import React, { useRef } from "react";
import { PAD } from "./liquidMetal";
import useLiquidMetal from "./useLiquidMetal";

/**
 * The hero's logo triangle in liquid metal, matching SAMUEL and IT. The SVG
 * with a static gradient in the metal's tones (globals.css) is the first
 * paint and the fallback without WebGL; the canvas takes over once it has
 * drawn (see useLiquidMetal.js).
 * Units: the 250 px triangle is drawn 1000 units wide (4 units per px), so
 * the shader's noise and bevel sizes match the hero words.
 */

const SIZE = 250; // CSS px
const UNITS = 1000;
const TRIANGLE = "M0 0L497.2 1000L1000 0Z";
const BOX = { x: 0, y: 0, w: UNITS, h: UNITS };
// Decorative, not text: only a light rim in the light theme.
const TUNING = { rim: 0.5 };

const LiquidLogo = () => {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  useLiquidMetal(rootRef, canvasRef, null, TRIANGLE, BOX, TUNING);

  const pad = (PAD * SIZE) / UNITS;
  return (
    <div
      id="logo_2"
      ref={rootRef}
      className="liquid-logo liquid-metal"
      style={{ width: SIZE, height: SIZE }}
    >
      <svg
        className="liquid-logo-svg"
        xmlns="http://www.w3.org/2000/svg"
        width={SIZE}
        height={SIZE}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient
            id="rad_grad_a"
            data-name="grad_trngl"
            x1={264.1}
            y1={130.6}
            x2={514.1}
            y2={130.6}
            gradientTransform="rotate(180 257.05 127.8)"
            gradientUnits="userSpaceOnUse"
          >
            <stop className="liquid-logo-stop-0" offset={0} />
            <stop className="liquid-logo-stop-1" offset={1} />
          </linearGradient>
        </defs>
        <path
          data-name="triangle nav"
          d="m0 0 124.3 250L250 0Z"
          fill="url(#rad_grad_a)"
        />
      </svg>
      <canvas
        ref={canvasRef}
        className="liquid-logo-canvas"
        style={{
          left: -pad,
          top: -pad,
          width: SIZE + 2 * pad,
          height: SIZE + 2 * pad,
        }}
        aria-hidden="true"
      />
    </div>
  );
};

export default LiquidLogo;
