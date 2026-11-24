// Renders brand/icons/contact-sheet.png: every icon in brand/icons/ at 20, 24 and 48 px, on the light and dark surfaces.
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const brand = join(dirname(fileURLToPath(import.meta.url)), "..");
const iconsDir = join(brand, "icons");
const names = readdirSync(iconsDir)
  .filter((f) => f.endsWith(".svg"))
  .map((f) => f.slice(0, -4));
const order = [
  "tool-brush",
  "tool-eraser",
  "effect-gaussian",
  "effect-pixelate",
  "effect-motion",
  "blur-entire",
  "undo",
  "redo",
  "intensity",
  "angle",
  "brush-size",
  "warning",
  "format",
  "download",
  "open-image",
  "link",
  "load",
  "theme-light",
  "theme-dark",
  "theme-system",
  "language",
  "chevron-down",
  "preview-split",
];
const missing = names.filter((n) => !order.includes(n));
if (missing.length)
  throw new Error(`Add to the sheet order: ${missing.join(", ")}`);

const svg = (name, size) =>
  readFileSync(join(iconsDir, `${name}.svg`), "utf8").replace(
    /width="24" height="24"/,
    `width="${size}" height="${size}"`,
  );

const cell = (name) => `
  <figure>
    <div class="sizes">${svg(name, 48)}${svg(name, 24)}${svg(name, 20)}</div>
    <figcaption>${name}${name === "preview-split" ? "<em>reserved, BMI-127</em>" : ""}</figcaption>
  </figure>`;

const sheet = (theme) =>
  `<section class="${theme}"><h2>${theme === "light" ? "Light: #0f1115 on #ffffff" : "Dark: #f2f3f5 on #181b21"}</h2><div class="grid">${order.map(cell).join("")}</div></section>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>${readFileSync(join(brand, "tokens.css"), "utf8")}
  body { margin: 0; font-family: var(--font-sans); background: var(--paper); }
  header { padding: 32px 40px 8px; color: var(--ink); }
  header h1 { margin: 0; font-size: 22px; }
  header p { margin: 4px 0 0; color: var(--ink-muted); font: 13px/1.4 var(--font-mono); }
  section { padding: 24px 40px 32px; }
  section.light { background: var(--color-white); color: var(--color-black); }
  section.dark { background: var(--grey-900); color: var(--grey-50); }
  h2 { margin: 0 0 16px; font: 12px var(--font-mono); text-transform: uppercase; letter-spacing: .06em; opacity: .75; }
  .grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 20px 16px; }
  figure { margin: 0; display: grid; gap: 8px; }
  .sizes { display: flex; align-items: flex-end; gap: 14px; height: 52px; }
  figcaption { font: 11.5px/1.3 var(--font-mono); }
  figcaption em { display: block; font-style: normal; opacity: .75; }
</style></head><body>
<header><h1>Blur My Image editor icons</h1><p>24 px grid, 1.5 px stroke, round caps and joins, currentColor. Shown at 48, 24 and 20 px.</p></header>
${sheet("light")}${sheet("dark")}
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 800 },
  deviceScaleFactor: 2,
});
await page.setContent(html, { waitUntil: "load" });
await page.screenshot({
  path: join(iconsDir, "contact-sheet.png"),
  fullPage: true,
});
await browser.close();
console.log(`contact-sheet.png: ${order.length} icons`);
