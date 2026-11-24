import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

const brandSource: Record<string, string> = {
  "/favicon.svg": "brand/favicon/favicon.svg",
  "/favicon-32x32.png": "brand/favicon/icon-32.png",
  "/apple-touch-icon.png": "brand/favicon/apple-touch-icon-180.png",
};

test("every icon and the OG image linked from index.html is served under the real CSP", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.addInitScript(() => {
    (window as unknown as { violations: string[] }).violations = [];
    document.addEventListener("securitypolicyviolation", (event) => {
      (window as unknown as { violations: string[] }).violations.push(
        `${event.violatedDirective} ${event.blockedURI}`,
      );
    });
  });
  await page.goto("/");

  const paths = await page.evaluate(() =>
    [
      ...document.querySelectorAll<HTMLLinkElement>(
        'link[rel~="icon"], link[rel="apple-touch-icon"]',
      ),
      ...document.querySelectorAll<HTMLMetaElement>(
        'meta[property="og:image"]',
      ),
    ].map(
      (el) =>
        new URL(el instanceof HTMLLinkElement ? el.href : el.content).pathname,
    ),
  );
  expect(paths).toEqual([
    "/favicon.svg",
    "/favicon-32x32.png",
    "/apple-touch-icon.png",
    "/og-image.png",
  ]);

  for (const path of paths) {
    const response = await page.request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"], path).toMatch(/^image\//);
    if (brandSource[path]) {
      const source = await readFile(brandSource[path]);
      expect(await response.body(), path).toEqual(source);
    }
  }

  const failed = await page.evaluate(
    (urls) =>
      Promise.all(
        urls.map(
          (url) =>
            new Promise<string | null>((resolve) => {
              const image = new Image();
              image.onload = () => resolve(null);
              image.onerror = () => resolve(url);
              image.src = url;
            }),
        ),
      ),
    paths,
  );
  expect(failed.filter(Boolean)).toEqual([]);
  expect(
    await page.evaluate(
      () => (window as unknown as { violations: string[] }).violations,
    ),
  ).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
