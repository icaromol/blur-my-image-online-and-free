import dns from "node:dns";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BlockedTargetError } from "./address.js";
import { publicOnlyFetch, publicOnlyLookup } from "./node-fetch.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("publicOnlyLookup", () => {
  function lookup(addresses: { address: string; family: number }[]) {
    vi.spyOn(dns, "lookup").mockImplementation(((
      _host: string,
      _options: unknown,
      callback: (error: null, result: typeof addresses) => void,
    ) => callback(null, addresses)) as unknown as typeof dns.lookup);
    return new Promise<unknown>((resolve, reject) => {
      publicOnlyLookup("example.test", { all: true }, (error, result) =>
        error ? reject(error) : resolve(result),
      );
    });
  }

  it("passes public answers through", async () => {
    await expect(
      lookup([{ address: "93.184.216.34", family: 4 }]),
    ).resolves.toEqual([{ address: "93.184.216.34", family: 4 }]);
  });

  it("rejects when any answer is private", async () => {
    await expect(
      lookup([
        { address: "93.184.216.34", family: 4 },
        { address: "10.0.0.5", family: 4 },
      ]),
    ).rejects.toMatchObject({ reason: "resolved" });
  });

  it("rejects an empty answer", async () => {
    await expect(lookup([])).rejects.toBeInstanceOf(BlockedTargetError);
  });
});

describe("publicOnlyFetch", () => {
  const init = () => ({
    redirect: "manual" as const,
    signal: AbortSignal.timeout(2000),
    headers: {},
  });

  it("refuses a hostname that resolves to loopback before connecting", async () => {
    // A connection attempt would fail with a network TypeError, not BlockedTargetError.
    await expect(
      publicOnlyFetch(new URL("http://localhost/"), init()),
    ).rejects.toMatchObject({ reason: "resolved" });
  });

  it("refuses a private IP literal", async () => {
    await expect(
      publicOnlyFetch(new URL("http://127.0.0.1/"), init()),
    ).rejects.toMatchObject({ reason: "address" });
  });
});
