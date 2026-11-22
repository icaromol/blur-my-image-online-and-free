import { describe, expect, it, vi } from "vitest";
import { fetchImage, ImageUrlError, parseImageUrl } from "./url";

const PROXY = "https://app.test/api/image";
const target = new URL("https://images.test/cat.png");

function imageResponse() {
  return new Response(new Uint8Array([1, 2, 3]), {
    headers: { "content-type": "image/png" },
  });
}

describe("parseImageUrl", () => {
  it("accepts http and https only", () => {
    expect(parseImageUrl("http://a.test/x.png")?.href).toBe(
      "http://a.test/x.png",
    );
    expect(parseImageUrl("ftp://a.test/x.png")).toBeNull();
    expect(parseImageUrl("data:image/png;base64,AAA")).toBeNull();
    expect(parseImageUrl("not a url")).toBeNull();
  });
});

describe("fetchImage", () => {
  it("uses the direct response when the site allows CORS", async () => {
    const fetcher = vi.fn(async () => imageResponse());
    const blob = await fetchImage(target, PROXY, fetcher);
    expect(blob.size).toBe(3);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("falls back to the proxy when the direct request is blocked", async () => {
    const fetcher = vi.fn(async (input: RequestInfo | URL) => {
      if (String(input).startsWith(PROXY)) return imageResponse();
      throw new TypeError("Failed to fetch");
    });
    await fetchImage(target, PROXY, fetcher);
    expect(fetcher).toHaveBeenLastCalledWith(
      `${PROXY}?url=${encodeURIComponent(target.href)}`,
    );
  });

  it("doesn't use the proxy when the site answered with an error", async () => {
    const fetcher = vi.fn(async () => new Response("", { status: 404 }));
    await expect(fetchImage(target, PROXY, fetcher)).rejects.toThrow(
      ImageUrlError,
    );
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("rejects a direct response that isn't an image", async () => {
    const fetcher = vi.fn(
      async () =>
        new Response("<html>", { headers: { "content-type": "text/html" } }),
    );
    await expect(fetchImage(target, PROXY, fetcher)).rejects.toThrow(
      "doesn't point to an image",
    );
  });

  it("turns proxy error codes into readable messages", async () => {
    const fetcher = vi.fn(async (input: RequestInfo | URL) => {
      if (String(input).startsWith(PROXY))
        return Response.json({ error: "blocked_address" }, { status: 403 });
      throw new TypeError("Failed to fetch");
    });
    await expect(fetchImage(target, PROXY, fetcher)).rejects.toThrow(
      "private or local address",
    );
  });
});
