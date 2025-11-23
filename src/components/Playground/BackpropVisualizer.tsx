import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Settings,
  Activity,
  Zap,
  BookOpen,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Sliders,
  Repeat,
  CheckCircle2,
  Code,
  Info,
  HelpCircle,
  Shuffle,
} from "lucide-react";

// --- Types ---
type Matrix3x3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];
type Matrix3x2 = [[number, number], [number, number], [number, number]];
type Vector3 = [number, number, number];
type Vector2 = [number, number];

type NetworkState = {
  inputs: Vector3;
  weights1: Matrix3x3;
  bias1: Vector3;
  weights2: Matrix3x3;
  bias2: Vector3;
  weights3: Matrix3x2;
  bias3: Vector2;
  target: Vector2;
  learningRate: number;
  epoch: number;
  history: HistoryEntry[];
};

type HistoryEntry = {
  epoch: number;
  error: number;
  output: Vector2;
  activations: { l1: Vector3; l2: Vector3 };
  weights1: Matrix3x3;
  weights2: Matrix3x3;
  weights3: Matrix3x2;
  bias1: Vector3;
  bias2: Vector3;
  bias3: Vector2;
  diffs: Vector2;
};

// --- Initial State ---
const INITIAL_STATE: NetworkState = {
  inputs: [0.5, 0.1, 0.8],
  weights1: [
    [0.2, -0.4, 0.1],
    [0.5, 0.1, -0.2],
    [-0.3, 0.2, 0.4],
  ],
  bias1: [0.1, -0.1, 0.0],
  weights2: [
    [0.3, -0.1, 0.2],
    [-0.2, 0.4, -0.3],
    [0.1, -0.2, 0.5],
  ],
  bias2: [0.0, 0.1, -0.1],
  weights3: [
    [0.6, -0.5],
    [-0.4, 0.3],
    [0.2, -0.1],
  ],
  bias3: [0.1, -0.1],
  target: [0.9, 0.2],
  learningRate: 0.1,
  epoch: 0,
  history: [],
};

// --- Math Helpers ---
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
const sigmoidDerivative = (x: number) => x * (1 - x);
const formatNum = (n: number) => n.toFixed(2);
const randW = () => parseFloat((Math.random() * 2 - 1).toFixed(2)); // -1 to 1
const randIn = () => parseFloat(Math.random().toFixed(2)); // 0 to 1
const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

const BackpropVisualizer = () => {
  const [network, setNetwork] = useState<NetworkState>(INITIAL_STATE);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [trainSpeed, setTrainSpeed] = useState(20);
  const [editMode, setEditMode] = useState<"INPUTS" | "WEIGHTS" | "BIASES">(
    "WEIGHTS"
  );
  const [activeTab, setActiveTab] = useState<"L1" | "L2" | "L3">("L1");
  const [expandedLogs, setExpandedLogs] = useState<number[]>([]);

  // --- Calculations ---
  const z1 = [0, 1, 2].map(
    (j) =>
      network.inputs.reduce((s, x, i) => s + x * network.weights1[i][j], 0) +
      network.bias1[j]
  ) as Vector3;
  const a1 = z1.map(sigmoid) as Vector3;
  const z2 = [0, 1, 2].map(
    (j) =>
      a1.reduce((s, h, i) => s + h * network.weights2[i][j], 0) +
      network.bias2[j]
  ) as Vector3;
  const a2 = z2.map(sigmoid) as Vector3;
  const z3 = [0, 1].map(
    (k) =>
      a2.reduce((s, h, i) => s + h * network.weights3[i][k], 0) +
      network.bias3[k]
  ) as Vector2;
  const a3 = z3.map(sigmoid) as Vector2;

  const diffs: Vector2 = [network.target[0] - a3[0], network.target[1] - a3[1]];
  const error = 0.5 * (Math.pow(diffs[0], 2) + Math.pow(diffs[1], 2));

  const showValuesL1 = isTraining || network.epoch > 0 || step >= 2;
  const showValuesL2 = isTraining || network.epoch > 0 || step >= 3;
  const showValuesOut = isTraining || network.epoch > 0 || step >= 4;
  const showLoss = isTraining || network.epoch > 0 || step >= 5;

  const flowL1 = isTraining || (step >= 1 && step < 9);
  const flowL2 = isTraining || (step >= 2 && step < 9);
  const flowOut = isTraining || (step >= 3 && step < 9);

  const isBackprop = step >= 5 && step < 9;
  const inputsLocked = step > 0 || isTraining || network.epoch > 0;

  // --- Steps Definition (Keine Änderung) ---
  const steps = [
    {
      id: "init",
      title: "1. Input Data",
      desc: "Input vector X is loaded. We use normalized data [0, 1] as per best practices. Weights are initialized with small random values (e.g. [-1, 1]) to avoid sigmoid saturation.",
      mathHTML: (
        <span>X = [{network.inputs.map((n) => n.toFixed(2)).join(", ")}]</span>
      ),
    },
    {
      id: "fwd-1",
      title: "2. Forward: Hidden Layer 1",
      desc: "We calculate the weighted sum of inputs plus bias, then apply the Sigmoid activation function.",
      mathHTML: (
        <span>
          A<sup>[1]</sup> = σ(X · W<sup>[1]</sup> + b<sup>[1]</sup>)
        </span>
      ),
    },
    {
      id: "fwd-2",
      title: "3. Forward: Hidden Layer 2",
      desc: "The activated signals from H1 propagate to H2. Again, weighted sums are calculated, biases added, and activations computed.",
      mathHTML: (
        <span>
          A<sup>[2]</sup> = σ(A<sup>[1]</sup> · W<sup>[2]</sup> + b
          <sup>[2]</sup>)
        </span>
      ),
    },
    {
      id: "fwd-3",
      title: "4. Forward: Output Layer",
      desc: "Final calculation to produce the prediction ŷ. Each output node aggregates information from H2.",
      mathHTML: (
        <span>
          ŷ = σ(A<sup>[2]</sup> · W<sup>[3]</sup> + b<sup>[3]</sup>) ={" "}
          <strong style={{ color: "#4ade80" }}>
            [{a3.map((n) => n.toFixed(2)).join(", ")}]
          </strong>
        </span>
      ),
    },
    {
      id: "loss",
      title: "5. Loss Calculation",
      desc: "We measure the total error (MSE) by comparing predictions ŷ against targets y.",
      mathHTML: (
        <span>
          E = ½Σ(y - ŷ)² ={" "}
          <strong style={{ color: "#a78bfa" }}>{error.toFixed(6)}</strong>
        </span>
      ),
    },
    {
      id: "back-1",
      title: "6. Backprop: Output Gradient",
      desc: "We compute the gradient δ at the output. This indicates the direction and magnitude of error for each output node.",
      mathHTML: (
        <span>
          δ<sup>[3]</sup> = (ŷ - y) · σ\'(Z<sup>[3]</sup>)
        </span>
      ),
    },
    {
      id: "back-2",
      title: "7. Backprop: Hidden 2 Gradient",
      desc: "The error is distributed backwards to Hidden Layer 2.",
      mathHTML: (
        <span>
          δ<sup>[2]</sup> = (W<sup>[3]T</sup> · δ<sup>[3]</sup>) · σ'(Z
          <sup>[2]</sup>)
        </span>
      ),
    },
    {
      id: "back-3",
      title: "8. Backprop: Hidden 1 Gradient",
      desc: "The error propagates further back to H1. We now know the gradient for every single neuron in the network.",
      mathHTML: (
        <span>
          δ<sup>[1]</sup> = (W<sup>[2]T</sup> · δ<sup>[2]</sup>) · σ'(Z
          <sup>[1]</sup>)
        </span>
      ),
    },
    {
      id: "update",
      title: "9. Parameter Update",
      desc: "Gradient Descent: All weights and biases are adjusted by subtracting the gradient × learning rate (η). This reduces the error for the next pass.",
      mathHTML: (
        <span>
          W<sub>new</sub> = W - η·∇W, b<sub>new</sub> = b - η·δ
        </span>
      ),
    },
  ];

  const calculateEpoch = (net: NetworkState): NetworkState => {
    const z1_ = [0, 1, 2].map(
      (j) =>
        net.inputs.reduce((s, x, i) => s + x * net.weights1[i][j], 0) +
        net.bias1[j]
    );
    const a1_ = z1_.map(sigmoid);
    const z2_ = [0, 1, 2].map(
      (j) =>
        a1_.reduce((s, h, i) => s + h * net.weights2[i][j], 0) + net.bias2[j]
    );
    const a2_ = z2_.map(sigmoid);
    const z3_ = [0, 1].map(
      (k) =>
        a2_.reduce((s, h, i) => s + h * net.weights3[i][k], 0) + net.bias3[k]
    );
    const a3_ = z3_.map(sigmoid);

    const errs = [net.target[0] - a3_[0], net.target[1] - a3_[1]];
    const currentError = 0.5 * (Math.pow(errs[0], 2) + Math.pow(errs[1], 2));

    const d3 = [
      (a3_[0] - net.target[0]) * sigmoidDerivative(a3_[0]),
      (a3_[1] - net.target[1]) * sigmoidDerivative(a3_[1]),
    ];
    const d2 = a2_.map(
      (_, j) =>
        (d3[0] * net.weights3[j][0] + d3[1] * net.weights3[j][1]) *
        sigmoidDerivative(a2_[j])
    );
    const d1 = a1_.map(
      (_, i) =>
        d2.reduce((s, d, j) => s + d * net.weights2[i][j], 0) *
        sigmoidDerivative(a1_[i])
    );

    const nW3 = net.weights3.map((r) => [...r]) as Matrix3x2;
    const nW2 = net.weights2.map((r) => [...r]) as Matrix3x3;
    const nW1 = net.weights1.map((r) => [...r]) as Matrix3x3;
    const nB3 = [...net.bias3] as Vector2;
    const nB2 = [...net.bias2] as Vector3;
    const nB1 = [...net.bias1] as Vector3;

    for (let i = 0; i < 3; i++) {
      for (let k = 0; k < 2; k++)
        nW3[i][k] -= net.learningRate * d3[k] * a2_[i];
    }
    nB3[0] -= net.learningRate * d3[0];
    nB3[1] -= net.learningRate * d3[1];
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++)
        nW2[i][j] -= net.learningRate * d2[j] * a1_[i];
      nB2[j] -= net.learningRate * d2[j];
    }
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++)
        nW1[i][j] -= net.learningRate * d1[j] * net.inputs[i];
      nB1[j] -= net.learningRate * d1[j];
    }

    return {
      ...net,
      weights1: nW1,
      weights2: nW2,
      weights3: nW3,
      bias1: nB1,
      bias2: nB2,
      bias3: nB3,
      epoch: net.epoch + 1,
      history: [
        {
          epoch: net.epoch + 1,
          error: currentError,
          output: a3_ as Vector2,
          activations: { l1: a1_, l2: a2_ },
          weights1: nW1,
          weights2: nW2,
          weights3: nW3,
          bias1: nB1,
          bias2: nB2,
          bias3: nB3,
          diffs: errs as Vector2,
        },
        ...net.history,
      ].slice(0, 50),
    };
  };

  const performUpdate = () => {
    setNetwork((prev) => calculateEpoch(prev));
    setStep(0);
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying && !isTraining)
      interval = setInterval(
        () => setStep((s) => (s < steps.length - 1 ? s + 1 : s)),
        1500
      );
    return () => clearInterval(interval);
  }, [isPlaying, isTraining]);

  useEffect(() => {
    let interval: any;
    if (isTraining) {
      interval = setInterval(() => {
        setNetwork((prev) => {
          if (prev.history.length > 0 && prev.history[0].error < 0.00001) {
            setIsTraining(false);
            return prev;
          }
          if (prev.epoch >= 10000) {
            setIsTraining(false);
            return prev;
          }
          let tmp = prev;
          const batchSize = Math.max(1, Math.ceil(trainSpeed / 2));
          for (let i = 0; i < batchSize; i++) {
            tmp = calculateEpoch(tmp);
            if (tmp.history[0].error < 0.00001) break;
          }
          return tmp;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isTraining, trainSpeed]);

  const randomizeSelection = () => {
    if (inputsLocked) return;
    if (editMode === "INPUTS") {
      setNetwork({ ...network, inputs: [randIn(), randIn(), randIn()] });
    } else if (editMode === "WEIGHTS") {
      if (activeTab === "L1") {
        const w = network.weights1.map((r) =>
          r.map(() => randW())
        ) as Matrix3x3;
        setNetwork({ ...network, weights1: w });
      } else if (activeTab === "L2") {
        const w = network.weights2.map((r) =>
          r.map(() => randW())
        ) as Matrix3x3;
        setNetwork({ ...network, weights2: w });
      } else {
        const w = network.weights3.map((r) =>
          r.map(() => randW())
        ) as Matrix3x2;
        setNetwork({ ...network, weights3: w });
      }
    } else if (editMode === "BIASES") {
      if (activeTab === "L1") {
        setNetwork({ ...network, bias1: [randW(), randW(), randW()] });
      } else if (activeTab === "L2") {
        setNetwork({ ...network, bias2: [randW(), randW(), randW()] });
      } else {
        setNetwork({ ...network, bias3: [randW(), randW()] });
      }
    }
  };

  const handleParamChange = (
    layer: string,
    r: number,
    c: number,
    val: string
  ) => {
    let v = parseFloat(val);
    if (isNaN(v)) return;

    if (editMode === "INPUTS") v = clamp(v, 0, 1);
    else v = clamp(v, -5, 5);

    if (editMode === "WEIGHTS") {
      if (layer === "L1") {
        const m = network.weights1.map((r) => [...r]) as Matrix3x3;
        m[r][c] = v;
        setNetwork({ ...network, weights1: m });
      }
      if (layer === "L2") {
        const m = network.weights2.map((r) => [...r]) as Matrix3x3;
        m[r][c] = v;
        setNetwork({ ...network, weights2: m });
      }
      if (layer === "L3") {
        const m = network.weights3.map((r) => [...r]) as Matrix3x2;
        m[r][c] = v;
        setNetwork({ ...network, weights3: m });
      }
    } else if (editMode === "BIASES") {
      if (layer === "L1") {
        const b = [...network.bias1] as Vector3;
        b[c] = v;
        setNetwork({ ...network, bias1: b });
      }
      if (layer === "L2") {
        const b = [...network.bias2] as Vector3;
        b[c] = v;
        setNetwork({ ...network, bias2: b });
      }
      if (layer === "L3") {
        const b = [...network.bias3] as Vector2;
        b[c] = v;
        setNetwork({ ...network, bias3: b });
      }
    } else {
      const inp = [...network.inputs] as Vector3;
      inp[c] = v;
      setNetwork({ ...network, inputs: inp });
    }
  };

  const handleTargetChange = (idx: number, val: string) => {
    let v = parseFloat(val);
    if (isNaN(v)) return;
    v = clamp(v, 0, 1);
    const newT = [...network.target] as Vector2;
    newT[idx] = v;
    setNetwork({ ...network, target: newT });
  };

  const handleRateChange = (val: string) => {
    let v = parseFloat(val);
    if (isNaN(v)) return;
    v = clamp(v, 0.001, 1.0);
    setNetwork({ ...network, learningRate: v });
  };

  const toggleLog = (epoch: number) =>
    setExpandedLogs((prev) =>
      prev.includes(epoch) ? prev.filter((e) => e !== epoch) : [...prev, epoch]
    );

  const currentInfo = steps[step];

  // --- Dynamic Labels ---
  const getTabLabel = (layer: "L1" | "L2" | "L3") => {
    if (editMode === "WEIGHTS") {
      if (layer === "L1") return "Input → H1";
      if (layer === "L2") return "H1 → H2";
      return "H2 → Output";
    }
    // Biases
    if (layer === "L1") return "H1 Layer";
    if (layer === "L2") return "H2 Layer";
    return "Output Layer";
  };

  // --- Legend Data (Keine Änderung) ---
  const legendItems = [
    {
      symbol: "Z",
      name: "Pre-activation",
      desc: "The weighted sum of inputs plus bias.",
    },
    {
      symbol: "A",
      name: "Activation (Matrix)",
      desc: "The output of a layer. Capital letters denote matrices/vectors.",
    },
    {
      symbol: "W",
      name: "Weights (Matrix)",
      desc: "Matrix of connection strengths between neurons.",
    },
    {
      symbol: "b",
      name: "Biases",
      desc: "Shift parameter allowing the node to fire even with zero input.",
    },
    {
      symbol: "σ",
      name: "Sigmoid",
      desc: "Activation function 1/(1+e^-x) mapping to (0,1).",
    },
    { symbol: "δ", name: "Gradient", desc: "Error term for backpropagation." },
    {
      symbol: "η",
      name: "Learning Rate (Eta)",
      desc: "Step size for gradient descent.",
    },
    {
      symbol: "∇",
      name: "Nabla",
      desc: "Vector differential operator (Gradient vector). Points in the direction of steepest ascent.",
    },
    { symbol: "[l]", name: "Layer Index", desc: "Layer number [0]..[L]." },
    {
      symbol: "T",
      name: "Transpose",
      desc: "Matrix transposition (swap rows/cols).",
    },
    { symbol: "y", name: "Prediction", desc: "Network output." },
    { symbol: "ŷ", name: "Target", desc: "True value." },
    {
      symbol: "λ",
      name: "Regularization",
      desc: "Penalty term (L2) to prevent overfitting. (Assumed 0 here).",
    },
  ];

  // --- Geometry Helper (Keine Änderung) ---
  const getLineCoords = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    rTarget: number,
    fixedLabelX: number
  ) => {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const x2_short = x2 - Math.cos(angle) * (rTarget + 10);
    const y2_short = y2 - Math.sin(angle) * (rTarget + 10);
    const x1_short = x1 + Math.cos(angle) * 28;
    const y1_short = y1 + Math.sin(angle) * 28;
    const slope = (y2 - y1) / (x2 - x1);
    const ly = y1 + slope * (fixedLabelX - x1);
    return {
      x1: x1_short,
      y1: y1_short,
      x2: x2_short,
      y2: y2_short,
      lx: fixedLabelX,
      ly,
    };
  };

  return (
    <div className="backprop-visualizer-container">
      {/* Styles Block for temporary CSS integration */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Neue CSS-Klassen aus Schritt 1 der letzten Antwort */
            .matrix-input { 
                background: #000; border: 1px solid #333; color: #4ade80; 
                font-family: monospace; text-align: center; border-radius: 4px; 
                width: 60px; padding: 4px; font-size: 0.75rem; transition: border 0.2s; 
            }
            .matrix-input:focus { outline: 1px solid #4ade80; border-color: #4ade80; }
            .matrix-input:disabled { color: #555; border-color: #222; cursor: not-allowed; opacity: 0.5; }
            
            .backprop-tab-btn { padding: 6px 12px; font-size: 9px; font-weight: bold; border-radius: 6px; transition: all 0.2s; background: none; border: none; cursor: pointer; color: rgb(136, 136, 136); text-transform: uppercase; flex-shrink: 0; }
            .backprop-tab-btn.active { background: rgb(51, 51, 51); color: #fff; }
            .backprop-tab-btn.inactive { background: #1f1f1f; color: #888; border: 1px solid #333; }
            
            .legend-item { position: relative; cursor: help; }
            .legend-tooltip { 
              visibility: hidden; position: absolute; bottom: 120%; left: 50%; transform: translateX(-50%);
              background: #1a1a1a; border: 1px solid #444; color: #eee; padding: 0.75rem; border-radius: 6px;
              width: 260px; font-size: 0.75rem; z-index: 50; text-align: left; box-shadow: 0 10px 20px rgba(0,0,0,0.8);
              opacity: 0; transition: opacity 0.2s; pointer-events: none;
            }
            .legend-item:hover .legend-tooltip { visibility: visible; opacity: 1; }
            .legend-tooltip::after { content: ""; position: absolute; top: 100%; left: 50%; margin-left: -5px; border-width: 5px; border-style: solid; border-color: #1a1a1a transparent transparent transparent; }
            
            .layer-box { fill: none; stroke: #333; stroke-width: 1; stroke-dasharray: 4 4; rx: 8; }
            .layer-label { font-family: monospace; font-size: 10px; font-weight: bold; fill: #555; text-anchor: middle; }

            /* Grid und Flex Helfer */
            .backprop-flex-col-1 { display: flex; flex-direction: column; gap: 0.25rem; align-items: center; }
            .backprop-flex-gap-1 { display: flex; gap: 0.25rem; align-items: center; }
            .backprop-flex-gap-2 { display: flex; gap: 0.5rem; align-items: center; }
            .backprop-tab-group { display: flex; background-color: rgb(17, 17, 17); padding: 4px; border-radius: 8px; border: 1px solid rgb(51, 51, 51); gap: 4px; }
            .backprop-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
            .backprop-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
            
            @keyframes slideInFromTop {
              from { transform: translateY(-10px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            .animate-in { animation: slideInFromTop 0.3s ease-out; }
          `,
        }}
      />

      {/* SECTION 1: DEFINITION */}
      <div className="backprop-section">
        <div className="backprop-header">
          <Code size={14} /> Definition
        </div>
        <div className="backprop-card" style={{ fontSize: "0.875rem" }}>
          <div className="backprop-grid-2" style={{ gap: "2rem" }}>
            <div>
              <h3 className="backprop-h3">
                <BookOpen size={16} /> Algorithm: Backpropagation
              </h3>
              <div
                style={{
                  lineHeight: 1.5,
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <span
                    style={{
                      color: "#a78bfa",
                      fontWeight: "bold",
                      minWidth: "60px",
                    }}
                  >
                    INPUT:
                  </span>{" "}
                  <span>Training set (X, ŷ), Rate η</span>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      color: "#4ade80",
                      fontWeight: "bold",
                      marginBottom: "0.25rem",
                    }}
                  >
                    1. Forward Pass
                  </div>
                  <div
                    style={{ paddingLeft: "1rem", color: "rgb(156, 163, 175)" }}
                  >
                    <div>
                      Z<sup>[l]</sup> = A<sup>[l-1]</sup> · W<sup>[l]</sup> + b
                      <sup>[l]</sup>
                    </div>
                    <div>
                      A<sup>[l]</sup> = σ(Z<sup>[l]</sup>)
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      color: "#4ade80",
                      fontWeight: "bold",
                      marginBottom: "0.25rem",
                    }}
                  >
                    2. Compute Loss
                  </div>
                  <div
                    style={{ paddingLeft: "1rem", color: "rgb(156, 163, 175)" }}
                  >
                    E = ½ ∑(y - ŷ)²
                  </div>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      color: "#4ade80",
                      fontWeight: "bold",
                      marginBottom: "0.25rem",
                    }}
                  >
                    3. Backward Pass
                  </div>
                  <div
                    style={{ paddingLeft: "1rem", color: "rgb(156, 163, 175)" }}
                  >
                    <div>
                      δ<sup>[L]</sup> = (y<sup>[L]</sup> - ŷ) · σ'(Z
                      <sup>[L]</sup>){" "}
                      <span
                        style={{ color: "rgb(75, 85, 99)", fontSize: "10px" }}
                      >
                        (Output)
                      </span>
                    </div>
                    <div>
                      δ<sup>[l]</sup> = (W<sup>[l+1]T</sup> · δ<sup>[l+1]</sup>)
                      · σ'(Z<sup>[l]</sup>){" "}
                      <span
                        style={{ color: "rgb(75, 85, 99)", fontSize: "10px" }}
                      >
                        (Hidden)
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      color: "#4ade80",
                      fontWeight: "bold",
                      marginBottom: "0.25rem",
                    }}
                  >
                    4. Update
                  </div>
                  <div
                    style={{ paddingLeft: "1rem", color: "rgb(156, 163, 175)" }}
                  >
                    <div>
                      W<sup>[l]</sup> ← W<sup>[l]</sup> - η · δ<sup>[l]</sup> ·
                      (A<sup>[l-1]</sup>)<sup>T</sup>
                    </div>
                    <div>
                      b<sup>[l]</sup> ← b<sup>[l]</sup> - η · δ<sup>[l]</sup>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="backprop-h3">
                <Info size={16} /> Interactive Legend
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.75rem",
                  fontSize: "0.75rem",
                  color: "rgb(156, 163, 175)",
                }}
              >
                {legendItems.map((item) => (
                  <div
                    key={item.symbol}
                    className="legend-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      position: "relative",
                      cursor: "help",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "bold",
                        width: "2rem",
                        height: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "0.15rem",
                        fontSize: "10px",
                        color: ["Z", "A", "y"].includes(item.symbol)
                          ? "#4ade80"
                          : ["W", "b", "T", "[l]", "L", "∇"].includes(
                              item.symbol
                            )
                          ? "#fff"
                          : ["δ", "σ"].includes(item.symbol)
                          ? "#a78bfa"
                          : item.symbol === "η"
                          ? "#60a5fa"
                          : "rgb(107, 114, 128)",
                        backgroundColor: ["Z", "A", "y"].includes(item.symbol)
                          ? "rgba(74, 222, 128, 0.1)"
                          : ["W", "b", "T", "[l]", "L", "∇"].includes(
                              item.symbol
                            )
                          ? "rgba(255, 255, 255, 0.1)"
                          : ["δ", "σ"].includes(item.symbol)
                          ? "rgba(167, 139, 250, 0.1)"
                          : item.symbol === "η"
                          ? "rgba(96, 165, 250, 0.1)"
                          : "rgb(31, 41, 55)",
                      }}
                    >
                      {item.symbol}
                    </span>
                    <span>{item.name}</span>
                    <div className="legend-tooltip">
                      <strong
                        style={{
                          color: "#fff",
                          display: "block",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {item.name}
                      </strong>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "0.75rem",
                  backgroundColor: "rgb(26, 26, 26)",
                  borderRadius: "6px",
                  border: "1px solid rgb(51, 51, 51)",
                  fontSize: "10px",
                  color: "rgb(107, 114, 128)",
                  lineHeight: 1.5,
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                <HelpCircle
                  size={14}
                  style={{ flexShrink: 0, marginTop: "2px" }}
                />
                <div>
                  <strong
                    style={{
                      color: "rgb(156, 163, 175)",
                      display: "block",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Regularization (λ):
                  </strong>{" "}
                  This visualizer focuses on core mechanics (assuming λ=0). In
                  practice, L2 regularization (+ λ/2m ∑W²) prevents overfitting.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: FLOW DIAGRAM */}
      <div className="backprop-section">
        <div className="backprop-header">
          <Activity size={14} /> Flow Diagram
        </div>
        <div
          className="backprop-card"
          style={{
            backgroundColor: "rgb(21, 21, 21)",
            position: "relative",
            overflow: "hidden",
            minHeight: "10rem",
          }}
        >
          <div
            className="backprop-grid-4"
            style={{ position: "relative", zIndex: 10, gap: "1rem" }}
          >
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid rgb(51, 51, 51)",
                fontFamily: "monospace",
                fontSize: "0.75rem",
                color: "rgb(110, 231, 158)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "6rem",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  color: "rgb(156, 163, 175)",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem",
                }}
              >
                1. Forward
              </div>
              <div>
                Z = A·W+b
                <br />A = σ(Z)
              </div>
            </div>
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid rgb(51, 51, 51)",
                fontFamily: "monospace",
                fontSize: "0.75rem",
                color: "rgb(110, 231, 158)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "6rem",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  color: "rgb(156, 163, 175)",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem",
                }}
              >
                2. Loss
              </div>
              E = ½Σ(y-ŷ)²
            </div>
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid rgb(51, 51, 51)",
                fontFamily: "monospace",
                fontSize: "0.75rem",
                color: "rgb(192, 132, 252)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "6rem",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  color: "rgb(156, 163, 175)",
                  textTransform: "uppercase",
                  marginBottom: "0.25rem",
                }}
              >
                3. Backward
              </div>
              δ = (y-ŷ)·σ'
            </div>
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "0.75rem",
                borderRadius: "6px",
                border: "1px solid rgb(51, 51, 51)",
                fontFamily: "monospace",
                fontSize: "0.75rem",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "6rem",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "9px",
                    color: "rgb(156, 163, 175)",
                    textTransform: "uppercase",
                    marginBottom: "0.25rem",
                  }}
                >
                  4. Update
                </div>
                W -= η·∇W
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "10px",
                  color: "rgb(107, 114, 128)",
                  alignSelf: "flex-end",
                }}
              >
                <Repeat size={10} /> Loop
              </div>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              opacity: 0.3,
            }}
          >
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 1000 160"
              preserveAspectRatio="none"
            >
              <path
                d="M 900 110 C 900 140, 100 140, 100 110"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="5 5"
              />
              <path d="M 95 110 L 100 105 L 105 110 Z" fill="white" />
            </svg>
          </div>
        </div>
      </div>

      {/* SECTION 3: CONFIG & STEP */}
      <div className="backprop-section">
        <div className="backprop-grid-2" style={{ gap: "1.5rem" }}>
          <div
            className="backprop-card"
            style={{
              backgroundColor: "rgb(21, 21, 21)",
              padding: "1.25rem",
              height: "auto",
            }}
          >
            <div className="backprop-header">
              <Settings size={14} /> Configuration
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "10px",
                      color: "rgb(156, 163, 175)",
                      fontWeight: "bold",
                      marginBottom: "0.25rem",
                      display: "block",
                    }}
                  >
                    TARGETS (ŷ)
                  </label>
                  <div className="backprop-flex-gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      className="matrix-input"
                      style={{ width: "100%" }}
                      value={network.target[0]}
                      onChange={(e) => handleTargetChange(0, e.target.value)}
                      disabled={inputsLocked}
                    />
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      className="matrix-input"
                      style={{ width: "100%" }}
                      value={network.target[1]}
                      onChange={(e) => handleTargetChange(1, e.target.value)}
                      disabled={inputsLocked}
                    />
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "10px",
                      color: "rgb(156, 163, 175)",
                      fontWeight: "bold",
                      marginBottom: "0.25rem",
                      display: "block",
                    }}
                  >
                    RATE η (0-1)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.001"
                    max="1"
                    className="matrix-input"
                    style={{ width: "100%" }}
                    value={network.learningRate}
                    onChange={(e) => handleRateChange(e.target.value)}
                    disabled={inputsLocked}
                  />
                </div>
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.75rem",
                      color: "rgb(156, 163, 175)",
                      fontWeight: "bold",
                    }}
                  >
                    PARAMETERS
                  </label>
                  <div className="backprop-tab-group">
                    <button
                      onClick={() => setEditMode("INPUTS")}
                      className={`backprop-tab-btn ${
                        editMode === "INPUTS" ? "active" : "inactive"
                      }`}
                    >
                      Inputs
                    </button>
                    <button
                      onClick={() => setEditMode("WEIGHTS")}
                      className={`backprop-tab-btn ${
                        editMode === "WEIGHTS" ? "active" : "inactive"
                      }`}
                    >
                      Weights
                    </button>
                    <button
                      onClick={() => setEditMode("BIASES")}
                      className={`backprop-tab-btn ${
                        editMode === "BIASES" ? "active" : "inactive"
                      }`}
                    >
                      Biases
                    </button>
                  </div>
                  <button
                    onClick={randomizeSelection}
                    disabled={inputsLocked}
                    className="backprop-randomize-btn"
                    title="Randomize Values"
                    style={{ opacity: inputsLocked ? 0.6 : 1 }}
                  >
                    <Shuffle size={12} /> Randomize Values
                  </button>
                </div>
                {/* FIX: Feste Höhe, Rechteck und Zentrierung */}
                <div className="backprop-params-area">
                  {editMode !== "INPUTS" && (
                    <div
                      className="backprop-flex-gap-2"
                      style={{ marginBottom: "1rem" }}
                    >
                      <button
                        onClick={() => setActiveTab("L1")}
                        className={`backprop-tab-btn ${
                          activeTab === "L1" ? "active" : "inactive"
                        }`}
                      >
                        {getTabLabel("L1")}
                      </button>
                      <button
                        onClick={() => setActiveTab("L2")}
                        className={`backprop-tab-btn ${
                          activeTab === "L2" ? "active" : "inactive"
                        }`}
                      >
                        {getTabLabel("L2")}
                      </button>
                      <button
                        onClick={() => setActiveTab("L3")}
                        className={`backprop-tab-btn ${
                          activeTab === "L3" ? "active" : "inactive"
                        }`}
                      >
                        {getTabLabel("L3")}
                      </button>
                    </div>
                  )}
                  {/* ANPASSUNG: Inputs Matrizen (Jetzt zentriert durch parent-Klasse) */}
                  {editMode === "INPUTS" && (
                    <div className="backprop-flex-col-1">
                      <div
                        className="backprop-flex-gap-2"
                        style={{ justifyContent: "center" }}
                      >
                        {network.inputs.map((v, i) => (
                          <div key={i} style={{ textAlign: "center" }}>
                            <div
                              style={{
                                fontSize: "9px",
                                color: "rgb(156, 163, 175)",
                                marginBottom: "0.25rem",
                              }}
                            >
                              x{i + 1}
                            </div>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="1"
                              className="matrix-input"
                              value={Number(v).toFixed(2)}
                              onChange={(e) =>
                                handleParamChange("L1", 0, i, e.target.value)
                              }
                              disabled={inputsLocked}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* ANPASSUNG: Weights Matrizen (Jetzt linksbündig in der zentrierten Box) */}
                  {editMode === "WEIGHTS" && activeTab === "L1" && (
                    <div
                      className="backprop-flex-col-1"
                      style={{ alignItems: "flex-start" }}
                    >
                      {network.weights1.map((r, i) => (
                        <div key={i} className="matrix-input-row">
                          <span
                            style={{
                              fontSize: "9px",
                              width: "1.5rem",
                              color: "rgb(156, 163, 175)",
                              textAlign: "right",
                            }}
                          >
                            x{i + 1}
                          </span>
                          {r.map((v, j) => (
                            <input
                              key={j}
                              type="number"
                              step="0.1"
                              className="matrix-input"
                              value={Number(v).toFixed(2)}
                              onChange={(e) =>
                                handleParamChange("L1", i, j, e.target.value)
                              }
                              disabled={inputsLocked}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                  {editMode === "WEIGHTS" && activeTab === "L2" && (
                    <div
                      className="backprop-flex-col-1"
                      style={{ alignItems: "flex-start" }}
                    >
                      {network.weights2.map((r, i) => (
                        <div key={i} className="matrix-input-row">
                          <span
                            style={{
                              fontSize: "9px",
                              width: "1.5rem",
                              color: "rgb(156, 163, 175)",
                              textAlign: "right",
                            }}
                          >
                            h1_{i + 1}
                          </span>
                          {r.map((v, j) => (
                            <input
                              key={j}
                              type="number"
                              step="0.1"
                              className="matrix-input"
                              value={Number(v).toFixed(2)}
                              onChange={(e) =>
                                handleParamChange("L2", i, j, e.target.value)
                              }
                              disabled={inputsLocked}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                  {editMode === "WEIGHTS" && activeTab === "L3" && (
                    <div
                      className="backprop-flex-col-1"
                      style={{ alignItems: "flex-start" }}
                    >
                      {network.weights3.map((r, i) => (
                        <div key={i} className="matrix-input-row">
                          <span
                            style={{
                              fontSize: "9px",
                              width: "1.5rem",
                              color: "rgb(156, 163, 175)",
                              textAlign: "right",
                            }}
                          >
                            h2_{i + 1}
                          </span>
                          {r.map((v, j) => (
                            <input
                              key={j}
                              type="number"
                              step="0.1"
                              className="matrix-input"
                              value={Number(v).toFixed(2)}
                              onChange={(e) =>
                                handleParamChange("L3", i, j, e.target.value)
                              }
                              disabled={inputsLocked}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                  {/* ANPASSUNG: Biases Matrizen (Jetzt zentriert durch parent-Klasse) */}
                  {editMode === "BIASES" && activeTab === "L1" && (
                    <div className="backprop-flex-gap-2">
                      {network.bias1.map((v, i) => (
                        <div key={i} style={{ textAlign: "center" }}>
                          <div
                            style={{
                              fontSize: "9px",
                              color: "rgb(156, 163, 175)",
                            }}
                          >
                            h1_{i + 1}
                          </div>
                          <input
                            type="number"
                            step="0.1"
                            className="matrix-input"
                            value={Number(v).toFixed(2)}
                            onChange={(e) =>
                              handleParamChange("L1", 0, i, e.target.value)
                            }
                            disabled={inputsLocked}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {editMode === "BIASES" && activeTab === "L2" && (
                    <div className="backprop-flex-gap-2">
                      {network.bias2.map((v, i) => (
                        <div key={i} style={{ textAlign: "center" }}>
                          <div
                            style={{
                              fontSize: "9px",
                              color: "rgb(156, 163, 175)",
                            }}
                          >
                            h2_{i + 1}
                          </div>
                          <input
                            type="number"
                            step="0.1"
                            className="matrix-input"
                            value={Number(v).toFixed(2)}
                            onChange={(e) =>
                              handleParamChange("L2", 0, i, e.target.value)
                            }
                            disabled={inputsLocked}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {editMode === "BIASES" && activeTab === "L3" && (
                    <div className="backprop-flex-gap-2">
                      {network.bias3.map((v, i) => (
                        <div key={i} style={{ textAlign: "center" }}>
                          <div
                            style={{
                              fontSize: "9px",
                              color: "rgb(156, 163, 175)",
                            }}
                          >
                            y{i + 1}
                          </div>
                          <input
                            type="number"
                            step="0.1"
                            className="matrix-input"
                            value={Number(v).toFixed(2)}
                            onChange={(e) =>
                              handleParamChange("L3", 0, i, e.target.value)
                            }
                            disabled={inputsLocked}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setNetwork(INITIAL_STATE);
                  setStep(0);
                }}
                className="backprop-action-btn-main backprop-reset-btn"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  color: "rgb(156, 163, 175)",
                  backgroundColor: "rgba(34, 34, 34, 0.5)",
                  marginTop: "1.5rem",
                }}
              >
                <RotateCcw size={16} /> Reset Everything
              </button>
            </div>
          </div>

          <div
            className="backprop-card"
            style={{
              backgroundColor: "rgb(21, 21, 21)",
              padding: "1.5rem",
              height: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "0.5rem",
                  color: isBackprop ? "#a78bfa" : "#4ade80",
                }}
              >
                Step {step + 1}: {isBackprop ? "Backward Pass" : "Forward Pass"}
              </div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#fff",
                  marginBottom: "0.5rem",
                }}
              >
                {currentInfo.title}
              </h2>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "rgb(156, 163, 175)",
                  marginBottom: "1rem",
                  lineHeight: 1.5,
                }}
              >
                {currentInfo.desc}
              </p>
              <div className="backprop-math">{currentInfo.mathHTML}</div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                marginTop: "1.5rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid rgb(34, 34, 34)",
              }}
            >
              <button
                className="backprop-action-btn-main"
                style={{
                  padding: "0.75rem",
                  flexShrink: 0,
                  color: "rgb(156, 163, 175)",
                }}
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={isTraining}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="backprop-action-btn-main"
                style={{ flex: 1, padding: "0.75rem", color: "#fff" }}
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={isTraining}
              >
                {isPlaying ? (
                  <Pause size={20} fill="white" />
                ) : (
                  <Play size={20} fill="white" />
                )}
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isPlaying ? "Pause" : "Play Steps"}
                </span>
              </button>
              <button
                className="backprop-action-btn-main"
                style={{
                  padding: "0.75rem",
                  flexShrink: 0,
                  color: "rgb(156, 163, 175)",
                }}
                onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
                disabled={isTraining}
              >
                <ChevronRight size={20} />
              </button>
              {step === steps.length - 1 && (
                <button
                  className="backprop-action-btn-main backprop-update-btn"
                  onClick={performUpdate}
                  disabled={isTraining}
                >
                  Update Params
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: NETWORK (Full Width) */}
      <div className="backprop-section">
        <div
          className="backprop-card"
          style={{
            backgroundColor: "rgb(21, 21, 21)",
            position: "relative",
            height: "550px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.8)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "1rem",
              left: "1.5rem",
              display: "flex",
              gap: "1.5rem",
              zIndex: 10,
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <div
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                  boxShadow: "0 0 10px #10b981",
                }}
              ></div>
              <span
                style={{
                  fontSize: "10px",
                  color: "rgb(156, 163, 175)",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  letterSpacing: "0.1em",
                }}
              >
                Forward
              </span>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <div
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  borderRadius: "50%",
                  backgroundColor: "#8b5cf6",
                  boxShadow: "0 0 10px #8b5cf6",
                }}
              ></div>
              <span
                style={{
                  fontSize: "10px",
                  color: "rgb(156, 163, 175)",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  letterSpacing: "0.1em",
                }}
              >
                Backprop
              </span>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "1.5rem",
              right: "1.5rem",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgb(51, 51, 51)",
              padding: "1rem",
              borderRadius: "8px",
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.8)",
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "rgb(107, 114, 128)",
                textTransform: "uppercase",
                fontWeight: "bold",
                marginBottom: "0.25rem",
                textAlign: "right",
              }}
            >
              Total Loss (MSE)
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontFamily: "monospace",
                fontWeight: "bold",
                color: "#a78bfa",
                textAlign: "right",
              }}
            >
              {error.toFixed(6)}
            </div>
          </div>

          <svg
            viewBox="0 0 800 500"
            style={{ width: "100%", height: "100%", userSelect: "none" }}
          >
            <defs>
              <marker
                id="arrow-fwd"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L9,3 z" fill="#4ade80" />
              </marker>
              <marker
                id="arrow-back"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L9,3 z" fill="#a78bfa" />
              </marker>
              <marker
                id="arrow-idle"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L9,3 z" fill="#666" />
              </marker>
            </defs>

            {/* LAYER BOXES */}
            <rect
              x="50"
              y="50"
              width="60"
              height="360"
              rx="8"
              className="layer-box"
            />
            <text x="80" y="430" className="layer-label">
              X (Input)
            </text>
            <rect
              x="250"
              y="50"
              width="60"
              height="360"
              rx="8"
              className="layer-box"
            />
            <text x="280" y="430" className="layer-label">
              A^[1] (H1)
            </text>
            <rect
              x="450"
              y="50"
              width="60"
              height="360"
              rx="8"
              className="layer-box"
            />
            <text x="480" y="430" className="layer-label">
              A^[2] (H2)
            </text>
            <rect
              x="650"
              y="80"
              width="60"
              height="300"
              rx="8"
              className="layer-box"
            />
            <text x="680" y="400" className="layer-label">
              A^[3] (Output)
            </text>

            {/* CONNECTIONS */}
            {[0, 1, 2].map((_, i) =>
              [0, 1, 2].map((j) => {
                let { x1, y1, x2, y2, lx, ly } = getLineCoords(
                  80,
                  100 + i * 120,
                  280,
                  100 + j * 120,
                  28,
                  130
                );
                const back = isBackprop && step >= 7;
                if (back) {
                  let t = { x: x1, y: y1 };
                  x1 = x2;
                  y1 = y2;
                  x2 = t.x;
                  y2 = t.y;
                }
                const fwd = flowL1;
                const stroke = back ? "#a78bfa" : fwd ? "#4ade80" : "#333";
                const markerEnd = back
                  ? "url(#arrow-back)"
                  : fwd
                  ? "url(#arrow-fwd)"
                  : "url(#arrow-idle)";
                return (
                  <g key={`w1-${i}-${j}`}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={stroke}
                      strokeWidth={back || fwd ? 1.5 : 0.5}
                      opacity={back || fwd ? 1 : 0.6}
                      markerEnd={markerEnd}
                    />
                    <rect
                      x={lx - 14}
                      y={ly - 7}
                      width="28"
                      height="14"
                      rx="3"
                      fill="#0f0f0f"
                      stroke={stroke}
                      strokeWidth="0.5"
                    />
                    <text
                      x={lx}
                      y={ly + 3}
                      textAnchor="middle"
                      fontSize="8"
                      fill={back ? "#fff" : "#666"}
                      fontFamily="monospace"
                    >
                      {network.weights1[i][j].toFixed(2)}
                    </text>
                  </g>
                );
              })
            )}
            {[0, 1, 2].map((i) =>
              [0, 1, 2].map((j) => {
                let { x1, y1, x2, y2, lx, ly } = getLineCoords(
                  280,
                  100 + i * 120,
                  480,
                  100 + j * 120,
                  28,
                  330
                );
                const back = isBackprop && step >= 6;
                if (back) {
                  let t = { x: x1, y: y1 };
                  x1 = x2;
                  y1 = y2;
                  x2 = t.x;
                  y2 = t.y;
                }
                const fwd = flowL2;
                const stroke = back ? "#a78bfa" : fwd ? "#4ade80" : "#333";
                const markerEnd = back
                  ? "url(#arrow-back)"
                  : fwd
                  ? "url(#arrow-fwd)"
                  : "url(#arrow-idle)";
                return (
                  <g key={`w2-${i}-${j}`}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={stroke}
                      strokeWidth={back || fwd ? 1.5 : 0.5}
                      opacity={back || fwd ? 1 : 0.6}
                      markerEnd={markerEnd}
                    />
                    <rect
                      x={lx - 14}
                      y={ly - 7}
                      width="28"
                      height="14"
                      rx="3"
                      fill="#0f0f0f"
                      stroke={stroke}
                      strokeWidth="0.5"
                    />
                    <text
                      x={lx}
                      y={ly + 3}
                      textAnchor="middle"
                      fontSize="8"
                      fill={back ? "#fff" : "#666"}
                      fontFamily="monospace"
                    >
                      {network.weights2[i][j].toFixed(2)}
                    </text>
                  </g>
                );
              })
            )}
            {[0, 1, 2].map((i) =>
              [0, 1].map((k) => {
                let { x1, y1, x2, y2, lx, ly } = getLineCoords(
                  480,
                  100 + i * 120,
                  680,
                  160 + k * 120,
                  36,
                  530
                );
                const back = isBackprop && step >= 5;
                if (back) {
                  let t = { x: x1, y: y1 };
                  x1 = x2;
                  y1 = y2;
                  x2 = t.x;
                  y2 = t.y;
                }
                const fwd = flowOut;
                const stroke = back ? "#a78bfa" : fwd ? "#4ade80" : "#333";
                const markerEnd = back
                  ? "url(#arrow-back)"
                  : fwd
                  ? "url(#arrow-fwd)"
                  : "url(#arrow-idle)";
                return (
                  <g key={`w3-${i}-${k}`}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={stroke}
                      strokeWidth={back || fwd ? 2 : 0.5}
                      opacity={back || fwd ? 1 : 0.6}
                      markerEnd={markerEnd}
                    />
                    <rect
                      x={lx - 14}
                      y={ly - 7}
                      width="28"
                      height="14"
                      rx="3"
                      fill="#0f0f0f"
                      stroke={stroke}
                      strokeWidth="0.5"
                    />
                    <text
                      x={lx}
                      y={ly + 3}
                      textAnchor="middle"
                      fontSize="8"
                      fill={back ? "#fff" : "#666"}
                      fontFamily="monospace"
                    >
                      {network.weights3[i][k].toFixed(2)}
                    </text>
                  </g>
                );
              })
            )}

            {/* NODES */}
            {[0, 1, 2].map((i) => (
              <g key={"in" + i} transform={`translate(80, ${100 + i * 120})`}>
                <circle r="24" fill="#151515" stroke="#333" strokeWidth="2" />
                <text
                  y="0"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="10"
                  fontWeight="bold"
                  dominantBaseline="middle"
                >
                  x{i + 1}
                </text>
                <text
                  y="35"
                  textAnchor="middle"
                  fill="#888"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {network.inputs[i]}
                </text>
              </g>
            ))}
            {[0, 1, 2].map((j) => (
              <g key={"h1" + j} transform={`translate(280, ${100 + j * 120})`}>
                <circle r="28" fill="#151515" />
                <circle
                  r="28"
                  fill={flowL1 ? "rgba(74,222,128,0.1)" : "transparent"}
                  stroke={flowL1 ? "#4ade80" : "#333"}
                  strokeWidth="2"
                />
                <text
                  y="-8"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="10"
                  fontWeight="bold"
                >
                  h1_{j + 1}
                </text>
                <text
                  y="-38"
                  textAnchor="middle"
                  fill="#aaa"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  b:{network.bias1[j].toFixed(1)}
                </text>
                {showValuesL1 && (
                  <text
                    y="12"
                    textAnchor="middle"
                    fill="#4ade80"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {a1[j].toFixed(2)}
                  </text>
                )}
              </g>
            ))}
            {[0, 1, 2].map((j) => (
              <g key={"h2" + j} transform={`translate(480, ${100 + j * 120})`}>
                <circle r="28" fill="#151515" />
                <circle
                  r="28"
                  fill={flowL2 ? "rgba(74,222,128,0.1)" : "transparent"}
                  stroke={flowL2 ? "#4ade80" : "#333"}
                  strokeWidth="2"
                />
                <text
                  y="-8"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="10"
                  fontWeight="bold"
                >
                  h2_{j + 1}
                </text>
                <text
                  y="-38"
                  textAnchor="middle"
                  fill="#aaa"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  b:{network.bias2[j].toFixed(1)}
                </text>
                {showValuesL2 && (
                  <text
                    y="12"
                    textAnchor="middle"
                    fill="#4ade80"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {a2[j].toFixed(2)}
                  </text>
                )}
              </g>
            ))}
            {[0, 1].map((k) => (
              <g key={"out" + k} transform={`translate(680, ${160 + k * 120})`}>
                <circle r="36" fill="#151515" />
                <circle
                  r="36"
                  fill={flowOut ? "rgba(74,222,128,0.1)" : "transparent"}
                  stroke={isBackprop ? "#a78bfa" : flowOut ? "#4ade80" : "#333"}
                  strokeWidth="3"
                />
                <text
                  y="-10"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="14"
                  fontWeight="bold"
                >
                  y{k + 1}
                </text>
                <text
                  y="-48"
                  textAnchor="middle"
                  fill="#aaa"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  b:{network.bias3[k].toFixed(1)}
                </text>
                {showValuesOut && (
                  <text
                    y="15"
                    textAnchor="middle"
                    fill="#4ade80"
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {formatNum(a3[k])}
                  </text>
                )}
                {showLoss && (
                  <g>
                    <text
                      x="0"
                      y="55"
                      textAnchor="middle"
                      fill="#ef4444"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      Err: {Math.abs(network.target[k] - a3[k]).toFixed(3)}
                    </text>
                  </g>
                )}
              </g>
            ))}
            {showLoss &&
              [0, 1].map((k) => (
                <g
                  key={"t" + k}
                  style={{ animation: "slideInFromTop 0.3s ease-out" }}
                  transform={`translate(0, ${k * 120})`}
                >
                  <line
                    x1="720"
                    y1="160"
                    x2="760"
                    y2="160"
                    stroke="#555"
                    strokeDasharray="4"
                  />
                  <rect
                    x="760"
                    y="135"
                    width="40"
                    height="50"
                    rx="4"
                    fill="#1a1a1a"
                    stroke="#444"
                  />
                  <text
                    x="780"
                    y="155"
                    textAnchor="middle"
                    fill="#666"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    TARGET
                  </text>
                  <text
                    x="780"
                    y="175"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {network.target[k]}
                  </text>
                  <text
                    x="740"
                    y="150"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="10"
                    fontWeight="bold"
                    opacity="0.5"
                  >
                    ŷ{k + 1}
                  </text>
                </g>
              ))}
          </svg>
        </div>
      </div>

      {/* SECTION 5: TRAINING PROCESS */}
      <div
        className="backprop-section backprop-card"
        style={{
          backgroundColor: "rgb(21, 21, 21)",
          padding: "1.25rem",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.8)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.75rem",
              fontWeight: "bold",
              color: "#a78bfa",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            <Zap size={14} /> Training Process
          </div>
          {isTraining && (
            <span
              style={{
                animation: "pulse 1.5s infinite",
                fontSize: "10px",
                color: "#4ade80",
                fontWeight: "bold",
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                padding: "2px 8px",
                borderRadius: "4px",
              }}
            >
              RUNNING
            </span>
          )}
          {!isTraining &&
            network.history.length > 0 &&
            network.history[0].error < 0.00001 && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "10px",
                  color: "#4ade80",
                  fontWeight: "bold",
                  backgroundColor: "rgba(16, 185, 129, 0.2)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  border: "1px solid rgba(74, 222, 128, 0.3)",
                }}
              >
                <CheckCircle2 size={10} /> TARGET REACHED
              </span>
            )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1rem",
            backgroundColor: "rgb(17, 17, 17)",
            padding: "0.5rem",
            borderRadius: "8px",
            border: "1px solid rgb(34, 34, 34)",
          }}
        >
          <Sliders size={14} style={{ color: "rgb(107, 114, 128)" }} />
          <span
            style={{
              fontSize: "10px",
              fontWeight: "bold",
              color: "rgb(107, 114, 128)",
              textTransform: "uppercase",
              width: "2.5rem",
            }}
          >
            Speed
          </span>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            style={{
              flex: 1,
              height: "4px",
              backgroundColor: "rgb(55, 65, 81)",
              borderRadius: "9999px",
              appearance: "none",
              cursor: "pointer",
              accentColor: "#a78bfa",
            }}
            value={trainSpeed}
            onChange={(e) => setTrainSpeed(Number(e.target.value))}
          />
          <span
            style={{
              fontSize: "10px",
              fontFamily: "monospace",
              color: "#4ade80",
              width: "2rem",
              textAlign: "right",
            }}
          >
            {trainSpeed}x
          </span>
        </div>
        <div className="backprop-training-btn-wrapper">
          <button
            onClick={() => setIsTraining(!isTraining)}
            className="backprop-training-btn"
            style={{
              padding: "0.75rem 2rem",
              fontSize: "0.875rem",
              fontWeight: "bold",
              transition: "all 0.2s",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
              backgroundColor: isTraining
                ? "rgba(239, 68, 68, 0.1)"
                : "#10b981",
              color: isTraining ? "#f87171" : "white",
              border: isTraining ? "1px solid rgba(239, 68, 68, 0.5)" : "none",
              cursor: "pointer",
            }}
          >
            {isTraining ? "Stop Auto-Training" : "Start Auto-Training"}
          </button>
        </div>
        <div
          style={{
            border: "1px solid rgb(51, 51, 51)",
            borderRadius: "8px",
            overflow: "hidden",
            flex: 1,
            minHeight: "300px",
            backgroundColor: "black",
          }}
        >
          <div
            className="backprop-grid-4"
            style={{
              backgroundColor: "rgb(34, 34, 34)",
              color: "rgb(156, 163, 175)",
              fontSize: "10px",
              textTransform: "uppercase",
              fontWeight: "bold",
              padding: "0.75rem",
              position: "sticky",
              top: 0,
              zIndex: 10,
              alignItems: "center",
            }}
          >
            <div>EPOCH</div>
            <div>OUTPUT</div>
            <div style={{ textAlign: "right" }}>LOSS</div>
            <div style={{ textAlign: "center" }}>INFO</div>
          </div>
          <div style={{ overflowY: "auto", maxHeight: "400px" }}>
            {network.history.length === 0 ? (
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "rgb(107, 114, 128)",
                  fontSize: "0.75rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Activity size={24} style={{ opacity: 0.2 }} />
                No data.
              </div>
            ) : (
              network.history.map((h) => (
                <div
                  key={h.epoch}
                  style={{ borderBottom: "1px solid rgb(34, 34, 34)" }}
                >
                  <div
                    className="backprop-grid-4"
                    style={{
                      padding: "0.75rem",
                      fontSize: "0.75rem",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onClick={() => toggleLog(h.epoch)}
                  >
                    <div
                      style={{
                        color: "rgb(107, 114, 128)",
                        fontFamily: "monospace",
                      }}
                    >
                      #{h.epoch}
                    </div>
                    <div
                      style={{
                        color: "#4ade80",
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        fontSize: "0.65rem",
                      }}
                    >
                      [{h.output[0].toFixed(2)},{h.output[1].toFixed(2)}]
                    </div>
                    <div
                      style={{
                        textAlign: "right",
                        color: "#a78bfa",
                        fontFamily: "monospace",
                        fontWeight: "bold",
                      }}
                    >
                      {h.error.toFixed(5)}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        color: "rgb(107, 114, 128)",
                      }}
                    >
                      {expandedLogs.includes(h.epoch) ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </div>
                  </div>
                  {expandedLogs.includes(h.epoch) && (
                    <div
                      className="animate-in"
                      style={{
                        backgroundColor: "rgb(10, 10, 10)",
                        padding: "1rem",
                        fontSize: "10px",
                        fontFamily: "monospace",
                        borderTop: "1px solid rgb(34, 34, 34)",
                      }}
                    >
                      <div
                        style={{
                          marginBottom: "0.75rem",
                          backgroundColor: "rgb(17, 17, 17)",
                          padding: "0.5rem",
                          borderRadius: "4px",
                          border: "1px solid rgb(34, 34, 34)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            color: "#a78bfa",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          Total Loss: {h.error.toFixed(6)}
                        </span>
                        <span style={{ color: "rgb(107, 114, 128)" }}>
                          Diff: [{Math.abs(h.diffs[0]).toFixed(4)},{" "}
                          {Math.abs(h.diffs[1]).toFixed(4)}]
                        </span>
                      </div>
                      <div style={{ marginBottom: "0.75rem" }}>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "rgb(107, 114, 128)",
                            marginBottom: "0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          NODE ACTIVATIONS
                        </div>
                        <div className="backprop-grid-3">
                          <div
                            style={{
                              backgroundColor: "rgb(21, 21, 21)",
                              padding: "4px",
                              borderRadius: "4px",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                color: "rgb(16, 185, 129)",
                                marginBottom: "0.25rem",
                              }}
                            >
                              H1
                            </div>
                            <div>
                              [
                              {h.activations.l1
                                .map((n) => n.toFixed(2))
                                .join(",")}
                              ]
                            </div>
                          </div>
                          <div
                            style={{
                              backgroundColor: "rgb(21, 21, 21)",
                              padding: "4px",
                              borderRadius: "4px",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                color: "rgb(96, 165, 250)",
                                marginBottom: "0.25rem",
                              }}
                            >
                              H2
                            </div>
                            <div>
                              [
                              {h.activations.l2
                                .map((n) => n.toFixed(2))
                                .join(",")}
                              ]
                            </div>
                          </div>
                          <div
                            style={{
                              backgroundColor: "rgb(21, 21, 21)",
                              padding: "4px",
                              borderRadius: "4px",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                color: "rgb(168, 85, 247)",
                                marginBottom: "0.25rem",
                              }}
                            >
                              OUT
                            </div>
                            <div>
                              [{h.output.map((n) => n.toFixed(2)).join(",")}]
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr",
                          gap: "1rem",
                          marginTop: "1rem",
                          paddingTop: "1rem",
                          borderTop: "1px solid rgb(34, 34, 34)",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              color: "rgb(16, 185, 129)",
                              marginBottom: "0.25rem",
                              fontWeight: "bold",
                              textTransform: "uppercase",
                            }}
                          >
                            <span>L1 Weights (In→H1)</span>
                          </div>
                          {h.weights1.map((r, ri) => (
                            <div
                              key={ri}
                              style={{ color: "rgb(156, 163, 175)" }}
                            >
                              [{r.map((n) => n.toFixed(2)).join(", ")}]
                            </div>
                          ))}
                        </div>
                        <div>
                          <div
                            style={{
                              color: "rgb(96, 165, 250)",
                              marginBottom: "0.25rem",
                              fontWeight: "bold",
                              textTransform: "uppercase",
                            }}
                          >
                            <span>L2 Weights (H1→H2)</span>
                          </div>
                          {h.weights2.map((r, ri) => (
                            <div
                              key={ri}
                              style={{ color: "rgb(156, 163, 175)" }}
                            >
                              [{r.map((n) => n.toFixed(2)).join(", ")}]
                            </div>
                          ))}
                        </div>
                        <div>
                          <div
                            style={{
                              color: "rgb(168, 85, 247)",
                              marginBottom: "0.25rem",
                              fontWeight: "bold",
                              textTransform: "uppercase",
                            }}
                          >
                            <span>L3 Weights (H2→Out)</span>
                          </div>
                          {h.weights3.map((r, ri) => (
                            <div
                              key={ri}
                              style={{ color: "rgb(156, 163, 175)" }}
                            >
                              [{r.map((n) => n.toFixed(2)).join(", ")}]
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackpropVisualizer;
