import { CodedError } from "../errors";

export function parseImageUrl(text: string): URL | null {
  const trimmed = text.trim();
  if (!/^https?:\/\//i.test(trimmed)) return null;
  try {
    return new URL(trimmed);
  } catch {
    return null;
  }
}

// The short limit covers only the wait for response headers (the proxy's upstream limit);
// the long one lets a slow but progressing download finish.
const HEADERS_TIMEOUT_MS = 10_000;
const TOTAL_TIMEOUT_MS = 60_000;

export const MAX_DIRECT_BYTES = 104_857_600;

function capBytes(maxBytes: number): TransformStream<Uint8Array, Uint8Array> {
  let total = 0;
  return new TransformStream({
    transform(chunk, controller) {
      total += chunk.byteLength;
      if (total > maxBytes) controller.error(new CodedError("too_large"));
      else controller.enqueue(chunk);
    },
  });
}

function isTimeout(error: unknown): boolean {
  return error instanceof DOMException && error.name === "TimeoutError";
}

function isImage(response: Response): boolean {
  return (response.headers.get("content-type") ?? "")
    .toLowerCase()
    .startsWith("image/");
}

async function readDirect(response: Response, maxBytes: number): Promise<Blob> {
  if (Number(response.headers.get("content-length")) > maxBytes) {
    response.body?.cancel().catch(() => {});
    throw new CodedError("too_large");
  }
  const capped = response.body?.pipeThrough(capBytes(maxBytes));
  try {
    return await new Response(capped, { headers: response.headers }).blob();
  } catch (e) {
    throw isTimeout(e) ? new CodedError("timeout") : e;
  }
}

// Tries a direct CORS request first. If the site refuses cross-origin access (fetch throws),
// the image goes once through the stateless proxy so the canvas isn't tainted.
export async function fetchImage(
  url: URL,
  proxyUrl: string,
  fetcher: typeof fetch = fetch,
  maxBytes = MAX_DIRECT_BYTES,
): Promise<Blob> {
  let direct: Response | null = null;
  const headersTimeout = new AbortController();
  const headersTimer = setTimeout(
    () => headersTimeout.abort(new DOMException("Timed out", "TimeoutError")),
    HEADERS_TIMEOUT_MS,
  );
  try {
    direct = await fetcher(url.href, {
      mode: "cors",
      credentials: "omit",
      signal: AbortSignal.any([
        headersTimeout.signal,
        AbortSignal.timeout(TOTAL_TIMEOUT_MS),
      ]),
    });
  } catch (e) {
    if (isTimeout(e)) throw new CodedError("timeout");
    direct = null;
  } finally {
    clearTimeout(headersTimer);
  }
  if (direct) {
    if (!direct.ok) throw new CodedError("upstream_status");
    if (!isImage(direct)) throw new CodedError("not_an_image");
    return readDirect(direct, maxBytes);
  }

  let proxied: Response;
  try {
    proxied = await fetcher(`${proxyUrl}?url=${encodeURIComponent(url.href)}`);
  } catch {
    throw new CodedError("load_failed");
  }
  if (!proxied.ok) {
    const code = await proxied
      .json()
      .then((body: { error?: string }) => body.error ?? "unknown")
      .catch(() => "load_failed");
    throw new CodedError(code);
  }
  if (!isImage(proxied)) throw new CodedError("not_an_image");
  return proxied.blob();
}
