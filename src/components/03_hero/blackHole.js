/**
 * Background of the hero: a gravitational lens ("black
 * hole") behind the logo triangle. Raw WebGL, one fragment shader, no
 * textures: the lensed backdrop is procedural dust in the liquid metal's
 * colours (--liquid-c1..3), drawn as a transparent overlay on the hero's
 * own background colour.
 *
 * Lensing: a point at angle theta from the centre shows the backdrop at
 * theta - E^2 / theta (E = Einstein radius), swirled a little by the spin;
 * inside the horizon the backdrop is swallowed, around it sits a thin
 * photon ring. Rendered at reduced resolution (it is soft) and ~30 fps.
 */

export const INTRO = 3.2; // seconds: supernova, shock wave, hole forming

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;      // canvas size in pixels
uniform vec2 uCenter;   // hole centre in pixels (y down)
uniform float uScale;   // pixels per CSS px
uniform float uHole;    // horizon radius in CSS px
uniform float uTime;
uniform float uDark;
uniform float uIntro;    // seconds since the supernova (>= INTRO: settled)
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

// Backdrop at q (CSS px): soft dust bands in the palette plus faint specks.
// Returns premultiplied colour and coverage.
vec4 backdrop(vec2 q, float stars) {
  vec2 p = q * 0.006 + vec2(uTime * 0.012, -uTime * 0.006);
  float n = fbm(p + fbm(p * 1.7 + uTime * 0.01) * 1.4);
  // Soft clouds plus thin filaments (ridges), which show the lensing.
  float ridge = 1.0 - abs(fbm(p * 2.2 + 5.0) * 2.0 - 1.0);
  float band = smoothstep(0.45, 0.85, n) * 0.7 + pow(ridge, 6.0) * 0.6;
  float hue = smoothstep(0.4, 0.7, fbm(p * 0.6 + 3.1));
  // Specks: one per 10 px cell, few of them lit. Soft and at least ~2 px
  // across, so they stay steady on the half-resolution canvas instead of
  // popping in and out as the backdrop turns.
  vec2 cell = floor(q / 10.0);
  float h = hash(cell);
  vec2 off = vec2(hash(cell + 7.1), hash(cell + 3.7)) * 4.0 - 2.0;
  float speck = step(0.978, h) * stars
              * smoothstep(2.4, 0.4, length(fract(q / 10.0) * 10.0 - 5.0 - off));
  // Twinkle: each star fades in and out on its own slow rhythm (1-3 s),
  // and is fully off for part of it.
  float rate = 0.6 + hash(cell + 1.3) * 1.6;
  float tw = 0.5 + 0.5 * sin(uTime * rate + hash(cell + 9.1) * 6.283);
  speck *= smoothstep(0.25, 0.85, tw);
  if (uDark > 0.5) {
    vec3 tint = mix(uC2, mix(uC1, uC3, hue), 0.6);
    float a = band * 0.22 + speck * 0.5;
    vec3 col = mix(tint, vec3(1.0), speck);
    return vec4(col * a, a);
  }
  // Light theme: like ink on the beige, in the slate of the text with a
  // touch of the logo's purple; dark specks.
  vec3 ink = mix(vec3(0.16, 0.22, 0.24), vec3(0.36, 0.2, 0.36), hue * 0.6);
  float a = band * 0.3 + speck * 0.3;
  return vec4(ink * a, a);
}

void main() {
  vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 d = (px - uCenter) / uScale;          // CSS px from the centre
  float r = max(length(d), 1e-3);
  // Intro: a supernova flashes, its shock wave runs outwards, then the hole
  // grows out of the centre and the lensing sets in (form 0 -> 1).
  float t = uIntro;
  float form = smoothstep(0.6, 2.4, t);
  float shockR = 1100.0 * (1.0 - exp(-t * 1.3));
  float shock = exp(-pow((r - shockR) / (25.0 + 50.0 * t), 2.0))
              * exp(-t * 0.9) * (1.0 - smoothstep(2.4, 3.2, t));
  // The shock front pushes the dust outwards a little.
  d *= 1.0 - 0.25 * shock;
  float hole = uHole * form;
  float E = hole * 1.9;                      // Einstein radius
  float bend = E * E / (r * r);
  // Swirl: frame dragging, strongest near the hole. The twist itself only
  // sways a little; the motion is a uniform rotation of the whole backdrop,
  // so the structure never winds up into fine rings over time.
  float ang = bend * (1.6 + 0.25 * sin(uTime * 0.11)) + uTime * 0.045;
  float c = cos(ang);
  float s = sin(ang);
  vec2 dr = vec2(c * d.x - s * d.y, s * d.x + c * d.y);
  vec2 q = uCenter / uScale + dr * (1.0 - bend);
  // Stars vanish where the lens squeezes them (they would only shimmer).
  vec4 col = backdrop(q, 1.0 - smoothstep(0.12, 0.5, bend));
  // Light (or ink) piles up close to the hole (lensing magnification).
  col *= 1.0 + 0.8 * smoothstep(E * 2.0, E * 0.9, r + 1e-3);
  // Before the supernova the dust is faint; the blast lights it up.
  col *= mix(0.25, 1.0, smoothstep(0.1, 2.2, t)) + 1.6 * shock;

  // Photon ring and horizon.
  float ring = exp(-pow((r - hole * 1.5) / (max(hole, 1.0) * 0.12), 2.0)) * form;
  vec3 ringCol = mix(uC1, uC3, 0.5 + 0.5 * sin(atan(d.y, d.x) * 2.0 + uTime * 0.4));
  // Light theme: a thin bright ring, lighter than the beige.
  float ringA = ring * (uDark > 0.5 ? 0.45 : 0.55);
  vec3 ringRgb = uDark > 0.5 ? mix(ringCol, vec3(1.0), 0.35) : mix(ringCol, vec3(1.0), 0.75);
  col = col * (1.0 - ringA) + vec4(ringRgb * ringA, ringA);
  float horizon = smoothstep(hole * 1.05, hole * 0.85, r) * step(0.01, form);
  // Dark theme: nearly black; light theme: the deep slate of the text.
  vec3 holeRgb = uDark > 0.5 ? vec3(0.03, 0.03, 0.035) : vec3(0.1, 0.13, 0.14);
  float holeA = horizon * (uDark > 0.5 ? 0.92 : 0.95);
  col = col * (1.0 - holeA) + vec4(holeRgb * holeA, holeA);

  // Supernova: a white-hot core that blooms and fades, and the shock ring
  // (light in the dark theme, ink in the light theme).
  float flash = smoothstep(0.0, 0.1, t) * exp(-t * 1.6);
  float core = exp(-r * r / pow(150.0 + 320.0 * t, 2.0)) * flash;
  vec3 hot = mix(vec3(1.0), mix(uC1, uC3, 0.5), smoothstep(0.0, 1.0, r / (200.0 + 360.0 * t)));
  float coreA = min(core * (uDark > 0.5 ? 1.1 : 0.9), 0.95);
  col = col * (1.0 - coreA) + vec4(hot * coreA, coreA);
  vec3 shockRgb = uDark > 0.5
    ? mix(uC1, vec3(1.0), 0.4)
    : vec3(0.16, 0.22, 0.24);
  float shockA = shock * (uDark > 0.5 ? 0.55 : 0.35);
  col = col * (1.0 - shockA) + vec4(shockRgb * shockA, shockA);
  // Fade out towards the canvas edges (left: the text).
  vec2 uv = px / uRes;
  float fade = smoothstep(0.25, 0.55, uv.x) * smoothstep(0.0, 0.1, uv.y) * smoothstep(1.0, 0.85, uv.y);
  gl_FragColor = col * fade;
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s) || "shader");
  }
  return s;
}

/** Returns { resize, draw, setPalette, dispose } or null without WebGL. */
export function createBlackHole(canvas) {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  const u = {};
  for (const name of [
    "uRes",
    "uCenter",
    "uScale",
    "uHole",
    "uTime",
    "uDark",
    "uIntro",
    "uC1",
    "uC2",
    "uC3",
  ]) {
    u[name] = gl.getUniformLocation(program, name);
  }
  const palette = [
    [0.05, 0.8, 0.45],
    [0.45, 0.52, 0.66],
    [0.8, 0.35, 0.72],
  ];
  let scale = 1;

  return {
    // w, h: canvas pixels; s: canvas pixels per CSS px.
    resize(w, h, s) {
      canvas.width = w;
      canvas.height = h;
      scale = s;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(u.uRes, w, h);
      gl.uniform1f(u.uScale, s);
    },
    // cx, cy, hole: CSS px.
    // intro: seconds since the supernova started (INTRO or more: settled).
    draw(time, dark, cx, cy, hole, intro = INTRO) {
      gl.uniform1f(u.uIntro, Math.min(intro, INTRO));
      gl.uniform1f(u.uTime, time);
      gl.uniform1f(u.uDark, dark ? 1 : 0);
      gl.uniform2f(u.uCenter, cx * scale, cy * scale);
      gl.uniform1f(u.uHole, hole);
      gl.uniform3fv(u.uC1, palette[0]);
      gl.uniform3fv(u.uC2, palette[1]);
      gl.uniform3fv(u.uC3, palette[2]);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    setPalette(colours) {
      colours.forEach((c, i) => {
        if (c && c.length === 3 && c.every(Number.isFinite)) palette[i] = c;
      });
    },
    dispose() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
