import React, { useMemo } from "react";
import { analyseRanking } from "./stats";
import useUrlState from "./useUrlState";
import { Chapter, pct } from "./ui";
import snapshot from "./data/epochSnapshot.json";
import styles from "./EvalLab.module.css";

const DEFAULTS = { b: 0 };
const Z95 = 1.959963984540054;

function IntervalBar({ model, lo, hi }) {
  const x = (v) => ((v - lo) / (hi - lo)) * 100;
  const left = Math.max(0, model.mean - Z95 * model.stderr);
  const right = Math.min(1, model.mean + Z95 * model.stderr);
  return (
    <svg className={styles.rankBar} viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
      <line className={model.tiedWithLeader ? styles.rankCiTied : styles.rankCi} x1={x(left)} x2={x(right)} y1={5} y2={5} />
      <line className={styles.rankMean} x1={x(model.mean)} x2={x(model.mean)} y1={1} y2={9} />
    </svg>
  );
}

export default function RankingChapter({ number }) {
  const [s, set] = useUrlState("rk.", DEFAULTS);
  const index = Math.min(Math.max(0, Math.round(s.b)), snapshot.benchmarks.length - 1);
  const bench = snapshot.benchmarks[index];
  const ranked = useMemo(() => analyseRanking(bench.models), [bench]);

  const tied = ranked.filter((m) => m.tiedWithLeader).length;
  const leader = ranked[0];
  const lo = Math.max(0, Math.min(...ranked.map((m) => m.mean - Z95 * m.stderr)) - 0.02);
  const hi = Math.min(1, Math.max(...ranked.map((m) => m.mean + Z95 * m.stderr)) + 0.02);

  return (
    <Chapter
      number={number}
      title="Real leaderboards, with their error bars"
      lead="The top models on public benchmarks, with the standard errors Epoch AI publishes. Bars show 95% intervals. The question is not who is first, but who you can actually tell apart."
    >
      <div className={styles.presets} role="group" aria-label="Benchmark">
        {snapshot.benchmarks.map((b, i) => (
          <button
            key={b.id}
            type="button"
            className={`${styles.preset} ${i === index ? styles.presetActive : ""}`}
            aria-pressed={i === index}
            onClick={() => set("b")(i)}
          >
            {b.name}
          </button>
        ))}
      </div>

      <div className={styles.result}>
        <p className={styles.verdict}>
          {tied > 1
            ? `${tied} of the top ${ranked.length} cannot be separated from #1 at 95%.`
            : `The leader is ahead of every other model at 95%.`}{" "}
          {`${leader.model} is truly best with about ${pct(leader.pBest, 0)} probability.`}
        </p>
        <p className={styles.hint}>{bench.note}</p>

        <div className={styles.rankTable}>
          <div className={`${styles.rankRow} ${styles.rankHead}`}>
            <span>Model (Epoch label)</span>
            <span>Score, 95% interval</span>
            <span className={styles.rankNum}>Best</span>
            <span className={styles.rankNum}>Top 3</span>
          </div>
          {ranked.map((m) => (
            <div key={m.model} className={styles.rankRow}>
              <span className={styles.rankName} title={`${m.org}, released ${m.released}, run ${m.runDate}`}>
                <span className={styles.rankLabel}>{m.model}</span>
                <span className={styles.rankScore}>{pct(m.mean)}</span>
              </span>
              <IntervalBar model={m} lo={lo} hi={hi} />
              <span className={styles.rankNum}>{pct(m.pBest, 0)}</span>
              <span className={styles.rankNum}>{pct(m.pTop3, 0)}</span>
            </div>
          ))}
          <div className={`${styles.rankRow} ${styles.rankAxis}`}>
            <span />
            <span className={styles.rankAxisLabels}>
              <span>{pct(lo, 0)}</span>
              <span>{pct(hi, 0)}</span>
            </span>
            <span />
            <span />
          </div>
        </div>

        <div className={styles.legend}>
          <span><span className={styles.swatch} style={{ borderColor: "var(--clr-green-everywhere)" }} />cannot be separated from #1</span>
          <span><span className={styles.swatch} style={{ borderColor: "currentColor" }} />behind #1 at 95%</span>
        </div>
        <p className={styles.takeaway}>
          &quot;Best&quot; and &quot;Top 3&quot; are the chances of each rank if the published scores are taken
          with their error bars. This treats models as independent. Because all of them answered the same
          questions, the real gaps are somewhat clearer than shown, so read this as a cautious view.
        </p>
      </div>

      <p className={styles.attribution}>
        Data:{" "}
        <a href={snapshot.sourceUrl} target="_blank" rel="noreferrer">{snapshot.source}</a>, licensed{" "}
        <a href={snapshot.licenseUrl} target="_blank" rel="noreferrer">{snapshot.license}</a>, retrieved{" "}
        {snapshot.retrieved}. Scores and standard errors as published by Epoch AI, top {ranked.length} per
        benchmark, latest run per model. Intervals and rank probabilities are computed on this page.
      </p>
    </Chapter>
  );
}
