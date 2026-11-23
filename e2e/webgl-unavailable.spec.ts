import { expect, type Page, test } from "@playwright/test";
import { makePng } from "./helpers";

const locales = {
  en: {
    imageFile: "Image file",
    imageUrl: "Image URL",
    load: "Load",
    alert:
      "Your browser couldn't start WebGL, which this app needs to render effects.",
    effect: "Effect",
    blur: "Blur entire image",
    download: "Download",
  },
  "pt-BR": {
    imageFile: "Arquivo de imagem",
    imageUrl: "URL da imagem",
    load: "Carregar",
    alert:
      "Seu navegador não conseguiu iniciar o WebGL, que o app precisa para aplicar os efeitos.",
    effect: "Efeito",
    blur: "Desfocar a imagem inteira",
    download: "Baixar",
  },
};

type Text = (typeof locales)["en"];

// Without WebGL the renderer must refuse to start. A Canvas2D fallback skips every filter,
// which would let the app export the original image as if it were blurred.
async function openWithoutWebgl(page: Page) {
  await page.addInitScript(() => {
    type GetContext = (type: string, options?: unknown) => unknown;
    for (const canvas of [HTMLCanvasElement, OffscreenCanvas]) {
      const original = canvas.prototype.getContext as GetContext;
      const patched = function (
        this: unknown,
        type: string,
        options?: unknown,
      ) {
        return /webgl/.test(type) ? null : original.call(this, type, options);
      };
      canvas.prototype.getContext =
        patched as typeof canvas.prototype.getContext;
    }
  });
  const downloads: string[] = [];
  page.on("download", (download) =>
    downloads.push(download.suggestedFilename()),
  );
  await page.goto("/");
  return downloads;
}

// Absent and disabled both mean the control cannot be used.
async function expectNothingUsable(
  page: Page,
  text: Text,
  downloads: string[],
) {
  await expect(page.getByRole("alert")).toHaveText(text.alert);
  for (const name of [text.blur, text.download]) {
    await expect(
      page.getByRole("button", { name, disabled: false }),
    ).toHaveCount(0);
  }
  await expect(
    page
      .getByRole("radiogroup", { name: text.effect })
      .locator("input:enabled"),
  ).toHaveCount(0);
  await expect(page.locator("canvas")).toBeHidden();
  expect(downloads).toEqual([]);
}

for (const [locale, text] of Object.entries(locales)) {
  test.describe(`without WebGL in ${locale}`, () => {
    test.use({ locale });

    test("an image opened from a file is refused with the existing message", async ({
      page,
    }) => {
      const downloads = await openWithoutWebgl(page);
      await expect(page.getByRole("alert")).toHaveText(text.alert);

      await page.getByLabel(text.imageFile).setInputFiles({
        name: "edge.png",
        mimeType: "image/png",
        buffer: await makePng(page, "edge"),
      });

      await expectNothingUsable(page, text, downloads);
    });

    test("an image opened from a link is refused with the existing message", async ({
      page,
    }) => {
      const downloads = await openWithoutWebgl(page);
      const png = await makePng(page, "edge");
      await page.route("https://images.test/photo.png", (route) =>
        route.fulfill({
          body: png,
          contentType: "image/png",
          headers: { "access-control-allow-origin": "*" },
        }),
      );

      await page
        .getByLabel(text.imageUrl)
        .fill("https://images.test/photo.png");
      await page.getByRole("button", { name: text.load }).click();

      await expectNothingUsable(page, text, downloads);
    });
  });
}
