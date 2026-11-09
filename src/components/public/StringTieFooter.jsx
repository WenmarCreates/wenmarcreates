import * as React from "react";

/**
 * String Tie Footer — a closing "thank you" footer built like a string-and-button
 * envelope: a paper flap with deep rounded corners over a dark body, two
 * paper buttons with metal grommets on the seam, and a cord wound round
 * them in a figure eight.
 */

// #region string
/** A small deterministic hash → [0, 1), so every render lays the cord down the same way. */
export const hash = (n) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const round = (v) => Math.round(v * 100) / 100;

export const clamp01 = (v) => (v > 0 ? (v < 1 ? v : 1) : 0);

export const polyLength = (pts) => {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  return l;
};

/** Resamples a polyline into `n` equal-length segments (n + 1 points), first and last kept exactly. */
export const resample = (pts, n) => {
  const segs = Math.max(1, Math.floor(n) || 1);
  if (!pts.length) return [];
  if (pts.length === 1) return Array.from({ length: segs + 1 }, () => ({ ...pts[0] }));
  const total = polyLength(pts);
  const out = [{ ...pts[0] }];
  let j = 1;
  let acc = 0;
  for (let i = 1; i < segs; i++) {
    const want = (total * i) / segs;
    while (j < pts.length - 1 && acc + Math.hypot(pts[j].x - pts[j - 1].x, pts[j].y - pts[j - 1].y) < want) {
      acc += Math.hypot(pts[j].x - pts[j - 1].x, pts[j].y - pts[j - 1].y);
      j++;
    }
    const a = pts[j - 1];
    const b = pts[j];
    const l = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const t = Math.min(1, Math.max(0, (want - acc) / l));
    out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
  }
  out.push({ ...pts[pts.length - 1] });
  return out;
};

/**
 * The tied cord: anchored in the bottom grommet, once round it, up across the
 * seam, round the top grommet, down across (the strands cross at the middle),
 * round the bottom again, up once more, and half round the top, where the end
 * tucks off to the upper right. `rho` is how far out from each grommet centre
 * the cord wraps.
 */
export const tiePath = (top, bottom, rho, tail, step = 4) => {
  const dx = bottom.x - top.x;
  const dy = bottom.y - top.y;
  const D = Math.hypot(dx, dy) || 1;
  const u = { x: dx / D, y: dy / D };
  const v = { x: u.y, y: -u.x };
  const r = Math.max(1, Math.min(rho, D * 0.42));
  const at = (c, rad, th) => ({
    x: c.x + rad * (Math.cos(th) * u.x + Math.sin(th) * v.x),
    y: c.y + rad * (Math.cos(th) * u.y + Math.sin(th) * v.y),
  });
  const pts = [{ ...bottom }];
  const arc = (c, rad, a0, a1) => {
    const n = Math.max(2, Math.ceil((Math.abs(a1 - a0) * rad) / step));
    for (let i = 1; i <= n; i++) pts.push(at(c, rad, a0 + ((a1 - a0) * i) / n));
  };
  const line = (b) => {
    const a = pts[pts.length - 1];
    const n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / step));
    for (let i = 1; i <= n; i++) pts.push({ x: a.x + ((b.x - a.x) * i) / n, y: a.y + ((b.y - a.y) * i) / n });
  };
  const tan = (rad) => Math.acos(Math.min(1, rad / (D / 2)));
  const PI = Math.PI;
  const r1 = r;
  const r2 = r * 1.16;
  const a1 = tan(r1);
  const a2 = tan(r2);
  // the anchor stitch, then under the bottom grommet
  line(at(bottom, r1, -PI / 2));
  arc(bottom, r1, -PI / 2, PI - a1);
  // up across the middle, then over the top grommet
  line(at(top, r1, -a1));
  arc(top, r1, -a1, a1 - 2 * PI);
  // down across the middle (the strands cross here), under the bottom again
  line(at(bottom, r2, -PI + a2));
  arc(bottom, r2, -PI + a2, PI - a2);
  // up once more, and half over the top
  line(at(top, r2, -a2));
  arc(top, r2, -a2, -1.25 * PI);
  // the free end tucks off to the upper right
  const end = pts[pts.length - 1];
  const out = at(top, r2 + tail * 0.5, -1.32 * PI);
  const tip = { x: out.x + (v.x * 0.85 - u.x * 0.35) * tail * 0.6, y: out.y + (v.y * 0.85 - u.y * 0.35) * tail * 0.6 };
  const n = Math.max(2, Math.ceil(tail / step));
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    const m = 1 - t;
    pts.push({
      x: m * m * end.x + 2 * m * t * out.x + t * t * tip.x,
      y: m * m * end.y + 2 * m * t * out.y + t * t * tip.y,
    });
  }
  return pts;
};

/**
 * Where the cord lies once it's untied: a loose, loopy string dropped on the
 * table from the anchor, `length` long, drifting along `angle`.
 */
export const restPath = (anchor, length, size, box, angle = 1.05, seed = 1, step = 3) => {
  const pts = [{ ...anchor }];
  const L = Math.max(0, length);
  const b = size * 0.75; // loop radius
  const a = size * 0.26; // advance per radian
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const clampIn = (p) => ({
    x: Math.min(box.right, Math.max(box.left, p.x)),
    y: Math.min(box.bottom, Math.max(box.top, p.y)),
  });
  let t = 0;
  let len = 0;
  let prev = { ...anchor };
  let guard = 0;
  while (len < L && guard++ < 20000) {
    t += step / Math.max(1, Math.hypot(a, b));
    const wob = 1 + (hash(Math.floor(t / 6.283) * 3.1 + seed) - 0.5) * 0.5;
    const bend = Math.sin(t * 0.18 + seed) * 0.28;
    const lx = a * t - b * wob * Math.sin(t);
    const ly = b * wob * (1 - Math.cos(t)) * 0.8;
    const cb = Math.cos(bend);
    const sb = Math.sin(bend);
    const rx = lx * cb - ly * sb;
    const ry = lx * sb + ly * cb;
    const p = clampIn({ x: anchor.x + rx * c - ry * s, y: anchor.y + rx * s + ry * c });
    const d = Math.hypot(p.x - prev.x, p.y - prev.y);
    if (d < 0.01) continue;
    if (len + d > L) {
      const k = (L - len) / d;
      pts.push({ x: prev.x + (p.x - prev.x) * k, y: prev.y + (p.y - prev.y) * k });
      len = L;
      break;
    }
    pts.push(p);
    len += d;
    prev = p;
  }
  while (len < L - 0.01 && guard++ < 40000) {
    const p = clampIn({ x: prev.x - Math.min(step, L - len), y: prev.y });
    const d = Math.hypot(p.x - prev.x, p.y - prev.y);
    if (d < 0.01) break;
    pts.push(p);
    len += d;
    prev = p;
  }
  return pts;
};

/** A smooth SVG path through the points (quadratic midpoints). */
export const smoothPath = (xs, ys) => {
  const n = Math.min(xs.length, ys.length);
  if (n < 2) return "";
  let d = "M" + round(xs[0]) + " " + round(ys[0]);
  for (let i = 1; i < n - 1; i++) {
    d +=
      "Q" +
      round(xs[i]) +
      " " +
      round(ys[i]) +
      " " +
      round((xs[i] + xs[i + 1]) / 2) +
      " " +
      round((ys[i] + ys[i + 1]) / 2);
  }
  return d + "L" + round(xs[n - 1]) + " " + round(ys[n - 1]);
};

export const scrollProgress = (top, height, viewport) => {
  if (!(viewport > 0) || !Number.isFinite(top)) return 1;
  const span = Math.max(1, Math.min(Number.isFinite(height) && height > 0 ? height : viewport, viewport) * 0.7);
  return clamp01((viewport - top) / span);
};

export const stepWind = (wind, target, dt, rate) => {
  const want = (target - wind) * (1 - Math.exp(-Math.max(0, dt) * 5));
  const cap = Math.max(0, rate) * Math.max(0, dt);
  const next = wind + Math.max(-cap, Math.min(cap, want));
  return Math.abs(target - next) < 0.0005 ? target : clamp01(next);
};

export const makeRope = (pts) => {
  const n = pts.length;
  const x = new Float64Array(n);
  const y = new Float64Array(n);
  pts.forEach((p, i) => {
    x[i] = p.x;
    y[i] = p.y;
  });
  return { x, y, px: Float64Array.from(x), py: Float64Array.from(y), seg: n > 1 ? polyLength(pts) / (n - 1) : 0 };
};

export const stepRope = (r, tied, rest, locked, attract, drag = null, iterations = 12) => {
  const n = r.x.length;
  const lockN = Math.max(1, Math.min(n, Math.floor(locked)));
  const pinned = (i) => i < lockN || (drag !== null && drag.i === i);
  for (let i = 0; i < n; i++) {
    if (drag && drag.i === i) {
      r.px[i] = r.x[i];
      r.py[i] = r.y[i];
      r.x[i] = drag.x;
      r.y[i] = drag.y;
    } else if (i < lockN) {
      const t = tied[i];
      r.px[i] = r.x[i];
      r.py[i] = r.y[i];
      if (t) {
        const k = i === 0 ? 1 : 0.24;
        r.x[i] += (t.x - r.x[i]) * k;
        r.y[i] += (t.y - r.y[i]) * k;
      }
    } else {
      const vx = (r.x[i] - r.px[i]) * 0.9;
      const vy = (r.y[i] - r.py[i]) * 0.9;
      r.px[i] = r.x[i];
      r.py[i] = r.y[i];
      r.x[i] += vx;
      r.y[i] += vy;
      const q = rest[i];
      if (q && attract > 0) {
        r.x[i] += (q.x - r.x[i]) * attract;
        r.y[i] += (q.y - r.y[i]) * attract;
      }
    }
  }
  const seg = r.seg;
  for (let k = 0; k < iterations; k++) {
    for (let i = 0; i < n - 1; i++) {
      const a = pinned(i);
      const b = pinned(i + 1);
      if (a && b) continue;
      const dx = r.x[i + 1] - r.x[i];
      const dy = r.y[i + 1] - r.y[i];
      const d = Math.hypot(dx, dy) || 1e-6;
      const diff = (d - seg) / d;
      if (a) {
        r.x[i + 1] -= dx * diff;
        r.y[i + 1] -= dy * diff;
      } else if (b) {
        r.x[i] += dx * diff;
        r.y[i] += dy * diff;
      } else {
        r.x[i] += dx * diff * 0.5;
        r.y[i] += dy * diff * 0.5;
        r.x[i + 1] -= dx * diff * 0.5;
        r.y[i + 1] -= dy * diff * 0.5;
      }
    }
  }
};

export const nearestFree = (r, x, y, locked, reach) => {
  let best = -1;
  let bd = reach * reach;
  for (let i = Math.max(1, Math.floor(locked)); i < r.x.length; i++) {
    const d = (r.x[i] - x) ** 2 + (r.y[i] - y) ** 2;
    if (d < bd) {
      bd = d;
      best = i;
    }
  }
  return best;
};
// #endregion

const DEFAULT_META = [];
const DEFAULT_TAPES = ["Looking Forward to", "Building with You!"];
const DEFAULT_LINKS = [
  { label: "linkedin.com/in/wenmarcreates", href: "https://linkedin.com" },
  { label: "instagram.com/wenmarcreates", href: "https://instagram.com" },
  { label: "youtube.com/@wenmarcreates", href: "https://youtube.com" },
];
const DEFAULT_NOTE = {
  kicker: "A note, tucked inside",
  text: "Got a web app, AI workflow, or GoHighLevel system to build? My inbox is open — I reply within 24 hours.",
  cta: "Write to me",
};

const DEFAULT_SIGNATURE = [
  "M2354 2446 l-28 -23 32 -17 c18 -9 32 -14 32 -11 0 3 10 0 23 -7 12 -7 26 -11 30 -10 5 1 6 -2 2 -8 -3 -5 -1 -10 6 -10 8 0 10 -19 7 -68 -5 -71 -55 -194 -98 -239 -11 -12 -20 -25 -20 -29 0 -11 -81 -116 -114 -148 -17 -16 -24 -26 -16 -21 8 4 -1 -10 -21 -31 -20 -21 -42 -47 -50 -57 -8 -10 -26 -31 -41 -46 -16 -16 -28 -30 -28 -33 0 -3 -67 -73 -149 -156 -82 -83 -146 -153 -143 -156 3 -4 0 -6 -6 -6 -10 0 -36 -20 -93 -72 -10 -10 -19 -15 -19 -10 -1 4 -9 -2 -18 -13 -24 -27 -80 -58 -92 -50 -15 9 -11 94 5 140 8 22 15 51 15 65 0 20 2 22 10 10 8 -12 10 -9 11 13 1 15 2 30 4 35 2 8 62 140 74 162 39 73 79 141 103 174 15 21 28 45 28 51 0 7 7 15 14 18 36 14 27 117 -10 117 -9 0 -12 5 -8 13 5 8 2 8 -9 -2 -9 -7 -17 -10 -17 -5 0 5 -7 -1 -15 -13 -9 -12 -21 -20 -28 -17 -6 2 -25 -12 -41 -31 -16 -19 -34 -35 -39 -35 -5 0 -16 -8 -24 -17 -9 -11 -12 -12 -7 -3 4 9 3 12 -2 7 -5 -5 -9 -12 -9 -16 0 -4 -8 -15 -17 -25 -10 -10 -18 -14 -18 -10 0 4 -8 -2 -17 -12 -10 -11 -35 -32 -56 -47 -20 -16 -35 -32 -33 -36 3 -4 -7 -15 -23 -24 -15 -8 -33 -27 -41 -41 -7 -14 -17 -26 -22 -26 -5 0 -27 -18 -49 -40 -22 -22 -44 -38 -50 -35 -5 4 -9 1 -9 -5 0 -7 7 -9 17 -6 11 5 9 -1 -7 -17 -14 -13 -29 -21 -34 -19 -5 3 -6 0 -2 -6 8 -13 -43 -54 -57 -45 -6 3 -7 1 -3 -5 4 -7 -4 -24 -18 -39 -14 -15 -22 -31 -19 -36 3 -6 2 -8 -3 -5 -10 7 -36 -17 -27 -25 3 -3 -5 -3 -18 0 -13 4 -18 8 -11 11 6 2 12 10 12 18 0 9 4 13 9 10 5 -3 12 5 15 19 4 14 11 25 16 25 6 0 10 5 10 11 0 16 51 75 62 71 5 -1 7 1 4 6 -3 5 12 33 34 62 22 30 40 57 40 60 0 4 11 19 25 34 13 14 39 47 57 72 18 26 45 64 61 86 15 21 27 42 27 46 0 4 14 24 31 45 17 21 29 41 25 44 -3 3 -1 12 4 18 6 7 13 33 16 58 9 63 -19 108 -82 132 -40 15 -55 16 -127 5 -45 -6 -95 -18 -112 -25 -16 -8 -51 -19 -78 -26 -26 -6 -50 -15 -53 -20 -3 -5 -12 -9 -21 -9 -19 0 -137 -52 -141 -62 -2 -5 -7 -6 -12 -3 -8 5 -179 -91 -265 -149 -22 -14 -48 -32 -58 -39 -11 -6 -28 -20 -39 -29 -11 -10 -25 -15 -29 -12 -8 5 -13 -9 -10 -28 0 -4 -7 -9 -17 -12 -16 -5 -34 -25 -97 -103 -26 -32 -52 -129 -32 -116 6 4 8 0 4 -10 -3 -9 4 -25 18 -40 43 -43 137 -30 119 17 -3 9 -15 16 -25 16 -46 0 -31 63 29 128 21 22 65 60 99 84 35 25 59 49 55 54 -4 4 2 2 12 -6 13 -10 17 -10 12 -2 -4 7 -2 12 4 12 6 0 8 5 4 12 -4 6 -3 8 3 5 6 -4 21 1 34 11 13 9 41 26 61 36 21 11 38 23 38 28 0 4 8 8 18 8 9 0 34 11 55 25 20 14 37 23 37 20 0 -3 36 13 80 35 44 22 86 40 94 40 8 0 16 4 18 8 3 8 178 57 238 68 14 2 32 0 40 -5 12 -9 12 -15 -5 -48 -10 -21 -18 -41 -17 -44 1 -4 -8 -15 -18 -24 -11 -10 -20 -24 -20 -31 0 -7 -8 -18 -17 -23 -10 -6 -14 -11 -9 -11 4 0 -2 -9 -15 -21 -13 -11 -17 -17 -9 -14 8 4 2 -4 -15 -19 -16 -14 -26 -25 -21 -26 4 0 -8 -19 -28 -42 -47 -55 -46 -53 -101 -134 -26 -38 -55 -74 -64 -82 -9 -7 -10 -10 -2 -6 8 4 -5 -18 -27 -48 -23 -31 -38 -58 -35 -62 4 -3 2 -6 -4 -6 -14 0 -78 -109 -130 -220 -46 -98 -70 -189 -52 -201 8 -5 8 -8 -1 -11 -20 -6 29 -58 55 -58 23 0 97 69 150 140 15 19 32 33 38 32 7 -2 9 -1 5 3 -3 4 1 16 10 27 55 68 75 87 85 81 5 -3 7 -2 4 4 -4 5 2 19 13 30 10 12 16 24 13 27 -4 3 1 6 11 6 9 0 14 5 11 10 -3 6 -1 10 5 10 6 0 9 4 5 9 -3 5 1 11 8 13 8 2 64 58 126 126 62 67 117 122 123 122 6 0 9 2 6 5 -7 7 50 65 63 65 6 0 4 -7 -5 -15 -8 -9 -12 -23 -9 -32 4 -11 3 -14 -5 -9 -11 6 -17 -5 -13 -26 0 -5 -4 -8 -10 -8 -6 0 -8 -7 -5 -17 4 -10 4 -14 0 -10 -10 9 -49 -94 -74 -191 -39 -156 6 -290 96 -286 16 0 41 2 56 2 14 1 40 14 57 28 17 14 31 22 31 17 0 -4 5 0 11 9 5 10 15 18 21 18 6 0 17 8 25 18 9 10 12 11 7 2 -4 -9 -3 -12 2 -7 5 5 9 13 9 18 0 5 2 8 5 7 4 -3 44 31 114 97 11 11 25 19 31 17 5 -2 7 -1 4 3 -4 3 27 41 68 83 41 42 95 99 119 126 25 27 47 47 49 44 3 -3 -7 -17 -21 -31 -15 -15 -23 -27 -19 -27 4 0 2 -7 -5 -15 -7 -8 -17 -12 -22 -9 -5 3 -8 0 -7 -7 1 -8 -2 -25 -8 -39 -12 -28 -12 -79 0 -97 5 -7 5 -13 1 -13 -4 0 6 -11 22 -25 30 -26 97 -35 109 -15 3 6 15 10 26 10 10 0 19 4 19 10 0 5 6 9 13 7 6 -1 11 4 9 11 -1 8 2 11 7 8 5 -4 16 1 24 9 9 8 20 15 25 15 5 0 15 7 22 15 15 18 31 20 25 3 -7 -19 7 -34 37 -42 28 -6 28 -7 110 81 9 10 24 24 33 31 8 7 13 18 9 23 -3 5 -2 8 3 7 4 -1 18 3 30 10 21 12 22 11 19 -23 -4 -35 13 -65 35 -65 6 0 8 -3 5 -8 -2 -4 15 -7 39 -7 33 0 52 7 82 32 22 17 40 26 40 20 0 -28 26 -117 34 -117 5 0 8 -4 6 -9 -1 -5 10 -19 25 -32 l27 -24 -48 -3 c-47 -3 -405 -47 -446 -55 -33 -7 -107 -18 -150 -23 -22 -3 -51 -6 -65 -8 -14 -2 -47 -7 -75 -10 -27 -4 -95 -16 -150 -28 -55 -11 -109 -22 -120 -23 -54 -8 -158 -29 -230 -46 -44 -11 -89 -21 -100 -23 -42 -6 -91 -18 -110 -25 -11 -5 -49 -15 -85 -24 -98 -22 -204 -51 -210 -57 -3 -3 -14 -6 -25 -8 -38 -5 -146 -41 -162 -54 -7 -5 -17 -7 -23 -3 -5 3 -10 1 -10 -6 0 -7 -3 -10 -6 -7 -11 12 -226 -87 -302 -138 -59 -40 -76 -62 -62 -79 19 -22 44 -18 75 13 16 15 25 22 22 15 -8 -13 54 15 64 30 3 5 9 8 13 8 25 -4 36 0 30 11 -4 6 -3 8 3 5 6 -4 35 4 64 17 29 14 56 23 61 20 4 -3 8 -1 8 4 0 5 12 10 26 10 15 0 29 4 33 10 3 5 20 12 36 15 45 7 119 28 130 37 6 4 17 7 25 7 8 1 35 6 60 12 25 6 56 14 70 17 13 3 63 14 110 25 47 12 96 23 110 25 14 3 32 7 40 10 8 3 60 14 115 24 55 10 111 22 125 25 14 4 35 7 48 6 15 -1 21 3 16 11 -4 6 -3 9 2 6 5 -3 32 -2 59 4 28 5 61 11 75 13 14 2 66 11 115 20 50 8 108 18 130 21 22 3 60 10 85 15 25 5 64 11 87 14 24 2 47 6 52 10 6 3 38 8 72 11 33 3 84 10 113 15 28 5 65 11 81 13 114 14 144 18 174 26 19 5 38 7 42 4 4 -2 10 0 13 4 3 5 20 9 38 10 19 1 72 11 118 22 47 12 95 23 108 25 13 2 29 8 36 14 7 6 16 8 19 5 7 -7 149 56 159 71 4 5 8 7 8 3 0 -10 108 38 144 64 16 12 36 21 43 21 7 0 11 3 8 6 -6 6 76 46 88 43 5 -1 6 1 4 6 -9 13 49 41 64 31 10 -6 10 -9 2 -9 -7 0 -20 -14 -28 -31 -9 -17 -27 -43 -40 -57 -13 -15 -25 -31 -26 -37 -2 -5 -7 -14 -11 -20 -5 -5 -17 -20 -27 -33 -11 -13 -22 -23 -25 -23 -3 1 -7 0 -8 0 -2 -1 -14 -3 -28 -4 -61 -7 -172 -27 -255 -45 -49 -11 -103 -23 -120 -26 -16 -3 -43 -12 -60 -19 -16 -7 -64 -23 -105 -35 -41 -12 -88 -30 -105 -39 -16 -9 -41 -20 -55 -26 -52 -21 -129 -68 -124 -76 3 -5 -4 -9 -16 -9 -12 0 -19 -4 -16 -8 3 -5 -6 -15 -19 -22 -13 -7 -22 -17 -19 -22 3 -4 -2 -8 -10 -8 -9 0 -16 -7 -16 -15 0 -8 -4 -15 -9 -15 -18 0 -42 -53 -46 -99 -3 -39 1 -52 20 -73 13 -14 22 -28 20 -30 -3 -2 14 -15 38 -28 59 -32 187 -37 289 -9 40 10 81 24 90 29 10 6 23 10 30 10 7 0 29 10 48 22 19 12 40 22 45 23 6 0 34 14 64 30 80 44 89 50 109 68 10 10 21 14 25 11 3 -3 13 6 22 20 10 14 21 23 26 20 5 -3 13 5 18 18 6 13 10 19 10 15 1 -4 8 -2 18 5 31 24 208 201 193 193 -8 -5 2 7 23 27 37 34 41 35 140 42 56 4 122 9 147 12 52 5 144 11 320 19 183 9 812 9 839 0 15 -4 21 -3 17 3 -4 6 7 7 32 2 20 -5 75 -11 122 -14 92 -5 171 -18 262 -43 46 -12 61 -13 73 -3 11 9 12 17 4 31 -5 11 -14 17 -20 14 -5 -4 -9 -2 -9 2 0 14 -72 42 -112 45 -20 2 -34 6 -32 10 6 9 -139 31 -286 44 -30 2 -140 7 -245 10 -104 4 -191 8 -193 9 -5 4 50 37 67 40 9 2 18 4 21 5 3 1 9 2 13 1 5 -1 6 3 2 9 -3 5 1 11 9 11 19 2 25 3 51 14 110 43 149 56 174 61 18 4 28 11 24 17 -4 6 0 8 10 4 9 -3 19 -2 22 4 4 5 10 7 15 4 5 -3 21 0 37 7 15 6 31 11 35 10 4 -1 20 3 35 9 15 7 46 14 68 16 22 2 44 8 50 13 9 7 244 7 286 -1 9 -1 16 -8 16 -15 0 -7 -3 -11 -6 -9 -4 2 -11 -7 -17 -19 -11 -24 1 -53 21 -50 36 5 74 18 70 24 -2 4 5 17 16 29 35 37 12 76 -68 117 -44 22 -55 23 -173 19 -164 -7 -218 -14 -320 -41 -30 -8 -62 -17 -70 -19 -8 -2 -17 -4 -20 -5 -3 -1 -9 -3 -15 -4 -5 -1 -17 -5 -25 -8 -8 -3 -35 -12 -60 -19 -25 -7 -69 -23 -98 -36 -63 -27 -99 -31 -67 -7 11 8 30 24 43 34 12 11 26 20 31 20 18 0 101 88 101 107 0 36 -40 59 -100 57 -30 -1 -68 -5 -85 -8 -16 -3 -51 -10 -76 -14 -48 -9 -82 -28 -87 -51 -4 -19 26 -61 43 -61 8 0 15 -7 15 -16 0 -12 5 -11 19 7 16 19 19 20 17 6 -1 -9 -8 -23 -15 -30 -10 -9 -15 -8 -26 6 -11 16 -14 16 -28 2 -9 -8 -19 -15 -24 -15 -7 0 -38 -26 -108 -88 -11 -9 -32 -28 -47 -41 l-27 -24 4 22 c8 44 18 66 41 94 13 16 22 32 19 37 -3 4 2 23 10 41 8 19 14 30 15 25 0 -11 60 64 60 75 0 5 7 9 17 9 9 0 14 3 11 6 -3 3 4 15 16 27 11 12 35 39 51 61 17 21 39 48 50 61 40 45 70 89 67 97 -1 4 4 7 10 6 7 -2 12 3 10 10 -1 6 4 12 12 12 8 0 17 7 20 16 4 10 2 13 -7 7 -6 -4 5 13 26 37 24 28 37 54 37 72 0 28 -30 68 -51 68 -17 0 -52 -21 -78 -46 -13 -13 -28 -21 -34 -17 -6 3 -7 1 -3 -5 4 -6 -11 -29 -34 -52 -22 -22 -38 -40 -35 -40 3 0 -4 -9 -15 -20 -11 -11 -20 -25 -20 -31 0 -5 -4 -8 -8 -5 -4 2 -19 -12 -32 -32 -14 -20 -39 -55 -57 -76 -18 -22 -33 -45 -33 -52 0 -6 -7 -14 -15 -18 -8 -3 -14 -9 -13 -13 2 -8 -30 -62 -42 -73 -9 -7 -23 -43 -22 -52 1 -5 -2 -8 -7 -8 -5 0 -17 -20 -27 -45 -12 -31 -22 -44 -31 -41 -8 3 -12 2 -9 -3 3 -5 -10 -21 -29 -35 -19 -15 -35 -24 -35 -20 0 3 -9 -4 -21 -17 l-21 -24 20 30 c11 17 20 33 21 38 1 4 1 8 2 10 0 1 2 24 5 52 3 38 0 56 -15 76 -14 19 -17 29 -9 37 8 8 7 16 -3 28 -12 16 -12 17 1 10 13 -6 -1 7 -45 42 -6 5 -32 16 -58 25 -38 13 -78 15 -185 13 -75 -2 -141 -5 -147 -6 -5 -1 -26 -1 -45 0 l-35 2 30 8 c42 10 86 36 78 44 -4 4 0 4 10 0 9 -3 17 -2 17 2 0 5 18 18 40 28 22 11 40 23 40 28 0 4 4 8 10 8 10 0 45 27 86 68 13 13 24 20 24 17 0 -8 25 16 31 29 2 5 15 22 29 37 37 39 52 59 45 59 -3 0 1 10 8 23 26 42 9 105 -35 132 -55 33 -90 43 -146 44 -68 1 -192 -19 -192 -31 0 -5 -4 -6 -10 -3 -5 3 -22 -1 -37 -8 -15 -8 -45 -17 -65 -21 -21 -4 -38 -11 -38 -17 0 -6 -4 -8 -9 -5 -5 3 -40 -9 -77 -26 -38 -17 -72 -31 -76 -30 -5 1 -8 -3 -8 -8 0 -6 -8 -10 -19 -10 -10 0 -24 -7 -31 -15 -7 -9 -15 -13 -18 -10 -3 3 -12 -4 -19 -15 -8 -11 -19 -17 -25 -14 -6 4 -13 3 -17 -2 -3 -5 -24 -18 -45 -29 -22 -11 -55 -32 -74 -47 -19 -16 -40 -28 -47 -28 -7 0 -24 -14 -39 -32 -14 -17 -26 -29 -26 -25 0 4 -16 -8 -35 -27 -19 -20 -35 -33 -35 -31 0 3 -9 -3 -19 -12 -11 -9 -17 -21 -14 -26 3 -6 1 -7 -4 -4 -6 4 -24 -8 -39 -27 -16 -18 -46 -54 -67 -79 -22 -25 -45 -58 -54 -73 -8 -16 -21 -37 -30 -46 -8 -9 -12 -22 -8 -27 3 -6 1 -11 -4 -11 -6 0 -11 -6 -11 -14 0 -8 -7 -16 -15 -20 -8 -3 -15 -10 -15 -16 0 -14 -37 -50 -44 -42 -3 3 -6 1 -6 -5 0 -6 -12 -18 -26 -28 -17 -11 -24 -12 -18 -4 5 8 10 22 11 32 2 10 10 31 18 47 19 37 19 54 0 90 -15 30 -55 42 -55 18 0 -6 -3 -9 -6 -5 -3 3 -11 1 -18 -4 -42 -36 -60 -49 -63 -49 -2 0 -14 12 -26 26 -20 23 -25 24 -49 14 -14 -7 -41 -32 -58 -56 -18 -25 -36 -41 -42 -38 -7 5 -9 1 -5 -9 3 -10 3 -17 -2 -17 -4 0 -20 -11 -35 -25 -36 -33 -33 -16 4 26 37 41 34 71 -10 110 -23 19 -38 24 -65 21 -19 -2 -35 -8 -35 -13 0 -5 -9 -9 -20 -9 -11 0 -20 -6 -20 -12 0 -7 -8 -4 -16 7 -11 14 -15 15 -14 5 4 -29 0 -40 -16 -40 -8 0 -13 -4 -10 -9 3 -5 0 -11 -7 -14 -25 -9 -14 25 18 59 18 19 31 34 29 34 -1 0 10 13 24 29 15 16 42 45 60 65 19 20 31 36 28 36 -4 0 7 14 24 30 17 17 27 30 23 30 -4 0 -3 4 2 8 18 13 140 188 143 205 6 33 15 57 22 57 13 0 33 118 27 161 -6 45 -38 96 -57 91 -6 -1 -9 2 -5 8 9 14 -56 40 -99 40 -22 0 -45 -9 -62 -24z m121 -20 c86 -36 99 -152 32 -286 -77 -153 -262 -383 -537 -664 -252 -257 -380 -350 -452 -330 -97 28 -100 185 -9 406 36 86 120 236 163 291 56 71 12 36 -139 -109 -161 -153 -307 -313 -512 -557 -128 -151 -152 -169 -172 -123 -34 73 93 327 315 630 264 361 280 385 287 436 20 138 -549 -71 -872 -321 -154 -119 -209 -249 -106 -249 23 0 28 -3 20 -11 -17 -17 -70 -1 -93 29 -35 44 -4 111 96 209 210 204 783 456 941 414 60 -16 77 -40 71 -101 -7 -66 -55 -145 -262 -427 -164 -223 -229 -323 -305 -465 -47 -89 -53 -116 -13 -66 256 319 797 858 863 858 34 0 28 -31 -22 -112 -83 -133 -186 -337 -220 -438 -36 -107 -46 -233 -20 -249 38 -24 156 63 346 254 410 411 647 750 621 889 -10 53 -50 86 -105 86 -33 0 -42 3 -31 10 22 14 76 12 115 -4z m1662 -90 c91 -46 80 -113 -35 -226 -85 -83 -169 -142 -280 -196 -76 -37 -127 -43 -56 -6 56 28 186 126 263 198 155 143 160 209 16 207 -222 -3 -652 -212 -888 -433 -138 -129 -212 -239 -243 -361 -20 -76 -11 -131 26 -173 27 -29 32 -31 97 -30 107 1 261 63 518 208 117 66 400 249 409 265 7 10 -237 -22 -373 -50 -161 -32 -310 -78 -340 -105 -2 -2 2 -11 10 -20 13 -16 12 -16 -9 -5 -58 31 -34 63 76 105 191 72 452 119 672 120 148 1 158 0 205 -25 50 -25 67 -52 45 -73 -8 -8 -10 -7 -5 7 10 24 -40 43 -130 51 l-70 6 -44 -71 c-25 -40 -100 -151 -167 -247 -68 -97 -122 -178 -120 -180 2 -2 104 5 227 15 284 22 1064 25 1259 5 148 -16 298 -46 359 -73 60 -26 47 -33 -15 -9 -145 54 -598 80 -1111 62 -186 -6 -432 -19 -548 -28 l-210 -16 -34 -42 c-19 -22 -75 -81 -126 -131 -303 -298 -732 -457 -884 -329 -63 53 -45 130 50 218 33 31 88 71 123 91 142 79 386 153 659 198 l138 23 67 91 c171 232 201 273 197 273 -2 0 -42 -24 -87 -53 -188 -120 -432 -247 -558 -291 -102 -35 -325 -78 -625 -121 -526 -75 -1166 -199 -1504 -291 -228 -62 -453 -148 -532 -205 -16 -11 -33 -19 -36 -16 -9 10 109 80 218 129 403 180 1239 360 2064 444 94 10 174 21 180 26 5 4 -1 8 -14 8 -35 0 -87 36 -113 78 -19 30 -23 51 -23 113 l0 77 -45 -37 c-97 -80 -128 -89 -156 -46 -15 22 -15 32 -5 68 7 23 21 57 32 75 35 61 -4 33 -128 -93 -68 -69 -127 -125 -132 -125 -20 0 -18 30 5 79 19 42 20 49 6 39 -9 -7 -51 -38 -92 -69 -131 -98 -190 -119 -230 -79 -41 41 -16 121 64 203 90 93 181 130 220 91 23 -22 20 -39 -11 -74 -36 -38 -140 -100 -170 -100 -15 0 -30 -11 -43 -32 -25 -41 -23 -74 5 -70 76 12 276 152 335 235 26 36 48 57 61 57 30 0 23 -25 -31 -105 -28 -41 -48 -75 -46 -75 3 0 28 25 57 55 101 107 188 159 202 122 3 -8 -8 -42 -23 -78 -61 -138 -51 -147 63 -64 66 48 79 63 107 122 135 289 592 602 1020 698 81 18 194 14 237 -9z m-29 -60 c17 -11 15 -23 -10 -47 -13 -12 -17 -18 -9 -14 9 5 7 -1 -4 -19 -10 -14 -23 -26 -30 -26 -8 0 -17 -9 -20 -21 -4 -11 -9 -18 -11 -16 -3 3 -20 -11 -39 -30 -24 -25 -40 -33 -52 -29 -10 4 -14 4 -10 0 9 -9 -22 -44 -40 -44 -7 0 -13 -4 -13 -10 0 -5 -21 -24 -47 -41 -27 -18 -49 -36 -51 -41 -2 -4 -9 -8 -15 -8 -18 0 -47 -32 -47 -52 0 -10 5 -18 10 -18 6 0 10 -4 10 -9 0 -6 -21 -12 -47 -16 -78 -10 -237 -46 -251 -58 -7 -5 -15 -7 -18 -4 -4 3 -24 -3 -45 -13 -21 -11 -44 -20 -51 -20 -7 0 -30 -9 -51 -20 -20 -11 -43 -20 -50 -20 -14 0 -16 -4 -20 -55 -1 -22 4 -32 20 -40 13 -7 20 -16 15 -21 -4 -4 1 -2 11 5 9 7 17 10 17 6 0 -4 11 4 25 19 14 15 30 24 35 21 6 -3 10 -1 10 6 0 7 3 10 6 6 3 -3 30 3 59 13 29 10 56 16 59 13 3 -4 6 -2 6 3 0 5 8 10 18 11 9 0 55 8 102 17 47 9 127 23 178 31 51 8 97 17 102 20 6 3 10 4 10 2 0 -2 -24 -19 -52 -37 -29 -19 -59 -40 -66 -47 -7 -7 -20 -13 -28 -13 -8 0 -14 -3 -14 -7 0 -5 -12 -17 -27 -27 -14 -11 -23 -14 -19 -8 5 8 2 10 -8 6 -9 -3 -16 -10 -16 -15 0 -5 -7 -9 -15 -9 -9 0 -26 -9 -38 -20 -12 -12 -46 -33 -77 -47 -30 -15 -71 -37 -90 -49 -19 -11 -38 -22 -43 -22 -4 -1 -33 -15 -65 -30 -80 -41 -192 -82 -236 -87 -21 -3 -42 -7 -46 -10 -5 -3 -11 -1 -15 4 -3 6 -11 8 -18 6 -50 -19 -81 113 -47 200 6 17 11 31 10 33 -1 2 9 20 21 40 13 20 22 40 21 43 0 4 10 17 23 29 14 13 25 28 25 35 0 6 14 23 31 38 17 15 29 27 26 27 -4 0 4 11 17 25 13 14 28 25 34 25 5 0 22 16 38 35 15 19 31 35 36 35 5 0 27 17 49 37 22 20 52 43 67 50 15 7 40 24 56 38 16 14 35 25 43 25 7 0 13 3 13 8 0 4 9 13 21 20 14 9 19 9 14 2 -4 -6 10 0 31 14 22 14 46 29 54 32 95 38 169 72 166 75 -3 2 6 5 19 5 13 1 38 9 56 18 18 9 40 16 49 16 9 0 20 3 23 7 4 3 24 8 45 10 20 2 40 7 44 11 9 9 111 7 126 -2z m788 -91 c15 -39 -24 -96 -244 -360 -133 -159 -175 -224 -205 -320 -23 -74 -26 -94 -17 -100 9 -6 147 100 212 163 21 20 41 33 45 29 6 -7 -94 -105 -187 -182 -59 -50 -79 -53 -108 -20 -21 24 -23 34 -17 74 4 25 11 54 16 64 11 19 -5 25 -17 6 -14 -24 -128 -99 -149 -99 -49 0 -65 43 -39 105 5 12 -14 0 -47 -29 -79 -71 -123 -98 -155 -94 -36 4 -48 26 -40 73 10 54 113 155 198 195 77 37 92 37 124 5 22 -22 24 -28 13 -41 -11 -14 -14 -13 -21 5 -4 12 -11 21 -15 21 -18 0 -91 -45 -141 -87 -52 -44 -119 -130 -109 -139 10 -10 64 25 156 100 51 42 99 76 106 76 28 0 26 -23 -4 -80 -53 -100 -38 -105 76 -24 68 49 83 65 109 118 81 168 321 483 409 537 36 23 44 23 51 4z m-691 -433 c14 -10 15 -12 3 -8 -9 3 -36 -6 -60 -19 -24 -13 -58 -32 -75 -41 -18 -9 -33 -20 -33 -25 0 -5 -5 -9 -11 -9 -13 0 -39 -25 -39 -37 0 -5 -14 -19 -30 -32 -17 -12 -28 -27 -24 -33 5 -7 2 -8 -6 -3 -10 6 -12 4 -7 -8 3 -9 3 -18 -1 -21 -17 -10 -12 -68 8 -97 18 -25 28 -29 66 -29 25 0 43 4 40 9 -3 5 12 16 33 25 22 8 46 24 54 35 14 21 14 21 27 -4 7 -13 17 -22 22 -19 4 3 8 1 8 -3 0 -5 9 -14 20 -21 17 -10 25 -10 45 4 13 8 26 15 29 15 17 -2 35 13 29 23 -3 6 -3 8 2 4 4 -4 14 -3 22 3 10 9 13 4 13 -25 0 -22 4 -35 10 -31 6 3 10 -4 10 -17 0 -22 -4 -24 -67 -24 -85 0 -311 -13 -423 -24 -109 -10 -119 -5 -77 40 13 14 32 39 42 55 11 17 36 53 57 81 21 28 38 56 38 62 0 15 35 33 46 24 5 -4 2 1 -5 11 -9 11 -10 17 -2 17 6 0 11 5 11 11 0 6 6 16 13 24 6 7 24 32 38 56 l26 44 64 0 c35 0 73 -6 84 -13z m743 -14 c7 -7 12 -18 12 -24 0 -7 -46 -48 -102 -92 -57 -44 -125 -103 -153 -131 l-50 -52 95 42 c328 142 717 220 871 176 95 -28 122 -80 58 -112 -43 -23 -57 -18 -25 8 63 51 -1 87 -155 87 -182 0 -415 -63 -733 -199 -91 -39 -172 -71 -180 -71 -8 0 -18 10 -21 21 -6 18 8 37 76 106 46 46 119 112 162 145 42 34 77 62 77 64 0 2 -152 -34 -170 -41 -9 -3 -24 1 -35 9 -31 23 -8 37 92 57 106 21 165 23 181 7z m-2221 -34 c-3 -3 -12 -4 -19 -1 -8 3 -5 6 6 6 11 1 17 -2 13 -5z m2043 -58 c0 -3 -4 -8 -10 -11 -5 -3 -10 -1 -10 4 0 6 5 11 10 11 6 0 10 -2 10 -4z m-600 -40 c0 -2 -7 -7 -16 -10 -8 -3 -12 -2 -9 4 6 10 25 14 25 6z m-41 -39 c-2 -1 -15 -11 -29 -22 l-25 -20 19 23 c11 12 24 22 29 22 6 0 8 -1 6 -3z m-1779 -41 c0 -2 -8 -10 -17 -17 -16 -13 -17 -12 -4 4 13 16 21 21 21 13z m-59 -50 c-14 -15 -29 -22 -39 -19 -10 4 -13 2 -8 -5 5 -8 2 -10 -9 -6 -10 4 -15 2 -13 -7 2 -8 -4 -13 -14 -11 -9 1 -19 -2 -23 -8 -3 -5 -11 -10 -17 -10 -6 0 -5 6 2 16 15 18 76 45 93 41 7 -1 11 4 9 11 -1 8 2 11 7 8 5 -4 12 -2 16 4 3 5 9 10 12 10 4 0 -4 -11 -16 -24z m2244 -96 c-3 -5 -10 -10 -16 -10 -5 0 -9 5 -9 10 0 6 7 10 16 10 8 0 12 -4 9 -10z m-3441 -8 c-6 -4 -15 -15 -21 -26 -9 -16 -11 -17 -16 -2 -4 10 -3 15 2 12 5 -3 11 1 15 9 3 8 11 15 18 15 9 0 9 -3 2 -8z",
  "M3895 1690 c-3 -5 -1 -10 4 -10 6 0 11 5 11 10 0 6 -2 10 -4 10 -3 0 -8 -4 -11 -10z",
  "M2315 1621 c-43 -26 -131 -108 -124 -115 9 -9 128 72 146 101 21 31 14 36 -22 14z",
  "M3540 1244 c-8 -2 -78 -14 -155 -28 -197 -35 -370 -88 -501 -151 -217 -105 -317 -245 -214 -298 28 -15 50 -17 115 -13 187 11 433 148 658 366 67 65 120 120 117 122 -3 2 -12 3 -20 2z m-60 -49 c0 -8 -110 -115 -118 -115 -4 0 -32 -22 -62 -50 -30 -27 -75 -62 -100 -76 -25 -15 -55 -35 -66 -46 -12 -11 -28 -21 -35 -22 -8 -1 -39 -15 -69 -31 -30 -16 -58 -29 -62 -30 -3 0 -10 -3 -14 -7 -4 -5 -19 -8 -34 -8 -14 0 -31 -5 -36 -10 -6 -6 -49 -14 -96 -18 -79 -7 -88 -6 -113 14 -18 14 -23 24 -16 29 9 5 9 10 0 21 -9 11 -8 15 4 20 9 3 19 14 22 24 6 18 143 116 198 141 15 7 27 16 27 20 0 4 7 10 16 13 8 3 12 2 9 -4 -3 -5 23 4 57 19 35 16 92 36 128 45 36 10 81 22 100 27 19 6 44 11 55 13 11 2 20 4 20 6 0 1 11 3 25 5 56 8 94 15 97 18 5 5 63 6 63 2z",
  "M4737 1978 c-137 -177 -157 -206 -140 -195 12 8 240 296 266 336 44 71 0 21 -126 -141z",
  "M4545 1771 c-3 -5 -2 -12 3 -15 5 -3 9 1 9 9 0 17 -3 19 -12 6z",
  "M1730 1999 c0 -5 5 -7 10 -4 6 3 10 8 10 11 0 2 -4 4 -10 4 -5 0 -10 -5 -10 -11z",
];

const GRAIN =
  'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'220\' height=\'220\'>' +
  "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/>" +
  "<feColorMatrix values='0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .9 0'/></filter>" +
  "<rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

const EASE = "cubic-bezier(.22,1,.36,1)";

const CSS =
  ".stt{position:relative;isolation:isolate;overflow:hidden;overflow:clip;container-type:inline-size;width:100%;box-sizing:border-box;background:var(--stt-ink);color:var(--stt-ink);font-family:var(--stt-sans);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}" +
  ":where(.stt) *,:where(.stt) *::before,:where(.stt) *::after{box-sizing:border-box}" +
  ":where(.stt) button{appearance:none;background:none;border:0;padding:0;margin:0;font:inherit;color:inherit;cursor:pointer}" +
  ":where(.stt) a{color:inherit;text-decoration:none}" +
  ":where(.stt) h2,:where(.stt) p{margin:0}" +
  ".stt :focus-visible{outline:2px solid var(--stt-accent);outline-offset:4px;border-radius:4px}" +
  ".stt-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}" +
  ".stt-frame{--r:clamp(44px,7cqw,92px);--fold:0px;--R:clamp(36px,10cqw,150px);position:relative;display:flex;flex-direction:column;min-height:var(--stt-h)}" +
  ".stt.is-open .stt-frame{--fold:calc(var(--r) * 2.46)}" +
  // the flap
  ".stt-flapwrap{position:relative;z-index:3;pointer-events:none;filter:drop-shadow(0 calc(var(--r) * .12) calc(var(--r) * .2) rgba(0,0,0,.28))}" +
  ".stt-flap{position:relative;pointer-events:auto;background:var(--stt-paper);color:var(--stt-ink);clip-path:inset(0 0 var(--fold) 0 round 0 0 var(--R) var(--R));transition:clip-path .85s " +
  EASE +
  ";padding:clamp(26px,4.4cqw,64px) clamp(16px,6cqw,110px) 0}" +
  ".stt-flap::before{content:'';position:absolute;inset:0;pointer-events:none;background-image:" +
  GRAIN +
  ";background-size:220px;opacity:calc(var(--stt-grain) * .9);mix-blend-mode:soft-light}" +
  ".stt-crease{position:absolute;left:0;right:0;bottom:var(--fold);height:calc(var(--r) * .5);pointer-events:none;background:linear-gradient(to top,rgba(0,0,0,.09),transparent);opacity:0;transition:opacity .5s,bottom .85s " +
  EASE +
  "}" +
  ".stt.is-open .stt-crease{opacity:1}" +
  ".stt-meta{position:relative;display:flex;justify-content:space-between;gap:12px;font-size:clamp(11px,1.45cqw,19px);letter-spacing:.01em}" +
  ".stt-meta span{opacity:0;transform:translateY(-6px);transition:opacity .8s,transform .8s " +
  EASE +
  "}" +
  ".stt-meta span:nth-child(2){transition-delay:.08s}.stt-meta span:nth-child(3){transition-delay:.16s}" +
  ".stt.is-in .stt-meta span{opacity:1;transform:none}" +
  ".stt-head{position:relative;display:flex;flex-direction:column;align-items:center;margin-top:clamp(36px,7.5cqw,120px)}" +
  ".stt-title{font-family:var(--stt-display);font-weight:400;font-size:clamp(58px,13.4cqw,200px);line-height:.9;letter-spacing:-.045em;white-space:nowrap;text-align:center;clip-path:inset(-.25em -.4em -.02em -.4em)}" +
  ".stt-title em{font-style:italic;letter-spacing:-.06em;margin-left:.06em}" +
  ".stt-ch{display:inline-block;transform:translateY(105%);transition:transform 1.1s " +
  EASE +
  ";transition-delay:calc(.15s + var(--i) * .045s)}" +
  ".stt.is-in .stt-ch{transform:none}" +
  ".stt.is-in .stt-title:hover .stt-ch{transition:transform .5s " +
  EASE +
  "}" +
  ".stt.is-in .stt-title .stt-ch:hover{transform:translateY(-.045em)}" +
  ".stt-tapes{position:relative;display:flex;flex-direction:column;align-items:center;margin-top:clamp(10px,1.6cqw,22px);font-family:var(--stt-display);font-size:clamp(20px,4cqw,56px);line-height:1;letter-spacing:-.03em}" +
  ".stt-tape{position:relative;display:inline-block;padding:.12em .42em .16em;white-space:nowrap;clip-path:inset(-20% 100% -20% 0);transition:clip-path .75s " +
  EASE +
  ",transform .5s " +
  EASE +
  "}" +
  ".stt-tape::before{content:'';position:absolute;inset:0;z-index:-1;background:var(--tb);clip-path:polygon(0 4%,1.2% 0,98.6% 3%,100% 0,99.2% 30%,100% 58%,98.8% 100%,1.6% 97%,0 100%,.9% 64%,0 34%);box-shadow:0 0 0 transparent;transition:filter .4s}" +
  ".stt-tape span{position:relative;color:var(--tc)}" +
  ".stt-tape-a{--tb:var(--stt-accent);--tc:#fff;transform:rotate(-1.6deg) translateX(-.2em);transition-delay:.75s,0s}" +
  ".stt-tape-b{--tb:var(--stt-ink);--tc:var(--stt-paper);margin-top:.06em;transform:rotate(.5deg) translateX(.12em);transition-delay:.95s,0s}" +
  ".stt.is-in .stt-tape{clip-path:inset(-20% -2% -20% -2%)}" +
  ".stt-tape:hover{transition-delay:0s,0s}" +
  ".stt-tape-a:hover{transform:rotate(-3deg) translate(-.24em,-.06em)}" +
  ".stt-tape-b:hover{transform:rotate(1.6deg) translate(.16em,-.05em)}" +
  ".stt-tape:hover::before{filter:drop-shadow(0 .12em .1em rgba(0,0,0,.25))}" +
  ".stt-dock{position:relative;height:calc(var(--r) * 2.62);display:flex;justify-content:center;align-items:flex-end;padding-bottom:calc(var(--r) * .22)}" +
  // the buttons
  ".stt-btn{position:relative;display:block;width:calc(var(--r) * 2);height:calc(var(--r) * 2);border-radius:50%;filter:drop-shadow(0 calc(var(--r) * .07) calc(var(--r) * .09) rgba(0,0,0,.32)) drop-shadow(0 1px 1px rgba(0,0,0,.28));transition:transform .45s " +
  EASE +
  ",filter .45s " +
  EASE +
  ";-webkit-tap-highlight-color:transparent}" +
  ".stt-btn:hover{transform:translateY(-3px) scale(1.025);filter:drop-shadow(0 calc(var(--r) * .14) calc(var(--r) * .16) rgba(0,0,0,.3)) drop-shadow(0 1px 1px rgba(0,0,0,.24))}" +
  ".stt-btn:active{transform:translateY(0) scale(.97);transition-duration:.12s}" +
  ".stt-btn:focus-visible{outline-offset:6px;border-radius:50%}" +
  ".stt-spin{display:block;width:100%;height:100%;will-change:transform}" +
  ".stt-btn svg{display:block;width:100%;height:100%;max-width:none;overflow:visible}" +
  ".stt-gloss{position:absolute;inset:0;pointer-events:none}" +
  ".stt-btn-top{transition:transform .45s " +
  EASE +
  ",filter .45s " +
  EASE +
  ",opacity .4s}" +
  ".stt.is-open .stt-btn-top{opacity:0;pointer-events:none}" +
  // the body
  ".stt-body{position:relative;z-index:2;flex:1;display:flex;flex-direction:column;color:var(--stt-body-ink)}" +
  ".stt-panel{position:absolute;inset:0;z-index:2;background:var(--stt-ink)}" +
  ".stt-panel::before{content:'';position:absolute;inset:0;pointer-events:none;background-image:" +
  GRAIN +
  ";background-size:220px;opacity:calc(var(--stt-grain) * .7);mix-blend-mode:soft-light}" +
  ".stt-dock-b{position:relative;z-index:4;height:calc(var(--r) * 2.62);display:flex;justify-content:center;align-items:flex-start;padding-top:calc(var(--r) * .22)}" +
  ".stt-content{position:relative;z-index:3;flex:1;display:grid;grid-template-columns:1fr auto;align-items:end;gap:32px;padding:clamp(28px,5cqw,80px) clamp(16px,8cqw,140px) clamp(36px,6.5cqw,110px)}" +
  ".stt-contacts{display:flex;flex-direction:column;gap:clamp(14px,1.6cqw,22px);font-size:clamp(14px,1.55cqw,20px);opacity:0;transform:translateY(14px);transition:opacity .9s .5s,transform .9s .5s " +
  EASE +
  "}" +
  ".stt.is-in .stt-contacts{opacity:1;transform:none}" +
  ".stt-k{display:block;font-size:.88em;opacity:.62;margin-bottom:.28em;font-weight:300;letter-spacing:.01em}" +
  ".stt-v{position:relative;display:inline-flex;align-items:center;gap:.5em;font-weight:500;letter-spacing:.005em;text-align:left;transition:color .25s}" +
  ".stt-v:hover{color:var(--stt-paper)}" +
  ".stt-copied{font-size:.68em;font-weight:500;padding:.25em .65em;border-radius:99px;background:var(--stt-accent);color:#fff;opacity:0;transform:translateX(-6px) scale(.9);transition:opacity .3s,transform .4s " +
  EASE +
  "}" +
  ".stt-copied.is-on{opacity:1;transform:none}" +
  ".stt-links{display:flex;flex-direction:column;gap:.3em}" +
  ".stt-link{position:relative;display:inline-flex;align-items:center;gap:.35em;width:fit-content;padding-bottom:.06em;background:linear-gradient(currentColor,currentColor) 0 100%/100% 1px no-repeat;transition:background-size .5s " +
  EASE +
  ",color .25s}" +
  ".stt-link:hover{background-size:0 1px;background-position:100% 100%;color:var(--stt-paper)}" +
  ".stt-link svg{width:.7em;height:.7em;flex:none;max-width:none;opacity:0;transform:translate(-4px,4px);transition:opacity .3s,transform .4s " +
  EASE +
  "}" +
  ".stt-link:hover svg{opacity:1;transform:none}" +
  ".stt-regards{display:flex;flex-direction:column;align-items:center;padding-right:clamp(0px,2cqw,40px);opacity:0;transform:translateY(14px);transition:opacity .9s .65s,transform .9s .65s " +
  EASE +
  "}" +
  ".stt.is-in .stt-regards{opacity:1;transform:none}" +
  ".stt-regards-t{font-family:var(--stt-display);font-size:clamp(22px,2.9cqw,40px);letter-spacing:-.035em;line-height:1;margin-right:-.4em}" +
  ".stt-sign{display:block;width:clamp(210px,26cqw,360px);height:auto;max-width:none;margin-top:-.2em;color:var(--stt-body-ink);overflow:visible;clip-path:inset(-15% 100% -15% 0);transition:clip-path 1.55s cubic-bezier(.55,.1,.35,1)}" +
  ".stt.is-signed .stt-sign{clip-path:inset(-15% -10% -15% 0)}" +
  ".stt-sign path{fill:currentColor;fill-opacity:0;stroke:currentColor;stroke-width:14;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:var(--l,28000) var(--l,28000);stroke-dashoffset:var(--l,28000)}" +
  ".stt.is-signed .stt-sign path{transition:stroke-dashoffset var(--d,1.4s) cubic-bezier(.55,.1,.35,1) var(--w,0s),fill-opacity .85s ease .35s;stroke-dashoffset:0;fill-opacity:1}" +
  ".stt-sign-text{display:block;font-family:var(--stt-script);font-size:clamp(40px,5.4cqw,76px);line-height:1.1;padding:0 .2em;clip-path:inset(-20% 100% -20% 0);transition:clip-path 1.6s cubic-bezier(.55,.1,.35,1)}" +
  ".stt.is-signed .stt-sign-text{clip-path:inset(-20% -10% -20% 0)}" +
  // the note
  ".stt-letter{position:absolute;z-index:1;left:50%;bottom:calc(100% - var(--tuck));--tuck:clamp(30px,4cqw,60px);width:min(620px,calc(100% - 32px));height:calc(var(--r) * 2.46 - var(--r) * .14 + var(--tuck));transform:translate(-50%,calc(var(--r) * 1.2));transition:transform .7s " +
  EASE +
  ";background:#f7f3ea;color:var(--stt-ink);border-radius:4px 4px 0 0;box-shadow:0 -1px 0 rgba(0,0,0,.04),0 10px 30px rgba(0,0,0,.25);padding:clamp(12px,1.9cqw,26px) clamp(16px,2.6cqw,36px) var(--tuck);display:flex;flex-direction:column;justify-content:center;gap:clamp(6px,1cqw,12px);overflow:hidden}" +
  ".stt-letter::before{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(transparent 0 calc(1.7em - 1px),rgba(30,60,140,.07) calc(1.7em - 1px) 1.7em);opacity:.9}" +
  ".stt-letter::after{content:'';position:absolute;inset:0;pointer-events:none;background-image:" +
  GRAIN +
  ";background-size:220px;opacity:calc(var(--stt-grain) * .8);mix-blend-mode:soft-light}" +
  ".stt.is-open .stt-letter{transform:translate(-50%,0);transition:transform .9s .3s " +
  EASE +
  "}" +
  ".stt-letter>*{position:relative;z-index:1}" +
  ".stt-letter>.stt-stamp{position:absolute;right:clamp(12px,2cqw,28px);top:clamp(10px,1.6cqw,22px);width:clamp(84px,10cqw,130px);height:auto;max-width:none;overflow:visible;color:var(--stt-accent);opacity:.5;transform:rotate(-9deg);fill:none;stroke:currentColor;stroke-width:1.4}" +
  ".stt-stamp text{fill:currentColor;stroke:none;font-family:var(--stt-sans);font-size:6.5px;font-weight:600;letter-spacing:.04em;text-anchor:middle}" +
  ".stt-note-k{font-size:clamp(10px,1.05cqw,13px);letter-spacing:.14em;text-transform:uppercase;color:var(--stt-accent);font-weight:600}" +
  ".stt-note-t{font-family:var(--stt-display);font-size:clamp(16px,2.1cqw,28px);line-height:1.12;letter-spacing:-.02em;max-width:26em;padding-right:clamp(0px,7cqw,90px)}" +
  ".stt-note-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;font-size:clamp(12px,1.2cqw,15px)}" +
  ".stt-cta{display:inline-flex;align-items:center;gap:.5em;padding:.55em 1.05em;border-radius:99px;background:var(--stt-ink);color:var(--stt-paper);font-weight:500;transition:background .3s,transform .3s " +
  EASE +
  "}" +
  ".stt-cta:hover{background:var(--stt-accent);transform:translateY(-1px)}" +
  ".stt-cta svg{width:.8em;height:.8em;max-width:none;transition:transform .3s " +
  EASE +
  "}" +
  ".stt-cta:hover svg{transform:translate(2px,-2px)}" +
  ".stt-ghost{font-weight:500;opacity:.75;text-decoration:underline;text-underline-offset:3px;transition:opacity .2s}" +
  ".stt-ghost:hover{opacity:1}" +
  // the cord
  ".stt-cord{position:absolute;left:0;top:0;z-index:5;overflow:visible;max-width:none;pointer-events:none}" +
  ".stt-cord path{fill:none;stroke-linecap:round;stroke-linejoin:round}" +
  ".stt-cord .stt-hit{stroke:transparent;stroke-width:22px;pointer-events:none;cursor:grab;touch-action:none}" +
  ".stt-cord.is-loose .stt-hit{pointer-events:stroke}" +
  ".stt-cord.is-drag .stt-hit{cursor:grabbing}" +
  "@container (max-width: 640px){" +
  ".stt-content{grid-template-columns:1fr;align-items:start;gap:40px}" +
  ".stt-regards{align-items:flex-start;padding-right:0}" +
  ".stt-regards-t{margin-right:0}" +
  ".stt-note-t{font-size:15px}" +
  ".stt-meta span:nth-child(2){display:none}" +
  "}" +
  "@media (prefers-reduced-motion: reduce){" +
  ".stt *,.stt *::before{transition-duration:.01s !important;transition-delay:0s !important}" +
  ".stt-ch,.stt-meta span{transform:none}" +
  "}";

/** Stamps each signature stroke's length (and when to start it) for the write-in. */
const useSignatureLengths = (ref, key) =>
  React.useEffect(() => {
    const paths = ref.current ? Array.from(ref.current.querySelectorAll("path")) : [];
    let at = 0;
    paths.forEach((p) => {
      const l = Math.ceil(p.getTotalLength()) + 20;
      const d = Math.min(1.45, Math.max(0.16, l / 14000));
      p.style.setProperty("--l", String(l));
      p.style.setProperty("--d", d.toFixed(2) + "s");
      p.style.setProperty("--w", at.toFixed(2) + "s");
      at += Math.min(0.28, d * 0.45);
    });
  }, [ref, key]);

function ButtonFace({ uid, accent }) {
  return (
    <svg viewBox="-100 -100 200 200" aria-hidden="true" focusable="false">
      <defs>
        <filter id={uid + "p"} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="3" seed="7" result="n" />
          <feDiffuseLighting in="n" surfaceScale="1.4" diffuseConstant="1.05" lightingColor="#fff" result="l">
            <feDistantLight azimuth="235" elevation="56" />
          </feDiffuseLighting>
          <feComposite in="l" in2="SourceGraphic" operator="arithmetic" k1="0.62" k2="0" k3="0.44" k4="0" result="m" />
          <feComposite in="m" in2="SourceAlpha" operator="in" />
        </filter>
        <linearGradient id={uid + "m"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FEFADF" />
          <stop offset=".3" stopColor="#D3A373" />
          <stop offset=".55" stopColor="#573325" />
          <stop offset=".8" stopColor="#EEDCAC" />
          <stop offset="1" stopColor="#2e1911" />
        </linearGradient>
        <linearGradient id={uid + "n"} x1="1" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#EEDCAC" />
          <stop offset=".45" stopColor="#825438" />
          <stop offset="1" stopColor="#1b0e09" />
        </linearGradient>
        <mask id={uid + "h"}>
          <rect x="-100" y="-100" width="200" height="200" fill="#fff" />
          <circle r="12.5" fill="#000" />
        </mask>
      </defs>
      <g mask={"url(#" + uid + "h)"}>
        <circle r="95" fill={accent} filter={"url(#" + uid + "p)"} />
        <circle r="33" fill="none" stroke="rgba(0,0,0,.16)" strokeWidth="3.5" />
        <circle r="35.5" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="1.5" />
        <circle r="26" fill={"url(#" + uid + "m)"} />
        <circle r="26" fill="none" stroke="rgba(0,0,0,.45)" strokeWidth="1" />
        <circle r="18.5" fill={"url(#" + uid + "n)"} />
        <circle r="13" fill="none" stroke="#180d08" strokeWidth="2.2" />
      </g>
    </svg>
  );
}

/** Light that stays put while the disc turns underneath it. */
function ButtonGloss({ uid }) {
  return (
    <svg className="stt-gloss" viewBox="-100 -100 200 200" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={uid + "g"} cx=".32" cy=".26" r=".85">
          <stop offset="0" stopColor="#fff" stopOpacity=".26" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".24" />
        </radialGradient>
        <mask id={uid + "k"}>
          <rect x="-100" y="-100" width="200" height="200" fill="#fff" />
          <circle r="12.5" fill="#000" />
        </mask>
      </defs>
      <g mask={"url(#" + uid + "k)"}>
        <circle r="95" fill={"url(#" + uid + "g)"} />
        <circle r="94" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1.4" />
        <path
          d="M-17 -12A21 21 0 0 1 -3 -21"
          fill="none"
          stroke="rgba(255,255,255,.85)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M14 15A21 21 0 0 1 3 21"
          fill="none"
          stroke="rgba(255,255,255,.35)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

const Arrow = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <path
      d="M2.5 9.5L9.5 2.5M4 2.5H9.5V8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SEGMENTS = 96;

export default function StringTieFooter({
  meta = DEFAULT_META,
  title = "Thank",
  titleAccent = "You",
  tapes = DEFAULT_TAPES,
  email = "wenmarcreates@gmail.com",
  phone = "Philippines • Available Worldwide",
  phoneLabel = "Location",
  links = DEFAULT_LINKS,
  regards = "Warm Regards,",
  signature = DEFAULT_SIGNATURE,
  signatureText,
  signatureLabel = "Signed, Wenmar Creates",
  note = DEFAULT_NOTE,
  copiedLabel = "Copied",
  height = "100svh",
  paper = "#FEFADF",
  ink = "#111111",
  bodyInk = "#FEFADF",
  accent = "#920000",
  cord = "#D3A373",
  fontDisplay = "'Instrument Serif', 'Bodoni Moda', 'Cinzel', Didot, 'Times New Roman', Times, serif",
  fontSans = "'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  fontScript = "'Snell Roundhand', 'Segoe Script', 'Brush Script MT', 'Apple Chancery', cursive",
  grain = 0.5,
  defaultOpen = false,
  onToggle,
  className = "",
}) {
  const uid = "stt" + React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const rootRef = React.useRef(null);
  const frameRef = React.useRef(null);
  const topRef = React.useRef(null);
  const botRef = React.useRef(null);
  const spinTopRef = React.useRef(null);
  const spinBotRef = React.useRef(null);
  const flapRef = React.useRef(null);
  const letterRef = React.useRef(null);
  const cordRef = React.useRef(null);
  const shadowRef = React.useRef(null);
  const bodyRef = React.useRef(null);
  const twistRef = React.useRef(null);
  const hitRef = React.useRef(null);
  const tipRef = React.useRef(null);
  const signRef = React.useRef(null);

  const [seen, setSeen] = React.useState(false);
  const [open, setOpen] = React.useState(defaultOpen);
  const [signed, setSigned] = React.useState(false);
  const [copied, setCopied] = React.useState(0);
  const [loose, setLoose] = React.useState(true);

  const sim = React.useRef({
    rope: null,
    tied: [],
    rest: [],
    w: 0,
    h: 0,
    scale: 1,
    cordW: 3,
    wind: 0,
    intent: defaultOpen ? "open" : "sealed",
    fast: false,
    attract: 0.05,
    drag: null,
    seenAt: 0,
    holdUntil: 0,
    acc: 0,
    last: 0,
    raf: 0,
    visible: false,
    reduced: false,
    loose: true,
    signed: false,
    open: defaultOpen,
    ptr: null,
  });

  useSignatureLengths(signRef, signature.join("|"));

  const draw = () => {
    const s = sim.current;
    const r = s.rope;
    if (!r) return;
    const d = smoothPath(r.x, r.y);
    shadowRef.current?.setAttribute("d", d);
    bodyRef.current?.setAttribute("d", d);
    twistRef.current?.setAttribute("d", d);
    hitRef.current?.setAttribute("d", d);
    const n = r.x.length;
    const tip = tipRef.current;
    if (tip && n > 2) {
      const ex = r.x[n - 1];
      const ey = r.y[n - 1];
      const dx = ex - r.x[n - 3];
      const dy = ey - r.y[n - 3];
      const l = Math.hypot(dx, dy) || 1;
      const len = s.cordW * 3.4;
      tip.setAttribute("x1", String(round(ex - (dx / l) * len)));
      tip.setAttribute("y1", String(round(ey - (dy / l) * len)));
      tip.setAttribute("x2", String(round(ex)));
      tip.setAttribute("y2", String(round(ey)));
    }
    const w = s.cordW;
    bodyRef.current?.setAttribute("stroke-width", String(w));
    shadowRef.current?.setAttribute("stroke-width", String(w + 1.2));
    twistRef.current?.setAttribute("stroke-width", String(round(w * 0.42)));
    twistRef.current?.setAttribute("stroke-dasharray", round(w * 0.9) + " " + round(w * 1.25));
    tip?.setAttribute("stroke-width", String(round(w * 1.55)));
  };

  const measure = React.useCallback(() => {
    const root = rootRef.current;
    const frame = frameRef.current;
    const t = topRef.current;
    const b = botRef.current;
    const flap = flapRef.current;
    if (!root || !frame || !t || !b || !flap) return;
    const s = sim.current;
    const rr = root.getBoundingClientRect();
    const scale = root.offsetWidth ? rr.width / root.offsetWidth : 1;
    s.scale = scale || 1;
    const local = (el) => {
      const q = el.getBoundingClientRect();
      return { x: (q.left + q.width / 2 - rr.left) / s.scale, y: (q.top + q.height / 2 - rr.top) / s.scale };
    };
    const top = local(t);
    const bottom = local(b);
    const r = t.offsetWidth / 2;
    s.w = root.offsetWidth;
    s.h = root.offsetHeight;
    s.cordW = Math.max(2.2, Math.min(3.6, r * 0.036));
    const seam = flap.offsetHeight;
    const tiedRaw = tiePath(top, bottom, r * 0.4, r * 0.95);
    const L = polyLength(tiedRaw);
    s.tied = resample(tiedRaw, SEGMENTS);
    const pad = Math.max(10, r * 0.2);
    const box = { left: pad, top: seam + pad, right: s.w - pad, bottom: s.h - pad };
    const narrow = s.w < 640;
    s.rest = resample(restPath(bottom, L, r * (narrow ? 0.58 : 0.66), box, narrow ? 1.5 : 1.4, 2), SEGMENTS);
    const cordEl = cordRef.current;
    if (cordEl) {
      cordEl.setAttribute("viewBox", "0 0 " + s.w + " " + s.h);
      cordEl.setAttribute("width", String(s.w));
      cordEl.setAttribute("height", String(s.h));
    }
    if (!s.rope || s.rope.x.length !== s.tied.length) {
      s.rope = makeRope(s.wind > 0.5 ? s.tied : s.rest);
    } else {
      s.rope.seg = L / SEGMENTS;
      const k = Math.floor(s.wind * (SEGMENTS + 1));
      for (let i = 0; i < s.rope.x.length; i++) {
        const q = i < k ? s.tied[i] : s.rest[i];
        s.rope.x[i] = s.rope.px[i] = q.x;
        s.rope.y[i] = s.rope.py[i] = q.y;
      }
    }
    draw();
  }, []);

  const tick = React.useCallback((now) => {
    const s = sim.current;
    s.raf = 0;
    const root = rootRef.current;
    if (!root || !s.rope) return;
    const dt = Math.min(0.05, s.last ? (now - s.last) / 1000 : 0.016);
    s.last = now;

    const rect = root.getBoundingClientRect();
    const p = scrollProgress(rect.top, rect.height, window.innerHeight);
    const started = s.seenAt > 0 && now - s.seenAt > (s.reduced ? 0 : 900);
    const target = s.intent === "sealed" && started && now >= s.holdUntil ? p : 0;
    s.wind = s.reduced ? target : stepWind(s.wind, target, dt, s.fast ? 1.5 : 0.85);
    if (s.wind === target) s.fast = false;
    const locked = s.wind * (SEGMENTS + 1);

    if (spinTopRef.current) spinTopRef.current.style.transform = "rotate(" + round(s.wind * 540) + "deg)";
    if (spinBotRef.current) spinBotRef.current.style.transform = "rotate(" + round(s.wind * -200) + "deg)";

    if (s.reduced) {
      const k = Math.floor(locked);
      for (let i = 0; i < s.rope.x.length; i++) {
        const q = i < Math.max(1, k) ? s.tied[i] : s.rest[i];
        s.rope.x[i] = s.rope.px[i] = q.x;
        s.rope.y[i] = s.rope.py[i] = q.y;
      }
    } else {
      s.acc += dt;
      while (s.acc >= 1 / 60) {
        s.acc -= 1 / 60;
        const ptr = s.ptr;
        if (ptr && !s.drag) {
          const reach = 46;
          for (let i = Math.max(1, Math.floor(locked)); i < s.rope.x.length; i++) {
            const dx = s.rope.x[i] - ptr.x;
            const dy = s.rope.y[i] - ptr.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < reach * reach) {
              const f = (1 - Math.sqrt(d2) / reach) * 0.22;
              s.rope.x[i] += ptr.vx * f;
              s.rope.y[i] += ptr.vy * f;
            }
          }
          ptr.vx *= 0.6;
          ptr.vy *= 0.6;
        }
        stepRope(s.rope, s.tied, s.rest, locked, s.attract, s.drag);
      }
    }
    draw();

    const isLoose = locked < SEGMENTS * 0.98;
    if (isLoose !== s.loose) {
      s.loose = isLoose;
      setLoose(isLoose);
    }
    if (!s.signed && s.wind > 0.985) {
      s.signed = true;
      setSigned(true);
    }
    if (s.intent === "open" && s.wind < 0.015 && !s.open) {
      s.open = true;
      setOpen(true);
    }
    if (s.visible) s.raf = requestAnimationFrame(tick);
  }, []);

  const wake = React.useCallback(() => {
    const s = sim.current;
    if (!s.raf && s.visible) {
      s.last = 0;
      s.raf = requestAnimationFrame(tick);
    }
  }, [tick]);

  React.useEffect(() => {
    const s = sim.current;
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    s.reduced = !!mq?.matches;
    const onMq = () => {
      s.reduced = !!mq?.matches;
    };
    mq?.addEventListener?.("change", onMq);

    measure();
    const root = rootRef.current;
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => measure()) : null;
    if (root) ro?.observe(root);
    document.fonts?.ready?.then(() => measure()).catch(() => {});

    let io = null;
    if (root && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          const on = entries.some((e) => e.isIntersecting);
          s.visible = on;
          if (on && !s.seenAt) {
            s.seenAt = performance.now();
            setSeen(true);
          }
          if (on) wake();
        },
        { threshold: 0.12 }
      );
      io.observe(root);
    } else {
      s.visible = true;
      s.seenAt = performance.now();
      setSeen(true);
      wake();
    }
    return () => {
      io?.disconnect();
      ro?.disconnect();
      mq?.removeEventListener?.("change", onMq);
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      s.visible = false;
    };
  }, [measure, wake]);

  React.useEffect(() => {
    const el = letterRef.current;
    if (!el) return;
    if (open) el.removeAttribute("inert");
    else el.setAttribute("inert", "");
  }, [open]);

  React.useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(0), 2200);
    return () => clearTimeout(id);
  }, [copied]);

  const toggle = (want) => {
    const s = sim.current;
    const next = want ?? s.intent === "sealed";
    if (next === (s.intent === "open")) return;
    s.fast = true;
    s.attract = 0.05;
    s.drag = null;
    onToggle?.(next);
    if (next) {
      s.intent = "open";
    } else {
      s.open = false;
      s.intent = "sealed";
      s.holdUntil = performance.now() + (s.reduced ? 0 : 650);
      setOpen(false);
    }
    wake();
  };

  const copy = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied((c) => c + 1);
    } catch {
      window.location.href = "mailto:" + email;
    }
  };

  const toLocal = (e) => {
    const rr = rootRef.current.getBoundingClientRect();
    const s = sim.current;
    return { x: (e.clientX - rr.left) / s.scale, y: (e.clientY - rr.top) / s.scale };
  };
  const onCordDown = (e) => {
    const s = sim.current;
    if (!s.rope) return;
    const p = toLocal(e);
    const i = nearestFree(s.rope, p.x, p.y, s.wind * (SEGMENTS + 1), 30);
    if (i < 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    s.drag = { i, x: p.x, y: p.y, id: e.pointerId };
    s.attract = 0;
    cordRef.current?.classList.add("is-drag");
    wake();
  };
  const onCordMove = (e) => {
    const s = sim.current;
    if (!s.drag || s.drag.id !== e.pointerId) return;
    const p = toLocal(e);
    s.drag.x = Math.min(s.w - 4, Math.max(4, p.x));
    s.drag.y = Math.min(s.h - 4, Math.max(4, p.y));
  };
  const onCordUp = (e) => {
    const s = sim.current;
    if (!s.drag || s.drag.id !== e.pointerId) return;
    s.drag = null;
    cordRef.current?.classList.remove("is-drag");
  };
  const onMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const s = sim.current;
    const p = toLocal(e);
    const prev = s.ptr;
    const cap = (v) => Math.max(-14, Math.min(14, v));
    s.ptr = { x: p.x, y: p.y, vx: prev ? cap(p.x - prev.x) : 0, vy: prev ? cap(p.y - prev.y) : 0 };
  };

  const style = {
    "--stt-paper": paper,
    "--stt-ink": ink,
    "--stt-body-ink": bodyInk,
    "--stt-accent": accent,
    "--stt-display": fontDisplay,
    "--stt-sans": fontSans,
    "--stt-script": fontScript,
    "--stt-grain": String(grain),
    "--stt-h": height,
  };

  let ci = 0;
  const letters = (word) =>
    [...word].map((c, i) => (
      <span key={i} className="stt-ch" style={{ "--i": ci++ }}>
        {c === " " ? " " : c}
      </span>
    ));

  const mailHref = email ? "mailto:" + email : undefined;
  const external = (href) => /^https?:/.test(href);
  const heading = [title, titleAccent].filter(Boolean).join(" ");

  return (
    <footer
      ref={rootRef}
      className={
        "stt" +
        (seen ? " is-in" : "") +
        (open ? " is-open" : "") +
        (signed ? " is-signed" : "") +
        (className ? " " + className : "")
      }
      style={style}
      onPointerMove={onMove}
      onPointerLeave={() => (sim.current.ptr = null)}
    >
      <style>{CSS}</style>
      <div ref={frameRef} className="stt-frame">
        <div className="stt-flapwrap">
          <div ref={flapRef} className="stt-flap">
            {meta.length > 0 && (
              <div className="stt-meta">
                {meta.slice(0, 3).map((m, i) => (
                  <span key={i}>({m})</span>
                ))}
              </div>
            )}
            <div className="stt-head">
              <h2 className="stt-title">
                <span className="stt-sr">{heading}</span>
                <span aria-hidden="true">
                  {letters(title)}
                  {titleAccent && (
                    <>
                      {" "}
                      <em>{letters(titleAccent)}</em>
                    </>
                  )}
                </span>
              </h2>
              {tapes.length > 0 && (
                <p className="stt-tapes">
                  {tapes.slice(0, 2).map((t, i) => (
                    <React.Fragment key={i}>
                      <span className={"stt-tape " + (i ? "stt-tape-b" : "stt-tape-a")}>
                        <span>{t}</span>
                      </span>
                      {i === 0 && tapes.length > 1 && <span className="stt-sr"> </span>}
                    </React.Fragment>
                  ))}
                </p>
              )}
            </div>
            <div className="stt-dock">
              <button
                ref={topRef}
                type="button"
                className="stt-btn stt-btn-top"
                onClick={() => toggle(true)}
                aria-label="Untie the envelope"
                aria-controls={uid + "note"}
                aria-expanded={open}
                tabIndex={open ? -1 : 0}
                aria-hidden={open || undefined}
              >
                <span ref={spinTopRef} className="stt-spin">
                  <ButtonFace uid={uid + "t"} accent={accent} />
                </span>
                <ButtonGloss uid={uid + "t"} />
              </button>
            </div>
            <div className="stt-crease" aria-hidden="true" />
          </div>
        </div>

        <div className="stt-body">
          <div ref={letterRef} id={uid + "note"} className="stt-letter" role="region" aria-label="Note">
            <svg className="stt-stamp" viewBox="0 0 150 64" aria-hidden="true" focusable="false">
              <circle cx="32" cy="32" r="26" />
              <circle cx="32" cy="32" r="20.5" />
              <text x="32" y="34.5" textLength="30" lengthAdjust="spacingAndGlyphs">
                {meta[1] || "With love"}
              </text>
              <path d="M66 18q10-5 20 0t20 0 20 0 20 0M66 28q10-5 20 0t20 0 20 0 20 0M66 38q10-5 20 0t20 0 20 0 20 0M66 48q10-5 20 0t20 0 20 0 20 0" />
            </svg>
            {note.kicker && <p className="stt-note-k">{note.kicker}</p>}
            {note.text && <p className="stt-note-t">{note.text}</p>}
            <div className="stt-note-row">
              {email && (
                <a className="stt-cta" href={mailHref}>
                  {note.cta || "Write to me"}
                  <Arrow />
                </a>
              )}
              <button type="button" className="stt-ghost" onClick={() => toggle(false)}>
                Tie it back up
              </button>
            </div>
          </div>
          <div className="stt-panel" aria-hidden="true" />
          <div className="stt-dock-b">
            <button
              ref={botRef}
              type="button"
              className="stt-btn"
              onClick={() => toggle()}
              aria-label={open ? "Tie the envelope back up" : "Untie the envelope"}
              aria-controls={uid + "note"}
              aria-expanded={open}
            >
              <span ref={spinBotRef} className="stt-spin">
                <ButtonFace uid={uid + "b"} accent={accent} />
              </span>
              <ButtonGloss uid={uid + "b"} />
            </button>
          </div>

          <div className="stt-content">
            <div className="stt-contacts">
              {email && (
                <div>
                  <span className="stt-k">Email</span>
                  <button type="button" className="stt-v" onClick={copy} title="Copy email address">
                    {email}
                    <span className={"stt-copied" + (copied ? " is-on" : "")} aria-hidden="true">
                      {copiedLabel}
                    </span>
                  </button>
                  <span className="stt-sr" role="status">
                    {copied ? "Email address copied" : ""}
                  </span>
                </div>
              )}
              {phone && (
                <div>
                  <span className="stt-k">{phoneLabel}</span>
                  <span className="stt-v">{phone}</span>
                </div>
              )}
              {links.length > 0 && (
                <nav className="stt-links" aria-label="Elsewhere">
                  {links.map((l, i) => (
                    <a
                      key={i}
                      className="stt-link"
                      href={l.href || "#"}
                      target={external(l.href) ? "_blank" : undefined}
                      rel={external(l.href) ? "noopener noreferrer" : undefined}
                      onClick={(e) => {
                        if (!l.href || l.href === "#") e.preventDefault();
                      }}
                    >
                      {l.label}
                      <Arrow />
                    </a>
                  ))}
                </nav>
              )}
            </div>

            {(regards || signature.length > 0 || signatureText) && (
              <div className="stt-regards">
                {regards && <p className="stt-regards-t">{regards}</p>}
                {signatureText ? (
                  <span className="stt-sign-text" role="img" aria-label={signatureLabel}>
                    {signatureText}
                  </span>
                ) : (
                  signature.length > 0 && (
                    <svg ref={signRef} className="stt-sign" viewBox="0 0 600 300" role="img" aria-label={signatureLabel}>
                      <g transform="translate(0,300) scale(0.1,-0.1)">
                        {signature.map((d, i) => (
                          <path key={i} d={d} />
                        ))}
                      </g>
                    </svg>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <svg ref={cordRef} className={"stt-cord" + (loose ? " is-loose" : "")} aria-hidden="true" focusable="false">
        <defs>
          <filter id={uid + "s"} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
        </defs>
        <path ref={shadowRef} stroke="rgba(0,0,0,.32)" transform="translate(1.2 2.6)" filter={"url(#" + uid + "s)"} />
        <path ref={bodyRef} stroke={cord} />
        <path ref={twistRef} stroke="rgba(255,255,255,.2)" />
        <line ref={tipRef} stroke="#EEDCAC" strokeLinecap="round" />
        <path
          ref={hitRef}
          className="stt-hit"
          onPointerDown={onCordDown}
          onPointerMove={onCordMove}
          onPointerUp={onCordUp}
          onPointerCancel={onCordUp}
        />
      </svg>
    </footer>
  );
}

