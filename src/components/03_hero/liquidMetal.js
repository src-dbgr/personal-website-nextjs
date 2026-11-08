/**
 * Liquid-metal renderer for one hero word (see LiquidWord.js).
 *
 * A small WebGL canvas per word, no three.js: a 2D fragment shader fakes the
 * look of a MeshPhysicalMaterial (metalness 1, low roughness, clearcoat,
 * thin-film iridescence) on a surface that is
 *   - inflated from a blurred glyph mask (rounded chrome edges),
 *   - rippled by domain-warped simplex noise (slow flow), with edges that
 *     flow a little.
 * The surface reflects a procedural environment: aurora bands in three
 * colours from CSS (--liquid-c1..3) plus a few softboxes; the oil film
 * shimmers in the same colours. Finally every colour is mapped into
 * a luminance range that keeps at least 3:1 contrast to the hero background
 * (light theme: dark "black chrome", dark theme: bright chrome).
 *
 * Coordinates are the shape's own units, y down: font units (1000 per em,
 * baseline 0) for the hero words, 1000 units across for the logo triangle.
 * `box` is the shape's bounding box in those units; the canvas covers it
 * plus PAD on every side.
 */

export const PAD = 80; // font units around the word for the flow at the edges
const RIM = 24; // font units, darker chrome rim in the light theme (~1 px at 80 px)
const BLUR = 46; // font units, inflation profile
const HOLE_EDGE = 6; // units, chamfer around cut-out holes
const MAX_HITS = 3;
export const HIT_LIFE = 1.8; // seconds a click wobble lasts
const FRAME_IDLE_MS = 32; // ~30 fps while only flowing

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uMask;   // r: sharp shape, g: blurred, b: eroded (rim), a: 0 in cut-out holes
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform vec2 uOrigin;      // font units of the canvas' top-left corner
uniform vec2 uSize;        // font units covered by the canvas
uniform vec2 uCenter;      // centre of the shape (camera target)
uniform float uTime;
uniform float uDark;
uniform vec4 uHits[${MAX_HITS}]; // click: x, y, start time, strength
uniform float uHitScale;   // size of the click wave in shape units (1 = logo)
uniform vec4 uLum;         // fixed luminance band: dark min/max, light min/max (max 0: off in that theme)
uniform float uRim;        // strength of the light-theme rim (0..1)
uniform float uHitTempo;   // speed of the click wave and wobble (1 = logo)

vec4 permute(vec4 x){ return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  vec3 ns = (1.0 / 7.0) * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// Liquid surface height (font units) at p, with a precomputed domain warp.
float flow(vec2 p, vec2 warp) {
  vec2 q = p * 0.0016 + warp * 0.9;
  return snoise(vec3(q, uTime * 0.22)) * 14.0
       + snoise(vec3(q * 2.1 + 7.1, uTime * 0.31)) * 3.0;
}

float inflate(vec2 uv) {
  float g = texture2D(uMask, uv).g;
  return g * g * (3.0 - 2.0 * g) * 85.0;
}

float boxLight(vec2 d, vec2 c, vec2 s) {
  vec2 q = abs(d - c) - s;
  return 1.0 - smoothstep(0.0, 0.06, max(q.x, q.y));
}

// Procedural environment, direction d with y up.
vec3 env(vec3 d) {
  float y = d.y;
  vec3 col = mix(vec3(0.02, 0.02, 0.025), vec3(0.85, 0.87, 0.9),
                 smoothstep(-0.25, 0.65, y));
  col += vec3(0.35) * smoothstep(-0.6, -1.0, y);
  float a = d.x * 1.6 + snoise(vec3(d.xy * 1.3, uTime * 0.05)) * 0.7;
  col += uC1 * smoothstep(0.24, 0.0, abs(y - 0.32 - 0.14 * sin(a * 2.1))) * 0.55;
  col += uC2 * smoothstep(0.22, 0.0, abs(y + 0.02 - 0.18 * sin(a * 1.3 + 1.0))) * 0.45;
  col += uC3 * smoothstep(0.22, 0.0, abs(y + 0.38 - 0.12 * sin(a * 1.7 + 2.0))) * 0.45;
  col += vec3(2.6) * boxLight(d.xy, vec2(-0.42, 0.58), vec2(0.20, 0.07));
  col += vec3(1.8) * boxLight(d.xy, vec2(0.48, 0.30), vec2(0.06, 0.22));
  col += vec3(1.2) * boxLight(d.xy, vec2(0.05, 0.86), vec2(0.30, 0.04));
  return col;
}

// Click response: a damped ring wave runs out from the click point (it
// lifts the surface and ripples the outline as it passes) while the whole
// shape wobbles briefly like jelly. Returns the displacement; the extra
// height goes to hitH.
vec2 hitWobble(vec2 p, out float hitH) {
  vec2 disp = vec2(0.0);
  hitH = 0.0;
  for (int i = 0; i < ${MAX_HITS}; i++) {
    vec4 h = uHits[i];
    float a = (uTime - h.z) * uHitTempo;
    if (h.w > 0.0 && a > 0.0 && a < ${HIT_LIFE.toFixed(1)}) {
      vec2 dir = p - h.xy;
      float d = length(dir) / uHitScale;
      dir /= max(length(dir), 1.0);
      float front = d - a * 650.0;
      float ring = sin(front * 0.022) * exp(-front * front / 40000.0) * exp(-a * 2.4);
      float jelly = exp(-a * 3.2);
      disp += dir * ring * 12.0 * h.w;
      disp.x += h.w * 11.0 * sin(a * 13.0) * jelly * sin((p.y - h.y) / uHitScale * 0.005 + 1.0);
      disp.y += h.w * 6.0 * sin(a * 11.0 + 1.0) * jelly * sin((p.x - h.x) / uHitScale * 0.003);
      hitH += ring * 18.0 * h.w;
    }
  }
  hitH *= uHitScale;
  return disp * uHitScale;
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec2 texel = 1.0 / uSize;
  float hitH;
  vec2 hit = hitWobble(uOrigin + vUv * uSize, hitH);
  vec2 uv = vUv - hit * texel;
  vec2 p = uOrigin + uv * uSize;

  // Domain warp, shared by the centre and the two neighbour samples.
  vec2 q = p * 0.0016;
  vec2 warp = vec2(snoise(vec3(q, uTime * 0.1)),
                   snoise(vec3(q + vec2(114.5, 22.1), uTime * 0.1)));

  // Edges flow a little: the glyph mask is read with a small noise offset.
  vec2 edge = vec2(snoise(vec3(p * 0.004, uTime * 0.35)),
                   snoise(vec3(p * 0.004 + 31.7, uTime * 0.35))) * 9.0;
  vec2 outline = uv + edge * texel;
  // Cut-out holes (button label) follow the wave but not the edge flow, so
  // the letters stay crisp.
  float mask = texture2D(uMask, outline).r * texture2D(uMask, uv).a;
  // 0 right at the outline, fading to 1 about RIM inside it.
  float inner = smoothstep(0.7, 0.99, texture2D(uMask, outline).b);
  inner = mix(1.0, inner, uRim);
  if (mask < 0.004) discard;

  float e = 9.0;
  vec2 ex = vec2(e, 0.0);
  vec2 ey = vec2(0.0, e);
  float hitHx;
  float hitHy;
  hitWobble(p + ex, hitHx);
  hitWobble(p + ey, hitHy);
  float h0 = inflate(uv) + flow(p, warp) + hitH;
  float hx = inflate(uv + ex * texel) + flow(p + ex, warp) + hitHx;
  float hy = inflate(uv + ey * texel) + flow(p + ey, warp) + hitHy;
  // y down in font units -> y up for the normal.
  vec3 n = normalize(vec3(-(hx - h0), hy - h0, e * 0.9));

  // Perspective camera in front of the word.
  vec3 cam = vec3(uCenter.x, 0.0, 2600.0);
  vec3 pos = vec3(p.x, -(p.y - uCenter.y), h0);
  vec3 v = normalize(vec3(cam.x - pos.x, cam.y - pos.y, cam.z - pos.z));
  vec3 r = reflect(-v, n);
  float cosV = clamp(dot(n, v), 0.0, 1.0);

  // Thin film (IOR 1.7, 250-750 nm) driven by the flow, like the pens.
  float film = 0.5 + 0.5 * snoise(vec3(q * 0.6 + warp * 0.3, uTime * 0.12));
  float thick = mix(250.0, 750.0, film);
  float sinT2 = (1.0 - cosV * cosV) / (1.7 * 1.7);
  float opd = 2.0 * 1.7 * thick * sqrt(1.0 - sinT2);
  // Interference order cycles through the palette instead of the full
  // rainbow, so the shimmer matches the site's colours.
  float phase = fract(opd / 560.0) * 3.0;
  vec3 irid = phase < 1.0 ? mix(uC1, uC2, smoothstep(0.0, 1.0, phase))
            : phase < 2.0 ? mix(uC2, uC3, smoothstep(1.0, 2.0, phase))
            : mix(uC3, uC1, smoothstep(2.0, 3.0, phase));
  irid *= 1.25;

  vec3 refl = env(r);
  // Rainbow mostly where the surface tilts away (edges).
  float iridAmt = 0.25 + 0.55 * (1.0 - cosV);
  vec3 metal = refl * mix(vec3(0.95), mix(vec3(1.0), irid, 0.6) * 1.1, iridAmt);
  float fres = 0.04 + 0.96 * pow(1.0 - cosV, 5.0);
  vec3 col = aces((metal + refl * fres) * 1.3);

  // Linear-ish luminance mapping for contrast (>= 3:1 to the hero bg).
  vec3 lin = col * col;
  float lum = dot(lin, vec3(0.2126, 0.7152, 0.0722));
  vec2 band = uDark > 0.5 ? uLum.xy : uLum.zw;
  if (band.y > 0.0) {
    // Fixed band (button surface under a label): keeps the label's contrast.
    float target = band.x + (band.y - band.x) * pow(clamp(lum, 0.0, 1.0), 0.8);
    if (uDark > 0.5) {
      lin += vec3(target - lum);
    } else {
      lin *= target / max(lum, 1e-4);
    }
  } else if (uDark > 0.5) {
    float target = 0.25 + 0.75 * lum;
    lin += vec3(target - lum);
  } else {
    // Light theme: a dark chrome rim along the outline stays below the 3:1
    // ceiling (luminance 0.115), so the letters keep their contrast at the
    // edge; inside the rim the metal may be brighter and more colourful.
    lin = max(mix(vec3(lum), lin, 1.6), 0.0);
    lum = max(dot(lin, vec3(0.2126, 0.7152, 0.0722)), 1e-4);
    float l = pow(clamp(lum, 0.0, 1.0), 0.6);
    // Rim just under the 3:1 ceiling (0.085..0.105), not darker than needed.
    float target = mix(0.085 + 0.02 * l, 0.07 + 0.25 * l, inner);
    lin *= target / lum;
  }
  col = sqrt(clamp(lin, 0.0, 1.0));
  gl_FragColor = vec4(col * mask, mask);
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

// Separable box blur, three passes ~ gaussian. In place on a Float32Array.
function blur(src, w, h, radius) {
  const tmp = new Float32Array(src.length);
  const pass = (from, to, len, count, stride, step) => {
    const r = Math.max(1, Math.round(radius));
    const norm = 1 / (2 * r + 1);
    for (let line = 0; line < count; line++) {
      const base = line * stride;
      let sum = 0;
      for (let i = -r; i <= r; i++) {
        sum += from[base + Math.min(len - 1, Math.max(0, i)) * step];
      }
      for (let i = 0; i < len; i++) {
        to[base + i * step] = sum * norm;
        const add = Math.min(len - 1, i + r + 1);
        const sub = Math.max(0, i - r);
        sum += from[base + add * step] - from[base + sub * step];
      }
    }
  };
  for (let k = 0; k < 3; k++) {
    pass(src, tmp, w, h, w, 1);
    pass(tmp, src, h, w, 1, w);
  }
}

/**
 * Creates the renderer on `canvas` for the glyph outline `d` (SVG path data,
 * units) inside `box` ({ x, y, w, h }). Returns null without WebGL.
 */
export function createLiquidMetal(canvas, { d, box, tuning }) {
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
    "uMask",
    "uOrigin",
    "uSize",
    "uCenter",
    "uHits",
    "uHitScale",
    "uHitTempo",
    "uRim",
    "uLum",
    "uTime",
    "uDark",
    "uC1",
    "uC2",
    "uC3",
  ]) {
    u[name] = gl.getUniformLocation(program, name);
  }
  const sizeX = box.w + 2 * PAD;
  const sizeY = box.h + 2 * PAD;
  gl.uniform2f(u.uOrigin, box.x - PAD, box.y - PAD);
  gl.uniform2f(u.uSize, sizeX, sizeY);
  gl.uniform2f(u.uCenter, box.x + box.w / 2, box.y + box.h / 2);
  // Click response: wave size relative to the shape (not to screen pixels,
  // so it looks the same at every font size), tempo and strength.
  const response = {
    scale: 1,
    tempo: 1,
    strength: 1,
    rim: 1,
    bevel: BLUR,
    lum: [0, 0, 0, 0],
    ...tuning,
  };
  gl.uniform1f(u.uHitScale, response.scale);
  gl.uniform1f(u.uHitTempo, response.tempo);
  gl.uniform1f(u.uRim, response.rim);
  gl.uniform4fv(u.uLum, response.lum);
  gl.uniform1i(u.uMask, 0);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const path = new Path2D(d);
  const hits = new Float32Array(MAX_HITS * 4);
  let nextHit = 0;
  const palette = [
    [0.1, 0.8, 0.5],
    [0.1, 0.65, 0.75],
    [0.95, 0.72, 0.3],
  ];

  // (Re)builds the glyph mask for a canvas of w x h device pixels. `holes`
  // (optional) draws shapes in units that are cut out of the metal.
  function resize(w, h, stroke, holes) {
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    const scale = w / sizeX;
    const c2 = document.createElement("canvas");
    c2.width = w;
    c2.height = h;
    const ctx = c2.getContext("2d");
    ctx.setTransform(
      scale,
      0,
      0,
      scale,
      (PAD - box.x) * scale,
      (PAD - box.y) * scale,
    );
    ctx.fillStyle = "#fff";
    ctx.fill(path);
    if (stroke > 0) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = stroke;
      ctx.lineJoin = "round";
      ctx.stroke(path);
    }
    const sharp = ctx.getImageData(0, 0, w, h).data;
    let cut = null;
    if (holes) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.restore();
      ctx.fillStyle = "#fff";
      holes(ctx);
      cut = ctx.getImageData(0, 0, w, h).data;
    }
    const soft = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) soft[i] = sharp[i * 4 + 3] / 255;
    const rim = soft.slice();
    blur(soft, w, h, (response.bevel * scale) / 1.7);
    blur(rim, w, h, (RIM * scale) / 1.9);
    if (cut) {
      // Holes get only a narrow, crisp chamfer (like a punched edge), not
      // the wide bevel, so no soft halo forms around the letters.
      const edge = new Float32Array(w * h);
      for (let i = 0; i < w * h; i++) edge[i] = cut[i * 4 + 3] / 255;
      blur(edge, w, h, (HOLE_EDGE * scale) / 1.7);
      for (let i = 0; i < w * h; i++) {
        soft[i] *= 1 - Math.min(1, edge[i] * 1.6);
      }
    }
    const pixels = new Uint8Array(w * h * 4);
    for (let i = 0; i < w * h; i++) {
      pixels[i * 4] = sharp[i * 4 + 3];
      pixels[i * 4 + 1] = Math.min(255, soft[i] * 255 * 1.15);
      pixels[i * 4 + 2] = rim[i] * 255;
      pixels[i * 4 + 3] = cut ? 255 - cut[i * 4 + 3] : 255;
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      w,
      h,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixels,
    );
  }

  function draw(time, dark) {
    gl.uniform1f(u.uTime, time);
    gl.uniform1f(u.uDark, dark ? 1 : 0);
    gl.uniform3fv(u.uC1, palette[0]);
    gl.uniform3fv(u.uC2, palette[1]);
    gl.uniform3fv(u.uC3, palette[2]);
    gl.uniform4fv(u.uHits, hits);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  // Three colours as [r, g, b] in 0..1 (see --liquid-c1..3 in CSS).
  // A click at client coordinates inside the canvas rect `rect`.
  function hit(rect, clientX, clientY, time) {
    const strength = response.strength;
    const i = nextHit * 4;
    hits[i] = box.x - PAD + ((clientX - rect.left) / rect.width) * sizeX;
    hits[i + 1] = box.y - PAD + ((clientY - rect.top) / rect.height) * sizeY;
    hits[i + 2] = time;
    hits[i + 3] = strength;
    nextHit = (nextHit + 1) % MAX_HITS;
  }

  function setPalette(colours) {
    colours.forEach((c, i) => {
      if (c && c.length === 3 && c.every(Number.isFinite)) palette[i] = c;
    });
  }

  function dispose() {
    gl.deleteTexture(texture);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  }

  return {
    resize,
    draw,
    setPalette,
    hit,
    hitDuration: HIT_LIFE / response.tempo,
    dispose,
  };
}

export const LIQUID_FRAME_IDLE_MS = FRAME_IDLE_MS;
