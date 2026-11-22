import { readFileSync } from "node:fs";

export function loadFont(path) {
  const buf = readFileSync(path);
  const numTables = buf.readUInt16BE(4);
  const tables = {};
  for (let i = 0; i < numTables; i++) {
    const o = 12 + i * 16;
    tables[buf.toString("ascii", o, o + 4)] = {
      offset: buf.readUInt32BE(o + 8),
      length: buf.readUInt32BE(o + 12),
    };
  }
  const head = tables.head.offset;
  const unitsPerEm = buf.readUInt16BE(head + 18);
  const longLoca = buf.readInt16BE(head + 50) === 1;
  const numHMetrics = buf.readUInt16BE(tables.hhea.offset + 34);
  const os2 = tables["OS/2"].offset;
  const capHeight = buf.readInt16BE(os2 + 88);

  const cmapOffset = tables.cmap.offset;
  const subtables = buf.readUInt16BE(cmapOffset + 2);
  let format4 = -1;
  for (let i = 0; i < subtables; i++) {
    const platform = buf.readUInt16BE(cmapOffset + 4 + i * 8);
    const sub = cmapOffset + buf.readUInt32BE(cmapOffset + 8 + i * 8);
    if (buf.readUInt16BE(sub) === 4 && (platform === 3 || platform === 0)) {
      format4 = sub;
    }
  }
  if (format4 < 0) throw new Error("no format 4 cmap");

  function glyphIndex(codePoint) {
    const segX2 = buf.readUInt16BE(format4 + 6);
    const ends = format4 + 14;
    const starts = ends + segX2 + 2;
    const deltas = starts + segX2;
    const rangeOffsets = deltas + segX2;
    for (let s = 0; s < segX2 / 2; s++) {
      const end = buf.readUInt16BE(ends + s * 2);
      if (codePoint > end) continue;
      const start = buf.readUInt16BE(starts + s * 2);
      if (codePoint < start) return 0;
      const delta = buf.readInt16BE(deltas + s * 2);
      const ro = buf.readUInt16BE(rangeOffsets + s * 2);
      if (ro === 0) return (codePoint + delta) & 0xffff;
      const g = buf.readUInt16BE(
        rangeOffsets + s * 2 + ro + (codePoint - start) * 2,
      );
      return g === 0 ? 0 : (g + delta) & 0xffff;
    }
    return 0;
  }

  function advance(g) {
    const i = Math.min(g, numHMetrics - 1);
    return buf.readUInt16BE(tables.hmtx.offset + i * 4);
  }

  function glyphRange(g) {
    const loca = tables.loca.offset;
    const read = (i) =>
      longLoca
        ? buf.readUInt32BE(loca + i * 4)
        : buf.readUInt16BE(loca + i * 2) * 2;
    return [read(g), read(g + 1)];
  }

  function contours(g) {
    const [from, to] = glyphRange(g);
    if (from === to) return [];
    const base = tables.glyf.offset + from;
    const n = buf.readInt16BE(base);
    if (n < 0) throw new Error(`glyph ${g} is composite`);
    let p = base + 10;
    const ends = [];
    for (let i = 0; i < n; i++, p += 2) ends.push(buf.readUInt16BE(p));
    const count = ends.length ? ends[ends.length - 1] + 1 : 0;
    const insLen = buf.readUInt16BE(p);
    p += 2 + insLen;
    const flags = [];
    while (flags.length < count) {
      const f = buf.readUInt8(p++);
      flags.push(f);
      if (f & 8) {
        let r = buf.readUInt8(p++);
        while (r-- > 0) flags.push(f);
      }
    }
    const axis = (shortBit, sameBit) => {
      const out = [];
      let v = 0;
      for (const f of flags) {
        if (f & shortBit) {
          const d = buf.readUInt8(p++);
          v += f & sameBit ? d : -d;
        } else if (!(f & sameBit)) {
          v += buf.readInt16BE(p);
          p += 2;
        }
        out.push(v);
      }
      return out;
    };
    const xs = axis(2, 16);
    const ys = axis(4, 32);
    const result = [];
    let start = 0;
    for (const end of ends) {
      const pts = [];
      for (let i = start; i <= end; i++) {
        pts.push({ x: xs[i], y: ys[i], on: (flags[i] & 1) === 1 });
      }
      result.push(pts);
      start = end + 1;
    }
    return result;
  }

  return { unitsPerEm, capHeight, glyphIndex, advance, contours };
}

export function contourToPath(pts, tx, ty, scale, fmt) {
  const X = (x) => fmt(tx + x * scale);
  const Y = (y) => fmt(ty - y * scale);
  const n = pts.length;
  const startIdx = pts.findIndex((q) => q.on);
  let first;
  let seq;
  if (startIdx >= 0) {
    first = pts[startIdx];
    seq = [...pts.slice(startIdx + 1), ...pts.slice(0, startIdx)];
  } else {
    const a = pts[0];
    const b = pts[n - 1];
    first = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, on: true };
    seq = pts.slice();
  }
  let d = `M${X(first.x)} ${Y(first.y)}`;
  let ctrl = null;
  for (const q of seq) {
    if (q.on) {
      d += ctrl
        ? `Q${X(ctrl.x)} ${Y(ctrl.y)} ${X(q.x)} ${Y(q.y)}`
        : `L${X(q.x)} ${Y(q.y)}`;
      ctrl = null;
    } else {
      if (ctrl) {
        const mx = (ctrl.x + q.x) / 2;
        const my = (ctrl.y + q.y) / 2;
        d += `Q${X(ctrl.x)} ${Y(ctrl.y)} ${X(mx)} ${Y(my)}`;
      }
      ctrl = q;
    }
  }
  d += ctrl ? `Q${X(ctrl.x)} ${Y(ctrl.y)} ${X(first.x)} ${Y(first.y)}Z` : "Z";
  return d;
}
