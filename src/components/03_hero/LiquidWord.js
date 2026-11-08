import React, { useRef } from "react";
import outlines from "./heroGlyphOutlines.json";
import { PAD } from "./liquidMetal";
import useLiquidMetal from "./useLiquidMetal";

/**
 * A hero word in liquid metal: chrome with an oil-film shimmer that flows
 * slowly (see liquidMetal.js).
 *
 * The real text stays in the DOM (transparent) for layout, selection, search
 * engines and screen readers. On top sit
 *   - an SVG with the exact font outline in static chrome colours (first
 *     paint, no JS, no WebGL) and
 *   - a small WebGL canvas that takes over once its first frame is drawn.
 * Rendering, pausing and reduced motion: see useLiquidMetal.js.
 */

const TOP = -900;
const HEIGHT = 1000;
// Bounding boxes in font units, stable across renders.
const BOXES = Object.fromEntries(
  Object.entries(outlines).map(([word, { width }]) => [
    word,
    { x: 0, y: TOP, w: width, h: HEIGHT },
  ]),
);

// Click wave on the words: gentler and slower than on the logo, sized to
// the letters (font units, so the same at every window width). Full rim in
// the light theme: it carries the 3:1 contrast of the text.
const WORD_TUNING = { scale: 2.2, tempo: 0.55, strength: 0.45, rim: 1 };

const LiquidWord = ({ word, stroke = 0, children }) => {
  // stroke (font units) imitates the browser's synthetic bold; CSS may
  // override it per breakpoint (.liquid-word-body in globals.css).
  const { width, d } = outlines[word];
  const rootRef = useRef(null);
  const bodyRef = useRef(null);
  const canvasRef = useRef(null);

  useLiquidMetal(rootRef, canvasRef, bodyRef, d, BOXES[word], WORD_TUNING);

  const pad = PAD / 1000;
  return (
    <span
      ref={rootRef}
      className={`highlight liquid-word liquid-metal liquid-word-${word}`}
    >
      {children}
      <svg
        className="liquid-word-svg"
        viewBox={`0 ${TOP} ${width} ${HEIGHT}`}
        style={{ width: `${width / 1000}em` }}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* Static chrome: light "sky" on top, dark horizon, light floor. */}
          <linearGradient
            id={`liquid-chrome-${word}`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="-820"
            x2="0"
            y2="0"
          >
            <stop className="liquid-chrome-0" offset="0" />
            <stop className="liquid-chrome-1" offset="0.42" />
            <stop className="liquid-chrome-2" offset="0.52" />
            <stop className="liquid-chrome-3" offset="1" />
          </linearGradient>
        </defs>
        <path
          ref={bodyRef}
          className="liquid-word-body"
          d={d}
          fill={`url(#liquid-chrome-${word})`}
          stroke={`url(#liquid-chrome-${word})`}
          strokeWidth={stroke}
          strokeLinejoin="round"
        />
      </svg>
      <canvas
        ref={canvasRef}
        className="liquid-word-canvas"
        style={{
          left: `${-pad}em`,
          top: `${0.293 - pad}em`,
          width: `${(width + PAD * 2) / 1000}em`,
          height: `${(HEIGHT + PAD * 2) / 1000}em`,
        }}
        aria-hidden="true"
      />
    </span>
  );
};

export default LiquidWord;
