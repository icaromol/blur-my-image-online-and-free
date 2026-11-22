import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { openImage } from "./helpers";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function expectNoViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(
    results.violations.map(
      (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
    ),
  ).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("start screen has no WCAG 2.2 AA violations", async ({ page }) => {
  await expectNoViolations(page);
});

test("editor has no WCAG 2.2 AA violations", async ({ page }) => {
  await openImage(page, "edge");
  // Motion shows every control, including the angle slider.
  await page.getByText("Motion", { exact: true }).click();
  await expectNoViolations(page);
});

for (const scheme of ["light", "dark"] as const) {
  for (const effect of ["Gaussian", "Pixelate", "Motion"]) {
    test(`editor with the ${effect} warning has no WCAG 2.2 AA violations in the ${scheme} theme`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await openImage(page, "edge");
      await page.getByText(effect, { exact: true }).click();
      await expect(page.getByText(/don't reliably hide text/)).toBeVisible();
      await expectNoViolations(page);
    });
  }
}

test("the effect group, not each effect, is described by the warning", async ({
  page,
}) => {
  await openImage(page, "edge");
  const warning = page.locator("#effects-warning");
  const group = page.getByRole("radiogroup", { name: "Effect" });

  await expect(warning).toHaveText(/don't reliably hide text/);
  await expect(group).toHaveAttribute("aria-describedby", "effects-warning");
  await expect(group).toHaveAccessibleDescription(/don't reliably hide text/);
  await expect(
    page.locator("input[name=effect][aria-describedby]"),
  ).toHaveCount(0);

  await page.getByLabel("Language").selectOption("pt-BR");

  const grupo = page.getByRole("radiogroup", { name: "Efeito" });
  await expect(warning).toHaveText(/não escondem texto de forma confiável/);
  await expect(grupo).toHaveAttribute("aria-describedby", "effects-warning");
  await expect(grupo).toHaveAccessibleDescription(
    /não escondem texto de forma confiável/,
  );
});

test("error message has no WCAG 2.2 AA violations", async ({ page }) => {
  await page.getByLabel("Image file").setInputFiles({
    name: "notes.png",
    mimeType: "image/png",
    buffer: Buffer.from("not an image"),
  });
  await expect(page.getByRole("alert")).toBeVisible();
  await expectNoViolations(page);
});
