import { describe, expect, it, vi } from "vitest";
import { BlockedTargetError } from "./address.js";
import { createProxyApp, type Fetch } from "./app.js";
import type { ProxyConfig } from "./config.js";

const config: ProxyConfig = {
  maxBytes: 16,
  maxRedirects: 3,
  timeoutMs: 1000,
  allowedOrigins: ["https://blur.example"],
};

const PNG = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);

const SAMPLES: Record<string, number[]> = {
  "image/png": [137, 80, 78, 71, 13, 10, 26, 10],
  "image/jpeg": [0xff, 0xd8, 0xff, 0xe0, 0, 0x10],
  "image/gif": [..."GIF89a"].map((c) => c.charCodeAt(0)),
  "image/webp": [..."RIFF\0\0\0\0WEBP"].map((c) => c.charCodeAt(0)),
  "image/avif": [0, 0, 0, 0x1c, ..."ftypavif"].map((c) =>
    typeof c === "number" ? c : c.charCodeAt(0),
  ),
  "image/bmp": [..."BM\0\0"].map((c) => c.charCodeAt(0)),
};

function sample(type: string): number[] {
  const bytes = SAMPLES[type];
  if (!bytes) throw new Error(`no sample bytes for ${type}`);
  return bytes;
}

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

describe("CORS headers", () => {
  const crossSite = {
    "sec-fetch-site": "cross-site",
    origin: "https://blur.example",
  };

  it("are set on a 502 for an allowed origin", async () => {
    const res = await proxy(async () => new Response("no", { status: 500 }))(
      "https://example.com/a.png",
      crossSite,
    );
    expect(res.status).toBe(502);
    expect(res.headers.get("access-control-allow-origin")).toBe(
      "https://blur.example",
    );
    expect(res.headers.get("vary")).toBe("Origin");
  });

  it("are set on a 415 for an allowed origin", async () => {
    const res = await proxy(async () =>
      image(PNG, { "content-type": "text/html" }),
    )("https://example.com/a.png", crossSite);
    expect(res.status).toBe(415);
    expect(res.headers.get("access-control-allow-origin")).toBe(
      "https://blur.example",
    );
    expect(res.headers.get("vary")).toBe("Origin");
  });

  it("are absent for an origin that is not allowed", async () => {
    const res = await proxy(async () => image())("https://example.com/a.png", {
      "sec-fetch-site": "same-origin",
      origin: "https://evil.example",
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });
});

describe("file signature", () => {
  it.each(Object.entries(SAMPLES))("accepts %s", async (type, bytes) => {
    const res = await proxy(async () =>
      image(new Uint8Array(bytes), { "content-type": type }),
    )("https://example.com/a");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe(type);
    expect([...new Uint8Array(await res.arrayBuffer())]).toEqual(bytes);
  });

  it("rejects a body whose signature differs from the declared type", async () => {
    const res = await proxy(async () =>
      image(new Uint8Array(sample("image/jpeg")), {
        "content-type": "image/png",
      }),
    )("https://example.com/a.png");
    expect(await errorOf(res)).toEqual({ status: 415, error: "not_an_image" });
  });

  it("rejects HTML served as image/png", async () => {
    const html = new TextEncoder().encode("<html><script>alert(1)</script>");
    const res = await proxy(async () => image(html))(
      "https://example.com/a.png",
    );
    expect(res.status).toBe(415);
  });

  it("rejects an empty body", async () => {
    const res = await proxy(async () => image(new Uint8Array(0)))(
      "https://example.com/a.png",
    );
    expect(res.status).toBe(415);
  });

  it("detects the signature when the first chunk is shorter than it", async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(PNG.slice(0, 3));
        controller.enqueue(PNG.slice(3));
        controller.close();
      },
    });
    const res = await proxy(
      async () =>
        new Response(stream, { headers: { "content-type": "image/png" } }),
    )("https://example.com/a.png");
    expect(res.status).toBe(200);
    expect(new Uint8Array(await res.arrayBuffer())).toEqual(PNG);
  });
});

describe("proxy privacy", () => {
  const expectedHeaders = {
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "cross-origin-resource-policy": "same-origin",
    "referrer-policy": "no-referrer",
    "content-security-policy": "default-src 'none'; sandbox",
  };

  it("sets the security headers on success and on every kind of error", async () => {
    const ok = await proxy(async () => image())("https://example.com/a.png");
    const badUrl = await proxy(vi.fn<Fetch>())("not a url");
    const blocked = await proxy(vi.fn<Fetch>())("http://127.0.0.1/");
    const forbidden = await proxy(vi.fn<Fetch>())("https://example.com/a", {});
    const notImage = await proxy(async () =>
      image(PNG, { "content-type": "text/html" }),
    )("https://example.com/a");
    for (const res of [ok, badUrl, blocked, forbidden, notImage]) {
      expect(Object.fromEntries(res.headers)).toMatchObject(expectedHeaders);
    }
  });

  it("sets them on 404 and on onError responses", async () => {
    const app = createProxyApp({ config, fetch: vi.fn<Fetch>() });
    app.post("/api/image", () => {
      throw new Error("boom");
    });
    const boom = await app.request("/api/image", { method: "POST" });
    expect(await errorOf(boom)).toEqual({
      status: 500,
      error: "internal_error",
    });
    expect(Object.fromEntries(boom.headers)).toMatchObject(expectedHeaders);

    const missing = await app.request("/api/image", { method: "DELETE" });
    expect(await errorOf(missing)).toEqual({ status: 404, error: "not_found" });
    expect(Object.fromEntries(missing.headers)).toMatchObject(expectedHeaders);
  });

  it("writes nothing to the console on success or failure", async () => {
    const spies = (["log", "info", "warn", "error", "debug"] as const).map(
      (method) => vi.spyOn(console, method).mockImplementation(() => {}),
    );
    await (
      await proxy(async () => image())("https://example.com/a.png")
    ).arrayBuffer();
    await proxy(async () => {
      throw new Error("network down");
    })("https://example.com/a.png");
    await proxy(vi.fn<Fetch>())("http://127.0.0.1/");
    const app = createProxyApp({ config, fetch: vi.fn<Fetch>() });
    app.post("/api/image", () => {
      throw new Error("boom");
    });
    await app.request("/api/image", { method: "POST" });
    for (const spy of spies) expect(spy).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it("sends fixed headers upstream and nothing from the visitor", async () => {
    const fetch = vi.fn<Fetch>(async () => image());
    await proxy(fetch)("https://example.com/a.png", {
      "sec-fetch-site": "same-origin",
      cookie: "session=secret",
      authorization: "Bearer secret",
      "user-agent": "visitor-agent",
      referer: "https://blur.example/page",
      "x-forwarded-for": "203.0.113.9",
    });
    const init = fetch.mock.calls[0]?.[1];
    expect(init?.headers).toEqual({
      "user-agent":
        "BlurMyImageProxy/1 (+https://github.com/icaromol/blur-my-image-online-and-free)",
      accept:
        "image/avif,image/webp,image/png,image/jpeg,image/gif;q=0.9,image/*;q=0.8",
    });
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

  it("rejects ports other than 80 and 443 before fetching", async () => {
    const fetch = vi.fn<Fetch>();
    const res = await proxy(fetch)("http://example.com:8080/x.png");
    expect(await errorOf(res)).toEqual({
      status: 400,
      error: "unsupported_port",
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("answers a hostname that resolves to a private address like a network failure", async () => {
    const res = await proxy(async () => {
      throw new BlockedTargetError("resolved", "10.0.0.5");
    })("https://internal.example/a.png");
    expect(await errorOf(res)).toEqual({
      status: 502,
      error: "upstream_unreachable",
    });
  });

  it.each([
    "https://user:pw@example.com/a.png",
    "https://user@example.com/a.png",
  ])("rejects credentials in %s", async (target) => {
    const fetch = vi.fn<Fetch>();
    const res = await proxy(fetch)(target);
    expect(await errorOf(res)).toEqual({
      status: 400,
      error: "credentials_not_allowed",
    });
    expect(fetch).not.toHaveBeenCalled();
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

  it.each([
    [
      "a non-default port",
      "http://example.com:8080/x.png",
      400,
      "unsupported_port",
    ],
    [
      "a non-default https port",
      "https://example.com:444/x.png",
      400,
      "unsupported_port",
    ],
    [
      "user and password",
      "https://user:pw@example.com/a.png",
      400,
      "credentials_not_allowed",
    ],
    [
      "a username only",
      "https://user@example.com/a.png",
      400,
      "credentials_not_allowed",
    ],
    [
      "a metadata address",
      "http://169.254.169.254/latest/meta-data/",
      403,
      "blocked_address",
    ],
    ["a private IPv4 literal", "http://10.0.0.5/", 403, "blocked_address"],
    ["an IPv6 loopback literal", "http://[::1]/", 403, "blocked_address"],
    [
      "an IPv4-mapped IPv6 loopback",
      "http://[::ffff:127.0.0.1]/",
      403,
      "blocked_address",
    ],
    ["a hex-encoded loopback", "http://0x7f.1/", 403, "blocked_address"],
  ])(
    "applies the first-hop guards to a redirect into %s",
    async (_label, location, status, error) => {
      const fetch = vi.fn<Fetch>(async () => redirect(location));
      const res = await proxy(fetch)("https://example.com/a.png");
      expect(await errorOf(res)).toEqual({ status, error });
      expect(fetch).toHaveBeenCalledTimes(1);
    },
  );

  it("checks the guards on a later hop, not only the first redirect", async () => {
    const fetch = vi.fn<Fetch>(async (url) =>
      url.pathname === "/start"
        ? redirect("/middle")
        : redirect("http://example.com:8080/x.png"),
    );
    const res = await proxy(fetch)("https://example.com/start");
    expect(await errorOf(res)).toEqual({
      status: 400,
      error: "unsupported_port",
    });
    expect(fetch).toHaveBeenCalledTimes(2);
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

  it.each([
    "text/html",
    "application/octet-stream",
    "image/svg+xml",
    "image/png, text/html",
    "image/png, image/svg+xml",
    "image/x-icon",
    "",
  ])("rejects content type %j", async (type) => {
    const res = await proxy(async () => image(PNG, { "content-type": type }))(
      "https://example.com/a.png",
    );
    expect(await errorOf(res)).toEqual({
      status: 415,
      error: "not_an_image",
    });
  });

  it.each([
    ["IMAGE/JPEG; charset=x", "image/jpeg"],
    ["image/pjpeg", "image/jpeg"],
    ["image/x-ms-bmp", "image/bmp"],
    ["image/x-bmp", "image/bmp"],
    ["image/webp", "image/webp"],
  ])("relabels %s as %s", async (upstream, canonical) => {
    const res = await proxy(async () =>
      image(new Uint8Array(sample(canonical)), { "content-type": upstream }),
    )("https://example.com/a.png");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe(canonical);
  });

  it("rejects a declared size above the limit", async () => {
    const res = await proxy(async () => image(PNG, { "content-length": "17" }))(
      "https://example.com/a.png",
    );
    expect(await errorOf(res)).toEqual({ status: 413, error: "too_large" });
  });

  it("cuts off an undeclared body that grows past the limit", async () => {
    const body = new Uint8Array(17);
    body.set(PNG);
    const res = await proxy(async () => image(body))(
      "https://example.com/a.png",
    );
    await expect(res.arrayBuffer()).rejects.toThrow();
  });

  it("cuts off a body that grows past its declared size and the limit", async () => {
    const body = new Uint8Array(17);
    body.set(PNG);
    const res = await proxy(async () => image(body, { "content-length": "8" }))(
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
