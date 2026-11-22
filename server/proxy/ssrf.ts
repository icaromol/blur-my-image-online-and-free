import dns from "node:dns";
import { isIP, type LookupFunction } from "node:net";
import ipaddr from "ipaddr.js";
import { Agent, fetch as undiciFetch } from "undici";

export class BlockedTargetError extends Error {
  constructor(
    readonly reason: "protocol" | "address",
    detail: string,
  ) {
    super(
      reason === "protocol"
        ? `Unsupported protocol ${detail}`
        : `Non-public address ${detail}`,
    );
  }
}

export function isPublicAddress(address: string): boolean {
  if (!ipaddr.isValid(address)) return false;
  let parsed = ipaddr.parse(address);
  if (parsed instanceof ipaddr.IPv6 && parsed.isIPv4MappedAddress()) {
    parsed = parsed.toIPv4Address();
  }
  return parsed.range() === "unicast";
}

export function assertPublicUrl(url: URL): void {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new BlockedTargetError("protocol", url.protocol);
  }
  const host = url.hostname.replace(/^\[(.*)\]$/, "$1");
  // IP literals never go through the DNS lookup below, so they are checked here.
  if (isIP(host) !== 0 && !isPublicAddress(host)) {
    throw new BlockedTargetError("address", host);
  }
}

export const publicOnlyLookup: LookupFunction = (
  hostname,
  options,
  callback,
) => {
  dns.lookup(hostname, { ...options, all: true }, (error, addresses) => {
    if (error) {
      callback(error, "", 0);
      return;
    }
    const blocked = addresses.find((entry) => !isPublicAddress(entry.address));
    if (blocked || addresses.length === 0) {
      callback(
        new BlockedTargetError("address", blocked?.address ?? hostname),
        "",
        0,
      );
      return;
    }
    if (options.all) {
      callback(null, addresses);
    } else {
      callback(null, addresses[0].address, addresses[0].family);
    }
  });
};

// Checking inside the socket's own DNS lookup pins the connection to the
// address that passed, so a second DNS answer (rebinding) can't swap it.
const publicOnlyAgent = new Agent({ connect: { lookup: publicOnlyLookup } });

export type Fetch = (
  url: URL,
  init: { redirect: "manual"; signal: AbortSignal },
) => Promise<Response>;

export const publicOnlyFetch: Fetch = async (url, init) => {
  assertPublicUrl(url);
  try {
    return (await undiciFetch(url, {
      ...init,
      dispatcher: publicOnlyAgent,
    })) as unknown as Response;
  } catch (error) {
    if (
      error instanceof TypeError &&
      error.cause instanceof BlockedTargetError
    ) {
      throw error.cause;
    }
    throw error;
  }
};
