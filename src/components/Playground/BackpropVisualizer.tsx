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
  preActivations: { l1: Vector3; l2: Vector3; l3: Vector2 };
  deltas: { l1: Vector3; l2: Vector3; l3: Vector2 };
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

// --- New Helper Component for Inputs ---
// This solves the cursor jumping and editing issues
interface SmartInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number;
  onValueChange: (val: string) => void;
  formatter?: (val: number) => string;
}

const SmartNumberInput: React.FC<SmartInputProps> = ({
  value,
  onValueChange,
  formatter,
  ...props
}) => {
  // If no formatter is provided, just use String conversion
  const formatValue = (v: number) => (formatter ? formatter(v) : String(v));

  const [localVal, setLocalVal] = useState(formatValue(value));
  const [isFocused, setIsFocused] = useState(false);

  // Sync with parent value (e.g. from Backprop algorithm),
  // BUT ONLY if we are not currently editing it (to avoid fighting the cursor).
  useEffect(() => {
    if (!isFocused) {
      setLocalVal(formatValue(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalVal(e.target.value);
    onValueChange(e.target.value);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    // On blur, clean up the formatting based on the actual number in state
    setLocalVal(formatValue(value));
    if (props.onBlur) props.onBlur(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  return (
    <input
      {...props}
      value={localVal}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  );
};

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

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Close tooltip when clicking anywhere else
  useEffect(() => {
    const handleGlobalClick = () => setActiveTooltip(null);
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  const handleTriggerClick = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation(); // Prevents the window click listener from firing immediately
    setActiveTooltip((prev) => (prev === symbol ? null : symbol));
  };

  // --- Calculations ---
  // 1. Live-Berechnung (wird gebraucht, wenn man manuell Regler schiebt oder Step 0 ist)
  const z1_live = [0, 1, 2].map(
    (j) =>
      network.inputs.reduce((s, x, i) => s + x * network.weights1[i][j], 0) +
      network.bias1[j]
  ) as Vector3;
  const a1_live = z1_live.map(sigmoid) as Vector3;

  const z2_live = [0, 1, 2].map(
    (j) =>
      a1_live.reduce((s, h, i) => s + h * network.weights2[i][j], 0) +
      network.bias2[j]
  ) as Vector3;
  const a2_live = z2_live.map(sigmoid) as Vector3;

  const z3_live = [0, 1].map(
    (k) =>
      a2_live.reduce((s, h, i) => s + h * network.weights3[i][k], 0) +
      network.bias3[k]
  ) as Vector2;
  const a3_live = z3_live.map(sigmoid) as Vector2;

  const diffs_live: Vector2 = [
    network.target[0] - a3_live[0],
    network.target[1] - a3_live[1],
  ];
  const error_live =
    0.5 * (Math.pow(diffs_live[0], 2) + Math.pow(diffs_live[1], 2));

  // 2. Entscheidung: History-Werte oder Live-Werte?
  // Wenn eine History existiert (Training lief), nehmen wir die Werte aus dem Log.
  // Das verhindert die Diskrepanz zwischen Tabelle und Grafik.
  const useHistory = network.history.length > 0 && network.epoch > 0;
  const latestEntry = network.history[0];

  const a1 = useHistory ? (latestEntry.activations.l1 as Vector3) : a1_live;
  const a2 = useHistory ? (latestEntry.activations.l2 as Vector3) : a2_live;
  const a3 = useHistory ? latestEntry.output : a3_live;
  const error = useHistory ? latestEntry.error : error_live;

  const showValuesL1 = isTraining || network.epoch > 0 || step >= 2;
  const showValuesL2 = isTraining || network.epoch > 0 || step >= 3;
  const showValuesOut = isTraining || network.epoch > 0 || step >= 4;
  const showLoss = isTraining || network.epoch > 0 || step >= 5;

  const flowL1 = isTraining || (step >= 1 && step < 9);
  const flowL2 = isTraining || (step >= 2 && step < 9);
  const flowOut = isTraining || (step >= 3 && step < 9);

  const isBackprop = step >= 5 && step < 9;
  // Logik für violette Färbung beim Backward Pass
  const backPropL3 = isBackprop && step >= 6; // Output Gradients
  const backPropL2 = isBackprop && step >= 7; // H2 Gradients
  const backPropL1 = isBackprop && step >= 8; // H1 Gradients

  const inputsLocked = step > 0 || isTraining || network.epoch > 0;

  // Prüfen, ob sich Daten geändert haben
  const isModified = React.useMemo(() => {
    if (network.epoch > 0) return true; // Training lief bereits
    const s = JSON.stringify;
    return (
      network.learningRate !== INITIAL_STATE.learningRate ||
      s(network.inputs) !== s(INITIAL_STATE.inputs) ||
      s(network.target) !== s(INITIAL_STATE.target) ||
      s(network.weights1) !== s(INITIAL_STATE.weights1) ||
      s(network.bias1) !== s(INITIAL_STATE.bias1) ||
      s(network.weights2) !== s(INITIAL_STATE.weights2) ||
      s(network.bias2) !== s(INITIAL_STATE.bias2) ||
      s(network.weights3) !== s(INITIAL_STATE.weights3) ||
      s(network.bias3) !== s(INITIAL_STATE.bias3)
    );
  }, [network]);

  // --- Steps Definition ---
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
          δ<sup>[3]</sup> = (ŷ - y) · σ'(Z<sup>[3]</sup>)
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
      desc: "Gradient Descent: All weights and biases are adjusted using the gradients calculated. Note that we calculate the outer product of Activation and Delta to match the weight matrix shape.",
      mathHTML: (
        <span>
          {/* VORHER: delta * A_transposed (Falsche Dimension für Row-Major W) */}
          {/* NACHHER: A_transposed * delta (Ergibt Matrix In x Out) */}W
          <sub>new</sub> = W - η · (A<sup>T</sup> · δ), &nbsp; b<sub>new</sub> =
          b - η · δ
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
          preActivations: {
            l1: z1_ as Vector3,
            l2: z2_ as Vector3,
            l3: z3_ as Vector2,
          },
          deltas: { l1: d1 as Vector3, l2: d2 as Vector3, l3: d3 as Vector2 },
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
      // LOGIK FÜR GESCHWINDIGKEIT:

      // 1. Dynamisches Intervall (Delay):
      // Speed 1  -> 1000ms Pause (1 Sekunde pro Schritt)
      // Speed 50 -> 20ms Pause
      // Speed 100 -> 10ms Pause
      const delay = Math.max(10, Math.floor(1000 / trainSpeed));

      // 2. Dynamische Batch Size (Menge pro Schritt):
      // Unter Speed 10 -> Immer nur 1 Epoche (für Zeitlupe)
      // Über Speed 10 -> Die Menge skaliert mit dem Slider
      const batchSize = trainSpeed < 10 ? 1 : Math.ceil(trainSpeed / 2);

      interval = setInterval(() => {
        setNetwork((prev) => {
          // Stop-Conditions prüfen
          if (prev.history.length > 0 && prev.history[0].error < 0.00001) {
            setIsTraining(false);
            return prev;
          }
          if (prev.epoch >= 1000000) {
            setIsTraining(false);
            return prev;
          }

          // Training Loop
          let tmp = prev;
          for (let i = 0; i < batchSize; i++) {
            tmp = calculateEpoch(tmp);
            // Wenn Ziel während des Batches erreicht wird, sofort abbrechen
            if (tmp.history[0].error < 0.00001) break;
          }
          return tmp;
        });
      }, delay);
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
    else v = clamp(v, -2, 2);

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

  const legendItems = [
    {
      symbol: "Z",
      name: (
        <>
          Pre-activation Z<sup>[l]</sup>
        </>
      ),
      desc: (
        <>
          <code>
            Z<sup>[l]</sup>
          </code>{" "}
          is the pre-activation vector for layer <code>l</code>. Computed as{" "}
          <code>
            A<sup>[l-1]</sup> · W<sup>[l]</sup> + b<sup>[l]</sup>
          </code>
          , one scalar per neuron in layer <code>l</code> (same shape as{" "}
          <code>
            A<sup>[l]</sup>
          </code>
          ).
        </>
      ),
    },
    {
      symbol: "A",
      name: (
        <>
          Activation A<sup>[l]</sup>
        </>
      ),
      desc: (
        <>
          <code>
            A<sup>[l]</sup>
          </code>{" "}
          is the activation vector of layer <code>l</code> after applying{" "}
          <code>σ</code> element-wise to{" "}
          <code>
            Z<sup>[l]</sup>
          </code>
          . Its length equals the number of neurons in that layer (
          <code>
            A<sup>[0]</sup> = X
          </code>
          ,{" "}
          <code>
            A<sup>[3]</sup> = ŷ
          </code>{" "}
          in this demo).
        </>
      ),
    },
    {
      symbol: "W",
      name: (
        <>
          Weight matrix W<sup>[l]</sup>
        </>
      ),
      desc: (
        <>
          <code>
            W<sup>[l]</sup>
          </code>{" "}
          is the weight matrix connecting layer <code>l−1</code> to{" "}
          <code>l</code>. Its shape is{" "}
          <code>
            (n<sub>l-1</sub> × n<sub>l</sub>)
          </code>
          , where <code>n</code>
          <sub>l-1</sub> is the number of neurons in the previous layer and{" "}
          <code>n</code>
          <sub>l</sub> is the number of neurons in the current layer. Each entry{" "}
          <code>
            w<sub>ij</sub>
          </code>{" "}
          is the connection strength from neuron <code>i</code> in layer{" "}
          <code>l−1</code> to neuron <code>j</code> in layer <code>l</code>. In
          this demo:{" "}
          <code>
            W<sup>[1]</sup>, W<sup>[2]</sup> ∈ ℝ<sup>3×3</sup>, W<sup>[3]</sup>{" "}
            ∈ ℝ<sup>3×2</sup>.
          </code>
        </>
      ),
    },
    {
      symbol: "b",
      name: (
        <>
          Bias vector b<sup>[l]</sup>
        </>
      ),
      desc: (
        <>
          <code>
            b<sup>[l]</sup>
          </code>{" "}
          is the bias vector for layer <code>l</code>, added to{" "}
          <code>
            Z<sup>[l]</sup>
          </code>{" "}
          before applying <code>σ</code>. Biases control the effective
          “threshold” of each neuron: a more positive bias shifts{" "}
          <code>
            Z<sup>[l]</sup>
          </code>{" "}
          upwards and makes the neuron easier to activate; a more negative bias
          shifts it downwards and makes activation less likely. Without biases,
          all learned decision boundaries would tend to pass through the origin.
          In this visualizer the bias length equals the number of neurons in the
          layer (3 for H1, 3 for H2, 2 for the output layer).
        </>
      ),
    },
    {
      symbol: "σ",
      name: <>Sigmoid σ</>,
      desc: (
        <>
          <code>σ(x)</code> is the sigmoid activation function{" "}
          <code>
            1 / (1 + e<sup>−x</sup>)
          </code>{" "}
          mapping any real value to <code>(0, 1)</code>. Its derivative{" "}
          <code>σ'(x)</code> is used during backpropagation.
        </>
      ),
    },
    {
      symbol: "δ",
      name: (
        <>
          Error signal δ<sup>[l]</sup>
        </>
      ),
      desc: (
        <>
          <code>
            δ<sup>[l]</sup>
          </code>{" "}
          is the delta/error vector for layer <code>l</code>. It has one scalar
          per neuron and measures how much the loss changes with that neuron’s
          pre-activation. It is used to compute gradients for{" "}
          <code>
            W<sup>[l]</sup>
          </code>{" "}
          and{" "}
          <code>
            b<sup>[l]</sup>
          </code>
          .
        </>
      ),
    },
    {
      symbol: "η",
      name: <>Learning rate η</>,
      desc: (
        <>
          <code>η</code> (eta) is a scalar learning rate that scales the
          gradient step in gradient descent. Larger <code>η</code> speeds up
          learning but can cause divergence; smaller <code>η</code> is more
          stable but slower.
        </>
      ),
    },
    {
      symbol: "∇",
      name: <>Gradient ∇E</>,
      desc: (
        <>
          <code>∇E</code> is the gradient of the loss function <code>E</code>{" "}
          with respect to a parameter (for example <code>W</code> or{" "}
          <code>b</code>). In this visualizer <code>E = ½ · Σ (y − ŷ)²</code>{" "}
          (mean squared error over the outputs). The gradient has the same shape
          as the parameter and tells us how much a small change in that
          parameter will change the loss. It points in the direction of steepest
          increase of <code>E</code>, so we update in the opposite direction{" "}
          <code>−∇E</code>.
        </>
      ),
    },
    {
      symbol: "[l]",
      name: <>Layer index [l]</>,
      desc: (
        <>
          <code>[l]</code> denotes the layer index.{" "}
          <code>
            [0] = input X, [1], [2] = hidden layers H1, H2, [3] = output layer
            (ŷ)
          </code>{" "}
          in this visualization.
        </>
      ),
    },
    {
      symbol: "T",
      name: (
        <>
          Transpose (·)<sup>T</sup>
        </>
      ),
      desc: (
        <>
          <code>M</code>
          <sup>T</sup> is the transpose of a matrix <code>M</code>, obtained by
          swapping rows and columns. It is used to match dimensions when
          propagating gradients between layers (e.g.{" "}
          <code>
            W<sup>[l+1]</sup>
          </code>
          <sup>T</sup> · <code>δ</code>).
        </>
      ),
    },
    {
      symbol: "ŷ",
      name: <>Prediction vector ŷ</>,
      desc: (
        <>
          <code>ŷ</code> is the network output vector for the current input{" "}
          <code>X</code>. In this demo it is 2-dimensional:{" "}
          <code>
            ŷ = (ŷ<sub>1</sub>, ŷ<sub>2</sub>)
          </code>
          , produced by the output layer{" "}
          <code>
            A<sup>[3]</sup>
          </code>
          .
        </>
      ),
    },
    {
      symbol: "y",
      name: <>Target vector y</>,
      desc: (
        <>
          <code>y</code> is the ground-truth target vector from the training
          data that <code>ŷ</code> should approximate. In this demo it is also
          2-dimensional:{" "}
          <code>
            y = (y<sub>1</sub>, y<sub>2</sub>)
          </code>
          .
        </>
      ),
    },
    {
      symbol: "λ",
      name: <>Regularization λ</>,
      desc: (
        <>
          <code>λ</code> (lambda) is the regularization strength for L2 weight
          decay. It scales the penalty term <code>(λ / 2m) · Σ‖W‖²</code> to
          discourage large weights and reduce overfitting. In this visualizer we
          assume <code>λ = 0</code>.
        </>
      ),
    },
  ];

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
                  <span>Training set (X, y), Learning Rate η</span>
                </div>
                <div
                  style={{
                    paddingLeft: "1.5rem",
                    marginTop: "-0.5rem",
                    marginBottom: "0.5rem",
                    fontSize: "0.7rem",
                    color: "rgb(156, 163, 175)",
                    fontFamily: "monospace",
                  }}
                >
                  (Convention: A<sup>[0]</sup> = X)
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
                      δ<sup>[L]</sup> = (ŷ - y<sup>[L]</sup>) · σ'(Z
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
                      W<sup>[l]</sup> ← W<sup>[l]</sup> - η · (A<sup>[l-1]</sup>
                      )<sup>T</sup> · δ<sup>[l]</sup>
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
                    }}
                  >
                    {/* --- UPDATED TRIGGER WRAPPER --- */}
                    <div
                      className={`legend-trigger ${
                        activeTooltip === item.symbol ? "active" : ""
                      }`}
                      onClick={(e) => handleTriggerClick(e, item.symbol)}
                    >
                      {/* The Symbol Box */}
                      <span
                        style={{
                          width: "2rem",
                          height: "1.5rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "0.15rem",
                          fontSize: "14px",
                          color: "#fff",
                          backgroundColor: "rgb(31, 41, 55)",
                          fontFamily: "monospace",
                          fontWeight: "bold",
                          border: "1px solid rgb(75, 85, 99)",
                          // The border color transition is handled by CSS now
                        }}
                      >
                        {item.symbol}
                      </span>

                      {/* The Tooltip */}
                      <div
                        className="legend-tooltip"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="tooltip-header">
                          <span className="tooltip-icon">{item.symbol}</span>
                          <span className="tooltip-title">{item.name}</span>
                        </div>
                        <div className="tooltip-desc">{item.desc}</div>
                      </div>
                    </div>

                    {/* The Name label */}
                    <span style={{ color: "rgb(156, 163, 175)" }}>
                      {item.name}
                    </span>
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
                      color: "rgba(255, 255, 255, 1)",
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

      {/* SECTION 3: CONFIG & STEP */}
      <div className="backprop-section">
        <div className="backprop-grid-2" style={{ gap: "1.5rem" }}>
          {/* --- LINKE KARTE: CONFIGURATION & PARAMETERS --- */}
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

            {/* NEUE STRUKTUR: TARGETS & LEARNING RATE */}
            <div
              className="config-row-group"
              style={{ alignItems: "flex-end" }}
            >
              {/* --- TARGETS BLOCK --- */}
              <div className="config-item-wrapper">
                <label className="backprop-input-label">TARGET VECTOR</label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {/* y = */}
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "#fff",
                      fontFamily: "monospace",
                      marginRight: "4px",
                      transform: "translateY(12px)", // KORREKTUR: Tiefer (wie bei X)
                    }}
                  >
                    y =
                  </span>

                  {/* [ */}
                  <span
                    style={{
                      fontSize: "2.5rem",
                      color: "rgb(107, 114, 128)",
                      fontWeight: "200",
                      lineHeight: "1",
                      transform: "translateY(6px)",
                      display: "inline-block",
                    }}
                  >
                    [
                  </span>

                  {/* Inputs y1, y2 */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    {network.target.map((v, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        {/* Label y1 */}
                        <div
                          className="backprop-small-label"
                          style={{
                            marginBottom: 0,
                            fontFamily: "serif",
                            fontStyle: "italic",
                            fontSize: "1rem",
                            color: "#ddd",
                          }}
                        >
                          y
                          <sub
                            style={{
                              fontSize: "0.7em",
                              fontStyle: "normal",
                              marginLeft: "1px",
                            }}
                          >
                            {i + 1}
                          </sub>
                        </div>

                        <SmartNumberInput
                          type="number"
                          step="0.1"
                          min="0"
                          max="1"
                          className="matrix-input"
                          style={{
                            width: "60px",
                            height: "40px", // Konsistente Höhe mit Inputs
                          }}
                          value={v}
                          onValueChange={(val) => handleTargetChange(i, val)}
                          disabled={inputsLocked}
                        />
                      </div>
                    ))}
                  </div>

                  {/* ] */}
                  <span
                    style={{
                      fontSize: "2.5rem",
                      color: "rgb(107, 114, 128)",
                      fontWeight: "200",
                      lineHeight: "1",
                      transform: "translateY(6px)",
                      display: "inline-block",
                    }}
                  >
                    ]
                  </span>
                </div>
              </div>

              {/* --- LEARNING RATE BLOCK (Korrigiert) --- */}
              <div
                className="config-item-wrapper"
                style={{ flexGrow: 0, minWidth: "auto" }}
              >
                <label
                  className="backprop-input-label"
                  style={{ marginBottom: "0.5rem" }}
                >
                  LEARNING RATE
                </label>

                {/* Flex Container für "eta = Input" */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {/* Label Eta = */}
                  <div
                    style={{
                      fontFamily: "serif",
                      fontStyle: "italic",
                      fontSize: "1.25rem",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    η{" "}
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontStyle: "normal",
                        fontWeight: "bold",
                      }}
                    >
                      =
                    </span>
                  </div>

                  <SmartNumberInput
                    type="number"
                    step="0.01"
                    min="0.001"
                    max="1"
                    className="matrix-input"
                    style={{
                      width: "70px",
                      textAlign: "center",
                    }}
                    value={network.learningRate}
                    onValueChange={handleRateChange}
                    disabled={inputsLocked}
                  />
                </div>
              </div>
            </div>

            {/* NEUE STRUKTUR: PARAMETERS HEADER */}
            <div>
              <div className="params-header">
                <label
                  style={{
                    fontSize: "0.75rem",
                    color: "rgb(156, 163, 175)",
                    fontWeight: "bold",
                  }}
                >
                  PARAMETERS
                </label>

                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    flexWrap: "wrap",
                    width: "100%",
                  }}
                >
                  <div className="backprop-tab-group">
                    {(["INPUTS", "WEIGHTS", "BIASES"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setEditMode(m)}
                        className={`backprop-tab-btn ${
                          editMode === m ? "active" : "inactive"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                    {/* --- START INFO BUTTON (Mobile & Active State Fix) --- */}
                    {editMode === "WEIGHTS" && (
                      <div
                        style={{
                          position: "relative",
                          display: "inline-block",
                          marginLeft: "8px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={(e) => handleTriggerClick(e, "limit-info")}
                          className="backprop-tab-btn"
                          style={{
                            padding: "4px 6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            transition: "all 0.2s ease",
                            // --- ACTIVE STATE LOGIC ---
                            backgroundColor:
                              activeTooltip === "limit-info"
                                ? "rgb(31, 41, 55)" // Dunkler Hintergrund wenn aktiv
                                : "transparent",
                            border:
                              activeTooltip === "limit-info"
                                ? "1px solid #a78bfa" // Violetter Rand wenn aktiv
                                : "1px solid transparent",
                            borderRadius: "6px",
                            opacity: 1,
                          }}
                          title="Why are values limited?"
                        >
                          <HelpCircle
                            size={14}
                            color={
                              activeTooltip === "limit-info"
                                ? "#fff"
                                : "#a78bfa"
                            }
                          />
                        </button>

                        {/* Das Tooltip Popup */}
                        {activeTooltip === "limit-info" && (
                          <div
                            // HIER WICHTIG: Eine Klasse für das CSS Media Query
                            className="limit-popup-mobile"
                            style={{
                              // Desktop Defaults (werden mobil überschrieben)
                              position: "absolute",
                              top: "125%",
                              left: "50%",
                              transform: "translateX(-50%)",
                              width: "280px",

                              // Generelle Styles
                              backgroundColor: "rgba(20, 20, 20, 0.98)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgb(75, 85, 99)",
                              padding: "1rem",
                              borderRadius: "0.5rem",
                              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.9)",
                              zIndex: 1000,
                              cursor: "auto",
                              textAlign: "left",
                              visibility: "visible",
                              opacity: 1,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              style={{
                                marginBottom: "10px",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                borderBottom: "1px solid rgba(255,255,255,0.1)",
                                paddingBottom: "8px",
                              }}
                            >
                              <span
                                style={{
                                  background: "#a78bfa",
                                  color: "#fff",
                                  width: "24px",
                                  height: "24px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  borderRadius: "6px",
                                  fontWeight: "bold",
                                  fontSize: "14px",
                                  flexShrink: 0,
                                }}
                              >
                                !
                              </span>
                              <span
                                style={{
                                  color: "#fff",
                                  fontWeight: "bold",
                                  fontSize: "0.9rem",
                                }}
                              >
                                Why limit weights?
                              </span>
                            </div>
                            <div
                              style={{
                                lineHeight: "1.5",
                                color: "rgb(209, 213, 219)",
                                fontSize: "0.8rem",
                              }}
                            >
                              Weights are clamped to <strong>[-2, 2]</strong> to
                              prevent{" "}
                              <span
                                style={{
                                  color: "#f87171",
                                  fontWeight: "bold",
                                }}
                              >
                                Neuron Saturation
                              </span>
                              .<br />
                              <br />
                              Large weights push the Sigmoid activation to 0 or
                              1. At these edges, the gradient becomes almost
                              zero (<strong>Vanishing Gradient</strong>),
                              causing the network to stop learning.
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {/* --- ENDE INFO BUTTON --- */}
                  </div>

                  <button
                    onClick={randomizeSelection}
                    disabled={inputsLocked}
                    className="backprop-randomize-btn"
                    title="Randomize Values"
                    style={{ opacity: inputsLocked ? 0.6 : 1 }}
                  >
                    <Shuffle size={12} /> Randomize
                  </button>
                </div>
              </div>

              <div className="backprop-params-area">
                {editMode !== "INPUTS" && (
                  <div
                    className="backprop-flex-gap-2"
                    style={{ marginBottom: "1rem" }}
                  >
                    {(["L1", "L2", "L3"] as const).map((l) => {
                      // Label Logik hier inline oder in Funktion
                      let mainLabel = "";
                      let subLabel = "";

                      if (l === "L1") {
                        mainLabel =
                          editMode === "WEIGHTS"
                            ? "W"
                            : editMode === "BIASES"
                            ? "b"
                            : "A";
                        subLabel =
                          editMode === "WEIGHTS" ? "(In → H1)" : "(H1)";
                      } else if (l === "L2") {
                        mainLabel =
                          editMode === "WEIGHTS"
                            ? "W"
                            : editMode === "BIASES"
                            ? "b"
                            : "A";
                        subLabel =
                          editMode === "WEIGHTS" ? "(H1 → H2)" : "(H2)";
                      } else {
                        mainLabel =
                          editMode === "WEIGHTS"
                            ? "W"
                            : editMode === "BIASES"
                            ? "b"
                            : "ŷ";
                        subLabel =
                          editMode === "WEIGHTS" ? "(H2 → Out)" : "(Out)";
                      }

                      // Index Zahl (1, 2, 3)
                      const idx = l === "L1" ? "1" : l === "L2" ? "2" : "3";
                      return (
                        <button
                          key={l}
                          onClick={() => setActiveTab(l)}
                          className={`backprop-tab-btn ${
                            activeTab === l ? "active" : "inactive"
                          }`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontFamily: "monospace", // Wichtig für math look
                            fontSize: "11px", // Etwas größer damit man sup lesen kann
                          }}
                        >
                          {/* Hauptsymbol: W^[1] */}
                          <span>
                            {mainLabel}
                            <sup style={{ fontSize: "9px" }}>[{idx}]</sup>
                          </span>

                          {/* Erklärung: (In->H1) - etwas blasser */}
                          <span
                            style={{
                              opacity: 0.6,
                              fontSize: "9px",
                              marginLeft: "2px",
                            }}
                          >
                            {subLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {/* === HIER IST DIE ÄNDERUNG: DER SCROLL WRAPPER === */}
                <div className="matrix-overflow-wrapper">
                  {/* Inputs Mode (Vektor-Darstellung, X korrigiert & Zahlen kleiner) */}
                  {editMode === "INPUTS" && (
                    <div className="matrix-overflow-wrapper">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.3rem",
                          padding: "1rem 0",
                          minWidth: "max-content",
                        }}
                      >
                        {/* Das Label X = */}
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "#fff",
                            fontSize: "1.25rem",
                            fontFamily: "monospace",
                            // KORREKTUR: X weiter runter schieben, damit es mittig zu den Boxen steht
                            transform: "translateY(12px)",
                            display: "inline-block",
                          }}
                        >
                          X =
                        </span>

                        {/* Öffnende Klammer */}
                        <span
                          style={{
                            fontSize: "35pt",
                            color: "rgb(107, 114, 128)",
                            fontWeight: "200",
                            lineHeight: "1",
                            transform: "translateY(8px)",
                            display: "inline-block",
                          }}
                        >
                          [
                        </span>

                        {/* Die Inputs selbst */}
                        <div
                          className="matrix-input-row"
                          style={{
                            width: "auto",
                            alignItems: "flex-end",
                            gap: "8px",
                          }}
                        >
                          {network.inputs.map((v, i) => (
                            <div
                              key={i}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              {/* Label mit Subscript (x₁) - BLEIBT GROSS */}
                              <div
                                className="backprop-small-label x-values"
                                style={{
                                  width: "100%",
                                  textAlign: "center",
                                  marginBottom: 0,
                                  fontFamily: "serif",
                                  fontStyle: "italic",
                                  fontSize: "1rem",
                                  color: "#ddd",
                                }}
                              >
                                x
                                <sub
                                  style={{
                                    fontSize: "0.7em",
                                    fontStyle: "normal",
                                    marginLeft: "1px",
                                  }}
                                >
                                  {i + 1}
                                </sub>
                              </div>

                              <SmartNumberInput
                                type="number"
                                step="0.1"
                                min="0"
                                max="1"
                                className="matrix-input"
                                style={{
                                  width: "75px",
                                  height: "40px",
                                }}
                                value={v}
                                formatter={formatNum}
                                onValueChange={(val) =>
                                  handleParamChange("L1", 0, i, val)
                                }
                                disabled={inputsLocked}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Schließende Klammer */}
                        <span
                          style={{
                            fontSize: "35pt",
                            color: "rgb(107, 114, 128)",
                            fontWeight: "200",
                            lineHeight: "1",
                            transform: "translateY(8px)",
                            display: "inline-block",
                          }}
                        >
                          ]
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Weights Mode */}
                  {editMode === "WEIGHTS" && (
                    <div
                      className="backprop-flex-col-1"
                      style={{
                        alignItems: "center",
                        width: "100%",
                        minWidth: "220px",
                      }}
                    >
                      {/* Helper: Wir definieren die Labels basierend auf dem Tab */}
                      {(() => {
                        let rowSymbol = "x";
                        let rowSuper = "";

                        let colSymbol = "a"; // HIER GEÄNDERT: a statt h
                        let colSuper = "[1]";

                        if (activeTab === "L1") {
                          // Input (x) -> H1 (a^[1])
                          rowSymbol = "x";
                          rowSuper = "";
                          colSymbol = "a";
                          colSuper = "[1]";
                        } else if (activeTab === "L2") {
                          // H1 (a^[1]) -> H2 (a^[2])
                          rowSymbol = "a";
                          rowSuper = "[1]";
                          colSymbol = "a";
                          colSuper = "[2]";
                        } else {
                          // H2 (a^[2]) -> Output (ŷ)
                          rowSymbol = "a";
                          rowSuper = "[2]";
                          colSymbol = "ŷ";
                          colSuper = "";
                        }

                        const matrixData =
                          activeTab === "L1"
                            ? network.weights1
                            : activeTab === "L2"
                            ? network.weights2
                            : network.weights3;

                        return (
                          <>
                            {matrixData.map((r, i) => (
                              <div key={i} className="matrix-input-row">
                                {/* --- ZEILEN LABEL (Quelle) --- */}
                                <span
                                  className="backprop-small-label"
                                  style={{
                                    width: "40px",
                                    fontFamily: "serif",
                                    fontStyle: "italic",
                                    fontSize: "15px",
                                    color: "#ddd",
                                    textAlign: "right",
                                    marginRight: "8px",
                                  }}
                                >
                                  {rowSymbol}
                                  {rowSuper && (
                                    <sup
                                      style={{
                                        fontStyle: "normal",
                                        fontSize: "0.6em",
                                        marginRight: "1px",
                                      }}
                                    >
                                      {rowSuper}
                                    </sup>
                                  )}
                                  <sub
                                    style={{
                                      fontSize: "0.7em",
                                      fontStyle: "normal",
                                      marginLeft: "1px",
                                    }}
                                  >
                                    {i + 1}
                                  </sub>
                                </span>

                                {/* INPUTS */}
                                {r.map((v, j) => (
                                  <SmartNumberInput
                                    key={j}
                                    type="number"
                                    step="0.1"
                                    className="matrix-input"
                                    value={v}
                                    formatter={formatNum}
                                    onValueChange={(val) =>
                                      handleParamChange(activeTab, i, j, val)
                                    }
                                    disabled={inputsLocked}
                                  />
                                ))}
                              </div>
                            ))}

                            {/* --- SPALTEN LABELS (Ziel) --- */}
                            <div
                              className="matrix-labels-row"
                              style={{ marginTop: "8px", gap: "12px" }}
                            >
                              <span
                                className="placeholder"
                                style={{ width: "40px", marginRight: "8px" }}
                              ></span>

                              {matrixData[0].map((_, idx) => (
                                <span
                                  key={idx}
                                  className="backprop-small-label"
                                  style={{
                                    width: "70px",
                                    textAlign: "center",
                                    fontFamily: "serif",
                                    fontStyle: "italic",
                                    fontSize: "15px",
                                    color: "#aaa",
                                  }}
                                >
                                  {colSymbol}
                                  {colSuper && (
                                    <sup
                                      style={{
                                        fontStyle: "normal",
                                        fontSize: "0.6em",
                                        marginRight: "1px",
                                      }}
                                    >
                                      {colSuper}
                                    </sup>
                                  )}
                                  <sub
                                    style={{
                                      fontSize: "0.7em",
                                      fontStyle: "normal",
                                      marginLeft: "1px",
                                    }}
                                  >
                                    {idx + 1}
                                  </sub>
                                </span>
                              ))}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* Biases Mode (b^[l]_i) */}
                  {editMode === "BIASES" && (
                    <div
                      className="matrix-input-row"
                      style={{
                        justifyContent: "center",
                        minWidth: "200px",
                        gap: "12px",
                      }}
                    >
                      {(activeTab === "L1"
                        ? network.bias1
                        : activeTab === "L2"
                        ? network.bias2
                        : network.bias3
                      ).map((v, i) => {
                        // Helper für den Layer-Index String (z.B. "[1]")
                        const layerIdx =
                          activeTab === "L1"
                            ? "[1]"
                            : activeTab === "L2"
                            ? "[2]"
                            : "[3]";

                        return (
                          <div
                            key={i}
                            style={{
                              flex: 1,
                              minWidth: "35px",
                              maxWidth: "80px",
                              textAlign: "center",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            {/* Label: b^[l]_i */}
                            <div
                              className="backprop-small-label"
                              style={{
                                marginBottom: 0,
                                fontFamily: "serif",
                                fontStyle: "italic",
                                fontSize: "1rem",
                                color: "#ddd",
                              }}
                            >
                              b{/* Layer Index (hochgestellt) */}
                              <sup
                                style={{
                                  fontSize: "0.6em",
                                  fontStyle: "normal",
                                  marginRight: "1px",
                                }}
                              >
                                {layerIdx}
                              </sup>
                              {/* Neuron Index (tiefgestellt) */}
                              <sub
                                style={{
                                  fontSize: "0.7em",
                                  fontStyle: "normal",
                                  marginLeft: "0px",
                                }}
                              >
                                {i + 1}
                              </sub>
                            </div>

                            <SmartNumberInput
                              type="number"
                              step="0.1"
                              className="matrix-input"
                              style={{
                                width: "100%",
                                height: "40px",
                                fontSize: "0.9rem",
                                fontWeight: "bold",
                              }}
                              value={v}
                              formatter={formatNum}
                              onValueChange={(val) =>
                                handleParamChange(activeTab, 0, i, val)
                              }
                              disabled={inputsLocked}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>{" "}
                {/* ENDE MATRIX OVERFLOW WRAPPER */}
              </div>
            </div>

            <button
              onClick={() => {
                setNetwork(INITIAL_STATE);
                setStep(0);
                setIsTraining(false); // Sicherstellen, dass Training stoppt
              }}
              className={`backprop-action-btn-main backprop-reset-btn ${
                isModified ? "active" : ""
              }`}
              style={{
                width: "100%",
                marginTop: "1.5rem",
                // Wir entfernen hier die Hintergrundfarbe, damit CSS greift!
              }}
            >
              <RotateCcw size={16} />
              {isModified ? "Reset Changes" : "Reset Everything"}
            </button>
          </div>

          {/* --- RECHTE KARTE: STEP INFO & PLAY CONTROLS --- */}
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

            <div className="backprop-action-btns-wrapper">
              <button
                className="backprop-action-btn-main"
                style={{ flexShrink: 0 }}
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={isTraining}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                className="backprop-action-btn-main"
                style={{ flex: 1, color: "#fff" }}
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={isTraining}
              >
                {isPlaying ? (
                  <Pause size={20} fill="white" />
                ) : (
                  <Play size={20} fill="white" />
                )}
                <span>{isPlaying ? "Pause" : "Play Steps"}</span>
              </button>
              <button
                className="backprop-action-btn-main"
                style={{ flexShrink: 0 }}
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
            backgroundColor: "#151515", // HINTERGRUND WIEDERHERGESTELLT (Dunkelgrau)
            position: "relative",
            height: "550px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.8)",
          }}
        >
          {/* --- STATUS INDICATORS (FORWARD / BACKPROP) --- */}
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
            {/* FORWARD INDICATOR */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <div
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  borderRadius: "50%",
                  // Logik: Leuchtet bei Training ODER Steps 1-4 (Forward Phase)
                  backgroundColor:
                    isTraining || (step >= 1 && step <= 4) ? "#10b981" : "#333", // Grün vs Dunkelgrau
                  boxShadow:
                    isTraining || (step >= 1 && step <= 4)
                      ? "0 0 10px #10b981"
                      : "none", // Glow vs kein Glow
                  transition: "all 0.3s ease",
                }}
              ></div>
              <span
                style={{
                  fontSize: "10px",
                  // Text dimmen, wenn inaktiv
                  color:
                    isTraining || (step >= 1 && step <= 4)
                      ? "rgb(156, 163, 175)"
                      : "rgb(80, 80, 80)",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  letterSpacing: "0.1em",
                  transition: "color 0.3s ease",
                }}
              >
                Forward
              </span>
            </div>

            {/* BACKPROP INDICATOR */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <div
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  borderRadius: "50%",
                  // Logik: Leuchtet bei Training ODER isBackprop (Steps 5-8)
                  backgroundColor:
                    isTraining || isBackprop ? "#8b5cf6" : "#333", // Violett vs Dunkelgrau
                  boxShadow:
                    isTraining || isBackprop ? "0 0 10px #8b5cf6" : "none",
                  transition: "all 0.3s ease",
                }}
              ></div>
              <span
                style={{
                  fontSize: "10px",
                  color:
                    isTraining || isBackprop
                      ? "rgb(156, 163, 175)"
                      : "rgb(80, 80, 80)",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  letterSpacing: "0.1em",
                  transition: "color 0.3s ease",
                }}
              >
                Backprop
              </span>
            </div>
          </div>

          <svg
            viewBox="0 0 800 500"
            style={{
              width: "100%",

              height: "100%",

              userSelect: "none",

              fontFamily: "var(--ff-primary)",
            }}
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
            </defs>

            {/* --- LAYER LABELS (Unten) --- */}

            {/* Input Layer */}

            <rect
              x="40"
              y="45"
              width="80"
              height="360"
              rx="8"
              className="layer-box"
            />

            <text
              x="80"
              y="430"
              className="layer-label"
              style={{ fill: "#fff", fontWeight: "bold", fontSize: "14px" }}
            >
              X (Input)
            </text>

            {/* Hidden 1 */}

            <rect
              x="240"
              y="45"
              width="80"
              height="360"
              rx="8"
              className="layer-box"
            />

            <text
              x="280"
              y="430"
              className="layer-label"
              style={{
                fill: "#fff",

                fontWeight: "bold",

                fontSize: "14px",

                fontFamily: "serif",

                fontStyle: "italic",
              }}
            >
              A
              <tspan dy="-5" fontSize="10" fontStyle="normal">
                [1]
              </tspan>
              <tspan dy="5" fontStyle="normal" fontFamily="var(--ff-primary)">
                {" "}
                (H1)
              </tspan>
            </text>

            {/* Hidden 2 */}

            <rect
              x="440"
              y="45"
              width="80"
              height="360"
              rx="8"
              className="layer-box"
            />

            <text
              x="480"
              y="430"
              className="layer-label"
              style={{
                fill: "#fff",

                fontWeight: "bold",

                fontSize: "14px",

                fontFamily: "serif",

                fontStyle: "italic",
              }}
            >
              A
              <tspan dy="-5" fontSize="10" fontStyle="normal">
                [2]
              </tspan>
              <tspan dy="5" fontStyle="normal" fontFamily="var(--ff-primary)">
                {" "}
                (H2)
              </tspan>
            </text>

            {/* Output */}

            <rect
              x="635"
              y="80"
              width="90"
              height="300"
              rx="8"
              className="layer-box"
            />

            <text
              x="680"
              y="400"
              className="layer-label"
              style={{
                fill: "#fff",

                fontWeight: "bold",

                fontSize: "14px",

                fontFamily: "serif",

                fontStyle: "italic",
              }}
            >
              A
              <tspan dy="-5" fontSize="10" fontStyle="normal">
                [3]
              </tspan>
              <tspan dy="5" fontStyle="normal" fontFamily="var(--ff-primary)">
                {" "}
                (Output)
              </tspan>
            </text>

            {/* --- CONNECTIONS (Lines & Weights) --- */}

            {/* W1 */}

            {[0, 1, 2].map((_, i) =>
              [0, 1, 2].map((j) => {
                let { x1, y1, x2, y2, lx, ly } = getLineCoords(
                  80,

                  100 + i * 120,

                  288,

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

                const stroke = back ? "#a78bfa" : fwd ? "#4ade80" : "#aaa";

                const opacity = back || fwd ? 1 : 0.3;

                // KORREKTUR: Kein Marker im Idle-Zustand

                const markerEnd = back
                  ? "url(#arrow-back)"
                  : fwd
                  ? "url(#arrow-fwd)"
                  : "";

                return (
                  <g key={`w1-${i}-${j}`}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={stroke}
                      strokeWidth={back || fwd ? 1.5 : 1}
                      opacity={opacity}
                      markerEnd={markerEnd}
                    />

                    <rect
                      x={lx - 10}
                      y={ly - 7}
                      width="35"
                      height="14"
                      rx="3"
                      fill="#0f0f0f"
                      stroke={stroke}
                      strokeWidth="0.5"
                    />

                    <text
                      x={lx + 8}
                      y={ly + 3}
                      textAnchor="middle"
                      fontSize="10"
                      fill={back ? "#fff" : "#aaa"}
                      fontFamily="monospace"
                    >
                      {network.weights1[i][j].toFixed(2)}
                    </text>
                  </g>
                );
              })
            )}

            {/* W2 */}

            {[0, 1, 2].map((i) =>
              [0, 1, 2].map((j) => {
                let { x1, y1, x2, y2, lx, ly } = getLineCoords(
                  280,

                  100 + i * 120,

                  488,

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

                const stroke = back ? "#a78bfa" : fwd ? "#4ade80" : "#aaa";

                const opacity = back || fwd ? 1 : 0.3;

                // KORREKTUR: Kein Marker im Idle-Zustand

                const markerEnd = back
                  ? "url(#arrow-back)"
                  : fwd
                  ? "url(#arrow-fwd)"
                  : "";

                return (
                  <g key={`w2-${i}-${j}`}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={stroke}
                      strokeWidth={back || fwd ? 1.5 : 1}
                      opacity={opacity}
                      markerEnd={markerEnd}
                    />

                    <rect
                      x={lx - 10}
                      y={ly - 7}
                      width="35"
                      height="14"
                      rx="3"
                      fill="#0f0f0f"
                      stroke={stroke}
                      strokeWidth="0.5"
                    />

                    <text
                      x={lx + 8}
                      y={ly + 3}
                      textAnchor="middle"
                      fontSize="10"
                      fill={back ? "#fff" : "#aaa"}
                      fontFamily="monospace"
                    >
                      {network.weights2[i][j].toFixed(2)}
                    </text>
                  </g>
                );
              })
            )}

            {/* W3 */}

            {[0, 1, 2].map((i) =>
              [0, 1].map((k) => {
                let { x1, y1, x2, y2, lx, ly } = getLineCoords(
                  480,

                  100 + i * 120,

                  688,

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

                const stroke = back ? "#a78bfa" : fwd ? "#4ade80" : "#aaa";

                const opacity = back || fwd ? 1 : 0.3;

                // KORREKTUR: Kein Marker im Idle-Zustand

                const markerEnd = back
                  ? "url(#arrow-back)"
                  : fwd
                  ? "url(#arrow-fwd)"
                  : "";

                return (
                  <g key={`w3-${i}-${k}`}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={stroke}
                      strokeWidth={back || fwd ? 2 : 1}
                      opacity={opacity}
                      markerEnd={markerEnd}
                    />

                    <rect
                      x={lx - 10}
                      y={ly - 7}
                      width="35"
                      height="14"
                      rx="3"
                      fill="#0f0f0f"
                      stroke={stroke}
                      strokeWidth="0.5"
                    />

                    <text
                      x={lx + 8}
                      y={ly + 3}
                      textAnchor="middle"
                      fontSize="10"
                      fill={back ? "#fff" : "#aaa"}
                      fontFamily="monospace"
                    >
                      {network.weights3[i][k].toFixed(2)}
                    </text>
                  </g>
                );
              })
            )}

            {/* --- NODES --- */}

            {/* Input Nodes (x_i) */}

            {[0, 1, 2].map((i) => (
              <g key={"in" + i} transform={`translate(80, ${100 + i * 120})`}>
                <circle r="26" fill="#151515" stroke="#333" strokeWidth="2" />

                {/* Label: x_i */}

                <text
                  y="-7"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="14"
                  fontWeight="bold"
                  fontFamily="serif"
                  fontStyle="italic"
                >
                  x
                  <tspan dy="6" fontSize="10" fontStyle="normal">
                    {i + 1}
                  </tspan>
                </text>

                {/* Value */}

                <text
                  y="16"
                  textAnchor="middle"
                  fill="#aaa"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {network.inputs[i]}
                </text>
              </g>
            ))}

            {/* Hidden 1 Nodes (a^[1]_j) - MIT LAYER INFO */}

            {[0, 1, 2].map((j) => (
              <g key={"a1" + j} transform={`translate(280, ${100 + j * 120})`}>
                <circle r="28" fill="#151515" />

                <circle
                  r="28"
                  fill={
                    isBackprop && step >= 7
                      ? "rgba(167, 139, 250, 0.15)"
                      : flowL1
                      ? "rgba(74,222,128,0.1)"
                      : "transparent"
                  }
                  stroke={
                    isBackprop && step >= 7
                      ? "#a78bfa"
                      : flowL1
                      ? "#4ade80"
                      : "#333"
                  }
                  strokeWidth="2"
                />

                {/* Label: a^[1]_j */}

                <text
                  y="-7"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="14"
                  fontWeight="bold"
                  fontFamily="serif"
                  fontStyle="italic"
                >
                  a{/* Superscript [1] - schön kompakt */}
                  <tspan dy="-6" fontSize="9" fontStyle="normal">
                    [1]
                  </tspan>
                  {/* Subscript j - wieder runter */}
                  <tspan dy="9" fontSize="9" fontStyle="normal">
                    {j + 1}
                  </tspan>
                </text>

                {/* Bias */}

                <text
                  y="-35"
                  textAnchor="middle"
                  fill="#aaa"
                  fontSize="10"
                  stroke="#151515"
                  paintOrder="stroke"
                  strokeWidth="4px"
                >
                  <tspan fontFamily="serif" fontStyle="italic">
                    b
                  </tspan>
                  <tspan dy="-4" fontSize="8" fontStyle="normal">
                    [1]
                  </tspan>{" "}
                  {/* Bias Layer Info */}
                  <tspan dy="4" fontSize="8">
                    {j + 1}
                  </tspan>
                  <tspan dy="-2" fontFamily="monospace">
                    : {network.bias1[j].toFixed(2)}
                  </tspan>
                </text>

                {/* Value */}

                {showValuesL1 && (
                  <text
                    y="15"
                    textAnchor="middle"
                    fill="#4ade80"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {a1[j].toFixed(2)}
                  </text>
                )}
              </g>
            ))}

            {/* Hidden 2 Nodes (a^[2]_j) - MIT LAYER INFO */}

            {[0, 1, 2].map((j) => (
              <g key={"a2" + j} transform={`translate(480, ${100 + j * 120})`}>
                <circle r="28" fill="#151515" />

                <circle
                  r="28"
                  fill={
                    isBackprop && step >= 6
                      ? "rgba(167, 139, 250, 0.15)"
                      : flowL2
                      ? "rgba(74,222,128,0.1)"
                      : "transparent"
                  }
                  stroke={
                    isBackprop && step >= 6
                      ? "#a78bfa"
                      : flowL2
                      ? "#4ade80"
                      : "#333"
                  }
                  strokeWidth="2"
                />

                {/* Label: a^[2]_j */}

                <text
                  y="-7"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="14"
                  fontWeight="bold"
                  fontFamily="serif"
                  fontStyle="italic"
                >
                  a
                  <tspan dy="-6" fontSize="9" fontStyle="normal">
                    [2]
                  </tspan>
                  <tspan dy="9" fontSize="9" fontStyle="normal">
                    {j + 1}
                  </tspan>
                </text>

                {/* Bias */}

                <text
                  y="-35"
                  textAnchor="middle"
                  fill="#aaa"
                  fontSize="10"
                  stroke="#151515"
                  paintOrder="stroke"
                  strokeWidth="4px"
                >
                  <tspan fontFamily="serif" fontStyle="italic">
                    b
                  </tspan>

                  <tspan dy="-4" fontSize="8" fontStyle="normal">
                    [2]
                  </tspan>

                  <tspan dy="4" fontSize="8">
                    {j + 1}
                  </tspan>

                  <tspan dy="-2" fontFamily="monospace">
                    : {network.bias2[j].toFixed(2)}
                  </tspan>
                </text>

                {/* Value */}

                {showValuesL2 && (
                  <text
                    y="15"
                    textAnchor="middle"
                    fill="#4ade80"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {a2[j].toFixed(2)}
                  </text>
                )}
              </g>
            ))}

            {/* Output Nodes (ŷ_k) */}

            {[0, 1].map((k) => (
              <g key={"out" + k} transform={`translate(680, ${160 + k * 120})`}>
                <circle r="36" fill="#151515" />

                <circle
                  r="36"
                  fill={flowOut ? "rgba(74,222,128,0.1)" : "transparent"}
                  stroke={isBackprop ? "#a78bfa" : flowOut ? "#4ade80" : "#333"}
                  strokeWidth="3"
                />

                {/* Label: ŷ_k */}

                <text
                  y="-8"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="16"
                  fontWeight="bold"
                  fontFamily="serif"
                  fontStyle="italic"
                >
                  ŷ
                  <tspan dy="6" fontSize="11" fontStyle="normal">
                    {k + 1}
                  </tspan>
                </text>

                {/* Bias */}

                <text
                  y="-45"
                  textAnchor="middle"
                  fill="#aaa"
                  fontSize="10"
                  stroke="#151515"
                  paintOrder="stroke"
                  strokeWidth="4px"
                >
                  <tspan fontFamily="serif" fontStyle="italic">
                    b
                  </tspan>

                  <tspan dy="-4" fontSize="8" fontStyle="normal">
                    [3]
                  </tspan>

                  <tspan dy="4" fontSize="8">
                    {k + 1}
                  </tspan>

                  <tspan dy="-2" fontFamily="monospace">
                    : {network.bias3[k].toFixed(2)}
                  </tspan>
                </text>

                {/* Value */}

                {showValuesOut && (
                  <text
                    y="18"
                    textAnchor="middle"
                    fill="#4ade80"
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {formatNum(a3[k])}
                  </text>
                )}

                {/* Error Label */}

                {showLoss && (
                  <text
                    x="0"
                    y="53"
                    textAnchor="middle"
                    fill="#ef4444"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    Err: {Math.abs(network.target[k] - a3[k]).toFixed(3)}
                  </text>
                )}
              </g>
            ))}

            {/* Target Boxes */}

            {showLoss &&
              [0, 1].map((k) => (
                <g key={"t" + k} transform={`translate(0, ${k * 120})`}>
                  <line
                    x1="720"
                    y1="160"
                    x2="760"
                    y2="160"
                    stroke="#444"
                    strokeDasharray="4"
                  />

                  <rect
                    x="730"
                    y="135"
                    width="50"
                    height="50"
                    rx="4"
                    fill="#111"
                    stroke="#333"
                  />

                  <text
                    x="755"
                    y="152"
                    textAnchor="middle"
                    fill="#888"
                    fontSize="20"
                    fontFamily="serif"
                    fontStyle="italic"
                  >
                    y
                    <tspan dy="4" fontSize="12" fontStyle="normal">
                      {k + 1}
                    </tspan>
                  </text>

                  <text
                    x="755"
                    y="175"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {network.target[k]}
                  </text>
                </g>
              ))}

            {/* Total Loss */}

            {showLoss && (
              <g transform="translate(680, 460)">
                <rect
                  x="-70"
                  y="-15"
                  width="140"
                  height="26"
                  rx="6"
                  fill="#0f0f0f"
                  stroke="#333"
                />

                <text
                  x="0"
                  y="1"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#a78bfa"
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  MSE: {error.toFixed(5)}
                </text>
              </g>
            )}
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
            minHeight: "80px",
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
            <div>OUTPUT (ŷ)</div>
            <div style={{ textAlign: "right" }}>MSE/LOSS</div>
            <div style={{ textAlign: "center" }}>INFO</div>
          </div>
          <div style={{ overflowY: "auto", maxHeight: "900px" }}>
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
                <Activity size={24} />
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
                      {/* --- HEADER: LOSS & ERRORS --- */}
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
                        <span style={{ color: "rgb(239, 68, 68)" }}>
                          Err: [{Math.abs(h.diffs[0]).toFixed(4)},{" "}
                          {Math.abs(h.diffs[1]).toFixed(4)}]
                        </span>
                      </div>

                      {/* --- SECTION: NODE ACTIVATIONS --- */}
                      {/* --- SECTION: NODE STATES (Z & A) --- */}
                      <div style={{ marginBottom: "1rem" }}>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "rgb(107, 114, 128)",
                            marginBottom: "0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          <span>NODE STATES (Z → A)</span>
                          <span
                            style={{
                              fontSize: "0.65rem",
                              color: "#4ade80", // Grün passend zum Forward Flow
                              opacity: 0.8,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            (Forward Pass)
                          </span>
                        </div>
                        <div className="backprop-grid-3">
                          {/* L1 States */}
                          <div
                            style={{
                              backgroundColor: "rgb(21, 21, 21)",
                              padding: "6px",
                              borderRadius: "4px",
                              textAlign: "center",
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                            }}
                          >
                            {/* Pre-Activation Z */}
                            <div>
                              <div
                                style={{
                                  color: "#facc15",
                                  fontSize: "0.65rem",
                                  fontWeight: "bold",
                                }}
                              >
                                Z<sup style={{ fontSize: "0.7em" }}>[1]</sup>{" "}
                                (Pre-Activation)
                              </div>
                              <div
                                style={{ color: "#fef08a", fontSize: "0.7rem" }}
                              >
                                [
                                {h.preActivations
                                  ? h.preActivations.l1
                                      .map((n) => n.toFixed(2))
                                      .join(", ")
                                  : "..."}
                                ]
                              </div>
                            </div>
                            {/* Trennlinie */}
                            <div
                              style={{
                                height: "1px",
                                background: "#333",
                                margin: "2px 0",
                              }}
                            ></div>
                            {/* Activation A */}
                            <div>
                              <div
                                style={{
                                  color: "rgb(16, 185, 129)",
                                  fontSize: "0.65rem",
                                  fontWeight: "bold",
                                }}
                              >
                                A<sup style={{ fontSize: "0.7em" }}>[1]</sup>{" "}
                                (Activation)
                              </div>
                              <div>
                                [
                                {h.activations.l1
                                  .map((n) => n.toFixed(2))
                                  .join(", ")}
                                ]
                              </div>
                            </div>
                          </div>

                          {/* L2 States */}
                          <div
                            style={{
                              backgroundColor: "rgb(21, 21, 21)",
                              padding: "6px",
                              borderRadius: "4px",
                              textAlign: "center",
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                            }}
                          >
                            {/* Pre-Activation Z */}
                            <div>
                              <div
                                style={{
                                  color: "#facc15",
                                  fontSize: "0.65rem",
                                  fontWeight: "bold",
                                }}
                              >
                                Z<sup style={{ fontSize: "0.7em" }}>[2]</sup>{" "}
                                (Pre-Activation)
                              </div>
                              <div
                                style={{ color: "#fef08a", fontSize: "0.7rem" }}
                              >
                                [
                                {h.preActivations
                                  ? h.preActivations.l2
                                      .map((n) => n.toFixed(2))
                                      .join(", ")
                                  : "..."}
                                ]
                              </div>
                            </div>
                            <div
                              style={{
                                height: "1px",
                                background: "#333",
                                margin: "2px 0",
                              }}
                            ></div>
                            {/* Activation A */}
                            <div>
                              <div
                                style={{
                                  color: "rgb(96, 165, 250)",
                                  fontSize: "0.65rem",
                                  fontWeight: "bold",
                                }}
                              >
                                A<sup style={{ fontSize: "0.7em" }}>[2]</sup>{" "}
                                (Activation)
                              </div>
                              <div>
                                [
                                {h.activations.l2
                                  .map((n) => n.toFixed(2))
                                  .join(", ")}
                                ]
                              </div>
                            </div>
                          </div>

                          {/* Output States */}
                          <div
                            style={{
                              backgroundColor: "rgb(21, 21, 21)",
                              padding: "6px",
                              borderRadius: "4px",
                              textAlign: "center",
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                            }}
                          >
                            {/* Pre-Activation Z */}
                            <div>
                              <div
                                style={{
                                  color: "#facc15",
                                  fontSize: "0.65rem",
                                  fontWeight: "bold",
                                }}
                              >
                                Z<sup style={{ fontSize: "0.7em" }}>[3]</sup>{" "}
                                (Pre-Activation)
                              </div>
                              <div
                                style={{ color: "#fef08a", fontSize: "0.7rem" }}
                              >
                                [
                                {h.preActivations
                                  ? h.preActivations.l3
                                      .map((n) => n.toFixed(2))
                                      .join(", ")
                                  : "..."}
                                ]
                              </div>
                            </div>
                            <div
                              style={{
                                height: "1px",
                                background: "#333",
                                margin: "2px 0",
                              }}
                            ></div>
                            {/* Activation A */}
                            <div>
                              <div
                                style={{
                                  color: "rgb(168, 85, 247)",
                                  fontSize: "0.65rem",
                                  fontWeight: "bold",
                                }}
                              >
                                A<sup style={{ fontSize: "0.7em" }}>[3]</sup> =
                                ŷ (Activation)
                              </div>
                              <div>
                                [{h.output.map((n) => n.toFixed(2)).join(", ")}]
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* --- SECTION: NODE GRADIENTS (NEU) --- */}
                      {/* Nutzt backprop-grid-3 für Stacked Mobile View */}
                      <div style={{ marginBottom: "1rem" }}>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "rgb(107, 114, 128)",
                            marginBottom: "0.25rem",
                            fontWeight: "bold",
                          }}
                        >
                          <span>NODE GRADIENTS (δ)</span>
                          <span
                            style={{
                              fontSize: "0.65rem",
                              color: "#a78bfa", // Violett passend zum Backprop Flow
                              opacity: 0.8,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            (Backward Pass)
                          </span>
                        </div>
                        <div className="backprop-grid-3">
                          {/* L1 Gradients */}
                          <div
                            style={{
                              backgroundColor: "rgba(239, 68, 68, 0.1)",
                              border: "1px solid rgba(239, 68, 68, 0.2)",
                              padding: "6px",
                              borderRadius: "4px",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                color: "#f87171",
                                marginBottom: "2px",
                                fontWeight: "bold",
                              }}
                            >
                              δ<sup style={{ fontSize: "0.7em" }}>[1]</sup> (H1)
                            </div>
                            <div style={{ color: "#fca5a5" }}>
                              [
                              {h.deltas
                                ? h.deltas.l1
                                    .map((n) => n.toFixed(4))
                                    .join(", ")
                                : "..."}
                              ]
                            </div>
                          </div>

                          {/* L2 Gradients */}
                          <div
                            style={{
                              backgroundColor: "rgba(239, 68, 68, 0.1)",
                              border: "1px solid rgba(239, 68, 68, 0.2)",
                              padding: "6px",
                              borderRadius: "4px",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                color: "#f87171",
                                marginBottom: "2px",
                                fontWeight: "bold",
                              }}
                            >
                              δ<sup style={{ fontSize: "0.7em" }}>[2]</sup> (H2)
                            </div>
                            <div style={{ color: "#fca5a5" }}>
                              [
                              {h.deltas
                                ? h.deltas.l2
                                    .map((n) => n.toFixed(4))
                                    .join(", ")
                                : "..."}
                              ]
                            </div>
                          </div>

                          {/* L3 Gradients */}
                          <div
                            style={{
                              backgroundColor: "rgba(239, 68, 68, 0.1)",
                              border: "1px solid rgba(239, 68, 68, 0.2)",
                              padding: "6px",
                              borderRadius: "4px",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                color: "#f87171",
                                marginBottom: "2px",
                                fontWeight: "bold",
                              }}
                            >
                              δ<sup style={{ fontSize: "0.7em" }}>[3]</sup>{" "}
                              (Out)
                            </div>
                            <div style={{ color: "#fca5a5" }}>
                              [
                              {h.deltas
                                ? h.deltas.l3
                                    .map((n) => n.toFixed(4))
                                    .join(", ")
                                : "..."}
                              ]
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* --- SECTION: WEIGHTS & BIASES --- */}
                      <div
                        className="backprop-grid-3"
                        style={{
                          marginTop: "1rem",
                          paddingTop: "1rem",
                          borderTop: "1px solid rgb(34, 34, 34)",
                          alignItems: "start",
                        }}
                      >
                        {/* SPALTE 1: LAYER 1 */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                          }}
                        >
                          {/* W1 */}
                          <div>
                            <div
                              style={{
                                color: "rgb(16, 185, 129)",
                                marginBottom: "0.25rem",
                                fontWeight: "bold",
                              }}
                            >
                              W<sup style={{ fontSize: "0.7em" }}>[1]</sup>{" "}
                              <span style={{ fontSize: "0.8em", opacity: 0.7 }}>
                                (In→H1)
                              </span>
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
                          {/* B1 */}
                          <div>
                            <div
                              style={{
                                color: "rgb(16, 185, 129)",
                                marginBottom: "0.25rem",
                                fontWeight: "bold",
                                opacity: 0.9,
                              }}
                            >
                              b<sup style={{ fontSize: "0.7em" }}>[1]</sup>
                            </div>
                            <div style={{ color: "rgb(156, 163, 175)" }}>
                              [{h.bias1.map((n) => n.toFixed(2)).join(", ")}]
                            </div>
                          </div>
                        </div>

                        {/* SPALTE 2: LAYER 2 */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                          }}
                        >
                          {/* W2 */}
                          <div>
                            <div
                              style={{
                                color: "rgb(96, 165, 250)",
                                marginBottom: "0.25rem",
                                fontWeight: "bold",
                              }}
                            >
                              W<sup style={{ fontSize: "0.7em" }}>[2]</sup>{" "}
                              <span style={{ fontSize: "0.8em", opacity: 0.7 }}>
                                (H1→H2)
                              </span>
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
                          {/* B2 */}
                          <div>
                            <div
                              style={{
                                color: "rgb(96, 165, 250)",
                                marginBottom: "0.25rem",
                                fontWeight: "bold",
                                opacity: 0.9,
                              }}
                            >
                              b<sup style={{ fontSize: "0.7em" }}>[2]</sup>
                            </div>
                            <div style={{ color: "rgb(156, 163, 175)" }}>
                              [{h.bias2.map((n) => n.toFixed(2)).join(", ")}]
                            </div>
                          </div>
                        </div>

                        {/* SPALTE 3: LAYER 3 */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                          }}
                        >
                          {/* W3 */}
                          <div>
                            <div
                              style={{
                                color: "rgb(168, 85, 247)",
                                marginBottom: "0.25rem",
                                fontWeight: "bold",
                              }}
                            >
                              W<sup style={{ fontSize: "0.7em" }}>[3]</sup>{" "}
                              <span style={{ fontSize: "0.8em", opacity: 0.7 }}>
                                (H2→Out)
                              </span>
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
                          {/* B3 */}
                          <div>
                            <div
                              style={{
                                color: "rgb(168, 85, 247)",
                                marginBottom: "0.25rem",
                                fontWeight: "bold",
                                opacity: 0.9,
                              }}
                            >
                              b<sup style={{ fontSize: "0.7em" }}>[3]</sup>
                            </div>
                            <div style={{ color: "rgb(156, 163, 175)" }}>
                              [{h.bias3.map((n) => n.toFixed(2)).join(", ")}]
                            </div>
                          </div>
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
