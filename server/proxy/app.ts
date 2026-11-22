import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { ProxyConfig } from "./config.js";
import { assertPublicUrl, BlockedTargetError, type Fetch } from "./ssrf.js";

class ProxyError extends Error {
  constructor(
    readonly status: ContentfulStatusCode,
    readonly code: string,
  ) {
    super(code);
  }
}

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

async function fetchFollowingRedirects(
  start: URL,
  fetch: Fetch,
  maxRedirects: number,
  signal: AbortSignal,
): Promise<Response> {
  let url = start;
  for (let redirects = 0; ; redirects++) {
    assertPublicUrl(url);
    const response = await fetch(url, { redirect: "manual", signal });
    if (!REDIRECT_STATUSES.has(response.status)) return response;
    await response.body?.cancel();
    const location = response.headers.get("location");
    if (!location) throw new ProxyError(502, "bad_redirect");
    if (redirects === maxRedirects)
      throw new ProxyError(502, "too_many_redirects");
    url = new URL(location, url);
  }
}

function limitBytes(maxBytes: number): TransformStream<Uint8Array, Uint8Array> {
  let total = 0;
  return new TransformStream({
    transform(chunk, controller) {
      total += chunk.byteLength;
      if (total > maxBytes) {
        controller.error(new ProxyError(413, "too_large"));
        return;
      }
      controller.enqueue(chunk);
    },
  });
}

function toProxyError(error: unknown): ProxyError {
  if (error instanceof ProxyError) return error;
  if (error instanceof BlockedTargetError) {
    return error.reason === "protocol"
      ? new ProxyError(400, "unsupported_protocol")
      : new ProxyError(403, "blocked_address");
  }
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return new ProxyError(504, "timeout");
  }
  return new ProxyError(502, "upstream_unreachable");
}

export function createProxyApp({
  config,
  fetch,
}: {
  config: ProxyConfig;
  fetch: Fetch;
}): Hono {
  const app = new Hono();

  app.get("/api/image", async (c) => {
    const origin = c.req.header("origin");
    const crossOriginAllowed =
      origin !== undefined && config.allowedOrigins.includes(origin);
    if (
      c.req.header("sec-fetch-site") !== "same-origin" &&
      !crossOriginAllowed
    ) {
      return c.json({ error: "forbidden_origin" }, 403);
    }

    let target: URL;
    try {
      target = new URL(c.req.query("url") ?? "");
    } catch {
      return c.json({ error: "invalid_url" }, 400);
    }

    try {
      const upstream = await fetchFollowingRedirects(
        target,
        fetch,
        config.maxRedirects,
        AbortSignal.timeout(config.timeoutMs),
      );
      if (!upstream.ok || !upstream.body) {
        await upstream.body?.cancel();
        throw new ProxyError(502, "upstream_status");
      }

      const type = (upstream.headers.get("content-type") ?? "")
        .split(";")[0]
        .trim()
        .toLowerCase();
      // SVG is refused: served from this origin, a scripted SVG opened directly would run as the app.
      if (!type.startsWith("image/") || type === "image/svg+xml") {
        await upstream.body.cancel();
        throw new ProxyError(415, "not_an_image");
      }

      const declaredLength = Number(upstream.headers.get("content-length"));
      if (declaredLength > config.maxBytes) {
        await upstream.body.cancel();
        throw new ProxyError(413, "too_large");
      }

      const headers = new Headers({
        "content-type": type,
        "cache-control": "no-store",
        "x-content-type-options": "nosniff",
        "content-security-policy": "default-src 'none'; sandbox",
      });
      if (crossOriginAllowed) {
        headers.set("access-control-allow-origin", origin);
        headers.set("vary", "Origin");
      }
      return new Response(
        upstream.body.pipeThrough(limitBytes(config.maxBytes)),
        { headers },
      );
    } catch (error) {
      const { status, code } = toProxyError(error);
      return c.json({ error: code }, status);
    }
  });

  return app;
}
