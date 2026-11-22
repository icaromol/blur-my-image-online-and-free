import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { contourToPath, loadFont } from "./ttf-outlines.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const logosDir = join(here, "..", "logos");
const faviconDir = join(here, "..", "favicon");
mkdirSync(logosDir, { recursive: true });
mkdirSync(faviconDir, { recursive: true });

const FONT = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf";
const font = loadFont(FONT);

const BLACK = "#0f1115";
const WHITE = "#ffffff";
const BLUE_ON_LIGHT = "#0d62b8";
const BLUE_ON_DARK = "#7cc4ff";

const VARIANTS = {
  black: { ink: BLACK, bar: BLACK },
  white: { ink: WHITE, bar: WHITE },
  blue: { ink: BLACK, bar: BLUE_ON_LIGHT },
  "blue-reverse": { ink: WHITE, bar: BLUE_ON_DARK },
};

const fmt = (n) => String(Math.round(n * 10) / 10);

// Mark cells on a 5 x 5 grid: [column, row, ink opacity]. The solid bar is column 4, rows 0 to 3.
const MARK_CELLS = [
  [2, 0, 0.4],
  [3, 0, 0.72],
  [1, 1, 0.18],
  [2, 1, 0.55],
  [3, 1, 0.85],
  [0, 2, 0.14],
  [1, 2, 0.32],
  [2, 2, 0.72],
  [3, 2, 0.92],
  [1, 3, 0.18],
  [2, 3, 0.55],
  [3, 3, 0.85],
  [2, 4, 0.3],
  [3, 4, 0.62],
];

function markShapes(x, y, u, v) {
  const rects = MARK_CELLS.map(
    ([c, r, o]) =>
      `<rect x="${fmt(x + c * u)}" y="${fmt(y + r * u)}" width="${fmt(u)}" height="${fmt(u)}" fill="${v.ink}" fill-opacity="${o}"/>`,
  );
  rects.push(
    `<rect x="${fmt(x + 4 * u)}" y="${fmt(y)}" width="${fmt(u)}" height="${fmt(4 * u)}" fill="${v.bar}"/>`,
  );
  return `<g shape-rendering="crispEdges">${rects.join("")}</g>`;
}

const TRACKING = -0.02;
const SPACE = 0.24;

function wordPath(text, x, baseline, size, fill) {
  const scale = size / font.unitsPerEm;
  let pen = x;
  let d = "";
  for (const ch of text) {
    const g = font.glyphIndex(ch.codePointAt(0));
    if (ch !== " ") {
      for (const c of font.contours(g)) {
        d += contourToPath(c, pen, baseline, scale, fmt);
      }
      pen += font.advance(g) * scale + TRACKING * size;
    } else {
      pen += SPACE * size;
    }
  }
  return { d, end: pen - TRACKING * size, fill };
}

function svg(w, h, body, label = "Blur My Image") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${fmt(w)} ${fmt(h)}" role="img" aria-label="${label}"><title>${label}</title>${body}</svg>\n`;
}

const SIZE = 100;
const CAP = (font.capHeight / font.unitsPerEm) * SIZE;

function horizontal(v) {
  const u = Math.round((CAP * 1.5) / 5);
  const markW = 5 * u;
  const gap = u * 1.5;
  const top = 0;
  const baseline = top + CAP;
  const word = wordPath("Blur My Image", markW + gap, baseline, SIZE, v.ink);
  const descender = 0.21 * SIZE;
  const h = Math.max(baseline + descender, top + 5 * u);
  const w = word.end;
  return svg(
    w,
    h,
    `${markShapes(0, top, u, v)}<path fill="${v.ink}" d="${word.d}"/>`,
  );
}

function stacked(v) {
  const pitch = SIZE * 0.88;
  const u = Math.round((CAP + pitch * 0.9) / 5);
  const markW = 5 * u;
  const gap = u * 1.1;
  const x = markW + gap;
  const lines = ["Blur", "My", "Image"].map((t, i) =>
    wordPath(t, x, CAP + i * pitch, SIZE, v.ink),
  );
  const w = Math.max(...lines.map((l) => l.end));
  const h = CAP + 2 * pitch + 0.21 * SIZE;
  const d = lines.map((l) => l.d).join("");
  return svg(w, h, `${markShapes(0, 0, u, v)}<path fill="${v.ink}" d="${d}"/>`);
}

function markOnly(v) {
  const u = 20;
  return svg(5 * u, 5 * u, markShapes(0, 0, u, v), "Blur My Image mark");
}

for (const [name, v] of Object.entries(VARIANTS)) {
  writeFileSync(join(logosDir, `logo-stacked-${name}.svg`), stacked(v));
  writeFileSync(join(logosDir, `logo-horizontal-${name}.svg`), horizontal(v));
  writeFileSync(join(logosDir, `mark-${name}.svg`), markOnly(v));
}

// Favicon: 4 x 4 cells of 8 units, so each cell is a whole pixel count at 16, 32 and 48 px.
const FAV_CELLS = [
  [2, 0, 0.5],
  [1, 1, 0.3],
  [2, 1, 0.75],
  [0, 2, 0.2],
  [1, 2, 0.5],
  [2, 2, 0.92],
  [2, 3, 0.5],
  [3, 3, 0.75],
];
function favCells(cls) {
  const rects = FAV_CELLS.map(
    ([c, r, o]) =>
      `<rect class="ink" x="${c * 8}" y="${r * 8}" width="8" height="8" fill-opacity="${o}"/>`,
  );
  rects.push(`<rect class="bar" x="24" y="0" width="8" height="24"/>`);
  return `<g${cls}>${rects.join("")}</g>`;
}
writeFileSync(
  join(faviconDir, "favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="Blur My Image"><title>Blur My Image</title><style>.ink{fill:${BLACK}}.bar{fill:${BLUE_ON_LIGHT}}@media (prefers-color-scheme:dark){.ink{fill:${WHITE}}.bar{fill:${BLUE_ON_DARK}}}</style>${favCells("")}</svg>\n`,
);

// Icon tiles for the PNG sizes: dark tile, reverse mark with the blue bar.
function tile(size, radiusRatio, markRatio) {
  const cell = Math.round((size * markRatio) / 4);
  const off = Math.floor((size - cell * 4) / 2);
  const s = cell / 8;
  const cells = FAV_CELLS.map(
    ([c, r, o]) =>
      `<rect x="${fmt(off + c * 8 * s)}" y="${fmt(off + r * 8 * s)}" width="${fmt(8 * s)}" height="${fmt(8 * s)}" fill="${WHITE}" fill-opacity="${o}"/>`,
  ).join("");
  const bar = `<rect x="${fmt(off + 24 * s)}" y="${fmt(off)}" width="${fmt(8 * s)}" height="${fmt(24 * s)}" fill="${BLUE_ON_DARK}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${fmt(size * radiusRatio)}" fill="${BLACK}"/><g shape-rendering="crispEdges">${cells}${bar}</g></svg>`;
}
const tiles = {
  "icon-16": tile(16, 0.2, 0.75),
  "icon-32": tile(32, 0.2, 0.75),
  "icon-48": tile(48, 0.2, 0.75),
  "apple-touch-icon-180": tile(180, 0, 0.58),
  "icon-192": tile(192, 0, 0.58),
  "icon-512": tile(512, 0, 0.58),
};

const browser = await chromium.launch();
try {
  for (const [name, markup] of Object.entries(tiles)) {
    const size = Number(name.split("-").at(-1));
    const page = await browser.newPage({
      viewport: { width: size, height: size },
    });
    await page.setContent(
      `<body style="margin:0;background:transparent">${markup}</body>`,
    );
    await page.screenshot({
      path: join(faviconDir, `${name}.png`),
      omitBackground: true,
    });
    await page.close();
  }
} finally {
  await browser.close();
}
