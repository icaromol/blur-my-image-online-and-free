import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { assertPublicUrl, BlockedTargetError } from "./address.js";
import type { ProxyConfig } from "./config.js";
import {
  canonicalDeclaredType,
  detectImageType,
  SIGNATURE_BYTES,
} from "./image-type.js";

export type Fetch = (
  url: URL,
  init: {
    redirect: "manual";
    signal: AbortSignal;
    headers: Record<string, string>;
  },
) => Promise<Response>;

const UPSTREAM_HEADERS = {
  "user-agent":
    "BlurMyImageProxy/1 (+https://github.com/icaromol/blur-my-image-online-and-free)",
  accept:
    "image/avif,image/webp,image/png,image/jpeg,image/gif;q=0.9,image/*;q=0.8",
};

const RESPONSE_HEADERS = {
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "cross-origin-resource-policy": "same-origin",
  "referrer-policy": "no-referrer",
  "content-security-policy": "default-src 'none'; sandbox",
};

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
    const response = await fetch(url, {
      redirect: "manual",
      signal,
      headers: UPSTREAM_HEADERS,
    });
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
    switch (error.reason) {
      case "credentials":
        return new ProxyError(400, "credentials_not_allowed");
      case "protocol":
        return new ProxyError(400, "unsupported_protocol");
      case "port":
        return new ProxyError(400, "unsupported_port");
      case "address":
        return new ProxyError(403, "blocked_address");
      case "resolved":
        // Same answer as a network failure, so callers can't probe internal hostnames.
        return new ProxyError(502, "upstream_unreachable");
    }
  }
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return new ProxyError(504, "timeout");
  }
  return new ProxyError(502, "upstream_unreachable");
}

async function peek(
  body: ReadableStream<Uint8Array>,
): Promise<{ head: Uint8Array; stream: ReadableStream<Uint8Array> }> {
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (length < SIGNATURE_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    length += value.byteLength;
  }
  const head = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    head.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(chunk);
    },
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) controller.close();
      else controller.enqueue(value);
    },
    cancel: (reason) => reader.cancel(reason),
  });
  return { head, stream };
}

export function createProxyApp({
  config,
  fetch,
}: {
  config: ProxyConfig;
  fetch: Fetch;
}): Hono {
  const app = new Hono();

  app.use("/api/image", async (c, next) => {
    await next();
    for (const [name, value] of Object.entries(RESPONSE_HEADERS)) {
      c.res.headers.set(name, value);
    }
    const origin = c.req.header("origin");
    if (origin !== undefined && config.allowedOrigins.includes(origin)) {
      c.res.headers.set("access-control-allow-origin", origin);
      c.res.headers.set("vary", "Origin");
    }
  });

  app.notFound((c) => c.json({ error: "not_found" }, 404));
  app.onError((_error, c) => c.json({ error: "internal_error" }, 500));

  app.get("/api/image", async (c) => {
    const origin = c.req.header("origin");
    const crossOriginAllowed =
      origin !== undefined && config.allowedOrigins.includes(origin);
    // A non-browser client can send this header too; the WAF rate limit on this path is what bounds it.
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

      const declared = canonicalDeclaredType(
        upstream.headers.get("content-type"),
      );
      if (declared === undefined) {
        await upstream.body.cancel();
        throw new ProxyError(415, "not_an_image");
      }

      const declaredLength = Number(upstream.headers.get("content-length"));
      if (declaredLength > config.maxBytes) {
        await upstream.body.cancel();
        throw new ProxyError(413, "too_large");
      }

      const { head, stream } = await peek(upstream.body);
      const detected = detectImageType(head);
      if (detected !== declared) {
        await stream.cancel();
        throw new ProxyError(415, "not_an_image");
      }

      return new Response(stream.pipeThrough(limitBytes(config.maxBytes)), {
        headers: { "content-type": detected },
      });
    } catch (error) {
      const { status, code } = toProxyError(error);
      return c.json({ error: code }, status);
    }
  });

  return app;
}
