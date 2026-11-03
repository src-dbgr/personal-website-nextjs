import React, { useId } from "react";
import styles from "./EvalLab.module.css";

export const pct = (x, digits = 1) => `${(x * 100).toFixed(digits)}%`;
export const pts = (x, digits = 1) => `${x >= 0 ? "+" : ""}${(x * 100).toFixed(digits)} pts`;

export function Slider({ label, value, min, max, step, onChange, format = String, hint }) {
  const id = useId();
  return (
    <div className={styles.control}>
      <label htmlFor={id} className={styles.controlLabel}>
        <span>{label}</span>
        <span className={styles.controlValue}>{format(value)}</span>
      </label>
      <input
        id={id}
        className={styles.range}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

export function Stat({ value, label }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

export function Chapter({ number, title, lead, children }) {
  return (
    <section className={styles.chapter}>
      <div className={styles.chapterHeader}>
        <span className={styles.chapterNumber}>{String(number).padStart(2, "0")}</span>
        <h2 className={styles.chapterTitle}>{title}</h2>
      </div>
      {lead && <p className={styles.lead}>{lead}</p>}
      {children}
    </section>
  );
}
