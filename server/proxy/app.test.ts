import { describe, expect, it, vi } from "vitest";
import { createProxyApp } from "./app.js";
import type { ProxyConfig } from "./config.js";
import type { Fetch } from "./ssrf.js";

const config: ProxyConfig = {
  maxBytes: 16,
  maxRedirects: 3,
  timeoutMs: 1000,
  allowedOrigins: ["https://blur.example"],
};

const PNG = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);

function image(body: Uint8Array = PNG, headers: Record<string, string> = {}) {
  return new Response(body, {
    headers: { "content-type": "image/png", ...headers },
  });
}

function redirect(location: string) {
  return new Response(null, { status: 302, headers: { location } });
}

function proxy(fetch: Fetch, overrides: Partial<ProxyConfig> = {}) {
  const app = createProxyApp({ config: { ...config, ...overrides }, fetch });
  return (
    target: string,
    headers: Record<string, string> = { "sec-fetch-site": "same-origin" },
  ) => app.request(`/api/image?url=${encodeURIComponent(target)}`, { headers });
}

async function errorOf(response: Response) {
  return {
    status: response.status,
    ...((await response.json()) as { error: string }),
  };
}

describe("caller checks", () => {
  it("rejects requests without Sec-Fetch-Site", async () => {
    const fetch = vi.fn<Fetch>();
    const res = await proxy(fetch)("https://example.com/a.png", {});
    expect(await errorOf(res)).toEqual({
      status: 403,
      error: "forbidden_origin",
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects cross-site callers", async () => {
    const res = await proxy(vi.fn<Fetch>())("https://example.com/a.png", {
      "sec-fetch-site": "cross-site",
      origin: "https://evil.example",
    });
    expect(res.status).toBe(403);
  });

  it("allows a configured origin and answers with CORS headers", async () => {
    const res = await proxy(async () => image())("https://example.com/a.png", {
      "sec-fetch-site": "cross-site",
      origin: "https://blur.example",
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("access-control-allow-origin")).toBe(
      "https://blur.example",
    );
  });
});

describe("target checks", () => {
  it("rejects a missing or malformed url", async () => {
    const res = await proxy(vi.fn<Fetch>())("not a url");
    expect(await errorOf(res)).toEqual({ status: 400, error: "invalid_url" });
  });

  it("rejects non-http protocols", async () => {
    const res = await proxy(vi.fn<Fetch>())("file:///etc/passwd");
    expect(await errorOf(res)).toEqual({
      status: 400,
      error: "unsupported_protocol",
    });
  });

  it("rejects private IP literals before fetching", async () => {
    const fetch = vi.fn<Fetch>();
    const res = await proxy(fetch)("http://169.254.169.254/latest/meta-data/");
    expect(await errorOf(res)).toEqual({
      status: 403,
      error: "blocked_address",
    });
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("redirects", () => {
  it("re-checks every hop and refuses a redirect into a private address", async () => {
    const fetch = vi.fn<Fetch>(async () => redirect("http://127.0.0.1/admin"));
    const res = await proxy(fetch)("https://example.com/a.png");
    expect(await errorOf(res)).toEqual({
      status: 403,
      error: "blocked_address",
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("refuses a redirect to another protocol", async () => {
    const res = await proxy(async () => redirect("ftp://example.com/a.png"))(
      "https://example.com/a.png",
    );
    expect(res.status).toBe(400);
  });

  it("follows up to 3 redirects, resolving relative locations", async () => {
    const fetch = vi.fn<Fetch>(async (url) => {
      const hop = Number(url.pathname.slice(1));
      return hop < 3 ? redirect(`/${hop + 1}`) : image();
    });
    const res = await proxy(fetch)("https://example.com/0");
    expect(res.status).toBe(200);
    expect(fetch.mock.calls.map(([url]) => url.href)).toEqual([
      "https://example.com/0",
      "https://example.com/1",
      "https://example.com/2",
      "https://example.com/3",
    ]);
  });

  it("gives up after the 4th redirect", async () => {
    const fetch = vi.fn<Fetch>(async () => redirect("/again"));
    const res = await proxy(fetch)("https://example.com/a.png");
    expect(await errorOf(res)).toEqual({
      status: 502,
      error: "too_many_redirects",
    });
    expect(fetch).toHaveBeenCalledTimes(4);
  });
});

describe("upstream response", () => {
  it("streams an image back with defensive headers", async () => {
    const res = await proxy(async () => image())("https://example.com/a.png");
    expect(res.status).toBe(200);
    expect(new Uint8Array(await res.arrayBuffer())).toEqual(PNG);
    expect(Object.fromEntries(res.headers)).toMatchObject({
      "content-type": "image/png",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "content-security-policy": "default-src 'none'; sandbox",
    });
  });

  it.each(["text/html", "application/octet-stream", "image/svg+xml"])(
    "rejects content type %s",
    async (type) => {
      const res = await proxy(async () => image(PNG, { "content-type": type }))(
        "https://example.com/a.png",
      );
      expect(await errorOf(res)).toEqual({
        status: 415,
        error: "not_an_image",
      });
    },
  );

  it("rejects a declared size above the limit", async () => {
    const res = await proxy(async () => image(PNG, { "content-length": "17" }))(
      "https://example.com/a.png",
    );
    expect(await errorOf(res)).toEqual({ status: 413, error: "too_large" });
  });

  it("cuts off an undeclared body that grows past the limit", async () => {
    const res = await proxy(async () => image(new Uint8Array(17)))(
      "https://example.com/a.png",
    );
    await expect(res.arrayBuffer()).rejects.toThrow();
  });

  it("reports upstream errors without forwarding them", async () => {
    const res = await proxy(async () => new Response("nope", { status: 404 }))(
      "https://example.com/a.png",
    );
    expect(await errorOf(res)).toEqual({
      status: 502,
      error: "upstream_status",
    });
  });

  it("times out a slow upstream", async () => {
    const hang: Fetch = (_url, { signal }) =>
      new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(signal.reason));
      });
    const res = await proxy(hang, { timeoutMs: 20 })(
      "https://example.com/a.png",
    );
    expect(await errorOf(res)).toEqual({ status: 504, error: "timeout" });
  });
});
