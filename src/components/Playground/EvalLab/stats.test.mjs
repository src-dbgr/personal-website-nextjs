// Run with: npm run test:eval-lab
// Checks the closed-form statistics against known values and Monte Carlo simulation.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalCdf,
  scoreStandardError,
  compareModels,
  passAtK,
  passHatK,
  betaParams,
} from "./stats.js";

// Seeded PRNG so failures are reproducible.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function gamma(rand, shape) {
  if (shape < 1) return gamma(rand, shape + 1) * rand() ** (1 / shape);
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x;
    let v;
    do {
      const u1 = rand();
      const u2 = rand();
      x = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = rand();
    if (Math.log(u) < 0.5 * x * x + d - d * v + d * Math.log(v)) return d * v;
  }
}
function beta(rand, a, b) {
  const x = gamma(rand, a);
  return x / (x + gamma(rand, b));
}
function sd(xs) {
  const m = xs.reduce((s, x) => s + x, 0) / xs.length;
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1));
}

test("normalCdf matches known values", () => {
  assert.ok(Math.abs(normalCdf(0) - 0.5) < 1e-7);
  assert.ok(Math.abs(normalCdf(1.959963984540054) - 0.975) < 1e-6);
  assert.ok(Math.abs(normalCdf(-1) - 0.158655254) < 1e-6);
});

test("pass@k and pass^k reduce to the textbook formulas without heterogeneity", () => {
  assert.ok(Math.abs(passHatK(0.75, 3) - 0.421875) < 1e-12); // Anthropic's 75% -> ~42% example
  assert.ok(Math.abs(passAtK(0.75, 3) - (1 - 0.25 ** 3)) < 1e-12);
  assert.equal(passAtK(0.5, 1, 0.4), 0.5);
  assert.equal(passHatK(0.5, 1, 0.4), 0.5);
});

test("pass@k and pass^k with heterogeneous tasks match simulation", () => {
  const rand = rng(7);
  const p = 0.6;
  const icc = 0.4;
  const k = 5;
  const { a, b } = betaParams(p, icc);
  let any = 0;
  let all = 0;
  const N = 200000;
  for (let i = 0; i < N; i += 1) {
    const pi = beta(rand, a, b);
    let wins = 0;
    for (let j = 0; j < k; j += 1) if (rand() < pi) wins += 1;
    if (wins > 0) any += 1;
    if (wins === k) all += 1;
  }
  assert.ok(Math.abs(any / N - passAtK(p, k, icc)) < 0.005);
  assert.ok(Math.abs(all / N - passHatK(p, k, icc)) < 0.005);
});

test("score standard error matches simulation of a whole benchmark", () => {
  const rand = rng(11);
  const cfg = { p: 0.7, n: 200, k: 3, icc: 0.5 };
  const { a, b } = betaParams(cfg.p, cfg.icc);
  const scores = [];
  for (let r = 0; r < 4000; r += 1) {
    let sum = 0;
    for (let i = 0; i < cfg.n; i += 1) {
      const pi = beta(rand, a, b);
      let wins = 0;
      for (let j = 0; j < cfg.k; j += 1) if (rand() < pi) wins += 1;
      sum += wins / cfg.k;
    }
    scores.push(sum / cfg.n);
  }
  const predicted = scoreStandardError(cfg);
  assert.ok(Math.abs(sd(scores) / predicted - 1) < 0.05, `sim ${sd(scores)} vs ${predicted}`);
});

test("paired comparison: shared task difficulty shrinks the error, as simulated", () => {
  const rand = rng(23);
  const n = 150;
  const icc = 0.5;
  const p = 0.6;
  const { a, b } = betaParams(p, icc);
  // Both models face the same task difficulty; each attempt is independent.
  const diffs = [];
  for (let r = 0; r < 4000; r += 1) {
    let sum = 0;
    for (let i = 0; i < n; i += 1) {
      const pi = beta(rand, a, b);
      sum += (rand() < pi ? 1 : 0) - (rand() < pi ? 1 : 0);
    }
    diffs.push(sum / n);
  }
  // Same p_i for both models: their true per-task success rates correlate perfectly.
  const predicted = compareModels({ pA: p, pB: p, n, k: 1, icc, rho: 1 }).se;
  assert.ok(Math.abs(sd(diffs) / predicted - 1) < 0.05, `sim ${sd(diffs)} vs ${predicted}`);
  const unpaired = compareModels({ pA: p, pB: p, n, k: 1, icc, rho: 0 }).se;
  assert.ok(predicted < unpaired);
});

test("paired comparison with several runs per task matches simulation", () => {
  const rand = rng(31);
  const n = 120;
  const k = 4;
  const icc = 0.5;
  const p = 0.55;
  const { a, b } = betaParams(p, icc);
  const diffs = [];
  for (let r = 0; r < 4000; r += 1) {
    let sum = 0;
    for (let i = 0; i < n; i += 1) {
      const pi = beta(rand, a, b);
      let d = 0;
      for (let j = 0; j < k; j += 1) d += (rand() < pi ? 1 : 0) - (rand() < pi ? 1 : 0);
      sum += d / k;
    }
    diffs.push(sum / n);
  }
  const predicted = compareModels({ pA: p, pB: p, n, k, icc, rho: 1 }).se;
  assert.ok(Math.abs(sd(diffs) / predicted - 1) < 0.05, `sim ${sd(diffs)} vs ${predicted}`);
});

test("power and sample size are consistent", () => {
  const cfg = { pA: 0.7, pB: 0.75, k: 1, icc: 0.3, rho: 0.4 };
  const { tasksFor80Power } = compareModels({ ...cfg, n: 100 });
  const atThatSize = compareModels({ ...cfg, n: tasksFor80Power });
  assert.ok(atThatSize.power >= 0.8 && atThatSize.power < 0.81, String(atThatSize.power));
  const flip = compareModels({ ...cfg, n: 100 }).rankFlip;
  assert.ok(flip > 0 && flip < 0.5);
});

test("clustered tasks widen the error by the design effect", () => {
  const base = scoreStandardError({ p: 0.5, n: 100 });
  const clustered = scoreStandardError({ p: 0.5, n: 100, clusterSize: 5, clusterCorrelation: 0.25 });
  assert.ok(Math.abs(clustered / base - Math.sqrt(2)) < 1e-12);
});
