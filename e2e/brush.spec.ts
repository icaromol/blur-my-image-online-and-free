import { expect, test } from "@playwright/test";
import {
  decode,
  download,
  HEIGHT,
  openImage,
  paint,
  setIntensity,
} from "./helpers";

const gray = (rgba: number[]) => rgba[0];
// In the checkerboard, (0,0)-(1,1) is black and (2,0)-(3,1) is white.
const isOriginalChecker = (value: number, x: number, y: number) =>
  value === ((Math.floor(x / 2) + Math.floor(y / 2)) % 2 === 0 ? 0 : 255);

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await openImage(page, "checker");
  await setIntensity(page, 100);
  await page.getByRole("slider", { name: "Brush size" }).fill("40");
});

test("the brush blurs only where you paint", async ({ page }) => {
  await paint(page, [20, HEIGHT / 2], [80, HEIGHT / 2]);
  const image = await decode(page, await download(page));
  const painted = gray(image.pixel(50, HEIGHT / 2));
  expect(painted).toBeGreaterThan(40);
  expect(painted).toBeLessThan(215);
  expect(isOriginalChecker(gray(image.pixel(180, 10)), 180, 10)).toBe(true);
});

test("painting twice with the same setting doesn't compound", async ({
  page,
}) => {
  await page.getByText("Pixelate", { exact: true }).click();
  await paint(page, [20, HEIGHT / 2], [80, HEIGHT / 2]);
  const once = await decode(page, await download(page));
  await paint(page, [80, HEIGHT / 2], [20, HEIGHT / 2]);
  const twice = await decode(page, await download(page));
  for (const x of [30, 45, 60])
    expect(twice.pixel(x, HEIGHT / 2)).toEqual(once.pixel(x, HEIGHT / 2));
});

test("the eraser brings back the original pixels", async ({ page }) => {
  await page.getByRole("button", { name: "Blur entire image" }).click();
  await page.keyboard.press("e");
  await expect(page.getByRole("button", { name: "Eraser" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await paint(page, [120, HEIGHT / 2], [180, HEIGHT / 2]);

  const image = await decode(page, await download(page));
  expect(
    isOriginalChecker(gray(image.pixel(150, HEIGHT / 2)), 150, HEIGHT / 2),
  ).toBe(true);
  expect(isOriginalChecker(gray(image.pixel(30, 10)), 30, 10)).toBe(false);
});

test("undo and redo step through strokes", async ({ page }) => {
  await paint(page, [20, HEIGHT / 2], [80, HEIGHT / 2]);
  const point: [number, number] = [50, HEIGHT / 2];

  await page.keyboard.press("ControlOrMeta+z");
  const undone = await decode(page, await download(page));
  expect(isOriginalChecker(gray(undone.pixel(...point)), ...point)).toBe(true);
  await expect(page.getByRole("button", { name: "Undo" })).toBeDisabled();

  await page.keyboard.press("ControlOrMeta+Shift+z");
  const redone = await decode(page, await download(page));
  expect(isOriginalChecker(gray(redone.pixel(...point)), ...point)).toBe(false);
});

test("[ and ] resize the brush", async ({ page }) => {
  const size = page.getByRole("slider", { name: "Brush size" });
  await page.keyboard.press("]");
  await expect(size).toHaveValue("50");
  await page.keyboard.press("[");
  await page.keyboard.press("[");
  await expect(size).toHaveValue("32");
  await page.keyboard.press("b");
  await expect(page.getByRole("button", { name: "Brush" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});
