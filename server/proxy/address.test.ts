import { isIP } from "node:net";
import { describe, expect, it } from "vitest";
import { assertPublicUrl, isIpLiteral, isPublicAddress } from "./address.js";

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
    ["::7f00:1", "IPv4-compatible loopback"],
    ["::a00:1", "IPv4-compatible private"],
    ["::a9fe:a9fe", "IPv4-compatible link-local (cloud metadata)"],
    ["not-an-ip", "garbage"],
  ])("blocks %s (%s)", (address) => {
    expect(isPublicAddress(address)).toBe(false);
  });
});

describe("isIpLiteral", () => {
  const candidates = [
    "127.0.0.1",
    "8.8.8.8",
    "0.0.0.0",
    "255.255.255.255",
    "1.2.3",
    "1.2.3.4.5",
    "01.02.03.04",
    "0x7f.1",
    "2130706433",
    "::",
    "::1",
    "1::",
    "2001:db8::1",
    "2001:0db8:0000:0000:0000:0000:0000:0001",
    "2001:DB8::ABCD",
    "::ffff:127.0.0.1",
    "::ffff:7f00:1",
    "64:ff9b::1.2.3.4",
    "::1.2.3.4",
    "fe80::1%eth0",
    "fe80::1%1",
    "::%eth0.fe80",
    "010::%eth0:",
    "[::1]",
    "1:2:3:4:5:6:7:8",
    "1:2:3:4:5:6:7::",
    "::2:3:4:5:6:7:8",
    "1:2:3:4:5:6:7:8:9",
    ":::",
    "12345::",
    "g::1",
    "example.com",
    "localhost",
    "",
    "1.2.3.a",
    "256.1.1.1",
    " 127.0.0.1",
    "127.0.0.1 ",
    "1e3.0.0.1",
  ];

  it.each(candidates)("detects %j whenever node:net does", (candidate) => {
    if (isIP(candidate) !== 0) expect(isIpLiteral(candidate)).toBe(true);
  });

  it("exercises real IP strings", () => {
    expect(candidates.filter((c) => isIP(c) !== 0).length).toBeGreaterThan(15);
  });

  it("treats any host with a colon as an IP literal that is not public", () => {
    expect(isIpLiteral("::%eth0.fe80")).toBe(true);
    expect(isPublicAddress("::%eth0.fe80")).toBe(false);
  });

  it("does not flag hostnames", () => {
    expect(isIpLiteral("example.com")).toBe(false);
    expect(isIpLiteral("localhost")).toBe(false);
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
    "http://example.com:8080/",
    "https://example.com:8443/a.png",
    "http://example.com:22/",
    "http://example.com:443/",
    "https://example.com:80/",
  ])("rejects the explicit port in %s", (url) => {
    expect(() => assertPublicUrl(new URL(url))).toThrow(
      expect.objectContaining({ reason: "port" }),
    );
  });

  it.each([
    "https://example.com/",
    "http://example.com/a.png",
    "https://example.com:443/",
    "http://example.com:80/",
  ])("allows %s (default port)", (url) => {
    expect(() => assertPublicUrl(new URL(url))).not.toThrow();
  });

  it.each([
    "https://user:pw@example.com/a.png",
    "https://user@example.com/a.png",
    "https://:pw@example.com/a.png",
  ])("rejects credentials in %s", (url) => {
    expect(() => assertPublicUrl(new URL(url))).toThrow(
      expect.objectContaining({ reason: "credentials" }),
    );
  });

  it.each([
    "http://127.0.0.1/a.png",
    "http://[::1]/a.png",
    "http://[::ffff:127.0.0.1]/a.png",
    "http://[::7f00:1]/a.png",
    "http://169.254.169.254/latest/meta-data/",
    "http://0x7f.1/a.png",
    "http://2130706433/a.png",
    "https://10.0.0.1/a.png",
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
