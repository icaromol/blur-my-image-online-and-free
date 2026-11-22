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

test("editor with the Pixelate warning has no WCAG 2.2 AA violations", async ({
  page,
}) => {
  await openImage(page, "edge");
  await page.getByText("Pixelate", { exact: true }).click();
  await expectNoViolations(page);
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
