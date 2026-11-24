import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const EN =
  "Links are fetched through our server. Files you open, drop or paste never leave your browser.";
const PT =
  "Links são buscados pelo nosso servidor. Arquivos que você abre, solta ou cola nunca saem do seu navegador.";

test("the link field has a visible notice below it, tied to the field", async ({
  page,
}) => {
  await page.goto("/");
  const field = page.getByLabel("Image URL");
  const notice = page.locator("#app").getByText(EN);

  await expect(notice).toBeVisible();
  const fieldBox = await field.boundingBox();
  const noticeBox = await notice.boundingBox();
  expect(fieldBox).not.toBeNull();
  expect(noticeBox).not.toBeNull();
  expect(noticeBox?.y).toBeGreaterThanOrEqual(
    (fieldBox?.y ?? 0) + (fieldBox?.height ?? 0),
  );

  const id = await notice.getAttribute("id");
  expect(id).toBeTruthy();
  await expect(field).toHaveAttribute("aria-describedby", id ?? "");
  await expect(field).toHaveAccessibleDescription(EN);
});

test("the notice follows the language", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Language").selectOption("pt-BR");

  await expect(page.locator("#app").getByText(PT)).toBeVisible();
  await expect(page.getByLabel("URL da imagem")).toHaveAccessibleDescription(
    PT,
  );
  await expect(page.locator("#app").getByText(EN)).toHaveCount(0);
});

for (const scheme of ["light", "dark"] as const) {
  test(`the notice has enough contrast in the ${scheme} theme`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    await expect(page.locator("#app").getByText(EN)).toBeVisible();

    const results = await new AxeBuilder({ page })
      .include("#image-url-notice")
      .withRules(["color-contrast"])
      .analyze();

    expect(results.violations).toEqual([]);
    expect(results.passes.some((rule) => rule.id === "color-contrast")).toBe(
      true,
    );
  });
}
