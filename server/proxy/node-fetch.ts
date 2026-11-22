import dns from "node:dns";
import type { LookupFunction } from "node:net";
import { Agent, fetch as undiciFetch } from "undici";
import {
  assertPublicUrl,
  BlockedTargetError,
  isPublicAddress,
} from "./address.js";
import type { Fetch } from "./app.js";

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
    const [first] = addresses;
    if (blocked || !first) {
      callback(
        new BlockedTargetError("resolved", blocked?.address ?? hostname),
        "",
        0,
      );
      return;
    }
    if (options.all) {
      callback(null, addresses);
    } else {
      callback(null, first.address, first.family);
    }
  });
};

// Checking inside the socket's own DNS lookup pins the connection to the
// address that passed, so a second DNS answer (rebinding) can't swap it.
const publicOnlyAgent = new Agent({ connect: { lookup: publicOnlyLookup } });

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
