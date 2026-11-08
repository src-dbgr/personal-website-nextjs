// Generates the outlines of SAMUEL (Oswald 500) and IT (Oswald Regular) for
// the liquid hero words, into src/components/03_hero/heroGlyphOutlines.json.
// Font units, 1000 per em, baseline at y = 0. Each word has its advance width
// (incl. letter spacing) and its exact outline as SVG path data: the SVG
// fallback draws it, the WebGL shader rasterises it into its glyph mask
// (see liquidMetal.js). Oswald is SIL OFL 1.1.
// Usage (opentype.js is not a project dependency; NODE_PATH points node at
// the copy npx fetched):
//   npx -y -p opentype.js@1.3.4 -c 'NODE_PATH="$(dirname "$(command -v ot)")/.." node scripts/generate-hero-glyphs.cjs'
const fs = require("fs");
const path = require("path");
const opentype = require("opentype.js");

const FONT_DIR = path.join(__dirname, "..", "src", "assets", "fonts", "Oswald");
const OUT_DIR = path.join(__dirname, "..", "src", "components", "03_hero");
const LETTER_SPACING = 10; // the headings use 0.05rem = 0.01em

const WORDS = {
  samuel: { text: "SAMUEL", font: "oswald-v36-latin-500.ttf" },
  it: { text: "IT", font: "oswald-v36-latin-regular.ttf" },
};

const outlines = {};
for (const [key, { text, font: file }] of Object.entries(WORDS)) {
  const font = opentype.loadSync(path.join(FONT_DIR, file));
  let x = 0;
  const d = [];
  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    d.push(glyph.getPath(x, 0, 1000).toPathData(1));
    x += glyph.advanceWidth + LETTER_SPACING;
  }
  outlines[key] = { width: x, d: d.join("") };
  console.log(`${key}: width ${x}`);
}
fs.writeFileSync(
  path.join(OUT_DIR, "heroGlyphOutlines.json"),
  JSON.stringify(outlines),
);
