import { useEffect } from "react";
import { createLiquidMetal, LIQUID_FRAME_IDLE_MS } from "./liquidMetal";

const MAX_DPR = 2;

/**
 * Runs the liquid-metal renderer (liquidMetal.js) on a canvas laid over a
 * shape: `d` is its SVG path data, `box` ({ x, y, w, h }) its bounding box in
 * the same units. `strokeRef` (optional) points at the SVG fallback path; its
 * CSS stroke-width is added to the shape (synthetic bold of the hero words).
 *
 * The canvas runs only while visible, at ~30 fps; with prefers-reduced-motion
 * it shows one still frame. Its three shimmer colours come from CSS
 * (--liquid-c1..3 on the root, per theme). Once the first frame is drawn the
 * root gets the class "liquid-gl", which hides the SVG fallback.
 *
 * A click (or tap) on the root sends a damped wave from that point and makes
 * the shape wobble briefly; it renders at full frame rate for that time.
 * `tuning` adjusts it per shape; pass a stable object (module constant):
 *   scale, tempo, strength  click wave (1 = logo)
 *   rim                     light-theme rim strength (0..1)
 *   bevel                   width of the rounded chrome edge, in units
 *   lum                     fixed luminance band [darkMin, darkMax,
 *                           lightMin, lightMax], e.g. under a label
 *   hitOn                   "click" (default) or "hover" (mouse only)
 * Without `d` (shape not measured yet) nothing runs.
 */
export default function useLiquidMetal(
  rootRef,
  canvasRef,
  strokeRef,
  d,
  box,
  tuning,
) {
  const { x, y, w, h } = box;

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!d || !root || !canvas) return undefined;
    let metal = null;
    try {
      metal = createLiquidMetal(canvas, {
        d,
        box: { x, y, w, h },
        tuning,
      });
    } catch {
      metal = null;
    }
    if (!metal) return undefined;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDark = () => document.body.classList.contains("dark-theme");
    const start = performance.now();
    let frame = 0;
    let visible = false;
    let last = 0;
    let lost = false;
    let busyUntil = 0; // click wobble running: render every frame
    let resizeTimer = 0;

    const now = () => (performance.now() - start) / 1000;
    const readPalette = () => {
      const style = getComputedStyle(root);
      metal.setPalette(
        ["--liquid-c1", "--liquid-c2", "--liquid-c3"].map((name) =>
          style.getPropertyValue(name).trim().split(/\s+/).map(Number),
        ),
      );
    };
    const render = (t) => {
      if (lost) return;
      metal.draw(t, isDark());
      root.classList.add("liquid-gl");
    };

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const stroke = strokeRef?.current
        ? parseFloat(getComputedStyle(strokeRef.current).strokeWidth) || 0
        : 0;
      metal.resize(
        Math.round(rect.width * dpr),
        Math.round(rect.height * dpr),
        stroke,
      );
      readPalette();
      render(still ? 0 : now());
    };

    // The mask is rebuilt (blurred on the CPU) only once the size settles;
    // meanwhile the canvas just stretches. The first build runs at once.
    let built = false;
    const resize = () => {
      if (!built) {
        built = true;
        rebuild();
        return;
      }
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(rebuild, 150);
    };

    const tick = (ms) => {
      frame = 0;
      if (!visible || still || lost) return;
      if (now() < busyUntil || ms - last >= LIQUID_FRAME_IDLE_MS) {
        last = ms;
        render(now());
      }
      frame = requestAnimationFrame(tick);
    };
    const loop = () => {
      if (!frame && visible && !still && !lost)
        frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      loop();
    });
    observer.observe(root);
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(root);
    // Theme switch: new colours, redraw at once.
    const themeObserver = new MutationObserver(() => {
      readPalette();
      render(still ? 0 : now());
    });
    themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const onLost = (event) => {
      event.preventDefault();
      lost = true;
      root.classList.remove("liquid-gl");
    };
    canvas.addEventListener("webglcontextlost", onLost);
    const onClick = (event) => {
      if (still || lost || !visible) return;
      // Selecting text is not a click on the metal.
      if (String(window.getSelection?.() || "").length) return;
      const t = now();
      metal.hit(
        canvas.getBoundingClientRect(),
        event.clientX,
        event.clientY,
        t,
      );
      busyUntil = t + metal.hitDuration;
      loop();
    };
    let lastHover = -10;
    const onEnter = (event) => {
      if (event.pointerType !== "mouse" || now() - lastHover < 0.8) return;
      lastHover = now();
      onClick(event);
    };
    const hitEvent = tuning?.hitOn === "hover" ? "pointerenter" : "click";
    const hitHandler = hitEvent === "click" ? onClick : onEnter;
    root.addEventListener(hitEvent, hitHandler);

    return () => {
      observer.disconnect();
      sizeObserver.disconnect();
      themeObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      root.removeEventListener(hitEvent, hitHandler);
      clearTimeout(resizeTimer);
      if (frame) cancelAnimationFrame(frame);
      root.classList.remove("liquid-gl");
      metal.dispose();
    };
  }, [rootRef, canvasRef, strokeRef, d, x, y, w, h, tuning]);
}
