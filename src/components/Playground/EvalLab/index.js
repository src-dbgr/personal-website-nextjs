import React, { useEffect, useRef, useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";
import SampleSizeChapter from "./SampleSizeChapter";
import PassKChapter from "./PassKChapter";
import RankingChapter from "./RankingChapter";
import HowItWorks from "./HowItWorks";
import styles from "./EvalLab.module.css";

// To add a chapter: build a component that takes { number }, keeps its settings
// with useUrlState under its own prefix, and append it here.
const CHAPTERS = [
  { id: "sample-size", Component: SampleSizeChapter },
  { id: "rankings", Component: RankingChapter },
  { id: "pass-k", Component: PassKChapter },
];

const SOURCES = [
  { label: "Anthropic, A statistical approach to model evaluations (2024)", href: "https://www.anthropic.com/research/statistical-approach-to-model-evals" },
  { label: "Anthropic, Demystifying evals for AI agents (2026)", href: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents" },
  { label: "On Randomness in Agentic Evals (2026)", href: "https://arxiv.org/abs/2602.07150" },
  { label: "τ-bench, which introduced pass^k (2024)", href: "https://arxiv.org/abs/2406.12045" },
];

function ShareButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <button type="button" className={styles.shareButton} onClick={share}>
      {copied ? <Check size={16} aria-hidden="true" /> : <LinkIcon size={16} aria-hidden="true" />}
      {copied ? "Link copied" : "Share these settings"}
    </button>
  );
}

export default function EvalLab() {
  return (
    <div className={styles.lab}>
      <p className={styles.intro}>
        Leaderboards report a single number. Every eval result is a sample with an error bar, and an agent
        that solves a task once may not solve it twice. Move the sliders to see when a difference between two
        models is real, how many tasks you need, and why capability and reliability are different numbers.
        Everything runs in your browser.
      </p>
      <div className={styles.toolbar}>
        <ShareButton />
      </div>
      {CHAPTERS.map(({ id, Component }, i) => (
        <Component key={id} number={i + 1} />
      ))}
      <HowItWorks />
      <div className={styles.sources}>
        <strong>Method and sources.</strong> Scores are modelled as task-level averages of independent
        attempts, with normal-approximation intervals and paired differences, following the Anthropic
        recommendations below. Treat results for very small evals or accuracies near 0% or 100% as rough.
        <ul>
          {SOURCES.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noreferrer">{s.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
