import React, { useEffect, useRef, useState } from "react";
import { PAD } from "./liquidMetal";
import useLiquidMetal from "./useLiquidMetal";

/**
 * A pill button whose surface is liquid metal (see liquidMetal.js). The
 * label is cut out of the metal, so the page background shows through the
 * letters, with the metal's rounded edge around them; the real text stays
 * for screen readers (transparent once the metal has drawn). Until then, and
 * without WebGL, the button shows a static gradient (globals.css).
 *
 * Dark theme: the metal stays inside a bright luminance band. Light theme:
 * the colours of the logo triangle. Hovering with the mouse sends a gentle
 * wave through it (a click navigates away at once, so it gets no wave).
 * Units: 4 per CSS px, like the logo triangle.
 */

const UNITS_PER_PX = 4;
const TUNING = {
  hitOn: "hover",
  scale: 0.8,
  tempo: 0.7,
  strength: 0.5,
  rim: 0.5, // light theme, like the triangle
  bevel: 14, // ~3.5 px: the button is only ~48 px tall
  lum: [0.36, 1, 0, 0], // light theme: no band, the triangle's mapping
};

// Pill outline (stadium) w x h in units, as SVG path data.
const pill = (w, h) => {
  const r = h / 2;
  return `M${r} 0H${w - r}A${r} ${r} 0 0 1 ${w - r} ${h}H${r}A${r} ${r} 0 0 1 ${r} 0Z`;
};

const LiquidButton = ({ className = "", children }) => {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const labelRef = useRef(null);
  const [size, setSize] = useState(null);

  // The pill follows the button's CSS size.
  useEffect(() => {
    const root = rootRef.current;
    const measure = () => {
      const w = Math.round(root.offsetWidth);
      const h = Math.round(root.offsetHeight);
      setSize((old) =>
        w && h && (!old || old.w !== w || old.h !== h) ? { w, h } : old,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const w = size ? size.w * UNITS_PER_PX : 0;
  const h = size ? size.h * UNITS_PER_PX : 0;
  useLiquidMetal(
    rootRef,
    canvasRef,
    null,
    size ? pill(w, h) : null,
    { x: 0, y: 0, w, h },
    TUNING,
    labelRef,
  );

  const pad = PAD / UNITS_PER_PX;
  return (
    <div ref={rootRef} className={`btn liquid-btn liquid-metal ${className}`}>
      {size && (
        <canvas
          ref={canvasRef}
          className="liquid-btn-canvas"
          style={{
            left: -pad,
            top: -pad,
            width: size.w + 2 * pad,
            height: size.h + 2 * pad,
          }}
          aria-hidden="true"
        />
      )}
      <span ref={labelRef} className="liquid-btn-label">
        {children}
      </span>
    </div>
  );
};

export default LiquidButton;
