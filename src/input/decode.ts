// createImageBitmap applies EXIF orientation and decodes whatever the browser supports.
export async function decodeImage(file: Blob): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file);
  } catch {
    throw new Error("This file isn't an image your browser can open.");
  }
}
