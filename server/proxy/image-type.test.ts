import { describe, expect, it } from "vitest";
import { detectImageType } from "./image-type.js";

function ftyp(major: string, compatible: string[]): Uint8Array {
  const brands = [major, "\0\0\0\0", ...compatible].join("");
  const bytes = new Uint8Array(8 + brands.length);
  new DataView(bytes.buffer).setUint32(0, bytes.length);
  bytes.set(new TextEncoder().encode(`ftyp${brands}`), 4);
  return bytes;
}

describe("detectImageType AVIF", () => {
  it("accepts major brand avif", () => {
    expect(detectImageType(ftyp("avif", []))).toBe("image/avif");
  });

  it("accepts major brand mif1 with avif among the compatible brands", () => {
    expect(detectImageType(ftyp("mif1", ["mif1", "miaf", "avif"]))).toBe(
      "image/avif",
    );
  });

  it("rejects heic with no avif brand", () => {
    expect(detectImageType(ftyp("heic", ["mif1", "heic"]))).toBeUndefined();
  });

  it("ignores brands past the declared box size", () => {
    const bytes = new Uint8Array([
      ...ftyp("mif1", ["mif1"]),
      ...ftyp("avif", []),
    ]);
    expect(detectImageType(bytes)).toBeUndefined();
  });

  it("returns undefined for a truncated ftyp without throwing", () => {
    const bytes = ftyp("avif", []).slice(0, 11);
    expect(() => detectImageType(bytes)).not.toThrow();
    expect(detectImageType(bytes)).toBeUndefined();
  });
});
