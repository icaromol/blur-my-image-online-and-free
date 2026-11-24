import { expect, test } from "@playwright/test";
import {
  decode,
  download,
  HEIGHT,
  openImage,
  setIntensity,
  WIDTH,
} from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("gaussian blur on the whole image softens edges and keeps the size", async ({
  page,
}) => {
  await openImage(page, "edge");
  await setIntensity(page, 100);
  await page.getByRole("button", { name: "Blur entire image" }).click();

  const file = await download(page);
  expect(file.suggestedFilename()).toBe("edge-blurred.png");
  const image = await decode(page, file);
  expect([image.width, image.height]).toEqual([WIDTH, HEIGHT]);
  expect(image.pixel(WIDTH / 2 - 3, HEIGHT / 2)[0]).toBeGreaterThan(10);
  expect(image.pixel(WIDTH / 2 + 2, HEIGHT / 2)[0]).toBeLessThan(245);
  // Edge pixels are repeated, so corners stay opaque instead of fading out.
  expect(image.pixel(0, 0)[3]).toBe(255);
  expect(image.pixel(WIDTH - 1, HEIGHT - 1)[3]).toBe(255);
});

const warnings = {
  en: {
    text: /Blur and pixelate don't reliably hide text/,
    effects: ["Gaussian", "Pixelate", "Motion"],
  },
  "pt-BR": {
    text: /Desfoque e pixelização não escondem texto de forma confiável/,
    effects: ["Gaussiano", "Pixelizar", "Movimento"],
  },
};

for (const [locale, { text, effects }] of Object.entries(warnings)) {
  test(`the text-hiding warning shows with every effect in ${locale}`, async ({
    page,
  }) => {
    await openImage(page, "edge");
    if (locale !== "en") await page.getByLabel("Language").selectOption(locale);

    for (const effect of effects) {
      await page.locator("#app").getByText(effect, { exact: true }).click();
      await expect(page.locator("#app").getByText(text)).toBeVisible();
    }
  });
}

test("pixelate turns the checkerboard into flat blocks", async ({ page }) => {
  await openImage(page, "checker");
  await page.locator("#app").getByText("Pixelate", { exact: true }).click();
  await expect(
    page
      .locator("#app")
      .getByText(/Blur and pixelate don't reliably hide text/),
  ).toBeVisible();
  await setIntensity(page, 100);
  await page.getByRole("button", { name: "Blur entire image" }).click();

  const image = await decode(page, await download(page));
  // Block size at 100 is 8% of the 100 px shorter side: 8 px.
  const block = [0, 1, 2, 3, 4, 5, 6, 7].map((x) => image.pixel(x, 3)[0]);
  expect(new Set(block).size).toBe(1);
});

test("motion blur streaks along the angle and keeps edges opaque", async ({
  page,
}) => {
  await openImage(page, "edge");
  await page.locator("#app").getByText("Motion", { exact: true }).click();
  await setIntensity(page, 100);
  await page.getByRole("slider", { name: "Angle" }).fill("0");
  await page.getByRole("button", { name: "Blur entire image" }).click();

  const image = await decode(page, await download(page));
  expect(image.pixel(WIDTH / 2 - 2, HEIGHT / 2)[0]).toBeGreaterThan(10);
  expect(image.pixel(WIDTH / 2 + 2, HEIGHT / 2)[0]).toBeLessThan(245);
  expect(image.pixel(0, 0)[3]).toBe(255);
  expect(image.pixel(WIDTH - 1, 0)[3]).toBe(255);
});

test("two whole-image passes apply one after the other", async ({ page }) => {
  await openImage(page, "edge");
  await setIntensity(page, 30);
  const blur = page.getByRole("button", { name: "Blur entire image" });
  await blur.click();
  const once = await decode(page, await download(page));
  await blur.click();
  const twice = await decode(page, await download(page));
  const x = WIDTH / 2 + 4;
  expect(twice.pixel(x, HEIGHT / 2)[0]).toBeLessThan(
    once.pixel(x, HEIGHT / 2)[0],
  );
});
