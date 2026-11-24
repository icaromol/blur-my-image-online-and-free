import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const LIGHT_BG = "rgb(236, 238, 242)";
const DARK_BG = "rgb(15, 17, 21)";

const html = (page: Page) => page.locator("html");
const trigger = (page: Page) => page.getByRole("button", { name: "Theme" });
const background = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const colorScheme = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.documentElement).colorScheme);
const stored = (page: Page) =>
  page.evaluate(() => localStorage.getItem("theme"));

async function choose(page: Page, name: "Light" | "Dark" | "System") {
  await trigger(page).click();
  await page.getByRole("menuitemradio", { name }).click();
}

test.describe("System is the default", () => {
  test("follows an emulated light or dark system, live", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await expect(html(page)).not.toHaveClass(/dark/);
    expect(await background(page)).toBe(LIGHT_BG);
    expect(await colorScheme(page)).toBe("light");

    await page.emulateMedia({ colorScheme: "dark" });
    await expect(html(page)).toHaveClass(/dark/);
    expect(await background(page)).toBe(DARK_BG);
    expect(await colorScheme(page)).toBe("dark");

    await page.emulateMedia({ colorScheme: "light" });
    await expect(html(page)).not.toHaveClass(/dark/);
    expect(await stored(page)).toBeNull();
  });

  test("an unknown stored value counts as System", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "sepia"));
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(html(page)).toHaveClass(/dark/);
    await expect(trigger(page)).toBeVisible();
    await trigger(page).click();
    await expect(
      page.getByRole("menuitemradio", { name: "System" }),
    ).toHaveAttribute("aria-checked", "true");
  });

  test("the app works when localStorage throws", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "localStorage", {
        get() {
          throw new DOMException("denied", "SecurityError");
        },
      });
    });
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(html(page)).toHaveClass(/dark/);
    await choose(page, "Light");
    await expect(html(page)).not.toHaveClass(/dark/);
  });
});

test("the trigger shows the sun in light and the moon in dark, and the page stays visible", async ({
  page,
}) => {
  const sun = page.locator(".trigger .sun");
  const moon = page.locator(".trigger .moon");
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(sun).toBeVisible();
  await expect(moon).toBeHidden();

  await choose(page, "Dark");
  await expect(html(page)).toHaveClass(/dark/);
  await expect(moon).toBeVisible();
  await expect(sun).toBeHidden();
  expect(
    await html(page).evaluate((el) => getComputedStyle(el).display),
  ).not.toBe("none");
  await expect(page.locator("body")).toBeVisible();

  await choose(page, "Light");
  await expect(sun).toBeVisible();
  await expect(moon).toBeHidden();
});

test("choosing Dark adds the class, marks the choice and survives a reload", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await choose(page, "Dark");
  await expect(html(page)).toHaveClass(/dark/);
  expect(await colorScheme(page)).toBe("dark");
  expect(await stored(page)).toBe("dark");

  await page.reload();
  await expect(html(page)).toHaveClass(/dark/);
  await trigger(page).click();
  await expect(
    page.getByRole("menuitemradio", { name: "Dark" }),
  ).toHaveAttribute("aria-checked", "true");
  await expect(
    page.getByRole("menuitemradio", { name: "Light" }),
  ).toHaveAttribute("aria-checked", "false");
});

test("an explicit choice wins over the system, and System goes back to following it", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await choose(page, "Light");
  await expect(html(page)).not.toHaveClass(/dark/);
  expect(await stored(page)).toBe("light");

  await page.reload();
  await expect(html(page)).not.toHaveClass(/dark/);

  await choose(page, "System");
  await expect(html(page)).toHaveClass(/dark/);
  expect(await stored(page)).toBe("system");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(html(page)).not.toHaveClass(/dark/);
});

test("with Dark stored, the first paint is already dark, before the app mounts", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await choose(page, "Dark");

  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/assets/index-*.js", async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/", { waitUntil: "commit" });

  await expect(html(page)).toHaveClass(/dark/);
  expect(await page.locator("#app").innerHTML()).toBe("");
  expect(await background(page)).toBe(DARK_BG);
  expect(await colorScheme(page)).toBe("dark");

  release();
  await expect(trigger(page)).toBeVisible();
  await expect(html(page)).toHaveClass(/dark/);
});

test("switching the theme does not animate colors", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.evaluate(() => {
    document.body.style.transition = "background-color 5s linear";
  });
  await choose(page, "Dark");
  expect(await background(page)).toBe(DARK_BG);
  await expect(html(page)).not.toHaveClass(/theme-switching/);

  await page.evaluate(() => {
    document.documentElement.classList.remove("dark");
  });
  await expect.poll(() => background(page)).not.toBe(DARK_BG);
  expect(await background(page)).not.toBe(LIGHT_BG);
});

test("the menu works with the keyboard only", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const menu = page.getByRole("menu", { name: "Theme" });
  const item = (name: string) => page.getByRole("menuitemradio", { name });

  await trigger(page).focus();
  await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Enter");
  await expect(menu).toBeVisible();
  await expect(trigger(page)).toHaveAttribute("aria-expanded", "true");
  await expect(item("System")).toBeFocused();

  await page.keyboard.press("ArrowDown");
  await expect(item("Light")).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(item("System")).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(item("Dark")).toBeFocused();
  await page.keyboard.press("Home");
  await expect(item("Light")).toBeFocused();
  await page.keyboard.press("End");
  await expect(item("System")).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger(page)).toBeFocused();
  await expect(html(page)).not.toHaveClass(/dark/);

  await page.keyboard.press("ArrowDown");
  await expect(item("System")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger(page)).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(menu).toBeVisible();
  await expect(item("System")).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(item("Dark")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(menu).toBeHidden();
  await expect(trigger(page)).toBeFocused();
  await expect(html(page)).toHaveClass(/dark/);
  expect(await stored(page)).toBe("dark");

  await page.keyboard.press("Space");
  await expect(item("Dark")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(menu).toBeHidden();
});

test("a click outside closes the menu", async ({ page }) => {
  await page.goto("/");
  await trigger(page).click();
  await expect(page.getByRole("menu", { name: "Theme" })).toBeVisible();
  await page.locator("h1").click();
  await expect(page.getByRole("menu", { name: "Theme" })).toBeHidden();
});

test("the control is translated", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Language").selectOption("pt-BR");
  await page.getByRole("button", { name: "Tema" }).click();
  await expect(page.getByRole("menuitemradio")).toHaveText([
    /Claro/,
    /Escuro/,
    /Sistema/,
  ]);
});

for (const scheme of ["light", "dark"] as const) {
  test(`has no WCAG 2.2 AA violations with the menu open and the ${scheme} theme chosen`, async ({
    page,
  }) => {
    await page.emulateMedia({
      colorScheme: scheme === "light" ? "dark" : "light",
    });
    await page.goto("/");
    await choose(page, scheme === "light" ? "Light" : "Dark");
    await trigger(page).click();
    await expect(page.getByRole("menu", { name: "Theme" })).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .analyze();
    expect(
      results.violations.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
      ),
    ).toEqual([]);
  });
}
