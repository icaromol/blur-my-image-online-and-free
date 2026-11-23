import { expect, type Page, test } from "@playwright/test";
import {
  decode,
  download,
  HEIGHT,
  makePng,
  openImage,
  paint,
  setIntensity,
  WIDTH,
} from "./helpers";

const locales = {
  en: {
    alert:
      "Your browser interrupted WebGL, which this app needs to render effects. Your edits are kept and come back when WebGL does. If nothing changes, reload the page and open the image again.",
    download: "Download",
  },
  "pt-BR": {
    alert:
      "Seu navegador interrompeu o WebGL, que o app precisa para aplicar os efeitos. Suas edições estão guardadas e voltam quando o WebGL voltar. Se nada mudar, recarregue a página e abra a imagem de novo.",
    download: "Baixar",
  },
};

declare global {
  interface Window {
    loseContextExtension?: WEBGL_lose_context;
  }
}

// The canvas keeps the context PixiJS created, so asking it again returns the same one.
// A lost context hands out no extensions, so the one used to lose it is kept for the restore.
async function loseContext(page: Page) {
  await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    const gl = canvas?.getContext("webgl2") ?? canvas?.getContext("webgl");
    const extension = gl?.getExtension("WEBGL_lose_context");
    if (!canvas || !extension) throw new Error("No WEBGL_lose_context");
    window.loseContextExtension = extension;
    const lost = new Promise((resolve) =>
      canvas.addEventListener("webglcontextlost", resolve, { once: true }),
    );
    extension.loseContext();
    return lost;
  });
  expect(await isContextLost(page)).toBe(true);
}

async function restoreContext(page: Page) {
  await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    const extension = window.loseContextExtension;
    if (!canvas || !extension) throw new Error("The context was not lost");
    const restored = new Promise((resolve) =>
      canvas.addEventListener("webglcontextrestored", resolve, { once: true }),
    );
    extension.restoreContext();
    return restored;
  });
  expect(await isContextLost(page)).toBe(false);
}

function isContextLost(page: Page) {
  return page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    const gl = canvas?.getContext("webgl2") ?? canvas?.getContext("webgl");
    return gl?.isContextLost();
  });
}

async function openBlurred(page: Page) {
  await openImage(page, "edge");
  await setIntensity(page, 100);
  await page.getByRole("button", { name: "Blur entire image" }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

for (const [locale, text] of Object.entries(locales)) {
  test.describe(`WebGL context loss in ${locale}`, () => {
    test("the download is refused while the context is lost", async ({
      page,
    }) => {
      const downloads: string[] = [];
      page.on("download", (file) => downloads.push(file.suggestedFilename()));
      await openBlurred(page);
      if (locale !== "en")
        await page.getByLabel("Language").selectOption(locale);

      await loseContext(page);
      await expect(page.getByRole("alert")).toHaveText(text.alert);
      await page.getByRole("button", { name: text.download }).click();
      await expect(page.getByRole("alert")).toHaveText(text.alert);

      // The export is asynchronous, so a download that slipped through would only show up later.
      // Downloading once after the restore proves the refused click produced none.
      await restoreContext(page);
      const pending = page.waitForEvent("download");
      await page.getByRole("button", { name: text.download }).click();
      await pending;
      expect(downloads).toHaveLength(1);
    });

    test("opening another image is refused while the context is lost and the open one is kept", async ({
      page,
    }) => {
      const requests: string[] = [];
      await page.route("https://images.test/**", (route) => {
        requests.push(route.request().url());
        return route.abort();
      });
      await openBlurred(page);
      if (locale !== "en")
        await page.getByLabel("Language").selectOption(locale);

      await loseContext(page);
      await expect(page.getByRole("alert")).toHaveText(text.alert);

      await page.getByLabel(/Image file|Arquivo de imagem/).setInputFiles({
        name: "other.png",
        mimeType: "image/png",
        buffer: await makePng(page, "checker", 64, 32),
      });
      await expect(page.getByRole("alert")).toHaveText(text.alert);

      await page
        .getByLabel(/Image URL|URL da imagem/)
        .fill("https://images.test/other.png");
      await page.getByRole("button", { name: /^(Load|Carregar)$/ }).click();
      await expect(page.getByRole("alert")).toHaveText(text.alert);
      expect(requests).toEqual([]);

      await restoreContext(page);
      await expect(page.getByRole("alert")).toHaveCount(0);

      const pending = page.waitForEvent("download");
      await page.getByRole("button", { name: text.download }).click();
      const image = await decode(page, await pending);
      expect([image.width, image.height]).toEqual([WIDTH, HEIGHT]);
      expect(image.pixel(WIDTH / 2 - 3, HEIGHT / 2)[0]).toBeGreaterThan(10);
      expect(image.pixel(WIDTH / 2 + 2, HEIGHT / 2)[0]).toBeLessThan(245);
    });

    test("the edits come back and the warning goes away when the context is restored", async ({
      page,
    }) => {
      await openBlurred(page);
      if (locale !== "en")
        await page.getByLabel("Language").selectOption(locale);

      await loseContext(page);
      await expect(page.getByRole("alert")).toHaveText(text.alert);

      await restoreContext(page);
      await expect(page.getByRole("alert")).toHaveCount(0);

      const pending = page.waitForEvent("download");
      await page.getByRole("button", { name: text.download }).click();
      const image = await decode(page, await pending);
      expect([image.width, image.height]).toEqual([WIDTH, HEIGHT]);
      expect(image.pixel(0, 0)[3]).toBe(255);
      // Blurred, not the sharp original and not empty.
      expect(image.pixel(WIDTH / 2 - 3, HEIGHT / 2)[0]).toBeGreaterThan(10);
      expect(image.pixel(WIDTH / 2 + 2, HEIGHT / 2)[0]).toBeLessThan(245);
    });
  });
}

test("an operation applied after the restore builds on the restored edits", async ({
  page,
}) => {
  await openImage(page, "edge");
  await setIntensity(page, 30);
  const blur = page.getByRole("button", { name: "Blur entire image" });
  await blur.click();
  const once = await decode(page, await download(page));

  await loseContext(page);
  await restoreContext(page);
  await blur.click();
  const twice = await decode(page, await download(page));

  const x = WIDTH / 2 + 4;
  expect(twice.pixel(x, HEIGHT / 2)[0]).toBeLessThan(
    once.pixel(x, HEIGHT / 2)[0],
  );
  expect(twice.pixel(0, 0)[3]).toBe(255);
});

test("a brush stroke comes back with its mask after the restore", async ({
  page,
}) => {
  await openImage(page, "edge");
  await setIntensity(page, 100);
  await paint(page, [80, 50], [120, 50]);

  await loseContext(page);
  await restoreContext(page);

  const image = await decode(page, await download(page));
  expect(image.pixel(WIDTH / 2 - 3, HEIGHT / 2)[0]).toBeGreaterThan(10);
  expect(image.pixel(WIDTH / 2 - 3, HEIGHT - 5)[0]).toBe(0);
});

test("an edit made while the context is lost is drawn when it returns", async ({
  page,
}) => {
  await openImage(page, "edge");
  await setIntensity(page, 100);

  await loseContext(page);
  await page.getByRole("button", { name: "Blur entire image" }).click();
  await restoreContext(page);

  const image = await decode(page, await download(page));
  expect(image.pixel(0, 0)[3]).toBe(255);
  expect(image.pixel(WIDTH / 2 - 3, HEIGHT / 2)[0]).toBeGreaterThan(10);
});
