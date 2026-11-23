import { expect, test } from "@playwright/test";
import { makePng } from "./helpers";

const blurButton = (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: "Blur entire image" });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("paste an image from the clipboard", async ({ page }) => {
  const png = (await makePng(page, "edge")).toString("base64");
  await page.evaluate((base64) => {
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const data = new DataTransfer();
    data.items.add(new File([bytes], "pasted.png", { type: "image/png" }));
    // Firefox drops the clipboardData given to the ClipboardEvent constructor.
    const event = new Event("paste", { cancelable: true });
    Object.defineProperty(event, "clipboardData", { value: data });
    window.dispatchEvent(event);
  }, png);
  await expect(blurButton(page)).toBeVisible();
});

test("drop an image anywhere on the page", async ({ page }) => {
  const png = (await makePng(page, "edge")).toString("base64");
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
  await expect(blurButton(page)).toBeVisible();
});

test("load a URL directly when the site allows CORS", async ({ page }) => {
  const png = await makePng(page, "edge");
  await page.route("https://images.test/cat.png", (route) =>
    route.fulfill({
      body: png,
      contentType: "image/png",
      headers: { "access-control-allow-origin": "*" },
    }),
  );
  await page.getByLabel("Image URL").fill("https://images.test/cat.png");
  await page.getByRole("button", { name: "Load" }).click();
  await expect(blurButton(page)).toBeVisible();
});

test("fall back to the proxy when the site blocks CORS", async ({ page }) => {
  const png = await makePng(page, "edge");
  let proxied = "";
  // A CORS refusal reaches the page as a failed fetch; Playwright's fulfill would skip the CORS check.
  await page.route("https://nocors.test/**", (route) =>
    route.abort("accessdenied"),
  );
  await page.route("**/api/image?**", (route) => {
    proxied = new URL(route.request().url()).searchParams.get("url") ?? "";
    return route.fulfill({ body: png, contentType: "image/png" });
  });
  await page.getByLabel("Image URL").fill("https://nocors.test/photo.png");
  await page.getByRole("button", { name: "Load" }).click();
  await expect(blurButton(page)).toBeVisible();
  expect(proxied).toBe("https://nocors.test/photo.png");
});

test("paste a link with Ctrl+V outside the URL field", async ({ page }) => {
  const png = await makePng(page, "edge");
  await page.route("https://images.test/pasted.png", (route) =>
    route.fulfill({
      body: png,
      contentType: "image/png",
      headers: { "access-control-allow-origin": "*" },
    }),
  );
  await page.evaluate(() => {
    const data = new DataTransfer();
    data.setData("text/plain", "https://images.test/pasted.png");
    const event = new Event("paste", { cancelable: true });
    Object.defineProperty(event, "clipboardData", { value: data });
    window.dispatchEvent(event);
  });
  await expect(blurButton(page)).toBeVisible();
});

test("show the proxy's reason when a URL can't be loaded", async ({ page }) => {
  await page.route("https://private.test/**", (route) => route.abort());
  await page.route("**/api/image?**", (route) =>
    route.fulfill({ status: 403, json: { error: "blocked_address" } }),
  );
  await page.getByLabel("Image URL").fill("https://private.test/x.png");
  await page.getByRole("button", { name: "Load" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "private or local address",
  );
});

test("tell the user to wait when the platform's rate limit denies the proxy", async ({
  page,
}) => {
  await page.route("https://busy.test/**", (route) => route.abort());
  await page.route("**/api/image?**", (route) =>
    route.fulfill({
      status: 403,
      body: "Forbidden",
      contentType: "text/plain",
      headers: { "x-vercel-mitigated": "deny" },
    }),
  );
  await page.getByLabel("Image URL").fill("https://busy.test/x.png");
  await page.getByRole("button", { name: "Load" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Try again in about a minute",
  );
});

test("reject a file that isn't an image", async ({ page }) => {
  await page.getByLabel("Image file").setInputFiles({
    name: "notes.png",
    mimeType: "image/png",
    buffer: Buffer.from("hello"),
  });
  await expect(page.getByRole("alert")).toContainText("isn't an image");
});
