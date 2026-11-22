import { CodedError } from "../errors";
import type { ImageSize } from "../image-size";

export interface DecodedImage {
  bitmap: ImageBitmap;
  // Set when the image was larger than the GPU allows and had to be scaled down.
  originalSize?: ImageSize;
}

export function fitWithin(size: ImageSize, maxSide: number): ImageSize {
  const scale = Math.min(1, maxSide / Math.max(size.width, size.height));
  return {
    width: Math.max(1, Math.floor(size.width * scale)),
    height: Math.max(1, Math.floor(size.height * scale)),
  };
}

// createImageBitmap applies EXIF orientation and decodes whatever the browser supports
// (GIF gives its first frame).
export async function decodeImage(
  blob: Blob,
  maxSide: number,
): Promise<DecodedImage> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(blob);
  } catch {
    throw new CodedError("decode_failed");
  }
  const original = { width: bitmap.width, height: bitmap.height };
  const fitted = fitWithin(original, maxSide);
  if (fitted.width === original.width && fitted.height === original.height)
    return { bitmap };

  try {
    const resized = await createImageBitmap(bitmap, {
      resizeWidth: fitted.width,
      resizeHeight: fitted.height,
      resizeQuality: "high",
    });
    return { bitmap: resized, originalSize: original };
  } catch {
    throw new CodedError("decode_failed");
  } finally {
    bitmap.close();
  }
}
