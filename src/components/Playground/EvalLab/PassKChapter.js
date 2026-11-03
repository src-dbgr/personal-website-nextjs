import React from "react";
import { passAtK, passHatK } from "./stats";
import useUrlState from "./useUrlState";
import { Chapter, Slider, Stat, pct } from "./ui";
import styles from "./EvalLab.module.css";

const DEFAULTS = { p: 0.75, k: 3, icc: 0.4 };
const K_MAX = 10;

function Curves({ p, k, icc }) {
  const W = 600;
  const H = 220;
  const x = (i) => 40 + ((i - 1) / (K_MAX - 1)) * (W - 70);
  const y = (v) => 15 + (1 - v) * (H - 45);
  const ks = Array.from({ length: K_MAX }, (_, i) => i + 1);
  const path = (f) => ks.map((i, j) => `${j ? "L" : "M"}${x(i)},${y(f(i))}`).join(" ");
  return (
    <svg className={styles.chart} viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label={`At k=${k}: pass@k ${pct(passAtK(p, k, icc))}, pass^k ${pct(passHatK(p, k, icc))}`}>
      <line className={styles.axis} x1={40} x2={W - 30} y1={y(0)} y2={y(0)} />
      <line className={styles.axis} x1={40} x2={40} y1={y(1)} y2={y(0)} />
      {[0, 0.5, 1].map((v) => (
        <text key={v} className={styles.tick} x={32} y={y(v) + 4} textAnchor="end">{pct(v, 0)}</text>
      ))}
      {ks.map((i) => (
        <text key={i} className={styles.tick} x={x(i)} y={H - 10} textAnchor="middle">{i}</text>
      ))}
      <line className={styles.marker} x1={x(k)} x2={x(k)} y1={y(1)} y2={y(0)} />
      <path className={styles.lineNaive} d={path((i) => passAtK(p, i))} />
      <path className={styles.lineNaive} d={path((i) => passHatK(p, i))} />
      <path className={styles.lineAt} d={path((i) => passAtK(p, i, icc))} />
      <path className={styles.lineHat} d={path((i) => passHatK(p, i, icc))} />
    </svg>
  );
}

export default function PassKChapter({ number }) {
  const [s, set] = useUrlState("pk.", DEFAULTS);
  const at = passAtK(s.p, s.k, s.icc);
  const hat = passHatK(s.p, s.k, s.icc);
  const naiveHat = passHatK(s.p, s.k);

  return (
    <Chapter
      number={number}
      title="pass@k or pass^k: capability or reliability?"
      lead="pass@k asks whether at least one of k attempts succeeds. pass^k asks whether all k succeed. The same agent looks better with every extra attempt on one and worse on the other. Which one matters depends on the product."
    >
      <div className={styles.grid}>
        <Slider label="Success rate per attempt" value={s.p} min={0.05} max={0.99} step={0.01} onChange={set("p")} format={(v) => pct(v, 0)} />
        <Slider label="Attempts k" value={s.k} min={1} max={K_MAX} step={1} onChange={set("k")} />
        <Slider label="Task difficulty spread" value={s.icc} min={0} max={0.95} step={0.05} onChange={set("icc")} format={(v) => v.toFixed(2)}
          hint="Real tasks differ: some are always solved, some never. That changes both curves." />
      </div>

      <div className={styles.result}>
        <Curves p={s.p} k={s.k} icc={s.icc} />
        <div className={styles.legend}>
          <span><span className={styles.swatch} style={{ borderColor: "var(--clr-green-everywhere)" }} />pass@k, any attempt succeeds</span>
          <span><span className={styles.swatch} style={{ borderColor: "var(--clr-stop-animation)" }} />pass^k, every attempt succeeds</span>
          <span><span className={styles.swatch} style={{ borderTopStyle: "dashed" }} />if all tasks were equally hard</span>
        </div>
        <div className={styles.stats}>
          <Stat value={pct(at)} label={`pass@${s.k}: a human retries until one attempt works`} />
          <Stat value={pct(hat)} label={`pass^${s.k}: ${s.k} users get a correct answer, every time`} />
          <Stat value={pct(naiveHat)} label={`p^${s.k}, the textbook formula, assumes equally hard tasks`} />
          <Stat value={pct(s.p)} label="pass@1, what most leaderboards report" />
        </div>
        <p className={styles.takeaway}>
          A coding assistant that a developer can rerun lives on pass@k. A customer-facing agent that must
          behave the same way for every user lives on pass^k. Report the one your users experience.
        </p>
      </div>
    </Chapter>
  );
}
