import { expect, test } from "@playwright/test";
import { decode, download, HEIGHT, openImage, WIDTH } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

for (const format of ["jpg", "jpeg"] as const) {
  test(`export ${format.toUpperCase()} flattens transparency onto white`, async ({
    page,
  }) => {
    await openImage(page, "transparent");
    await page.getByLabel("Format").selectOption(format);
    const file = await download(page);
    expect(file.suggestedFilename()).toBe(`transparent-blurred.${format}`);
    const image = await decode(page, file, "image/jpeg");
    expect([...image.bytes.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
    expect([image.width, image.height]).toEqual([WIDTH, HEIGHT]);
    const corner = image.pixel(2, 2);
    expect(Math.min(...corner.slice(0, 3))).toBeGreaterThan(245);
  });
}

test("export WebP with the browser's encoder", async ({ page }) => {
  await openImage(page, "edge");
  await page.getByLabel("Format").selectOption("webp");
  const file = await download(page);
  expect(file.suggestedFilename()).toBe("edge-blurred.webp");
  const image = await decode(page, file, "image/webp");
  expect(image.bytes.subarray(8, 12).toString()).toBe("WEBP");
  expect([image.width, image.height]).toEqual([WIDTH, HEIGHT]);
});

test("export WebP through the WebAssembly encoder where toBlob can't encode it", async ({
  page,
}) => {
  // Behave like Safari: asking for WebP silently returns a PNG.
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function (callback, type, quality) {
      return original.call(
        this,
        callback,
        type === "image/webp" ? "image/png" : type,
        quality,
      );
    };
  });
  await page.goto("/");
  await openImage(page, "edge");
  await page.getByLabel("Format").selectOption("webp");
  const image = await decode(page, await download(page), "image/webp");
  expect(image.bytes.subarray(8, 12).toString()).toBe("WEBP");
  expect([image.width, image.height]).toEqual([WIDTH, HEIGHT]);
});
