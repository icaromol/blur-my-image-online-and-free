import dns from "node:dns";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  assertPublicUrl,
  BlockedTargetError,
  isPublicAddress,
  publicOnlyFetch,
  publicOnlyLookup,
} from "./ssrf.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("isPublicAddress", () => {
  it.each(["8.8.8.8", "1.1.1.1", "2001:4860:4860::8888", "::ffff:8.8.8.8"])(
    "allows %s",
    (address) => {
      expect(isPublicAddress(address)).toBe(true);
    },
  );

  it.each([
    ["127.0.0.1", "loopback"],
    ["10.0.0.1", "private"],
    ["172.16.0.1", "private"],
    ["192.168.1.1", "private"],
    ["169.254.169.254", "link-local (cloud metadata)"],
    ["100.64.0.1", "carrier-grade NAT"],
    ["0.0.0.0", "unspecified"],
    ["224.0.0.1", "multicast"],
    ["255.255.255.255", "broadcast"],
    ["198.18.0.1", "benchmarking"],
    ["::1", "IPv6 loopback"],
    ["::", "IPv6 unspecified"],
    ["fe80::1", "IPv6 link-local"],
    ["fc00::1", "IPv6 unique local"],
    ["::ffff:127.0.0.1", "IPv4-mapped loopback"],
    ["::ffff:169.254.169.254", "IPv4-mapped link-local"],
    ["64:ff9b::7f00:1", "NAT64 of loopback"],
    ["2002:7f00:1::", "6to4 of loopback"],
    ["not-an-ip", "garbage"],
  ])("blocks %s (%s)", (address) => {
    expect(isPublicAddress(address)).toBe(false);
  });
});

describe("assertPublicUrl", () => {
  it.each([
    "ftp://example.com/a.png",
    "file:///etc/passwd",
    "data:image/png;base64,AAAA",
    "javascript:alert(1)",
  ])("rejects protocol of %s", (url) => {
    expect(() => assertPublicUrl(new URL(url))).toThrow(
      expect.objectContaining({ reason: "protocol" }),
    );
  });

  it.each([
    "http://127.0.0.1/a.png",
    "http://[::1]/a.png",
    "http://[::ffff:127.0.0.1]/a.png",
    "http://169.254.169.254/latest/meta-data/",
    "http://0x7f.1/a.png",
    "http://2130706433/a.png",
    "https://10.0.0.1:8443/a.png",
  ])("rejects private IP literal in %s", (url) => {
    expect(() => assertPublicUrl(new URL(url))).toThrow(
      expect.objectContaining({ reason: "address" }),
    );
  });

  it("leaves hostnames to the DNS check", () => {
    expect(() =>
      assertPublicUrl(new URL("https://example.com/a.png")),
    ).not.toThrow();
  });
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
    ).rejects.toBeInstanceOf(BlockedTargetError);
  });

  it("rejects an empty answer", async () => {
    await expect(lookup([])).rejects.toBeInstanceOf(BlockedTargetError);
  });
});

describe("publicOnlyFetch", () => {
  it("never connects to a hostname that resolves to loopback", async () => {
    const onRequest = vi.fn();
    const server = createServer((_req, res) => {
      onRequest();
      res.end("secret");
    });
    await new Promise<void>((resolve) =>
      server.listen(0, "127.0.0.1", resolve),
    );
    const { port } = server.address() as AddressInfo;

    try {
      await expect(
        publicOnlyFetch(new URL(`http://localhost:${port}/`), {
          redirect: "manual",
          signal: AbortSignal.timeout(2000),
        }),
      ).rejects.toBeInstanceOf(BlockedTargetError);
      expect(onRequest).not.toHaveBeenCalled();
    } finally {
      server.close();
    }
  });
});
