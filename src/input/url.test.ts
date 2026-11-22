import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CodedError } from "../errors";
import { fetchImage, parseImageUrl } from "./url";

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
    await expect(fetchImage(target, PROXY, fetcher)).rejects.toMatchObject({
      code: "upstream_status",
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("rejects a direct response that isn't an image", async () => {
    const fetcher = vi.fn(
      async () =>
        new Response("<html>", { headers: { "content-type": "text/html" } }),
    );
    await expect(fetchImage(target, PROXY, fetcher)).rejects.toMatchObject({
      code: "not_an_image",
    });
  });

  it("passes the proxy error code through", async () => {
    const fetcher = vi.fn(async (input: RequestInfo | URL) => {
      if (String(input).startsWith(PROXY))
        return Response.json({ error: "blocked_address" }, { status: 403 });
      throw new TypeError("Failed to fetch");
    });
    await expect(fetchImage(target, PROXY, fetcher)).rejects.toMatchObject({
      code: "blocked_address",
    });
  });

  it("passes unknown proxy codes through for the UI to map", async () => {
    const fetcher = vi.fn(async (input: RequestInfo | URL) => {
      if (String(input).startsWith(PROXY))
        return Response.json({ error: "constructor" }, { status: 400 });
      throw new TypeError("Failed to fetch");
    });
    await expect(fetchImage(target, PROXY, fetcher)).rejects.toMatchObject({
      code: "constructor",
    });
    await expect(fetchImage(target, PROXY, fetcher)).rejects.toBeInstanceOf(
      CodedError,
    );
  });

  it("reports a refused port", async () => {
    const fetcher = vi.fn(async (input: RequestInfo | URL) => {
      if (String(input).startsWith(PROXY))
        return Response.json({ error: "unsupported_port" }, { status: 400 });
      throw new TypeError("Failed to fetch");
    });
    await expect(fetchImage(target, PROXY, fetcher)).rejects.toMatchObject({
      code: "unsupported_port",
    });
  });

  describe("direct request timeouts", () => {
    const timeoutError = () => new DOMException("timed out", "TimeoutError");
    const imageHeaders = { "content-type": "image/png" };

    // The body errors with the abort reason, as a real aborted fetch does.
    function stalledResponse(signal: AbortSignal | null | undefined) {
      const body = new ReadableStream<Uint8Array>({
        start(controller) {
          signal?.addEventListener("abort", () =>
            controller.error(signal.reason),
          );
        },
      });
      return new Response(body, { headers: imageHeaders });
    }

    // AbortSignal.timeout runs on its own timer, so drive it from the fake clock instead.
    function timeoutOnFakeClock() {
      return vi.spyOn(AbortSignal, "timeout").mockImplementation((ms) => {
        const controller = new AbortController();
        setTimeout(() => controller.abort(timeoutError()), ms);
        return controller.signal;
      });
    }

    beforeEach(() => vi.useFakeTimers());
    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    it("gives up after 10 s without response headers, without using the proxy", async () => {
      const total = timeoutOnFakeClock();
      const fetcher = vi.fn(
        (_input: RequestInfo | URL, init?: RequestInit) =>
          new Promise<Response>((_, reject) => {
            init?.signal?.addEventListener("abort", () =>
              reject(init.signal?.reason),
            );
          }),
      );

      const result = fetchImage(target, PROXY, fetcher);
      const assertion = expect(result).rejects.toMatchObject({
        code: "timeout",
      });
      await vi.advanceTimersByTimeAsync(9_999);
      expect(fetcher).toHaveBeenCalledTimes(1);
      await vi.advanceTimersByTimeAsync(1);

      await assertion;
      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(total).toHaveBeenCalledWith(60_000);
    });

    it("gives up on a download that stalls past the 60 s total limit", async () => {
      const total = new AbortController();
      vi.spyOn(AbortSignal, "timeout").mockReturnValue(total.signal);
      const fetcher = vi.fn(
        async (_input: RequestInfo | URL, init?: RequestInit) =>
          stalledResponse(init?.signal),
      );

      const result = fetchImage(target, PROXY, fetcher);
      const assertion = expect(result).rejects.toMatchObject({
        code: "timeout",
      });
      await vi.advanceTimersByTimeAsync(0);
      expect(vi.getTimerCount()).toBe(0);
      total.abort(timeoutError());

      await assertion;
    });

    it("doesn't fail a slow download whose headers arrived within 10 s", async () => {
      timeoutOnFakeClock();
      const fetcher = vi.fn(
        async (_input: RequestInfo | URL, init?: RequestInit) => {
          await new Promise((resolve) => setTimeout(resolve, 5_000));
          const signal = init?.signal;
          const body = new ReadableStream<Uint8Array>({
            start(controller) {
              signal?.addEventListener("abort", () =>
                controller.error(signal.reason),
              );
              setTimeout(() => {
                controller.enqueue(new Uint8Array([1, 2, 3]));
                controller.close();
              }, 30_000);
            },
          });
          return new Response(body, { headers: imageHeaders });
        },
      );

      const result = fetchImage(target, PROXY, fetcher);
      await vi.advanceTimersByTimeAsync(5_000);
      await vi.advanceTimersByTimeAsync(30_000);

      await expect(result).resolves.toHaveProperty("size", 3);
      expect(fetcher).toHaveBeenCalledTimes(1);
    });
  });
});
