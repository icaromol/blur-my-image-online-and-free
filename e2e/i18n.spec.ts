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
