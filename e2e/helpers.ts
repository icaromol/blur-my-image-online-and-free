import { readFile } from "node:fs/promises";
import { type Download, expect, type Page } from "@playwright/test";

export const WIDTH = 200;
export const HEIGHT = 100;

export type Pattern = "edge" | "checker" | "transparent";

// edge: left half black, right half white. checker: 2 px black and white squares.
// transparent: a black square on a fully transparent background.
export async function makePng(
  page: Page,
  pattern: Pattern,
  width = WIDTH,
  height = HEIGHT,
): Promise<Buffer> {
  const base64 = await page.evaluate(
    async ({ pattern, width, height }) => {
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No 2D context");
      if (pattern === "edge") {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width / 2, height);
      } else if (pattern === "checker") {
        for (let y = 0; y < height; y += 2) {
          for (let x = 0; x < width; x += 2) {
            ctx.fillStyle = (x + y) % 4 === 0 ? "#000" : "#fff";
            ctx.fillRect(x, y, 2, 2);
          }
        }
      } else {
        ctx.fillStyle = "#000";
        ctx.fillRect(width / 4, height / 4, width / 2, height / 2);
      }
      const bytes = new Uint8Array(
        await (await canvas.convertToBlob()).arrayBuffer(),
      );
      let binary = "";
      for (const byte of bytes) binary += String.fromCharCode(byte);
      return btoa(binary);
    },
    { pattern, width, height },
  );
  return Buffer.from(base64, "base64");
}

export async function openImage(
  page: Page,
  pattern: Pattern,
  name = `${pattern}.png`,
) {
  await page.getByLabel("Image file").setInputFiles({
    name,
    mimeType: "image/png",
    buffer: await makePng(page, pattern),
  });
  await expect(
    page.getByRole("button", { name: "Blur entire image" }),
  ).toBeEnabled();
}

export async function setIntensity(page: Page, value: number) {
  await page.getByRole("slider", { name: "Intensity" }).fill(String(value));
}

export async function download(page: Page): Promise<Download> {
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download" }).click();
  return pending;
}

export interface Decoded {
  width: number;
  height: number;
  bytes: Buffer;
  pixel(x: number, y: number): number[];
}

// Decodes the file in the browser and returns RGBA pixels.
export async function decode(
  page: Page,
  download: Download,
  mime = "image/png",
): Promise<Decoded> {
  const bytes = await readFile(await download.path());
  const result = await page.evaluate(
    async ({ base64, mime }) => {
      const data = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const bitmap = await createImageBitmap(new Blob([data], { type: mime }));
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No 2D context");
      ctx.drawImage(bitmap, 0, 0);
      return {
        width: bitmap.width,
        height: bitmap.height,
        rgba: Array.from(
          ctx.getImageData(0, 0, bitmap.width, bitmap.height).data,
        ),
      };
    },
    { base64: bytes.toString("base64"), mime },
  );
  return {
    width: result.width,
    height: result.height,
    bytes,
    pixel: (x, y) =>
      result.rgba.slice(
        (y * result.width + x) * 4,
        (y * result.width + x) * 4 + 4,
      ),
  };
}

// Drags across the canvas between two points given in image pixels.
export async function paint(
  page: Page,
  from: [number, number],
  to: [number, number],
) {
  const canvas = page.locator("canvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("Canvas not visible");
  const scale = box.width / WIDTH;
  await page.mouse.move(box.x + from[0] * scale, box.y + from[1] * scale);
  await page.mouse.down();
  await page.mouse.move(box.x + to[0] * scale, box.y + to[1] * scale, {
    steps: 10,
  });
  await page.mouse.up();
}
