import React, { useEffect, useRef } from "react";
import { createBlackHole, INTRO } from "./blackHole";

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
    // The hero gets "bh-intro" (the triangle springs out of the supernova)
    // or "bh-nointro" (it just shows), see globals.css.
    const hero = canvas.closest(".hero");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hole = null;
    try {
      hole = createBlackHole(canvas);
    } catch {
      hole = null;
    }
    hero?.classList.add(hole && !still ? "bh-intro" : "bh-nointro");
    if (!hole) return undefined;

    const isDark = () => document.body.classList.contains("dark-theme");
    const start = performance.now();
    const now = () => (performance.now() - start) / 1000;
    let frame = 0;
    let last = 0;
    let visible = false;
    let anchor = { x: 0, y: 0, size: 250 };
    // Intro start (seconds of now()); null: no intro.
    let introStart = still ? null : 0; // supernova on every page load
    const introAt = (t) => (introStart === null ? INTRO : t - introStart);
    // With the intro the canvas appears at once (the flash is the fade-in).
    if (introStart !== null) canvas.style.transition = "opacity 0.1s";

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
      // The triangle itself (its SVG, 250 x 250), not #logo_2: that box can
      // be taller than the triangle (min-height 30vh on tall windows).
      const logo = document.querySelector("#logo_2");
      const shape = logo && logo.querySelector(".liquid-logo-svg");
      const t = shape ? shape.getBoundingClientRect() : null;
      anchor =
        t && t.width
          ? {
              // Incentre of the downward triangle (31% from its top edge).
              // The intro scales the logo around this point, so it holds
              // during the animation too.
              x: t.left - box.left + t.width * 0.499,
              y: t.top - box.top + t.height * 0.309,
              // Layout size, not the (possibly scaled) on-screen size.
              size: Math.min(logo.offsetWidth || 250, 250),
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
      hole.draw(t, isDark(), anchor.x, anchor.y, size, introAt(t));
      canvas.classList.add("is-drawn");
    };
    let located = 0;
    const tick = (ms) => {
      frame = 0;
      if (!visible) return;
      // Every frame during the intro, ~30 fps afterwards.
      if (introAt(now()) < INTRO || ms - last >= FRAME_MS) {
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
      hero?.classList.remove("bh-intro", "bh-nointro");
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
