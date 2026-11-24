import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

// Reads the mark from the raw PNGs in brand/source/ and writes mark-geometry.json:
// cell size, position relative to the wordmark origin, and the ink opacity of every block.
const here = dirname(fileURLToPath(import.meta.url));
const wordmarks = JSON.parse(
  readFileSync(join(here, "wordmark-paths.json"), "utf8"),
);

// Outer edges of the 5 x 5 mark grid in source pixels, read where the anti-aliased edge crosses 50%.
const SOURCES = {
  horizontal: {
    file: "logo-horizontal.png",
    box: { left: 132, top: 280.3, right: 352.5, bottom: 478.3 },
  },
  stacked: {
    file: "logo-stacked.png",
    box: { left: 134.5, top: 376.2, right: 431.3, bottom: 661.3 },
  },
};
const GRID = 5;
const BAR_COLUMN = 4;
const EMPTY_BELOW = 0.06;

const r2 = (n) => Math.round(n * 100) / 100;
const r1 = (n) => Math.round(n * 10) / 10;

const browser = await chromium.launch();
const out = {};
try {
  const page = await browser.newPage();
  for (const [name, cfg] of Object.entries(SOURCES)) {
    const b64 = readFileSync(join(here, "..", "source", cfg.file)).toString(
      "base64",
    );
    const { box } = cfg;
    const cellW = (box.right - box.left) / GRID;
    const cellH = (box.bottom - box.top) / GRID;
    const lum = await page.evaluate(
      async ({ src, box, cellW, cellH, GRID }) => {
        const img = new Image();
        img.src = src;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = img.width;
        c.height = img.height;
        const g = c.getContext("2d");
        g.drawImage(img, 0, 0);
        const mean = (x0, y0, x1, y1) => {
          const d = g.getImageData(x0, y0, x1 - x0, y1 - y0).data;
          let s = 0;
          for (let i = 0; i < d.length; i += 4)
            s += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
          return s / (d.length / 4);
        };
        const cells = [];
        for (let r = 0; r < GRID; r++)
          for (let col = 0; col < GRID; col++) {
            const cx = box.left + (col + 0.5) * cellW;
            const cy = box.top + (r + 0.5) * cellH;
            cells.push(
              mean(
                Math.round(cx - cellW / 4),
                Math.round(cy - cellH / 4),
                Math.round(cx + cellW / 4),
                Math.round(cy + cellH / 4),
              ),
            );
          }
        const paper = mean(
          Math.round(box.left - 60),
          Math.round(box.top),
          Math.round(box.left - 20),
          Math.round(box.bottom),
        );
        return { cells, paper };
      },
      { src: `data:image/png;base64,${b64}`, box, cellW, cellH, GRID },
    );
    const ink = lum.cells[BAR_COLUMN];
    const cells = [];
    const barRows = [];
    for (let r = 0; r < GRID; r++)
      for (let col = 0; col < GRID; col++) {
        const o = r2(
          (lum.paper - lum.cells[r * GRID + col]) / (lum.paper - ink),
        );
        if (col === BAR_COLUMN) {
          if (o >= 0.9) barRows.push(r);
          continue;
        }
        if (o >= EMPTY_BELOW) cells.push([col, r, Math.min(o, 1)]);
      }
    const w = wordmarks[name];
    out[name] = {
      x: r1(box.left - w.originX),
      y: r1(box.top - w.originY),
      cellWidth: r1(cellW),
      cellHeight: r1(cellH),
      barColumn: BAR_COLUMN,
      barRows: barRows.length,
      cells,
    };
  }
} finally {
  await browser.close();
}

// One block per line, as the repository's formatter writes short arrays.
const json = JSON.stringify(out, null, 2).replace(
  /\[\s+([\d.]+),\s+([\d.]+),\s+([\d.]+)\s+\]/g,
  "[$1, $2, $3]",
);
writeFileSync(join(here, "mark-geometry.json"), `${json}\n`);
console.log(JSON.stringify(out));
