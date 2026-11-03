// Pure statistics for the Eval Lab. No React, no DOM: everything here is unit tested
// in stats.test.mjs and can be reused by later chapters.
//
// Model: a benchmark has N tasks. Each task i has a true success probability p_i
// drawn around the mean accuracy p. "Task heterogeneity" (icc) is the share of the
// per-attempt variance p(1-p) that comes from differences between tasks, so
// Var(p_i) = icc * p(1-p). Each task is attempted k times (independent Bernoulli
// trials given p_i), and the task score is the mean of its k attempts.
// Reference: Miller, "Adding Error Bars to Evals" (Anthropic, 2024).

const Z95 = 1.959963984540054;
const Z80_POWER = 0.8416212335729143;

// Abramowitz-Stegun 7.1.26 has ~1e-7 error, enough for display and for tests.
export function normalCdf(x) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2);
  const poly =
    t *
    (0.254829592 +
      t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const erf = 1 - poly * Math.exp(-(x * x) / 2);
  return x >= 0 ? (1 + erf) / 2 : (1 - erf) / 2;
}

// Variance of one task's score (mean of k attempts) around the benchmark mean.
export function taskScoreVariance(p, icc, k) {
  const total = p * (1 - p);
  return total * (icc + (1 - icc) / k);
}

// Design effect when tasks come in groups that share context (e.g. several
// questions about one document): variance grows by 1 + (m - 1) * rho.
export function designEffect(clusterSize = 1, clusterCorrelation = 0) {
  return 1 + Math.max(0, clusterSize - 1) * clusterCorrelation;
}

// Standard error of one model's benchmark score.
export function scoreStandardError({ p, n, k = 1, icc = 0, clusterSize = 1, clusterCorrelation = 0 }) {
  const v = taskScoreVariance(p, icc, k) * designEffect(clusterSize, clusterCorrelation);
  return Math.sqrt(v / n);
}

// Variance of the per-task score difference between two models evaluated on the
// same tasks. rho is the correlation of the two models' true per-task success rates
// (how much they find the same tasks hard); it applies to the between-task part only,
// so it keeps its meaning when the number of runs changes. rho = 0 is the unpaired case.
export function differenceVariance({ pA, pB, k = 1, icc = 0, rho = 0 }) {
  const tA = pA * (1 - pA);
  const tB = pB * (1 - pB);
  const between = icc * tA + icc * tB - 2 * rho * icc * Math.sqrt(tA * tB);
  const within = ((1 - icc) * (tA + tB)) / k;
  return Math.max(0, between + within);
}

// Full comparison of model B against model A on n shared tasks.
export function compareModels({ pA, pB, n, k = 1, icc = 0, rho = 0, clusterSize = 1, clusterCorrelation = 0 }) {
  const delta = pB - pA;
  const de = designEffect(clusterSize, clusterCorrelation);
  const variance = differenceVariance({ pA, pB, k, icc, rho }) * de;
  const se = Math.sqrt(variance / n);
  const z = se > 0 ? Math.abs(delta) / se : Infinity;
  return {
    delta,
    se,
    ciLow: delta - Z95 * se,
    ciHigh: delta + Z95 * se,
    // Two-sided test at alpha = 0.05.
    power: se > 0 ? normalCdf(z - Z95) + normalCdf(-z - Z95) : 1,
    // Chance that the observed ranking of the two models is the wrong way round.
    rankFlip: se > 0 && delta !== 0 ? normalCdf(-z) : 0,
    significant: Math.abs(delta) > Z95 * se,
    tasksFor80Power:
      delta !== 0 ? Math.ceil(((Z95 + Z80_POWER) ** 2 * variance) / (delta * delta)) : Infinity,
  };
}

// Beta(a, b) with mean p and Var(p_i) = icc * p(1-p), i.e. a + b = 1/icc - 1.
export function betaParams(p, icc) {
  const s = 1 / icc - 1;
  return { a: p * s, b: (1 - p) * s };
}

// pass@k: at least one of k attempts succeeds. pass^k: all k attempts succeed.
// With icc = 0 every task has the same p and these reduce to 1-(1-p)^k and p^k.
export function passAtK(p, k, icc = 0) {
  if (icc <= 0) return 1 - (1 - p) ** k;
  if (icc >= 1) return p;
  const { a, b } = betaParams(p, icc);
  let failAll = 1;
  for (let j = 0; j < k; j += 1) failAll *= (b + j) / (a + b + j);
  return 1 - failAll;
}

export function passHatK(p, k, icc = 0) {
  if (icc <= 0) return p ** k;
  if (icc >= 1) return p;
  const { a, b } = betaParams(p, icc);
  let all = 1;
  for (let j = 0; j < k; j += 1) all *= (a + j) / (a + b + j);
  return all;
}
