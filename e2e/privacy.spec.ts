import { expect, type Request, test } from "@playwright/test";
import { download, openImage, paint } from "./helpers";

interface Violation {
  directive: string;
  blocked: string;
}

test("a local image never leaves the page and the full flow stays within the CSP", async ({
  page,
  context,
}) => {
  await page.addInitScript(() => {
    const found: { directive: string; blocked: string }[] = [];
    Object.defineProperty(window, "__cspViolations", { value: found });
    document.addEventListener("securitypolicyviolation", (event) =>
      found.push({
        directive: event.violatedDirective,
        blocked: event.blockedURI,
      }),
    );
  });
  const requests: Request[] = [];
  const errors: string[] = [];
  page.on("request", (request) => requests.push(request));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  const response = await page.goto("/");
  expect(response?.headers()["content-security-policy"]).toContain(
    "default-src 'none'",
  );
  const origin = new URL(page.url()).origin;
  const afterLoad = requests.length;

  await openImage(page, "checker");
  await page.getByText("Motion", { exact: true }).click();
  await page.getByRole("button", { name: "Blur entire image" }).click();
  await page.getByRole("button", { name: "Eraser" }).click();
  await paint(page, [20, 50], [150, 60]);
  await page.getByText("Pixelate", { exact: true }).click();
  await page.getByRole("button", { name: "Brush" }).click();
  await paint(page, [20, 20], [150, 30]);
  for (const format of ["png", "jpg", "webp"]) {
    await page.getByLabel("Format").selectOption(format);
    await download(page);
  }

  const foreign = requests.filter(
    (r) => !r.url().startsWith(origin) && !r.url().startsWith("blob:"),
  );
  expect(foreign.map((r) => r.url())).toEqual([]);
  const sinceLoad = requests.slice(afterLoad);
  expect(
    sinceLoad
      .filter((r) => r.method() !== "GET" || r.postData() !== null)
      .map((r) => r.url()),
  ).toEqual([]);
  expect(
    requests.filter((r) => r.url().includes("/api/image")).map((r) => r.url()),
  ).toEqual([]);

  expect(await context.cookies()).toEqual([]);
  expect(await page.evaluate(() => document.cookie)).toBe("");
  const violations = await page.evaluate(
    () =>
      (window as unknown as { __cspViolations: Violation[] }).__cspViolations,
  );
  expect(violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("the WebAssembly WebP encoder also runs under the CSP", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  // Behave like Safari: asking for WebP silently returns a PNG, so the app loads @jsquash/webp.
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function (callback, type, quality) {
      return original.call(
        this,
        callback,
        type === "image/webp" ? "image/png" : type,
        quality,
      );
    };
  });
  await page.goto("/");
  await openImage(page, "edge");
  await page.getByLabel("Format").selectOption("webp");
  const file = await download(page);
  expect(file.suggestedFilename()).toMatch(/\.webp$/);
  expect(errors).toEqual([]);
});
