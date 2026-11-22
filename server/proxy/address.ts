import ipaddr from "ipaddr.js";

export class BlockedTargetError extends Error {
  constructor(
    readonly reason:
      | "protocol"
      | "credentials"
      | "port"
      | "address"
      | "resolved",
    detail: string,
  ) {
    super(`Blocked target (${reason}): ${detail}`);
  }
}

const GLOBAL_UNICAST_V6 = ipaddr.parseCIDR("2000::/3");

export function isPublicAddress(address: string): boolean {
  if (!ipaddr.isValid(address)) return false;
  let parsed = ipaddr.parse(address);
  if (parsed instanceof ipaddr.IPv6 && parsed.isIPv4MappedAddress()) {
    parsed = parsed.toIPv4Address();
  }
  if (parsed instanceof ipaddr.IPv6) {
    // Also drops ::/96 (IPv4-compatible), which ipaddr.js reports as unicast.
    return parsed.range() === "unicast" && parsed.match(GLOBAL_UNICAST_V6);
  }
  return parsed.range() === "unicast";
}

// Must accept everything node:net isIP() accepts, or a literal would skip both this check and the DNS one.
// A hostname never contains ":", so any colon means IPv6 (even with a zone suffix ipaddr.js rejects); isPublicAddress then blocks it.
export function isIpLiteral(host: string): boolean {
  return host.includes(":") || ipaddr.isValid(host);
}

export function assertPublicUrl(url: URL): void {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new BlockedTargetError("protocol", url.protocol);
  }
  if (url.username !== "" || url.password !== "") {
    throw new BlockedTargetError("credentials", url.hostname);
  }
  if (url.port !== "") {
    throw new BlockedTargetError("port", url.port);
  }
  const host = url.hostname.replace(/^\[(.*)\]$/, "$1");
  // IP literals never go through the DNS lookup, so they are checked here.
  if (isIpLiteral(host) && !isPublicAddress(host)) {
    throw new BlockedTargetError("address", host);
  }
}
