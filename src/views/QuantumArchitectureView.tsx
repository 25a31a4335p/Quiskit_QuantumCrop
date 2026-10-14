import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Zap,
  Activity,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';

export const QuantumArchitectureView: React.FC = () => {
  const [circuitLayers, setCircuitLayers] = useState<number>(3);
  const [qubitCount, setQubitCount] = useState<number>(6);

  // Dynamic calculations based on playground sliders
  const hilbertDim = Math.pow(2, qubitCount);
  const parameterCount = qubitCount * circuitLayers * 2;
  const circuitDepth = circuitLayers * 6;

  // Simulated loss curve points
  const lossPoints = [
    { step: 0, loss: 0.88 },
    { step: 5, loss: 0.72 },
    { step: 10, loss: 0.58 },
    { step: 15, loss: 0.46 },
    { step: 20, loss: 0.38 },
    { step: 25, loss: 0.32 },
    { step: 30, loss: 0.28 },
    { step: 35, loss: 0.25 },
    { step: 40, loss: 0.23 },
    { step: 45, loss: 0.224 }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-950 text-lime-400">
                <Cpu className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-emerald-950 font-sans">
                Variational Quantum Regression (VQR) Theory & Circuit Architecture
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              How quantum parameterized circuits encode and resolve non-linear agricultural interdependencies in Indian agronomy
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700">
              Ansatz: RealAmplitudes
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 font-semibold">
              Optimizer: COBYLA / Adam
            </span>
          </div>
        </div>

        {/* 4-Step Pipeline Flow */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>STAGE 01</span>
              <span>Input x ∈ ℝ⁶</span>
            </div>
            <h4 className="text-xs font-bold text-emerald-950">
              1. Agronomic Feature Normalization
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Monsoon rainfall, fertilizer dosage, crop phenology, and soil zone indices are scaled to radians in [0, 2π].
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-700">
              <span>STAGE 02</span>
              <span>U_Φ(x)</span>
            </div>
            <h4 className="text-xs font-bold text-emerald-950">
              2. ZZ-Feature Map Kernel
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Encodes non-linear 2-qubit interactions Φ(x_i, x_j) = 2(π - x_i)(π - x_j), coupling moisture and nitrogen uptake.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>STAGE 03</span>
              <span>U_v(θ)</span>
            </div>
            <h4 className="text-xs font-bold text-emerald-950">
              3. Variational Ansatz
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Alternating layers of single-qubit rotations Ry(θ) and circular CNOT entanglement ladders trained over loss gradients.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-700">
              <span>STAGE 04</span>
              <span>⟨Z⟩ → Ŷ</span>
            </div>
            <h4 className="text-xs font-bold text-emerald-950">
              4. Pauli-Z Observable Measurement
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Measures expectation value ⟨ψ(x, θ)|Z|ψ(x, θ)⟩, inversely mapped back to physical crop yield in Tonnes/Hectare.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Architecture Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Playground Controls */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                Circuit Topology Configuration
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust quantum hyper-parameters to inspect circuit scale
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-100 text-lime-900 font-semibold">
              Interactive
            </span>
          </div>

          {/* Qubit count slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label>Qubit Count (Features n)</label>
              <span className="font-mono font-bold text-emerald-950 text-xs">
                {qubitCount} Qubits
              </span>
            </div>
            <input
              type="range"
              min={4}
              max={8}
              value={qubitCount}
              onChange={(e) => setQubitCount(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>4 Qubits (Core)</span>
              <span>6 Qubits (Standard)</span>
              <span>8 Qubits (Extended)</span>
            </div>
          </div>

          {/* Variational Layers slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label>Variational Repetitions (Layers L)</label>
              <span className="font-mono font-bold text-emerald-950 text-xs">
                {circuitLayers} Layers
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={circuitLayers}
              onChange={(e) => setCircuitLayers(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>L=1 (Shallow)</span>
              <span>L=3 (Default)</span>
              <span>L=5 (Deep)</span>
            </div>
          </div>

          {/* Derived Circuit Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Hilbert Space</div>
              <div className="text-base font-bold text-emerald-950 font-mono mt-0.5">
                2^{qubitCount} = {hilbertDim}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Trainable θ</div>
              <div className="text-base font-bold text-emerald-950 font-mono mt-0.5">
                {parameterCount}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Circuit Depth</div>
              <div className="text-base font-bold text-emerald-950 font-mono mt-0.5">
                {circuitDepth}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Simulated Loss Convergence Chart */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                COBYLA Loss Optimization Trajectory
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mean Squared Error (MSE) loss minimization across 45 quantum parameter tuning iterations
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold">
              Final Loss: 0.224
            </span>
          </div>

          {/* SVG Loss Curve */}
          <div className="mt-4">
            <div className="relative h-56 w-full">
              <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                {/* Horizontal grid */}
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((val) => {
                  const y = 180 - ((val - 0.1) / 0.9) * 150;
                  return (
                    <g key={val}>
                      <line
                        x1="40"
                        y1={y}
                        x2="480"
                        y2={y}
                        stroke="#f1f5f9"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                      <text
                        x="34"
                        y={y + 3}
                        textAnchor="end"
                        fontSize="9"
                        fill="#94a3b8"
                        fontFamily="JetBrains Mono"
                      >
                        {val.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                {/* Path line */}
                <path
                  d="M 50 40 Q 120 110, 200 135 T 350 160 T 460 165"
                  fill="none"
                  stroke="#064e3b"
                  strokeWidth="2.5"
                />

                {/* Gradient area under curve */}
                <defs>
                  <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#047857" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#047857" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 50 40 Q 120 110, 200 135 T 350 160 T 460 165 L 460 180 L 50 180 Z"
                  fill="url(#lossGradient)"
                />

                {/* Key data points */}
                {lossPoints.map((pt, i) => {
                  const x = 50 + (pt.step / 45) * 410;
                  const y = 180 - ((pt.loss - 0.1) / 0.9) * 150;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="3" fill="#84cc16" stroke="#064e3b" strokeWidth="1.5" />
                      {i % 3 === 0 && (
                        <text
                          x={x}
                          y={y - 8}
                          textAnchor="middle"
                          fontSize="8.5"
                          fontFamily="JetBrains Mono"
                          fill="#334155"
                        >
                          {pt.loss.toFixed(2)}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Baseline Axis */}
                <line x1="40" y1="180" x2="480" y2="180" stroke="#cbd5e1" strokeWidth="1" />
                <text x="260" y="196" textAnchor="middle" fontSize="9" fill="#94a3b8">
                  Optimizer Evaluation Steps
                </text>
              </svg>
            </div>
          </div>

          <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <span className="font-semibold text-slate-900">Convergence Stability: </span>
            The loss reaches asymptotic convergence around step 35. Entanglement gates enable rapid escape from local barren plateaus during parameter gradient descent.
          </div>
        </div>
      </div>
    </div>
  );
};
