import React, { useEffect, useRef } from "react";
import { createBlackHole } from "./blackHole";

/**
 * Hero background: a gravitational lens centred behind the
 * logo triangle, slowly breathing (see blackHole.js). Only on wide screens
 * (where the triangle shows, CSS), only while visible, ~30 fps at half
 * resolution;
 * prefers-reduced-motion shows a still frame, without WebGL nothing.
 */

const RES = 0.5; // canvas pixels per CSS px
const FRAME_MS = 32;

const HeroBlackHole = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || getComputedStyle(canvas).display === "none")
      return undefined;
    let hole = null;
    try {
      hole = createBlackHole(canvas);
    } catch {
      hole = null;
    }
    if (!hole) return undefined;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDark = () => document.body.classList.contains("dark-theme");
    const start = performance.now();
    const now = () => (performance.now() - start) / 1000;
    let frame = 0;
    let last = 0;
    let visible = false;
    let anchor = { x: 0, y: 0, size: 250 };

    const readPalette = () => {
      const style = getComputedStyle(canvas);
      hole.setPalette(
        ["--liquid-c1", "--liquid-c2", "--liquid-c3"].map((name) =>
          style.getPropertyValue(name).trim().split(/\s+/).map(Number),
        ),
      );
    };
    // The hole circles around the triangle's centre (the triangle mounts
    // late and can change, so this runs again every second).
    const locate = () => {
      const box = canvas.getBoundingClientRect();
      const target =
        document.querySelector("#logo_2") ||
        document.querySelector(".hero-img");
      const t = target ? target.getBoundingClientRect() : null;
      anchor = t
        ? {
            // Incentre of the downward triangle (31% from its top edge).
            x: t.left - box.left + t.width * 0.499,
            y: t.top - box.top + t.height * 0.309,
            size: Math.min(t.width, 250),
          }
        : { x: box.width * 0.72, y: box.height * 0.45, size: 250 };
    };
    const measure = () => {
      const box = canvas.getBoundingClientRect();
      if (!box.width) return;
      locate();
      hole.resize(
        Math.max(1, Math.round(box.width * RES)),
        Math.max(1, Math.round(box.height * RES)),
        RES,
      );
      readPalette();
    };
    const render = (t) => {
      const r = anchor.size;
      // Fixed at the triangle's centre; it only breathes slowly (+-6 %).
      const size = r * 0.4 * (1 + 0.06 * Math.sin(t * 0.25));
      hole.draw(t, isDark(), anchor.x, anchor.y, size);
      canvas.classList.add("is-drawn");
    };
    let located = 0;
    const tick = (ms) => {
      frame = 0;
      if (!visible) return;
      if (ms - last >= FRAME_MS) {
        last = ms;
        if (ms - located > 1000) {
          located = ms;
          locate();
        }
        render(now());
      }
      frame = requestAnimationFrame(tick);
    };
    const loop = () => {
      if (!frame && visible && !still) frame = requestAnimationFrame(tick);
    };

    measure();
    render(still ? 20 : 0);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      loop();
    });
    io.observe(canvas);
    let timer = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        measure();
        render(still ? 20 : now());
      }, 150);
    });
    ro.observe(canvas);
    const mo = new MutationObserver(() => {
      readPalette();
      render(still ? 20 : now());
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => {
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      clearTimeout(timer);
      if (frame) cancelAnimationFrame(frame);
      hole.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-blackhole liquid-metal"
      aria-hidden="true"
    />
  );
};

export default HeroBlackHole;
