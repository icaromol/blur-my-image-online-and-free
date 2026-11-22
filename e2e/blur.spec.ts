import { readFile } from "node:fs/promises";
import { expect, type Page, test } from "@playwright/test";

const WIDTH = 200;
const HEIGHT = 100;

// Left half black, right half white: a sharp edge that a blur must soften.
async function makeTestPng(page: Page): Promise<Buffer> {
  const base64 = await page.evaluate(
    async ({ width, height }) => {
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No 2D context");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width / 2, height);
      const bytes = new Uint8Array(
        await (await canvas.convertToBlob()).arrayBuffer(),
      );
      return btoa(String.fromCharCode(...bytes));
    },
    { width: WIDTH, height: HEIGHT },
  );
  return Buffer.from(base64, "base64");
}

async function readPixels(page: Page, png: Buffer, points: [number, number][]) {
  return page.evaluate(
    async ({ base64, points }) => {
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const bitmap = await createImageBitmap(
        new Blob([bytes], { type: "image/png" }),
      );
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("No 2D context");
      ctx.drawImage(bitmap, 0, 0);
      return {
        width: bitmap.width,
        height: bitmap.height,
        pixels: points.map(([x, y]) =>
          Array.from(ctx.getImageData(x, y, 1, 1).data),
        ),
      };
    },
    { base64: png.toString("base64"), points },
  );
}

test("load an image, blur all of it and download a PNG", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Choose image").setInputFiles({
    name: "edge.png",
    mimeType: "image/png",
    buffer: await makeTestPng(page),
  });
  await page.getByLabel("Intensity").fill("100");
  await page.getByRole("button", { name: "Blur entire image" }).click();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download PNG" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("edge-blurred.png");

  const result = await readPixels(page, await readFile(await download.path()), [
    [WIDTH / 2 - 3, HEIGHT / 2],
    [WIDTH / 2 + 2, HEIGHT / 2],
    [0, 0],
    [WIDTH - 1, HEIGHT - 1],
  ]);
  expect(result.width).toBe(WIDTH);
  expect(result.height).toBe(HEIGHT);

  const [nearEdgeDark, nearEdgeLight, topLeft, bottomRight] = result.pixels;
  expect(nearEdgeDark[0]).toBeGreaterThan(10);
  expect(nearEdgeLight[0]).toBeLessThan(245);
  // Edge pixels are repeated, so corners stay opaque instead of fading out.
  expect(topLeft[3]).toBe(255);
  expect(bottomRight[3]).toBe(255);
});
