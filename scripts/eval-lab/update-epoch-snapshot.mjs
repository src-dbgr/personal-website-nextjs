// Refreshes the Eval Lab's Epoch AI snapshot from Epoch's benchmark data ZIP.
//
//   1. Download https://epoch.ai/data/benchmark_data.zip
//   2. node scripts/eval-lab/update-epoch-snapshot.mjs path/to/benchmark_data.zip
//
// Epoch AI data is CC BY 4.0 (https://epoch.ai/benchmarks/use-this-data). Only
// aggregate scores and standard errors are kept; no benchmark questions or answers.
// The script stops if Epoch changes the columns, so the tool never ships bad data.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const OUT = "src/components/Playground/EvalLab/data/epochSnapshot.json";
const TOP_N = 12;
const BENCHMARKS = [
  { id: "frontiermath", name: "FrontierMath Tiers 1-3", file: "frontiermath_tiers_1_3_v2.csv", note: "Expert-level maths, private problem set." },
  { id: "simpleqa", name: "SimpleQA Verified", file: "simpleqa_verified.csv", note: "Short factual questions." },
  { id: "gpqa", name: "GPQA Diamond", file: "gpqa_diamond.csv", note: "Graduate-level science questions, close to saturated." },
  { id: "swebench", name: "SWE-bench Verified", file: "swe_bench_verified.csv", note: "Coding tasks from real GitHub issues. Epoch has fewer recent runs here." },
];
const REQUIRED = ["Model version", "mean_score", "stderr", "Release date", "Organization", "Started at"];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows.filter((r) => r.some((v) => v.trim() !== ""));
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

const zip = process.argv[2];
if (!zip) {
  console.error("Usage: node scripts/eval-lab/update-epoch-snapshot.mjs <benchmark_data.zip>");
  process.exit(1);
}

const benchmarks = BENCHMARKS.map(({ file, ...meta }) => {
  const rows = parseCsv(execFileSync("unzip", ["-p", zip, file], { encoding: "utf8", maxBuffer: 50e6 }));
  const missing = REQUIRED.filter((col) => !(col in (rows[0] ?? {})));
  if (rows.length === 0 || missing.length) {
    throw new Error(`${file}: unexpected format, missing ${missing.join(", ") || "rows"}`);
  }
  // Keep the most recent run per model version.
  const latest = new Map();
  for (const r of rows) {
    const mean = Number(r.mean_score);
    const stderr = Number(r.stderr);
    if (!Number.isFinite(mean) || !Number.isFinite(stderr) || r.stderr.trim() === "") continue;
    const prev = latest.get(r["Model version"]);
    if (!prev || r["Started at"] > prev.runDate) {
      latest.set(r["Model version"], {
        model: r["Model version"],
        org: r.Organization,
        released: r["Release date"],
        runDate: r["Started at"].slice(0, 10),
        mean,
        stderr,
      });
    }
  }
  const models = [...latest.values()].sort((a, b) => b.mean - a.mean).slice(0, TOP_N);
  if (models.length < 5) throw new Error(`${file}: only ${models.length} usable models`);
  return { ...meta, models };
});

const snapshot = {
  source: "Epoch AI, Benchmarking Hub",
  sourceUrl: "https://epoch.ai/benchmarks",
  license: "CC BY 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  retrieved: new Date().toISOString().slice(0, 10),
  benchmarks,
};
writeFileSync(OUT, `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Wrote ${OUT}: ${benchmarks.map((b) => `${b.id} ${b.models.length}`).join(", ")}`);
