import React from "react";
import { compareModels } from "./stats";
import useUrlState from "./useUrlState";
import { Chapter, Slider, Stat, pct, pts } from "./ui";
import styles from "./EvalLab.module.css";

const DEFAULTS = { a: 0.7, b: 0.73, n: 200, k: 1, icc: 0.5, rho: 0.5, m: 1, mr: 0 };

const PRESETS = [
  { label: "Leaderboard gap", values: { a: 0.82, b: 0.84, n: 500, k: 1, icc: 0.5, rho: 0.6, m: 1, mr: 0 } },
  { label: "Small agent eval", values: { a: 0.6, b: 0.7, n: 40, k: 1, icc: 0.4, rho: 0.4, m: 1, mr: 0 } },
  { label: "Same eval, 5 runs", values: { a: 0.6, b: 0.7, n: 40, k: 5, icc: 0.4, rho: 0.4, m: 1, mr: 0 } },
  { label: "Questions per document", values: { a: 0.7, b: 0.75, n: 300, k: 1, icc: 0.5, rho: 0.5, m: 10, mr: 0.3 } },
];

function DifferenceChart({ result, unpaired }) {
  const span = Math.max(0.05, Math.abs(unpaired.ciLow), Math.abs(unpaired.ciHigh), Math.abs(result.delta) * 1.2);
  const W = 600;
  const x = (v) => 40 + ((v + span) / (2 * span)) * (W - 80);
  const ticks = [-span, -span / 2, 0, span / 2, span];
  return (
    <svg className={styles.chart} viewBox={`0 0 ${W} 130`} role="img"
      aria-label={`Difference ${pts(result.delta)}, 95% interval ${pts(result.ciLow)} to ${pts(result.ciHigh)}`}>
      <line className={styles.axis} x1={40} x2={W - 40} y1={100} y2={100} />
      {ticks.map((t) => (
        <text key={t} className={styles.tick} x={x(t)} y={122} textAnchor="middle">{pts(t, 0)}</text>
      ))}
      <line className={styles.zero} x1={x(0)} x2={x(0)} y1={6} y2={100} />
      <text className={styles.tick} x={40} y={16}>unpaired, 95%</text>
      <line className={styles.ciUnpaired} x1={x(unpaired.ciLow)} x2={x(unpaired.ciHigh)} y1={28} y2={28} />
      <text className={styles.tick} x={40} y={56}>same tasks (paired), 95%</text>
      <line className={styles.ci} x1={x(result.ciLow)} x2={x(result.ciHigh)} y1={72} y2={72} />
      <circle className={styles.point} cx={x(result.delta)} cy={72} r={6} />
    </svg>
  );
}

export default function SampleSizeChapter({ number }) {
  const [s, set, setAll] = useUrlState("ss.", DEFAULTS);
  const params = { pA: s.a, pB: s.b, n: s.n, k: s.k, icc: s.icc, rho: s.rho, clusterSize: s.m, clusterCorrelation: s.mr };
  const result = compareModels(params);
  const unpaired = compareModels({ ...params, rho: 0 });
  const needed = Number.isFinite(result.tasksFor80Power) ? result.tasksFor80Power.toLocaleString("en-US") : "n/a";
  const neededUnpaired = Number.isFinite(unpaired.tasksFor80Power) ? unpaired.tasksFor80Power.toLocaleString("en-US") : "n/a";

  return (
    <Chapter
      number={number}
      title="Is model B really better than model A?"
      lead="A benchmark score is a sample, not a fact. Set two accuracies and the size of your eval. The bar shows the 95% interval for the difference, and whether the gap could be noise."
    >
      <div className={styles.presets}>
        {PRESETS.map((p) => (
          <button key={p.label} type="button" className={styles.preset} onClick={() => setAll(p.values)}>
            {p.label}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        <Slider label="Model A accuracy" value={s.a} min={0.01} max={0.99} step={0.01} onChange={set("a")} format={(v) => pct(v, 0)} />
        <Slider label="Model B accuracy" value={s.b} min={0.01} max={0.99} step={0.01} onChange={set("b")} format={(v) => pct(v, 0)} />
        <Slider label="Tasks in the eval" value={s.n} min={10} max={2000} step={10} onChange={set("n")} />
        <Slider label="Runs per task" value={s.k} min={1} max={16} step={1} onChange={set("k")}
          hint="Averaging repeated runs only removes run-to-run noise, not task-to-task differences." />
        <Slider label="Task difficulty spread" value={s.icc} min={0} max={0.95} step={0.05} onChange={set("icc")} format={(v) => v.toFixed(2)}
          hint="0: every task equally hard. Near 1: tasks are either always solved or never." />
        <Slider label="Shared difficulty between models" value={s.rho} min={0} max={0.95} step={0.05} onChange={set("rho")} format={(v) => v.toFixed(2)}
          hint="How strongly the models’ success rates per task move together. Comparing on the same tasks uses this." />
      </div>

      <details className={styles.advanced}>
        <summary>Tasks that come in groups</summary>
        <div className={styles.grid}>
          <Slider label="Tasks per group" value={s.m} min={1} max={30} step={1} onChange={set("m")}
            hint="For example several questions about one document or repository." />
          <Slider label="Correlation within a group" value={s.mr} min={0} max={0.9} step={0.05} onChange={set("mr")} format={(v) => v.toFixed(2)}
            hint="Grouped tasks carry less information than their count suggests." />
        </div>
      </details>

      <div className={styles.result}>
        <p className={`${styles.verdict} ${result.significant ? styles.verdictOk : styles.verdictNo}`}>
          {result.significant
            ? `The ${pts(result.delta)} gap is distinguishable from noise at 95%.`
            : `The ${pts(result.delta)} gap could be noise. The 95% interval includes zero.`}
        </p>
        <DifferenceChart result={result} unpaired={unpaired} />
        <div className={styles.stats}>
          <Stat value={`± ${(1.96 * result.se * 100).toFixed(1)} pts`} label="95% margin on the difference" />
          <Stat value={pct(result.power, 0)} label="Chance this eval detects the gap (power)" />
          <Stat value={pct(result.rankFlip, 1)} label="Chance the ranking comes out the wrong way round" />
          <Stat value={needed} label={`Tasks for 80% power (unpaired: ${neededUnpaired})`} />
        </div>
      </div>
    </Chapter>
  );
}
