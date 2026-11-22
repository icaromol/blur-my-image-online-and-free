import { mkdir, readFile } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const FORMATS = {
  landscape: { width: 1200, height: 675 },
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  "og-1200x630": { width: 1200, height: 630, scale: 1 },
  "github-1280x640": { width: 1280, height: 640, scale: 1 },
};

const here = dirname(fileURLToPath(import.meta.url));
const templatesDir = join(here, "templates");
const outDir = join(here, "out");

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function fill(template, data, specPath) {
  const missing = new Set();
  const html = template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    if (!(key in data)) missing.add(key);
    return escapeHtml(data[key] ?? "");
  });
  if (missing.size > 0) {
    throw new Error(`${specPath}: missing data for ${[...missing].join(", ")}`);
  }
  return html;
}

async function render(browser, specPath, spec, format) {
  const size = FORMATS[format];
  if (!size) {
    throw new Error(
      `${specPath}: format must be one of ${Object.keys(FORMATS).join(", ")}`,
    );
  }

  const templatePath = join(templatesDir, `${spec.template}.html`);
  const html = fill(
    await readFile(templatePath, "utf8"),
    spec.data ?? {},
    specPath,
  );

  const page = await browser.newPage({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: size.scale ?? 2,
  });
  // Load the template file first so the filled page keeps a file:// origin and can read brand.css.
  await page.goto(pathToFileURL(templatePath).href);
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  const name = `${basename(specPath, extname(specPath))}-${format}.png`;
  const outPath = join(outDir, name);
  await page.screenshot({ path: outPath });
  await page.close();
  return outPath;
}

const specs = process.argv.slice(2).map((p) => resolve(p));
if (specs.length === 0) {
  console.error("usage: node marketing/social/render.mjs <spec.json>...");
  process.exit(1);
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
try {
  for (const specPath of specs) {
    const spec = JSON.parse(await readFile(specPath, "utf8"));
    const formats = [spec.format].flat();
    if (formats.length === 0 || formats.some((f) => !f)) {
      throw new Error(`${specPath}: format must name at least one format`);
    }
    for (const format of formats) {
      console.log(await render(browser, specPath, spec, format));
    }
  }
} finally {
  await browser.close();
}
