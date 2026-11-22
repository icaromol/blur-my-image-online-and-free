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

function isImage(response: Response): boolean {
  return (response.headers.get("content-type") ?? "")
    .toLowerCase()
    .startsWith("image/");
}

// Tries a direct CORS request first. If the site refuses cross-origin access (fetch throws),
// the image goes once through the stateless proxy so the canvas isn't tainted.
export async function fetchImage(
  url: URL,
  proxyUrl: string,
  fetcher: typeof fetch = fetch,
): Promise<Blob> {
  let direct: Response | null = null;
  try {
    direct = await fetcher(url.href, { mode: "cors", credentials: "omit" });
  } catch {
    direct = null;
  }
  if (direct) {
    if (!direct.ok) throw new CodedError("upstream_status");
    if (!isImage(direct)) throw new CodedError("not_an_image");
    return direct.blob();
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
