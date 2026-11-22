import { CodedError } from "../errors";

export const exportFormats = {
  png: { label: "PNG", mime: "image/png", extension: "png" },
  jpg: { label: "JPG", mime: "image/jpeg", extension: "jpg" },
  jpeg: { label: "JPEG", mime: "image/jpeg", extension: "jpeg" },
  webp: { label: "WebP", mime: "image/webp", extension: "webp" },
} as const;

export type ExportFormat = keyof typeof exportFormats;

export const QUALITY = 0.92;

function toBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new CodedError("export_failed")),
      type,
      quality,
    );
  });
}

function context2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new CodedError("export_failed");
  return ctx;
}

// JPEG has no transparency, so transparent pixels are flattened onto white.
function flattenOnWhite(source: HTMLCanvasElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = context2d(canvas);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(source, 0, 0);
  return canvas;
}

let nativeWebp: Promise<boolean> | undefined;

// Safari decodes WebP but toBlob("image/webp") silently returns a PNG there.
function supportsNativeWebp(): Promise<boolean> {
  nativeWebp ??= (() => {
    const probe = document.createElement("canvas");
    probe.width = 1;
    probe.height = 1;
    return toBlob(probe, "image/webp").then(
      (blob) => blob.type === "image/webp",
      () => false,
    );
  })();
  return nativeWebp;
}

async function encodeWebp(canvas: HTMLCanvasElement): Promise<Blob> {
  if (await supportsNativeWebp()) return toBlob(canvas, "image/webp", QUALITY);
  const { default: encode } = await import("@jsquash/webp/encode");
  const pixels = context2d(canvas).getImageData(
    0,
    0,
    canvas.width,
    canvas.height,
  );
  const buffer = await encode(pixels, { quality: QUALITY * 100 });
  return new Blob([buffer], { type: "image/webp" });
}

// Canvas export writes pixels only, so EXIF metadata (camera, time, GPS) never reaches the file.
export function encodeImage(
  canvas: HTMLCanvasElement,
  format: ExportFormat,
): Promise<Blob> {
  switch (format) {
    case "png":
      return toBlob(canvas, "image/png");
    case "jpg":
    case "jpeg":
      return toBlob(flattenOnWhite(canvas), "image/jpeg", QUALITY);
    case "webp":
      return encodeWebp(canvas);
  }
}
