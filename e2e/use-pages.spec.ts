import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { download, makePng, openImage } from "./helpers";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const SUFFIX = "| Blur My Image";

const PAGES = [
  {
    path: "/blur-license-plate/",
    title: `Blur a License Plate in a Photo Online ${SUFFIX}`,
    description:
      "Paint over a license plate to pixelate or blur it. No account, no watermark. Image files you open, drop or paste never leave your device.",
    h1: "Blur a license plate in a photo",
  },
  {
    path: "/blur-text-in-screenshot/",
    title: `Blur or Pixelate Text in a Screenshot ${SUFFIX}`,
    description:
      "Paste a screenshot, paint over a name or number and pixelate it. No account, no watermark. Image files you open, drop or paste never leave your device.",
    h1: "Blur or pixelate text in a screenshot",
  },
  {
    path: "/blur-face-in-photo/",
    title: `Blur a Face in a Photo Online ${SUFFIX}`,
    description:
      "Paint over faces to pixelate or blur them. No account, no watermark. Image files you open, drop or paste never leave your device.",
    h1: "Blur a face in a photo",
  },
];

const PATHS = PAGES.map((p) => p.path);

test("robots.txt keeps crawlers off the API", async ({ request }) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain("Disallow: /api/");
});

test("the home links the three pages from its section and its footer", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator('section[aria-labelledby="what-people-hide"]');
  const footer = page.getByRole("navigation", { name: "Use cases" });
  await expect(
    page.getByRole("heading", { level: 2, name: "What people hide with it" }),
  ).toBeVisible();
  for (const path of PATHS) {
    await expect(section.locator(`a[href="${path}"]`)).toHaveCount(1);
    await expect(footer.locator(`a[href="${path}"]`)).toHaveCount(1);
  }
});

for (const { path, title, description, h1 } of PAGES) {
  test.describe(path, () => {
    test.describe("without JavaScript", () => {
      test.use({ javaScriptEnabled: false });

      test("its own head tags, one h1 and its copy are in the HTML", async ({
        page,
      }) => {
        await page.goto(path);
        await expect(page).toHaveTitle(title);
        await expect(page.locator("html")).toHaveAttribute("lang", "en");
        await expect(page.locator('meta[name="description"]')).toHaveAttribute(
          "content",
          description,
        );
        await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
          "content",
          title,
        );
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1);
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
        await expect(
          page.getByRole("heading", { level: 2, name: "Questions" }),
        ).toBeVisible();
        await expect(page.locator("body")).not.toContainText(/DRAFT/);
        await expect(page.locator("body")).not.toContainText(
          /Choices for the owner|Internal notes/,
        );
        await expect(page.locator(".site-footer a")).toHaveCount(3);
      });
    });

    test("loads an image and downloads it", async ({ page }) => {
      await page.goto(path);
      await openImage(page, "edge", "photo.png");
      await page.getByRole("button", { name: "Blur entire image" }).click();
      const file = await download(page);
      expect(file.suggestedFilename()).toBe("photo-blurred.png");
    });

    test("dropping an image with the page scrolled to the bottom brings the editor into view", async ({
      page,
    }) => {
      await page.goto(path);
      const png = (await makePng(page, "edge")).toString("base64");
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await expect(
        page.getByRole("button", { name: "Choose an image" }),
      ).not.toBeInViewport();
      await page.evaluate((base64) => {
        const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        const data = new DataTransfer();
        data.items.add(new File([bytes], "dropped.png", { type: "image/png" }));
        document.body.dispatchEvent(
          new DragEvent("drop", {
            dataTransfer: data,
            bubbles: true,
            cancelable: true,
          }),
        );
      }, png);
      await expect(page.locator("canvas")).toBeInViewport();
    });

    test("sends the same security headers as the home", async ({ request }) => {
      const home = (await request.get("/")).headers();
      const own = (await request.get(path)).headers();
      for (const name of [
        "content-security-policy",
        "permissions-policy",
        "referrer-policy",
        "x-content-type-options",
      ]) {
        expect(own[name]).toBeTruthy();
        expect(own[name]).toBe(home[name]);
      }
    });

    test("follows the system theme live, with no flash before the app mounts", async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: "dark" });
      await page.goto(path, { waitUntil: "commit" });
      await expect(page.locator("html")).toHaveClass(/dark/);
      await page.waitForLoadState("load");
      await page.emulateMedia({ colorScheme: "light" });
      await expect(page.locator("html")).not.toHaveClass(/dark/);
      await page.emulateMedia({ colorScheme: "dark" });
      await expect(page.locator("html")).toHaveClass(/dark/);
    });

    for (const scheme of ["light", "dark"] as const) {
      test(`has no WCAG 2.2 AA violations in the ${scheme} theme`, async ({
        page,
      }) => {
        await page.emulateMedia({ colorScheme: scheme });
        await page.goto(path);
        await expect(page.getByText("Choose an image")).toBeVisible();
        const results = await new AxeBuilder({ page })
          .withTags(WCAG_TAGS)
          .analyze();
        expect(
          results.violations.map(
            (v) =>
              `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
          ),
        ).toEqual([]);
      });
    }
  });
}
