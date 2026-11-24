import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// potrace (2.1.8, GPL-2.0) is not a repository dependency: run `npm install potrace@2.1.8` in a folder
// outside the repo and set TRACE_MODULES to its node_modules. It also installs jimp.
const here = dirname(fileURLToPath(import.meta.url));
const modulesDir = process.env.TRACE_MODULES;
if (!modulesDir)
  throw new Error(
    "set TRACE_MODULES to the folder that has potrace and jimp installed",
  );
const req = createRequire(join(modulesDir, "x.js"));
const jimpModule = req("jimp");
const Jimp = jimpModule.default || jimpModule;
const { Potrace } = req("potrace");

const SOURCES = {
  horizontal: {
    file: "logo-horizontal.png",
    crop: [380, 250, 1870, 520],
  },
  stacked: {
    file: "logo-stacked.png",
    crop: [450, 340, 1160, 940],
  },
};

const UPSCALE = 4;
const BLUR = 1;
const OPT = 2;

const RUN_TOL = 0.6;
const MIN_RUN = 30;
const BLEND = 40;
const TRIM = 12;
const SHORT_RUN = 16;
const SHORT_TOL = 0.3;
const CORNER_GAP_MAX = 9;
const AXIS_ANGLE = 0.05;
const CLUSTER_GAP = 1.2;
const STEP = 0.5;

const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

function bezierPoint(s, t) {
  const [p0, c1, c2, p3] = [s.p0, s.c1, s.c2, s.p3];
  const u = 1 - t;
  return [
    u * u * u * p0[0] +
      3 * u * u * t * c1[0] +
      3 * u * t * t * c2[0] +
      t * t * t * p3[0],
    u * u * u * p0[1] +
      3 * u * u * t * c1[1] +
      3 * u * t * t * c2[1] +
      t * t * t * p3[1],
  ];
}

function parseSubpaths(d, dx, dy, scale) {
  const tokens = d.match(/[MCLZ]|-?\d+(?:\.\d+)?/g);
  const subpaths = [];
  let cur = null;
  let cmd = "";
  let i = 0;
  let count = 0;
  const num = () => Number(tokens[i++]) / scale + (count++ % 2 === 0 ? dx : dy);
  const pt = () => [num(), num()];
  while (i < tokens.length) {
    const t = tokens[i];
    if (/[MCLZ]/.test(t)) {
      cmd = t;
      i++;
      if (cmd === "M") {
        cur = { start: pt(), segs: [] };
        subpaths.push(cur);
      }
      continue;
    }
    const p0 = cur.segs.length ? cur.segs.at(-1).p3 : cur.start;
    if (cmd === "C") cur.segs.push({ p0, c1: pt(), c2: pt(), p3: pt() });
    else if (cmd === "L") cur.segs.push({ p0, p3: pt() });
  }
  for (const sp of subpaths) {
    const last = sp.segs.at(-1);
    if (dist(last.p3, sp.start) > 1e-6)
      sp.segs.push({ p0: last.p3, p3: sp.start });
    sp.segs[sp.segs.length - 1].p3 = sp.start;
  }
  return subpaths;
}

function flatten(segs) {
  const pts = [];
  segs.forEach((s, si) => {
    let len = dist(s.p0, s.p3);
    if (s.c1) len = dist(s.p0, s.c1) + dist(s.c1, s.c2) + dist(s.c2, s.p3);
    const n = Math.max(1, Math.ceil(len / STEP));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      pts.push({ p: s.c1 ? bezierPoint(s, t) : lerp(s.p0, s.p3, t), si, t });
    }
  });
  const last = segs.at(-1);
  pts.push({ p: last.p3, si: segs.length - 1, t: 1 });
  return pts;
}

function maxDev(pts, i, j) {
  const a = pts[i].p;
  const b = pts[j].p;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  let m = 0;
  for (let k = i + 1; k < j; k++) {
    m = Math.max(
      m,
      Math.abs((pts[k].p[0] - a[0]) * dy - (pts[k].p[1] - a[1]) * dx) / len,
    );
  }
  return m;
}

function findRuns(pts) {
  const runs = [];
  let i = 0;
  while (i < pts.length - 1) {
    let j = i + 1;
    let best = -1;
    while (j < pts.length) {
      const dev = maxDev(pts, i, j);
      if (dev > RUN_TOL) break;
      const len = dist(pts[i].p, pts[j].p);
      if (len >= MIN_RUN || (len >= SHORT_RUN && dev <= SHORT_TOL)) best = j;
      j++;
    }
    if (best > 0) {
      runs.push({ i, j: best });
      i = best;
    } else {
      i++;
    }
  }
  return runs;
}

function fitLine(pts, i, j) {
  let mx = 0;
  let my = 0;
  const n = j - i + 1;
  for (let k = i; k <= j; k++) {
    mx += pts[k].p[0] / n;
    my += pts[k].p[1] / n;
  }
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let k = i; k <= j; k++) {
    const x = pts[k].p[0] - mx;
    const y = pts[k].p[1] - my;
    sxx += x * x;
    sxy += x * y;
    syy += y * y;
  }
  const ang = 0.5 * Math.atan2(2 * sxy, sxx - syy);
  let dir = [Math.cos(ang), Math.sin(ang)];
  const chord = [pts[j].p[0] - pts[i].p[0], pts[j].p[1] - pts[i].p[1]];
  if (dir[0] * chord[0] + dir[1] * chord[1] < 0) dir = [-dir[0], -dir[1]];
  return { o: [mx, my], dir };
}

function snapLine(line) {
  const [dx, dy] = line.dir;
  if (Math.abs(dx) < AXIS_ANGLE) {
    line.dir = [0, dy > 0 ? 1 : -1];
    line.axis = "v";
  } else if (Math.abs(dy) < AXIS_ANGLE) {
    line.dir = [dx > 0 ? 1 : -1, 0];
    line.axis = "h";
  }
}

function clusterHorizontals(runs) {
  const hs = runs
    .filter((r) => r.line.axis === "h")
    .sort((a, b) => a.line.o[1] - b.line.o[1]);
  let group = [];
  const flush = () => {
    if (!group.length) return;
    const y = group.reduce((acc, r) => acc + r.line.o[1], 0) / group.length;
    for (const r of group) r.line.o = [r.line.o[0], y];
    group = [];
  };
  for (const r of hs) {
    if (group.length && r.line.o[1] - group.at(-1).line.o[1] > CLUSTER_GAP)
      flush();
    group.push(r);
  }
  flush();
}

function project(p, line) {
  const t = (p[0] - line.o[0]) * line.dir[0] + (p[1] - line.o[1]) * line.dir[1];
  return [line.o[0] + line.dir[0] * t, line.o[1] + line.dir[1] * t];
}

function intersect(l1, l2) {
  const cross = l1.dir[0] * l2.dir[1] - l1.dir[1] * l2.dir[0];
  if (Math.abs(cross) < 0.2) return null;
  const t =
    ((l2.o[0] - l1.o[0]) * l2.dir[1] - (l2.o[1] - l1.o[1]) * l2.dir[0]) / cross;
  return [l1.o[0] + l1.dir[0] * t, l1.o[1] + l1.dir[1] * t];
}

const FIT_ERROR = 0.35;
const ARM = 6;
const CORNER_ANGLE = 0.8;

const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const unit = (a) => {
  const l = Math.hypot(a[0], a[1]) || 1;
  return [a[0] / l, a[1] / l];
};

function bez(c, t) {
  const u = 1 - t;
  return add(
    add(mul(c[0], u * u * u), mul(c[1], 3 * u * u * t)),
    add(mul(c[2], 3 * u * t * t), mul(c[3], t * t * t)),
  );
}

function bezD1(c, t) {
  const u = 1 - t;
  return add(
    add(mul(sub(c[1], c[0]), 3 * u * u), mul(sub(c[2], c[1]), 6 * u * t)),
    mul(sub(c[3], c[2]), 3 * t * t),
  );
}

function bezD2(c, t) {
  const u = 1 - t;
  return add(
    mul(add(sub(c[2], mul(c[1], 2)), c[0]), 6 * u),
    mul(add(sub(c[3], mul(c[2], 2)), c[1]), 6 * t),
  );
}

function chordParams(pts) {
  const u = [0];
  for (let i = 1; i < pts.length; i++)
    u.push(u[i - 1] + dist(pts[i], pts[i - 1]));
  return u.map((v) => v / u.at(-1));
}

function generateBezier(pts, u, t1, t2) {
  const p0 = pts[0];
  const p3 = pts.at(-1);
  let c00 = 0;
  let c01 = 0;
  let c11 = 0;
  let x0 = 0;
  let x1 = 0;
  for (let i = 0; i < pts.length; i++) {
    const t = u[i];
    const m = 1 - t;
    const b0 = m * m * m;
    const b1 = 3 * m * m * t;
    const b2 = 3 * m * t * t;
    const b3 = t * t * t;
    const a0 = mul(t1, b1);
    const a1 = mul(t2, b2);
    c00 += dot(a0, a0);
    c01 += dot(a0, a1);
    c11 += dot(a1, a1);
    const tmp = sub(pts[i], add(mul(p0, b0 + b1), mul(p3, b2 + b3)));
    x0 += dot(a0, tmp);
    x1 += dot(a1, tmp);
  }
  const det = c00 * c11 - c01 * c01;
  const al = det === 0 ? 0 : (x0 * c11 - x1 * c01) / det;
  const ar = det === 0 ? 0 : (c00 * x1 - c01 * x0) / det;
  const seg = dist(p0, p3);
  if (al < 1e-6 * seg || ar < 1e-6 * seg) {
    return [p0, add(p0, mul(t1, seg / 3)), add(p3, mul(t2, seg / 3)), p3];
  }
  return [p0, add(p0, mul(t1, al)), add(p3, mul(t2, ar)), p3];
}

function maxError(pts, c, u) {
  let worst = 0;
  let at = Math.floor(pts.length / 2);
  for (let i = 1; i < pts.length - 1; i++) {
    const d = sub(bez(c, u[i]), pts[i]);
    const e = dot(d, d);
    if (e > worst) {
      worst = e;
      at = i;
    }
  }
  return { err: Math.sqrt(worst), at };
}

function reparam(c, pts, u) {
  return u.map((t, i) => {
    const d = sub(bez(c, t), pts[i]);
    const d1 = bezD1(c, t);
    const d2 = bezD2(c, t);
    const num = dot(d, d1);
    const den = dot(d1, d1) + dot(d, d2);
    return den === 0 ? t : Math.min(1, Math.max(0, t - num / den));
  });
}

function fitCubic(pts, t1, t2, error) {
  if (pts.length === 2) {
    const seg = dist(pts[0], pts[1]) / 3;
    return [
      [pts[0], add(pts[0], mul(t1, seg)), add(pts[1], mul(t2, seg)), pts[1]],
    ];
  }
  let u = chordParams(pts);
  let c = generateBezier(pts, u, t1, t2);
  let { err, at } = maxError(pts, c, u);
  if (err < error) return [c];
  if (err < error * 4) {
    for (let k = 0; k < 20; k++) {
      u = reparam(c, pts, u);
      c = generateBezier(pts, u, t1, t2);
      ({ err, at } = maxError(pts, c, u));
      if (err < error) return [c];
    }
  }
  const center = unit(sub(pts[at - 1], pts[at + 1]));
  return [
    ...fitCubic(pts.slice(0, at + 1), t1, center, error),
    ...fitCubic(pts.slice(at), mul(center, -1), t2, error),
  ];
}

function tangentFwd(poly, k) {
  return unit(sub(poly[Math.min(poly.length - 1, k + ARM)], poly[k]));
}

function tangentBack(poly, k) {
  return unit(sub(poly[Math.max(0, k - ARM)], poly[k]));
}

function cornersOf(poly) {
  const scores = [];
  for (let k = 1; k < poly.length - 1; k++) {
    const a = sub(poly[k], poly[Math.max(0, k - ARM)]);
    const b = sub(poly[Math.min(poly.length - 1, k + ARM)], poly[k]);
    const la = Math.hypot(a[0], a[1]);
    const lb = Math.hypot(b[0], b[1]);
    if (la < 2 || lb < 2) {
      scores.push(0);
      continue;
    }
    scores.push(Math.acos(Math.min(1, Math.max(-1, dot(a, b) / (la * lb)))));
  }
  const found = [];
  for (let k = 1; k < poly.length - 1; k++) {
    const sc = scores[k - 1];
    if (sc < CORNER_ANGLE) continue;
    let isMax = true;
    for (
      let q = Math.max(1, k - ARM);
      q <= Math.min(poly.length - 2, k + ARM);
      q++
    ) {
      if (scores[q - 1] > sc || (scores[q - 1] === sc && q < k)) isMax = false;
    }
    if (isMax) found.push(k);
  }
  return found;
}

function fitPolyline(poly, leftT, rightT, f) {
  const cuts = [0, ...cornersOf(poly), poly.length - 1];
  let d = "";
  for (let c = 0; c < cuts.length - 1; c++) {
    const piece = poly.slice(cuts[c], cuts[c + 1] + 1);
    if (piece.length < 2) continue;
    const first = c === 0;
    const last = c === cuts.length - 2;
    const t1 = first && leftT ? leftT : tangentFwd(piece, 0);
    const t2 = last && rightT ? rightT : tangentBack(piece, piece.length - 1);
    if (
      piece.length === 2 ||
      maxDev(
        piece.map((p) => ({ p })),
        0,
        piece.length - 1,
      ) < 0.15
    ) {
      d += `L${f(piece.at(-1))}`;
      continue;
    }
    for (const b of fitCubic(piece, t1, t2, FIT_ERROR))
      d += `C${f(b[1])} ${f(b[2])} ${f(b[3])}`;
  }
  return d;
}

function signedArea(poly) {
  let a = 0;
  for (let i = 0; i < poly.length - 1; i++) {
    a += poly[i][0] * poly[i + 1][1] - poly[i + 1][0] * poly[i][1];
  }
  return a / 2;
}

function inside(point, poly) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (
      yi > point[1] !== yj > point[1] &&
      point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi
    )
      hit = !hit;
  }
  return hit;
}

function reverseSegs(sp) {
  sp.segs = sp.segs
    .map((s) => ({ p0: s.p3, c1: s.c2, c2: s.c1, p3: s.p0 }))
    .reverse();
}

// Potrace winds outlines and holes the same way and relies on fill-rule="evenodd".
// Holes are reversed so the paths also fill correctly under the default nonzero rule.
function orientHoles(sps) {
  const polys = sps.map((sp) => flatten(sp.segs).map((q) => q.p));
  sps.forEach((sp, k) => {
    const depth = polys.filter(
      (other, m) => m !== k && inside(polys[k][0], other),
    ).length;
    const wantPositive = depth % 2 === 0;
    if (signedArea(polys[k]) > 0 !== wantPositive) reverseSegs(sp);
  });
}

function mergeTouching(pts, runs) {
  const out = [];
  for (const r of runs) {
    const prev = out.at(-1);
    if (prev && r.i - prev.j <= 2) {
      const merged = { i: prev.i, j: r.j };
      if (maxDev(pts, merged.i, merged.j) <= RUN_TOL) {
        out[out.length - 1] = merged;
        continue;
      }
    }
    out.push(r);
  }
  return out;
}

function rebuild(sp) {
  let pts = flatten(sp.segs);
  const probe = findRuns(pts);
  if (probe.length) {
    const m = Math.floor((probe[0].i + probe[0].j) / 2);
    pts = [...pts.slice(m, -1), ...pts.slice(0, m + 1)];
    const second = mergeTouching(pts, findRuns(pts));
    const last = second.at(-1);
    if (last && last.j >= pts.length - 2 && second[0].i === 0) {
      pts = [...pts.slice(last.i, -1), ...pts.slice(0, last.i + 1)];
    }
  }
  const runs = mergeTouching(pts, findRuns(pts)).map((r) => ({
    ...r,
    line: fitLine(pts, r.i, r.j),
  }));
  return { sp, pts, runs };
}

function assemble(entry) {
  const { sp, pts, runs } = entry;
  const items = [];
  let cursor = 0;
  for (const r of runs) {
    if (r.i > cursor) items.push({ kind: "gap", i: cursor, j: r.i });
    items.push({ kind: "run", run: r });
    cursor = r.j;
  }
  if (cursor < pts.length - 1)
    items.push({ kind: "gap", i: cursor, j: pts.length - 1 });
  if (!items.some((it) => it.kind === "run")) return { items, pts: null, sp };

  const gapLen = (g) => (g.j - g.i) * STEP;
  const collapsed = [];
  for (let k = 0; k < items.length; k++) {
    const it = items[k];
    const prev = collapsed.at(-1);
    const next = items[k + 1];
    if (
      it.kind === "gap" &&
      prev?.kind === "run" &&
      next?.kind === "run" &&
      gapLen(it) <= CORNER_GAP_MAX
    ) {
      const corner = intersect(prev.run.line, next.run.line);
      if (
        corner &&
        dist(corner, pts[it.i].p) < 8 &&
        dist(corner, pts[it.j].p) < 8
      ) {
        prev.cornerAfter = corner;
        next.cornerBefore = corner;
        continue;
      }
    }
    collapsed.push(it);
  }
  collapsed.forEach((it, k) => {
    if (it.kind !== "gap") return;
    const prev = collapsed[(k + collapsed.length - 1) % collapsed.length];
    const next = collapsed[(k + 1) % collapsed.length];
    if (k > 0 && prev.kind === "run" && !prev.cornerAfter)
      it.i = Math.max(prev.run.i + 1, it.i - TRIM);
    if (k < collapsed.length - 1 && next.kind === "run" && !next.cornerBefore)
      it.j = Math.min(next.run.j - 1, it.j + TRIM);
  });
  return { items: collapsed, pts, sp };
}

function emit(asm, ox, oy) {
  const { items, pts, sp } = asm;
  const f = (p) => `${r1(p[0] - ox)} ${r1(p[1] - oy)}`;
  if (!pts) {
    const poly = flatten(sp.segs).map((q) => q.p);
    const n = poly.length - 1;
    const half = Math.floor(n / 2);
    const tStart = unit(sub(poly[ARM], poly[n - ARM]));
    const tHalf = unit(sub(poly[half + ARM], poly[half - ARM]));
    const first = poly.slice(0, half + 1);
    const second = poly.slice(half);
    let d = `M${f(poly[0])}`;
    for (const b of fitCubic(first, tStart, mul(tHalf, -1), FIT_ERROR))
      d += `C${f(b[1])} ${f(b[2])} ${f(b[3])}`;
    for (const b of fitCubic(second, tHalf, mul(tStart, -1), FIT_ERROR))
      d += `C${f(b[1])} ${f(b[2])} ${f(b[3])}`;
    return `${d}Z`;
  }
  const n = items.length;
  const nodeBefore = new Array(n);
  for (let k = 0; k < n; k++) {
    const it = items[k];
    const prev = items[(k + n - 1) % n];
    if (it.kind === "run") {
      if (it.cornerBefore) nodeBefore[k] = it.cornerBefore;
      else if (prev.kind === "gap")
        nodeBefore[k] = project(pts[prev.j].p, it.run.line);
      else
        nodeBefore[k] =
          intersect(prev.run.line, it.run.line) ||
          project(pts[it.run.i].p, it.run.line);
    } else if (prev.kind === "run") {
      nodeBefore[k] = prev.cornerAfter || project(pts[it.i].p, prev.run.line);
    } else {
      nodeBefore[k] = pts[it.i].p;
    }
  }
  let d = `M${f(nodeBefore[0])}`;
  for (let k = 0; k < n; k++) {
    const it = items[k];
    const end = nodeBefore[(k + 1) % n];
    if (it.kind === "run") {
      if (it.run.line.axis === "v") d += `V${r1(end[1] - oy)}`;
      else if (it.run.line.axis === "h") d += `H${r1(end[0] - ox)}`;
      else d += `L${f(end)}`;
      continue;
    }
    const poly = pts.slice(it.i, it.j + 1).map((q) => q.p);
    const d0 = sub(nodeBefore[k], poly[0]);
    const d1 = sub(end, poly.at(-1));
    const span = Math.min(BLEND, Math.floor(poly.length / 2));
    for (let q = 0; q < span; q++) {
      const w = 1 - q / span;
      poly[q] = add(poly[q], mul(d0, w));
      poly[poly.length - 1 - q] = add(poly[poly.length - 1 - q], mul(d1, w));
    }
    const prev = items[(k + n - 1) % n];
    const next = items[(k + 1) % n];
    const leftT =
      prev.kind === "run" && !prev.cornerAfter ? prev.run.line.dir : null;
    const rightT =
      next.kind === "run" && !next.cornerBefore
        ? mul(next.run.line.dir, -1)
        : null;
    d += fitPolyline(poly, leftT, rightT, f);
  }
  return `${d}Z`;
}

function boundsOf(sps) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const sp of sps) {
    for (const s of sp.segs) {
      for (const q of [s.p0, s.c1, s.c2, s.p3].filter(Boolean)) {
        minX = Math.min(minX, q[0]);
        minY = Math.min(minY, q[1]);
        maxX = Math.max(maxX, q[0]);
        maxY = Math.max(maxY, q[1]);
      }
    }
  }
  return { minX, minY, maxX, maxY };
}

const r1 = (n) => String(Math.round(n * 10) / 10);

const out = {};
for (const [name, cfg] of Object.entries(SOURCES)) {
  const [x0, y0, x1, y1] = cfg.crop;
  const img = await Jimp.read(join(here, "..", "source", cfg.file));
  img
    .crop(x0, y0, x1 - x0, y1 - y0)
    .greyscale()
    .resize((x1 - x0) * UPSCALE, (y1 - y0) * UPSCALE, Jimp.RESIZE_HERMITE);
  if (BLUR > 0) img.gaussian(BLUR);
  const buf = await img.getBufferAsync(Jimp.MIME_PNG);
  const potrace = new Potrace({
    threshold: 128,
    turdSize: 10 * UPSCALE * UPSCALE,
    alphaMax: 1,
    optCurve: true,
    optTolerance: OPT,
    blackOnWhite: true,
  });
  await new Promise((resolve) => potrace.loadImage(buf, resolve));
  const raw = /d="([^"]+)"/.exec(potrace.getSVG())[1];
  const sps = parseSubpaths(raw, x0, y0, UPSCALE);
  orientHoles(sps);
  const entries = sps.map(rebuild);
  const allRuns = entries.flatMap((en) => en.runs);
  for (const r of allRuns) snapLine(r.line);
  clusterHorizontals(allRuns);
  const asms = entries.map(assemble);
  const { minX, minY, maxX, maxY } = boundsOf(sps);
  const ox = Math.floor(minX);
  const oy = Math.floor(minY);
  const d = asms.map((a) => emit(a, ox, oy)).join("");
  out[name] = {
    d,
    width: Math.ceil(maxX) - ox,
    height: Math.ceil(maxY) - oy,
    originX: ox,
    originY: oy,
  };
  console.log(
    name,
    "bytes",
    d.length,
    "runs",
    allRuns.length,
    "box",
    out[name].width,
    out[name].height,
  );
}
writeFileSync(
  join(here, "wordmark-paths.json"),
  `${JSON.stringify(out, null, 2)}\n`,
);
