import React, { useEffect, useRef, useState } from "react";
import { MdCheck, MdContentCopy, MdErrorOutline } from "react-icons/md";
import styles from "./EvalLab.module.css";

const COPY_STATES = {
  idle: { label: "Copy explanation", Icon: MdContentCopy },
  copied: { label: "Copied", Icon: MdCheck },
  failed: { label: "Not copied", Icon: MdErrorOutline },
};

function CopyButton({ sourceRef }) {
  const [status, setStatus] = useState("idle");
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    let next = "copied";
    try {
      await navigator.clipboard.writeText(sourceRef.current.innerText.trim());
    } catch {
      next = "failed";
    }
    setStatus(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  };

  const { label, Icon } = COPY_STATES[status];
  return (
    <button type="button" className={styles.copyButton} onClick={copy} aria-label={label} title={label}>
      <Icon aria-hidden="true" />
    </button>
  );
}

const F = ({ children }) => <code className={styles.formula}>{children}</code>;

export default function HowItWorks() {
  const bodyRef = useRef(null);

  return (
    <details className={styles.howItWorks}>
      <summary className={styles.howSummary}>How it works</summary>
      <div className={styles.howToolbar}>
        <CopyButton sourceRef={bodyRef} />
      </div>
      <div ref={bodyRef} className={styles.howBody}>
        <h3>Eval Uncertainty Lab: how it works</h3>
        <p>
          An eval score is a measurement taken on a sample: a finite set of tasks, each attempted a finite
          number of times. Run the same model on a different sample, or simply again, and the number moves.
          This lab makes that movement visible and shows what it means for comparing models and for
          judging an agent&apos;s reliability. Everything is calculated in your browser.
        </p>

        <h4>1. Is model B really better than model A?</h4>
        <p>
          <strong>What it is for.</strong> Deciding whether a gap between two models is real before you act on
          it, and planning how large an eval must be to detect the gap you care about.
        </p>
        <p>
          <strong>The model.</strong> The eval has n tasks. Task i has a true success probability p<sub>i</sub>,
          and the model&apos;s accuracy p is their average. Some tasks are easy and some are hard; &quot;task
          difficulty spread&quot; is the share of the per-attempt variance p(1-p) that comes from those
          differences:
        </p>
        <F>Var(p_i) = spread × p(1 − p)</F>
        <p>Each task is run k times and scored as the average of its runs. The variance of one task&apos;s score is</p>
        <F>v = p(1 − p) × (spread + (1 − spread) / k)</F>
        <p>
          More runs only shrink the second term, the run-to-run noise. Differences between tasks stay, which
          is why more tasks usually help more than more runs.
        </p>
        <p>
          <strong>Comparing two models.</strong> When both models are tested on the same tasks, each task gives a
          paired difference. If the models find the same tasks hard, much of the task-to-task variation
          cancels out. &quot;Shared difficulty&quot; is the correlation r of their true per-task success rates.
          With s<sub>A</sub>² = p<sub>A</sub>(1 − p<sub>A</sub>) and s<sub>B</sub>² = p<sub>B</sub>(1 − p<sub>B</sub>):
        </p>
        <F>Var(d) = spread × (s_A² + s_B² − 2 r s_A s_B) + (1 − spread) × (s_A² + s_B²) / k</F>
        <F>SE = √(Var(d) / n)</F>
        <p>From the standard error, with the observed gap d = p<sub>B</sub> − p<sub>A</sub>:</p>
        <ul>
          <li>95% interval: <F>d ± 1.96 × SE</F>. If it contains zero, the gap could be noise.</li>
          <li>Power, the chance that this eval detects the gap at 95%: <F>Φ(|d|/SE − 1.96) + Φ(−|d|/SE − 1.96)</F></li>
          <li>Chance the ranking comes out the wrong way round: <F>Φ(−|d|/SE)</F></li>
          <li>Tasks needed for 80% power: <F>(1.96 + 0.84)² × Var(d) / d²</F></li>
        </ul>
        <p>
          Φ is the standard normal distribution. &quot;Unpaired&quot; repeats the calculation with r = 0, as if
          the models had been tested on different tasks.
        </p>
        <p>
          <strong>Tasks that come in groups.</strong> Several questions about one document, or several tasks
          from one repository, are not independent. With m tasks per group and a correlation c inside a group,
          the variance grows by the design effect <F>1 + (m − 1) × c</F>.
        </p>
        <p>
          <strong>Example.</strong> The default settings, 70% against 73% on 200 tasks with one run each, give a
          95% margin of ±7.7 points around the 3-point gap. The eval detects such a gap only 12% of the time,
          ranks the two models the wrong way round with a 22% chance, and would need about 2,700 tasks for 80%
          power.
        </p>

        <h4>2. Real leaderboards, with their error bars</h4>
        <p>
          <strong>What it is for.</strong> Reading a public leaderboard the way a statistician would: who can
          actually be told apart, and how sure anyone can be about the order.
        </p>
        <p>
          <strong>The data.</strong> For each benchmark, the twelve highest-scoring models in Epoch AI&apos;s
          Benchmarking Hub, using the latest run per model. Epoch publishes each score with a standard error;
          the lab uses both as published.
        </p>
        <ul>
          <li>95% interval for a model: <F>score ± 1.96 × SE</F></li>
          <li>
            A model cannot be separated from the leader when the gap is smaller than{" "}
            <F>1.96 × √(SE_model² + SE_leader²)</F>
          </li>
          <li>
            &quot;Best&quot; and &quot;Top 3&quot;: the lab draws 20,000 plausible leaderboards, each model&apos;s score
            varying by its standard error, and counts how often each model lands first or in the top three.
            A fixed random seed keeps the numbers stable.
          </li>
        </ul>
        <p>
          <strong>Limits.</strong> Epoch does not publish per-question results, so the models are treated as
          independent. Because they all answered the same questions, the true gaps are somewhat clearer than
          shown, so read the result as a cautious view. The data is a snapshot with its retrieval date shown
          under the chart.
        </p>

        <h4>3. pass@k or pass^k: capability or reliability?</h4>
        <p>
          <strong>What it is for.</strong> Choosing the metric that matches what users experience when an agent
          gets k attempts.
        </p>
        <ul>
          <li>pass@k, at least one of k attempts succeeds: <F>1 − E[(1 − p_i)^k]</F>. It rises with k.</li>
          <li>pass^k, all k attempts succeed: <F>E[p_i^k]</F>. It falls with k.</li>
        </ul>
        <p>
          If every task were equally hard, these would be the textbook formulas <F>1 − (1 − p)^k</F> and{" "}
          <F>p^k</F>. Real tasks differ, so the lab draws task success rates from a Beta distribution with mean p
          and the chosen spread, where the averages have exact closed forms. With spread, easy tasks are solved
          every time and hard tasks almost never, so pass^k stays higher than p^k suggests while pass@k grows
          more slowly. At 75% per attempt and three attempts, the textbook gives 42% for pass^3; with the
          default spread of 0.4 it is 57%.
        </p>
        <p>
          A coding assistant that a developer can rerun lives on pass@k. A customer-facing agent that must
          behave the same way for every user lives on pass^k.
        </p>

        <h4>Assumptions and checks</h4>
        <ul>
          <li>Intervals use the normal approximation. For very small evals or accuracies near 0% or 100%, treat them as rough.</li>
          <li>Runs of the same task are treated as independent, and both models share the same difficulty spread.</li>
          <li>
            The formulas are tested automatically against known values and Monte Carlo simulations of whole
            benchmarks, including paired comparisons, repeated runs and the rank probabilities.
          </li>
          <li>Settings are stored in the page address, so a link reproduces exactly what you see.</li>
        </ul>
      </div>
    </details>
  );
}
