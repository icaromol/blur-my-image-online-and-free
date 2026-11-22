import { expect, test } from "@playwright/test";
import { makePng } from "./helpers";

const html = (page: import("@playwright/test").Page) => page.locator("html");

test.describe("browser in pt-BR", () => {
  test.use({ locale: "pt-BR" });

  test("shows the Portuguese UI with no saved choice", async ({ page }) => {
    await page.goto("/");
    await expect(html(page)).toHaveAttribute("lang", "pt-BR");
    await expect(page.getByText("Escolher uma imagem")).toBeVisible();
    await expect(page.getByLabel("Idioma")).toHaveValue("pt-BR");

    await page.getByLabel("Arquivo de imagem").setInputFiles({
      name: "edge.png",
      mimeType: "image/png",
      buffer: await makePng(page, "edge"),
    });
    await expect(
      page.getByRole("button", { name: "Desfocar a imagem inteira" }),
    ).toBeEnabled();
    await expect(page.getByText("Gaussiano", { exact: true })).toBeVisible();
  });

  test("shows errors in Portuguese", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Arquivo de imagem").setInputFiles({
      name: "notes.png",
      mimeType: "image/png",
      buffer: Buffer.from("hello"),
    });
    await expect(page.getByRole("alert")).toContainText("não é uma imagem");
  });
});

test("the English browser gets English", async ({ page }) => {
  await page.goto("/");
  await expect(html(page)).toHaveAttribute("lang", "en");
  await expect(page.getByText("Choose an image")).toBeVisible();
});

test("a language chosen in the switcher survives a reload", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Language").selectOption("pt-BR");
  await expect(html(page)).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByText("Escolher uma imagem")).toBeVisible();
  await expect(page).toHaveTitle("Blur My Image");

  await page.reload();
  await expect(html(page)).toHaveAttribute("lang", "pt-BR");
  await expect(page.getByText("Escolher uma imagem")).toBeVisible();
  await expect(page.getByLabel("Idioma")).toHaveValue("pt-BR");

  await page.getByLabel("Idioma").selectOption("en");
  await page.reload();
  await expect(html(page)).toHaveAttribute("lang", "en");
});

test("the app still works when localStorage throws", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("denied", "SecurityError");
      },
    });
  });
  await page.goto("/");
  await page.getByLabel("Language").selectOption("pt-BR");
  await expect(page.getByText("Escolher uma imagem")).toBeVisible();
});

test("a language file that fails to load leaves the page and the select as they were", async ({
  page,
}) => {
  await page.route("**/assets/pt-BR-*.js", (route) => route.abort());
  await page.goto("/");

  await page.getByLabel("Language").selectOption("pt-BR");

  await expect(page.getByLabel("Language")).toHaveValue("en");
  await expect(html(page)).toHaveAttribute("lang", "en");
  await expect(page.getByText("Choose an image")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("locale"))).toBeNull();
});

test("a slower language choice that finishes after a newer one changes nothing", async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/assets/pt-BR-*.js", async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/");
  const select = page.getByLabel("Language");

  await select.selectOption("pt-BR");
  await select.selectOption("en");
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("locale")))
    .toBe("en");
  const loaded = page.waitForResponse(/pt-BR-.*\.js/);
  release();
  await (await loaded).finished();
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );

  await expect(select).toHaveValue("en");
  await expect(html(page)).toHaveAttribute("lang", "en");
  await expect(page.getByText("Choose an image")).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("locale"))).toBe("en");
});
