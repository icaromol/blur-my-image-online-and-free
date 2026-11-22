// Allowlist, not image/*: SVG served from this origin could run scripts as the app.
const DECLARED_TYPES: Record<string, string> = {
  "image/png": "image/png",
  "image/jpeg": "image/jpeg",
  "image/jpg": "image/jpeg",
  "image/pjpeg": "image/jpeg",
  "image/gif": "image/gif",
  "image/webp": "image/webp",
  "image/avif": "image/avif",
  "image/bmp": "image/bmp",
  "image/x-bmp": "image/bmp",
  "image/x-ms-bmp": "image/bmp",
};

export const SIGNATURE_BYTES = 64;

export function canonicalDeclaredType(header: string | null) {
  if (header === null || header.includes(",")) return undefined;
  const [rawType = ""] = header.split(";");
  const type = rawType.trim().toLowerCase();
  return Object.hasOwn(DECLARED_TYPES, type) ? DECLARED_TYPES[type] : undefined;
}

function ascii(bytes: Uint8Array, offset: number, text: string): boolean {
  return (
    bytes.length >= offset + text.length &&
    [...text].every((char, i) => bytes[offset + i] === char.charCodeAt(0))
  );
}

function startsWith(bytes: Uint8Array, prefix: number[]): boolean {
  return (
    bytes.length >= prefix.length && prefix.every((b, i) => bytes[i] === b)
  );
}

// AVIF files often use major brand mif1/miaf and list avif only among the compatible brands.
function hasAvifBrand(bytes: Uint8Array): boolean {
  const isAvif = (offset: number) =>
    ascii(bytes, offset, "avif") || ascii(bytes, offset, "avis");
  if (isAvif(8)) return true;
  const boxSize = new DataView(bytes.buffer, bytes.byteOffset).getUint32(0);
  const end = Math.min(boxSize, bytes.length);
  for (let offset = 16; offset + 4 <= end; offset += 4) {
    if (isAvif(offset)) return true;
  }
  return false;
}

export function detectImageType(bytes: Uint8Array): string | undefined {
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return "image/png";
  }
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (ascii(bytes, 0, "GIF87a") || ascii(bytes, 0, "GIF89a"))
    return "image/gif";
  if (ascii(bytes, 0, "RIFF") && ascii(bytes, 8, "WEBP")) return "image/webp";
  if (ascii(bytes, 4, "ftyp") && hasAvifBrand(bytes)) return "image/avif";
  if (ascii(bytes, 0, "BM")) return "image/bmp";
  return undefined;
}
