// Renders brand/editor-proposal.html at 390, 820 and 1366 px wide, light and dark, plus one annotated desktop view.
// Usage: node brand/scripts/render-editor-proposal.mjs <output folder>
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const brand = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(process.argv[2] ?? ".");
mkdirSync(out, { recursive: true });

const icon = (name) =>
  readFileSync(join(brand, "icons", `${name}.svg`), "utf8")
    .trim()
    .replace("<svg ", '<svg class="i" ');

// The horizontal logo from the kit, recolored through currentColor so it follows the theme (black on light, white on dark).
const logo = readFileSync(
  join(brand, "logos", "logo-horizontal-black.svg"),
  "utf8",
)
  .trim()
  .replace(/^<\?xml[^>]*>\s*/, "")
  .replaceAll(/fill="#0f1115"/gi, 'fill="currentColor"')
  .replace("<svg ", '<svg class="logo" ');

// GitHub's mark, copied unchanged from @primer/octicons 19.42.0 build/svg/mark-github-16.svg (MIT), used only as the link to the repository.
const github =
  '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6.766 11.328c-2.063-.25-3.516-1.734-3.516-3.656 0-.781.281-1.625.75-2.188-.203-.515-.172-1.609.063-2.062.625-.078 1.468.25 1.968.703.594-.187 1.219-.281 1.985-.281.765 0 1.39.094 1.953.265.484-.437 1.344-.765 1.969-.687.218.422.25 1.515.046 2.047.5.593.766 1.39.766 2.203 0 1.922-1.453 3.375-3.547 3.64.531.344.89 1.094.89 1.954v1.625c0 .468.391.734.86.547C13.781 14.359 16 11.53 16 8.03 16 3.61 12.406 0 7.984 0 3.563 0 0 3.61 0 8.031a7.88 7.88 0 0 0 5.172 7.422c.422.156.828-.125.828-.547v-1.25c-.219.094-.5.156-.75.156-1.031 0-1.64-.562-2.078-1.609-.172-.422-.36-.672-.719-.719-.187-.015-.25-.093-.25-.187 0-.188.313-.328.625-.328.453 0 .844.281 1.25.86.313.452.64.655 1.031.655s.641-.14 1-.5c.266-.265.47-.5.657-.656"/></svg>';

const html = readFileSync(join(brand, "editor-proposal.html"), "utf8")
  .replaceAll(/\{\{icon:([a-z-]+)\}\}/g, (_, name) => icon(name))
  .replace(
    '<link rel="stylesheet" href="tokens.css">',
    () => `<style>${readFileSync(join(brand, "tokens.css"), "utf8")}</style>`,
  )
  .replace("{{logo}}", logo)
  .replace("{{github}}", github)
  // This machine's system-ui is DejaVu Sans, much wider than Segoe UI or San Francisco; Liberation Sans (Arial metrics) stands in.
  .replace(
    "</head>",
    '<style>:root { --font: "Liberation Sans", Arial, sans-serif; }</style></head>',
  );
const left = html.match(/\{\{[^}]+\}\}/);
if (left) throw new Error(`Unfilled placeholder ${left[0]}`);

const sizes = [
  { width: 390, height: 844, touch: true },
  { width: 820, height: 1180, touch: true },
  { width: 1366, height: 768, touch: false },
];
const themes = {
  light: { theme: "light", tool: "brush", effect: "pixelate", canRedo: false },
  dark: { theme: "dark", tool: "eraser", effect: "motion", canRedo: true },
};

const browser = await chromium.launch();
const shots = [];
for (const size of sizes) {
  for (const [name, state] of Object.entries(themes)) {
    shots.push({
      file: `editor-proposal-${size.width}-${name}.png`,
      size,
      state: {
        ...state,
        tip: !size.touch && name === "light",
        cursor: !size.touch,
      },
    });
  }
}
shots.push({
  file: "editor-proposal-1366-light-reserved.png",
  size: sizes[2],
  state: { ...themes.light, annotate: true },
});
shots.push({
  file: "editor-proposal-390-light-reserved.png",
  size: sizes[0],
  state: { ...themes.light, annotate: true },
});

for (const shot of shots) {
  const page = await browser.newPage({
    viewport: { width: shot.size.width, height: shot.size.height },
    deviceScaleFactor: 2,
  });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate((s) => window.applyState(s), shot.state);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  if (overflow > 0)
    console.warn(`${shot.file}: ${overflow} px of horizontal overflow`);
  await page.screenshot({ path: join(out, shot.file), fullPage: true });
  await page.close();
  console.log(shot.file);
}
await browser.close();
