import React, { useEffect, useId, useRef } from "react";
import outlines from "./heroGlyphOutlines.json";

/**
 * A hero word that looks like oil on water: the letter outlines flow like a
 * viscous liquid; inside, over a green metallic reflection (light top, dark
 * horizon), soft oil streaks in the logo's colours drift, bend and blend.
 *
 * The real text stays in the DOM (transparent) for layout, selection, search
 * engines and screen readers. An SVG with the font outlines sits exactly on
 * top. The first paint shows the exact outline and the streaks at t = 0 (also
 * without JS). After load, the evenly spaced contour points
 * (heroGlyphPoints.json, made by scripts/generate-hero-glyphs.cjs) are pushed
 * along their normals by smooth noise, and the streak boundaries are bent by
 * the same noise field, so outline and pattern move together. Runs at
 * ~24 fps, only while visible, and not at all with prefers-reduced-motion.
 */

const EDGE_AMPLITUDE = 34; // font units (2.7 px at 80 px)
const EDGE_SCALE = 1 / 300; // noise scale along the outline
const SPEED = 0.6; // noise time per second
const STREAKS = 10; // streak boundaries across the word
const BLEND = 22; // blur between the oil streaks, font units
const OIL_COLOURS = 5; // streak colour classes, see .liquid-streak-* in CSS
const STREAK_STEP = 40; // point spacing along a boundary, font units
const FRAME_MS = 42; // ~24 fps
const TOP = -900; // viewBox: 1em tall, baseline 0.9em from the top
const HEIGHT = 1000;

// Smooth 3D value noise in [-1, 1]; deterministic, so server and client
// render the same first frame.
const PERM = new Uint8Array(512);
{
  let seed = 7;
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    seed = (seed * 16807) % 2147483647;
    const j = seed % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
}
const fade = (t) => t * t * (3 - 2 * t);
const lattice = (x, y, z) =>
  PERM[PERM[PERM[x & 255] + (y & 255)] + (z & 255)] / 127.5 - 1;
function noise3(x, y, z) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const u = fade(x - xi);
  const v = fade(y - yi);
  const w = fade(z - zi);
  const mix = (a, b, t) => a + (b - a) * t;
  return mix(
    mix(
      mix(lattice(xi, yi, zi), lattice(xi + 1, yi, zi), u),
      mix(lattice(xi, yi + 1, zi), lattice(xi + 1, yi + 1, zi), u),
      v,
    ),
    mix(
      mix(lattice(xi, yi, zi + 1), lattice(xi + 1, yi, zi + 1), u),
      mix(lattice(xi, yi + 1, zi + 1), lattice(xi + 1, yi + 1, zi + 1), u),
      v,
    ),
    w,
  );
}

function withNormals(flat) {
  const n = flat.length / 2;
  const out = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    const a = ((i - 1 + n) % n) * 2;
    const b = ((i + 1) % n) * 2;
    const tx = flat[b] - flat[a];
    const ty = flat[b + 1] - flat[a + 1];
    const len = Math.hypot(tx, ty) || 1;
    out[i * 4] = flat[i * 2];
    out[i * 4 + 1] = flat[i * 2 + 1];
    out[i * 4 + 2] = ty / len;
    out[i * 4 + 3] = -tx / len;
  }
  return out;
}

function outlinePath(contours, time) {
  let d = "";
  for (const c of contours) {
    for (let i = 0; i < c.length; i += 4) {
      const x = c[i];
      const y = c[i + 1];
      const offset =
        EDGE_AMPLITUDE * noise3(x * EDGE_SCALE, y * EDGE_SCALE, time);
      d +=
        (i ? "L" : "M") +
        Math.round(x + c[i + 2] * offset) +
        " " +
        Math.round(y + c[i + 3] * offset);
    }
    d += "Z";
  }
  return d;
}

// One streak boundary: a tilted line across the word, bent by two noise
// octaves that drift sideways over time, like oil pulled through water.
function boundary(width, j, time) {
  const points = [];
  const base = TOP + ((j + 0.5) / STREAKS) * HEIGHT * 1.6 - HEIGHT * 0.3;
  for (let x = -300; x <= width + 300; x += STREAK_STEP) {
    const flow = x / 420 - time * 0.35;
    const bend =
      210 * noise3(flow, j * 0.37, time * 0.5) +
      90 * noise3(x / 170 + time * 0.2, j * 0.91 + 5, time * 0.9);
    points.push([x, base + (x - width / 2) * 0.32 + bend]);
  }
  return points;
}

function streakPaths(width, time) {
  const lines = Array.from({ length: STREAKS }, (_, j) =>
    boundary(width, j, time),
  );
  const paths = [];
  for (let j = 0; j < STREAKS - 1; j++) {
    const upper = lines[j];
    const lower = lines[j + 1];
    let d = `M${Math.round(upper[0][0])} ${Math.round(upper[0][1])}`;
    for (let i = 1; i < upper.length; i++)
      d += `L${Math.round(upper[i][0])} ${Math.round(upper[i][1])}`;
    for (let i = lower.length - 1; i >= 0; i--)
      d += `L${Math.round(lower[i][0])} ${Math.round(lower[i][1])}`;
    paths.push(d + "Z");
  }
  return paths;
}

const LiquidWord = ({ word, stroke = 0, children }) => {
  // stroke (font units) imitates the browser's synthetic bold; CSS may
  // override it per breakpoint (.liquid-word-body in globals.css).
  const { width, d } = outlines[word];
  const clipId = `liquid-${useId().replace(/:/g, "")}`;
  const clipRef = useRef(null);
  const bodyRef = useRef(null);
  const streakRefs = useRef([]);
  const initial = streakPaths(width, 0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    const clip = clipRef.current;
    const body = bodyRef.current;
    let contours = null;
    let frame = 0;
    let visible = false;
    let last = 0;
    let cancelled = false;

    const tick = (now) => {
      frame = 0;
      if (!visible || !contours) return;
      if (now - last >= FRAME_MS) {
        last = now;
        const t = (now / 1000) * SPEED;
        const outline = outlinePath(contours, t);
        clip.setAttribute("d", outline);
        body.setAttribute("d", outline);
        streakPaths(width, t).forEach((band, i) =>
          streakRefs.current[i]?.setAttribute("d", band),
        );
      }
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!frame && visible && contours && !cancelled)
        frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    observer.observe(body);

    import("./heroGlyphPoints.json").then((module) => {
      contours = (module.default || module)[word].map(withNormals);
      start();
    });

    return () => {
      cancelled = true;
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [word, width]);

  return (
    <span className={`highlight liquid-word liquid-word-${word}`}>
      {children}
      <svg
        className="liquid-word-svg"
        viewBox={`0 ${TOP} ${width} ${HEIGHT}`}
        style={{ width: `${width / 1000}em` }}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id={clipId}>
            <path ref={clipRef} d={d} />
          </clipPath>
          <filter
            id={`${clipId}-blend`}
            x="-5%"
            y="-20%"
            width="110%"
            height="140%"
          >
            <feGaussianBlur stdDeviation={BLEND} />
          </filter>
          {/* Metallic reflection: light "sky" on top, dark horizon, light floor. */}
          <linearGradient
            id={`${clipId}-chrome`}
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
          fill={`url(#${clipId}-chrome)`}
          stroke={`url(#${clipId}-chrome)`}
          strokeWidth={stroke}
          strokeLinejoin="round"
        />
        <g clipPath={`url(#${clipId})`}>
          <g className="liquid-streaks" filter={`url(#${clipId}-blend)`}>
            {initial.map((streak, i) => (
              <path
                key={i}
                ref={(el) => {
                  streakRefs.current[i] = el;
                }}
                className={`liquid-streak liquid-streak-${i % OIL_COLOURS}`}
                d={streak}
              />
            ))}
          </g>
        </g>
      </svg>
    </span>
  );
};

export default LiquidWord;
