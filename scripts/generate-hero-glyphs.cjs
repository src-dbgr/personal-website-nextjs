// Generates the outlines of SAMUEL
// (Oswald 500) and IT (Oswald Regular) for the liquid hero words, into
// src/components/03_hero: heroGlyphOutlines.json and heroGlyphPoints.json.
// Font units, 1000 per em, baseline at y = 0. Each word has the exact outline
// as SVG path data (first paint, no JS) and its contours resampled to evenly
// spaced points, stored flat as [x0, y0, x1, y1, ...] (animation, loaded
// lazily). Normals are computed in the browser. Oswald is SIL OFL 1.1.
// Usage: npx -y -p opentype.js@1.3.4 node scripts/generate-hero-glyphs.cjs
const fs = require("fs");
const path = require("path");
const opentype = require("opentype.js");

const FONT_DIR = path.join(__dirname, "..", "src", "assets", "fonts", "Oswald");
const OUT_DIR = path.join(__dirname, "..", "src", "components", "03_hero");
const LETTER_SPACING = 10; // the headings use 0.05rem = 0.01em
const STEP = 14; // point spacing in font units (1.1 px at 80 px)

const WORDS = {
  samuel: { text: "SAMUEL", font: "oswald-v36-latin-500.ttf" },
  it: { text: "IT", font: "oswald-v36-latin-regular.ttf" },
};

function flatten(commands) {
  const contours = [];
  let current = [];
  let last = [0, 0];
  const push = (p) => {
    current.push(p);
    last = p;
  };
  for (const c of commands) {
    if (c.type === "M") {
      if (current.length) contours.push(current);
      current = [];
      push([c.x, c.y]);
    } else if (c.type === "L") {
      push([c.x, c.y]);
    } else if (c.type === "Q" || c.type === "C") {
      const [x0, y0] = last;
      for (let i = 1; i <= 16; i++) {
        const t = i / 16;
        const u = 1 - t;
        if (c.type === "Q") {
          push([
            u * u * x0 + 2 * u * t * c.x1 + t * t * c.x,
            u * u * y0 + 2 * u * t * c.y1 + t * t * c.y,
          ]);
        } else {
          push([
            u * u * u * x0 + 3 * u * u * t * c.x1 + 3 * u * t * t * c.x2 + t * t * t * c.x,
            u * u * u * y0 + 3 * u * u * t * c.y1 + 3 * u * t * t * c.y2 + t * t * t * c.y,
          ]);
        }
      }
    } else if (c.type === "Z") {
      if (current.length) contours.push(current);
      current = [];
    }
  }
  if (current.length) contours.push(current);
  return contours;
}

function resample(points) {
  const closed = [...points, points[0]];
  let length = 0;
  for (let i = 1; i < closed.length; i++) {
    length += Math.hypot(closed[i][0] - closed[i - 1][0], closed[i][1] - closed[i - 1][1]);
  }
  const count = Math.max(12, Math.round(length / STEP));
  const step = length / count;
  const out = [];
  let seg = 1;
  let segStart = 0;
  for (let k = 0; k < count; k++) {
    const target = k * step;
    let segLen = Math.hypot(closed[seg][0] - closed[seg - 1][0], closed[seg][1] - closed[seg - 1][1]);
    while (segStart + segLen < target && seg < closed.length - 1) {
      segStart += segLen;
      seg += 1;
      segLen = Math.hypot(closed[seg][0] - closed[seg - 1][0], closed[seg][1] - closed[seg - 1][1]);
    }
    const t = segLen ? (target - segStart) / segLen : 0;
    out.push([
      closed[seg - 1][0] + (closed[seg][0] - closed[seg - 1][0]) * t,
      closed[seg - 1][1] + (closed[seg][1] - closed[seg - 1][1]) * t,
    ]);
  }
  return out;
}

const result = {};
for (const [key, { text, font: file }] of Object.entries(WORDS)) {
  const font = opentype.loadSync(path.join(FONT_DIR, file));
  let x = 0;
  const d = [];
  const contours = [];
  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    const glyphPath = glyph.getPath(x, 0, 1000);
    d.push(glyphPath.toPathData(1));
    for (const contour of flatten(glyphPath.commands)) {
      contours.push(resample(contour).flatMap(([px, py]) => [Math.round(px), Math.round(py)]));
    }
    x += glyph.advanceWidth + LETTER_SPACING;
  }
  result[key] = { width: x, d: d.join(""), contours };
}

const outlines = {};
const points = {};
for (const [key, word] of Object.entries(result)) {
  outlines[key] = { width: word.width, d: word.d };
  points[key] = word.contours;
}
fs.writeFileSync(path.join(OUT_DIR, "heroGlyphOutlines.json"), JSON.stringify(outlines));
fs.writeFileSync(path.join(OUT_DIR, "heroGlyphPoints.json"), JSON.stringify(points));
for (const [key, word] of Object.entries(result)) {
  const points = word.contours.reduce((sum, c) => sum + c.length / 2, 0);
  console.log(`${key}: width ${word.width}, ${word.contours.length} contours, ${points} points`);
}
