import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const here = dirname(fileURLToPath(import.meta.url));
const logosDir = join(here, "..", "logos");
const faviconDir = join(here, "..", "favicon");
mkdirSync(logosDir, { recursive: true });
mkdirSync(faviconDir, { recursive: true });

const wordmarks = JSON.parse(
  readFileSync(join(here, "wordmark-paths.json"), "utf8"),
);
// Written by measure-mark.mjs from the raw PNGs: block size, position and ink opacity.
const marks = JSON.parse(
  readFileSync(join(here, "mark-geometry.json"), "utf8"),
);

const BLACK = "#0f1115";
const WHITE = "#ffffff";

const VARIANTS = { black: BLACK, white: WHITE };

const fmt = (n) => String(Math.round(n * 10) / 10);

function markShapes(m, x, y, w, h, ink) {
  const rects = m.cells.map(
    ([c, r, o]) =>
      `<rect x="${fmt(x + c * w)}" y="${fmt(y + r * h)}" width="${fmt(w)}" height="${fmt(h)}" fill="${ink}"${o < 1 ? ` fill-opacity="${o}"` : ""}/>`,
  );
  rects.push(
    `<rect x="${fmt(x + m.barColumn * w)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(m.barRows * h)}" fill="${ink}"/>`,
  );
  return `<g shape-rendering="crispEdges">${rects.join("")}</g>`;
}

function svg(minX, minY, w, h, body, label = "Blur My Image") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fmt(minX)} ${fmt(minY)} ${fmt(w)} ${fmt(h)}" role="img" aria-label="${label}"><title>${label}</title>${body}</svg>\n`;
}

function lockup(kind, ink) {
  const w = wordmarks[kind];
  const m = marks[kind];
  const minX = Math.min(0, m.x);
  const minY = Math.min(0, m.y);
  const maxX = Math.max(w.width, m.x + 5 * m.cellWidth);
  const maxY = Math.max(w.height, m.y + 5 * m.cellHeight);
  return svg(
    minX,
    minY,
    maxX - minX,
    maxY - minY,
    `${markShapes(m, m.x, m.y, m.cellWidth, m.cellHeight, ink)}<path fill="${ink}" d="${w.d}"/>`,
  );
}

// The mark alone uses the stacked drawing, whose blocks are closest to square, at 20 units per block height.
function markOnly(ink) {
  const m = marks.stacked;
  const h = 20;
  const w = (m.cellWidth / m.cellHeight) * h;
  return svg(
    0,
    0,
    5 * w,
    5 * h,
    markShapes(m, 0, 0, w, h, ink),
    "Blur My Image mark",
  );
}

for (const [name, ink] of Object.entries(VARIANTS)) {
  writeFileSync(
    join(logosDir, `logo-stacked-${name}.svg`),
    lockup("stacked", ink),
  );
  writeFileSync(
    join(logosDir, `logo-horizontal-${name}.svg`),
    lockup("horizontal", ink),
  );
  writeFileSync(join(logosDir, `mark-${name}.svg`), markOnly(ink));
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
const favCells = FAV_CELLS.map(
  ([c, r, o]) =>
    `<rect x="${c * 8}" y="${r * 8}" width="8" height="8" fill-opacity="${o}"/>`,
).join("");
writeFileSync(
  join(faviconDir, "favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="Blur My Image"><title>Blur My Image</title><style>g{fill:${BLACK}}@media (prefers-color-scheme:dark){g{fill:${WHITE}}}</style><g>${favCells}<rect x="24" y="0" width="8" height="24"/></g></svg>\n`,
);

// Icon tiles for the PNG sizes: dark tile with the white mark.
function tile(size, radiusRatio, markRatio) {
  const cell = Math.round((size * markRatio) / 4);
  const off = Math.floor((size - cell * 4) / 2);
  const s = cell / 8;
  const cells = FAV_CELLS.map(
    ([c, r, o]) =>
      `<rect x="${fmt(off + c * 8 * s)}" y="${fmt(off + r * 8 * s)}" width="${fmt(8 * s)}" height="${fmt(8 * s)}" fill="${WHITE}" fill-opacity="${o}"/>`,
  ).join("");
  const bar = `<rect x="${fmt(off + 24 * s)}" y="${fmt(off)}" width="${fmt(8 * s)}" height="${fmt(24 * s)}" fill="${WHITE}"/>`;
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
