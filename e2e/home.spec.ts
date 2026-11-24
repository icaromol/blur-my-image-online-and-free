import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";
import { makePng } from "./helpers";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const TITLE = "Blur or Pixelate an Image Online, Free | Blur My Image";
const H1 = "Blur or pixelate part of an image, in your browser";
const REPO = "https://github.com/icaromol/blur-my-image-online-and-free";

// Sentences of Ícaro's mockup that claims-check.md forbids on the page.
const FORBIDDEN = [
  "forever",
  "No limits",
  "No files are uploaded",
  "sensitive information",
  "Remove personal data",
  "select the area",
  "it's that simple",
  "12 px",
];

const phone = { width: 390, height: 844 };
const laptop = { width: 1366, height: 768 };

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the copy, its headings and the stepper are in the HTML", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(TITLE);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(H1);
    for (const name of [
      "Private by design",
      "Fast and simple",
      "Works with any image",
      "Free and open source",
      "An MCP server for agents",
      "Shortcuts from Photoshop",
      "Ask for a feature or report a bug",
    ]) {
      await expect(page.getByRole("heading", { level: 3, name })).toBeVisible();
    }
    const steps = page.locator("ol.stepper > li");
    await expect(steps).toHaveCount(3);
    await expect(steps.nth(0)).toContainText("Paste");
    await expect(steps.nth(1)).toContainText("Blur");
    await expect(steps.nth(2)).toContainText("Download");
    await expect(page.locator("#how-it-works")).toHaveText(
      "Blur part of an image in three steps",
    );
  });
});

test("the head tags are the home's own", async ({ page }) => {
  await page.goto("/");
  const description =
    "Blur or pixelate an image, or just the parts you paint. Free, no account, no watermark. Image files you open, drop or paste never leave your device.";
  await expect(page).toHaveTitle(TITLE);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    description,
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    TITLE,
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    description,
  );
});

test("one h1, in the static HTML, and the document stays English under a Portuguese app", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("locale", "pt-BR"));
  await page.goto("/");
  await expect(page.getByLabel("Idioma")).toHaveValue("pt-BR");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(H1);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("#app > [lang]")).toHaveAttribute("lang", "pt-BR");
  await expect(page.locator(".copy")).not.toHaveAttribute("lang", /.+/);
});

test("none of the mockup's forbidden sentences is on the page", async ({
  page,
}) => {
  await page.goto("/");
  const text = (await page.locator("body").textContent()) ?? "";
  for (const phrase of FORBIDDEN) {
    expect(text.toLowerCase()).not.toContain(phrase.toLowerCase());
  }
});

test("the cards and links point where the copy says", async ({ page }) => {
  await page.goto("/");
  const link = (name: string) => page.getByRole("link", { name, exact: true });
  await expect(link("How links load")).toHaveAttribute(
    "href",
    "#the-exception-links",
  );
  await expect(page.locator("#the-exception-links")).toHaveText(
    "The exception: links",
  );
  await expect(link("View on GitHub")).toHaveAttribute("href", REPO);
  await expect(link("Read the MCP spec")).toHaveAttribute(
    "href",
    `${REPO}/blob/main/docs/product/specs/mcp-for-agents.md`,
  );
  await expect(link("Open an issue on GitHub")).toHaveAttribute(
    "href",
    `${REPO}/issues/new/choose`,
  );
  await link("How links load").click();
  await expect(page.locator("#the-exception-links")).toBeInViewport();
});

for (const [name, viewport] of [
  ["a 1366x768 laptop", laptop],
  ["a phone", phone],
] as const) {
  test(`the drop zone and the link field are on the first screen of ${name}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "Choose an image" }),
    ).toBeInViewport({ ratio: 1 });
    await expect(page.getByLabel("Image URL")).toBeInViewport({ ratio: 1 });
  });
}

for (const [name, viewport, locale] of [
  ["a laptop", laptop, "en"],
  ["a tall window, with the copy in view", { width: 1366, height: 1600 }, "en"],
  ["a phone", phone, "en"],
  ["a phone in Portuguese", phone, "pt-BR"],
  ["a narrow phone in Portuguese", { width: 385, height: 844 }, "pt-BR"],
  ["a wide phone in Portuguese", { width: 430, height: 932 }, "pt-BR"],
] as const) {
  test(`loading the page and the app shifts nothing on ${name}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.addInitScript((l) => localStorage.setItem("locale", l), locale);
    await page.addInitScript(() => {
      const w = window as unknown as { shift: number };
      w.shift = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & {
            value: number;
            hadRecentInput: boolean;
          };
          if (!shift.hadRecentInput) w.shift += shift.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto("/");
    await expect(page.locator("#app [lang] button").first()).toBeVisible();
    // The copy is below the fold on both sizes; scroll through it so any shift there counts too.
    await page.evaluate(() =>
      document.querySelector(".closing")?.scrollIntoView(),
    );
    await page.waitForTimeout(500);
    const shift = await page.evaluate(
      () => (window as unknown as { shift: number }).shift,
    );
    expect(shift).toBe(0);
  });
}

async function scrollToBottom(page: Page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator(".closing")).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "Choose an image" }),
  ).not.toBeInViewport();
}

test("dropping an image with the page scrolled to the bottom brings the editor into view", async ({
  page,
}) => {
  await page.goto("/");
  const png = (await makePng(page, "edge")).toString("base64");
  await scrollToBottom(page);
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
  await expect(
    page.getByRole("button", { name: "Blur entire image" }),
  ).toBeInViewport();
});

test("pasting an image with the page scrolled to the bottom brings the editor into view", async ({
  page,
}) => {
  await page.goto("/");
  const png = (await makePng(page, "edge")).toString("base64");
  await scrollToBottom(page);
  await page.evaluate((base64) => {
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const data = new DataTransfer();
    data.items.add(new File([bytes], "pasted.png", { type: "image/png" }));
    // Firefox drops the clipboardData given to the ClipboardEvent constructor.
    const event = new Event("paste", { cancelable: true });
    Object.defineProperty(event, "clipboardData", { value: data });
    window.dispatchEvent(event);
  }, png);
  await expect(page.locator("canvas")).toBeInViewport();
});

async function dropAtBottom(
  page: Page,
  name: string,
  type: string,
  bytes: Uint8Array,
) {
  await scrollToBottom(page);
  await page.evaluate(
    ({ name, type, bytes }) => {
      const data = new DataTransfer();
      data.items.add(new File([new Uint8Array(bytes)], name, { type }));
      document.body.dispatchEvent(
        new DragEvent("drop", {
          dataTransfer: data,
          bubbles: true,
          cancelable: true,
        }),
      );
    },
    { name, type, bytes: Array.from(bytes) },
  );
}

test("dropping a file that is not an image with the page scrolled to the bottom shows the error", async ({
  page,
}) => {
  await page.setViewportSize(laptop);
  await page.goto("/");
  await dropAtBottom(page, "notes.txt", "text/plain", Buffer.from("hello"));
  const alert = page.getByRole("alert");
  await expect(alert).toHaveText("That file isn't an image.");
  await expect(alert).toBeInViewport({ ratio: 1 });
});

test("dropping a broken image with the page scrolled to the bottom shows the error", async ({
  page,
}) => {
  await page.setViewportSize(laptop);
  await page.goto("/");
  await dropAtBottom(page, "broken.png", "image/png", Buffer.from("not a png"));
  const alert = page.getByRole("alert");
  await expect(alert).toHaveText(
    "This file isn't an image your browser can open.",
  );
  await expect(alert).toBeInViewport({ ratio: 1 });
});

test("pasting a link that fails with the page scrolled to the bottom shows the error", async ({
  page,
}) => {
  await page.setViewportSize(laptop);
  await page.route("https://private.test/**", (route) => route.abort());
  await page.route("**/api/image?**", (route) =>
    route.fulfill({ status: 403, json: { error: "blocked_address" } }),
  );
  await page.goto("/");
  await scrollToBottom(page);
  await page.evaluate(() => {
    const data = new DataTransfer();
    data.setData("text/plain", "https://private.test/x.png");
    const event = new Event("paste", { cancelable: true });
    Object.defineProperty(event, "clipboardData", { value: data });
    window.dispatchEvent(event);
  });
  const alert = page.getByRole("alert");
  await expect(alert).toBeVisible();
  await expect(alert).toBeInViewport({ ratio: 1 });
});

test("pasting a link with the page scrolled to the bottom scrolls to the app before the image arrives", async ({
  page,
}) => {
  await page.setViewportSize(laptop);
  await page.route("https://slow.test/**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.abort();
  });
  await page.route("**/api/image?**", (route) =>
    route.fulfill({ status: 403, json: { error: "blocked_address" } }),
  );
  await page.goto("/");
  await scrollToBottom(page);
  await page.evaluate(() => {
    const data = new DataTransfer();
    data.setData("text/plain", "https://slow.test/x.png");
    const event = new Event("paste", { cancelable: true });
    Object.defineProperty(event, "clipboardData", { value: data });
    window.dispatchEvent(event);
  });
  await expect(page.getByLabel("Image URL")).toBeInViewport();
  await expect(page.getByRole("alert")).not.toBeVisible();
});

test("a link superseded by a file does not scroll the page when it finishes", async ({
  page,
}) => {
  await page.setViewportSize(laptop);
  await page.route("https://slow.test/**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.abort();
  });
  await page.route("**/api/image?**", (route) =>
    route.fulfill({ status: 403, json: { error: "blocked_address" } }),
  );
  await page.goto("/");
  const png = (await makePng(page, "edge")).toString("base64");
  await scrollToBottom(page);
  const proxied = page.waitForResponse("**/api/image?**");
  await page.evaluate(() => {
    const data = new DataTransfer();
    data.setData("text/plain", "https://slow.test/x.png");
    const event = new Event("paste", { cancelable: true });
    Object.defineProperty(event, "clipboardData", { value: data });
    window.dispatchEvent(event);
  });
  await expect(page.getByLabel("Image URL")).toBeInViewport();
  await page.evaluate((base64) => {
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const data = new DataTransfer();
    data.items.add(new File([bytes], "file.png", { type: "image/png" }));
    document.body.dispatchEvent(
      new DragEvent("drop", {
        dataTransfer: data,
        bubbles: true,
        cancelable: true,
      }),
    );
  }, png);
  await expect(page.locator("canvas")).toBeInViewport();
  await page.evaluate(() => window.scrollTo(0, 0));
  await proxied;
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("alert")).not.toBeVisible();
});

test("the keyboard goes from the hero into the app without a trap", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByText("Choose an image")).toBeVisible();
  const reached: string[] = [];
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    reached.push(
      await page.evaluate(
        () =>
          document.activeElement?.textContent?.trim() ||
          document.activeElement?.tagName ||
          "",
      ),
    );
  }
  expect(reached.join("|")).toContain("Choose an image");
  expect(reached.join("|")).toContain("How links load");
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(page.locator("body")).not.toBeFocused();
});

for (const scheme of ["light", "dark"] as const) {
  test(`the home has no WCAG 2.2 AA violations in the ${scheme} theme`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    await expect(page.getByText("Choose an image")).toBeVisible();
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

test("the logo follows the app's theme class, not the system alone", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const logo = page.locator(".logo");

  await page.evaluate(() => localStorage.setItem("theme", "dark"));
  await page.reload();
  await expect(logo).toHaveCSS("color", "rgb(255, 255, 255)");

  await page.evaluate(() => localStorage.setItem("theme", "light"));
  await page.emulateMedia({ colorScheme: "dark" });
  await page.reload();
  await expect(logo).toHaveCSS("color", "rgb(15, 17, 21)");
});
