import React, { useState } from 'react';
import { Cpu, Zap, Activity, Info, HelpCircle, Layers, Sliders } from 'lucide-react';
import {
  dynamicQuantumEngine,
  EntanglementStrategy,
  calculateCircuitTelemetry
} from '../models/dynamicQuantumEngine';

interface QuantumCircuitViewProps {
  qubits?: number;
  layers?: number;
  entanglement?: EntanglementStrategy;
  isSimulating?: boolean;
  activeFeatureValues?: {
    rainfall: number;
    fertilizer: number;
    crop: string;
    state: string;
    area?: number;
  };
}

export const QuantumCircuitView: React.FC<QuantumCircuitViewProps> = ({
  qubits: propQubits,
  layers: propLayers,
  entanglement: propEntanglement,
  isSimulating = false,
  activeFeatureValues
}) => {
  const [selectedGate, setSelectedGate] = useState<string | null>('hadamard');

  const currentConfig = dynamicQuantumEngine.getConfig();
  const qubits = propQubits ?? currentConfig.qubits;
  const layers = propLayers ?? currentConfig.layers;
  const entanglement = propEntanglement ?? currentConfig.entanglement;

  const telemetry = calculateCircuitTelemetry(qubits, layers, entanglement);

  // Derive feature assignment per qubit wire
  const featureNames = [
    'Rainfall (mm)',
    'Fertilizer (kg)',
    'Cultivated Area',
    'Crop Phenology',
    'State Agro-Zone',
    'Rain × Fert Interaction',
    'Rain × Area Coupling',
    'Soil Moisture Dynamics',
    'NPK Absorption Field',
    'Canopy Radiation Phase',
    'Thermal Stress Factor',
    'Agronomic Residual Wire'
  ];

  const getFeatureDisplay = (idx: number) => {
    if (idx === 0) return `${activeFeatureValues?.rainfall ?? 750} mm`;
    if (idx === 1) return `${activeFeatureValues?.fertilizer ?? 110} kg`;
    if (idx === 2) return `${activeFeatureValues?.area ?? 25} ha`;
    if (idx === 3) return activeFeatureValues?.crop || 'Wheat';
    if (idx === 4) return activeFeatureValues?.state || 'Punjab';
    return `Cross-term φ_${idx}`;
  };

  const wireHeight = 44;
  const svgHeight = Math.max(260, 60 + qubits * wireHeight);
  // Dynamic width based on layers
  const layerWidth = 140;
  const svgWidth = Math.max(760, 260 + layers * layerWidth + 120);

  // Compute CNOT pairs for the given entanglement
  const getCnotPairs = (layerIdx: number): Array<[number, number]> => {
    const pairs: Array<[number, number]> = [];
    if (entanglement === 'linear') {
      for (let i = 0; i < qubits - 1; i++) {
        pairs.push([i, i + 1]);
      }
    } else if (entanglement === 'circular') {
      for (let i = 0; i < qubits - 1; i++) {
        pairs.push([i, i + 1]);
      }
      if (qubits > 2) {
        pairs.push([qubits - 1, 0]);
      }
    } else {
      // Nearest-neighbor alternating
      if (layerIdx % 2 === 0) {
        for (let i = 0; i < qubits - 1; i += 2) {
          pairs.push([i, i + 1]);
        }
      } else {
        for (let i = 1; i < qubits - 1; i += 2) {
          pairs.push([i, i + 1]);
        }
      }
    }
    return pairs;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
      {/* Header & Circuit Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-950 text-lime-400">
              <Cpu className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-sm font-bold text-emerald-950 font-sans">
              Dynamic {qubits}-Qubit Parameterized Quantum Circuit (PQC)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Angle Embedding with {layers} Variational Rotation Layers and{' '}
            <span className="capitalize font-medium text-emerald-800">{entanglement}</span> CNOT Entanglement
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
            <span>Qubits:</span>
            <span className="font-bold text-emerald-950">{qubits}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
            <span>Layers:</span>
            <span className="font-bold text-emerald-950">{layers}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200">
            <span>Params θ:</span>
            <span className="font-bold text-emerald-950">{telemetry.totalParameters}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
            <span>CNOTs:</span>
            <span className="font-bold text-emerald-950">{telemetry.entanglingGates}</span>
          </div>
        </div>
      </div>

      {/* Circuit Schematic SVG */}
      <div className="relative overflow-x-auto pb-2 border border-slate-100 rounded-lg bg-slate-50/40">
        <div style={{ minWidth: `${svgWidth}px` }}>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full text-slate-800 select-none">
            {/* Background Grid & Definitions */}
            <defs>
              <linearGradient id="quantumGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#84cc16" stopOpacity="0" />
                <stop offset="50%" stopColor="#84cc16" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Stage Banners */}
            <rect x="70" y="8" width="130" height={svgHeight - 16} fill="#f1f5f9" rx="6" />
            <text x="135" y="24" textAnchor="middle" fontSize="9" fontWeight="700" fill="#475569" fontFamily="JetBrains Mono">
              ANGLE EMBEDDING
            </text>

            {/* Layer Banners */}
            {Array.from({ length: layers }).map((_, lIdx) => {
              const xStart = 210 + lIdx * layerWidth;
              return (
                <g key={`banner-l-${lIdx}`}>
                  <rect
                    x={xStart}
                    y="8"
                    width={layerWidth - 8}
                    height={svgHeight - 16}
                    fill={lIdx % 2 === 0 ? '#ecfdf5' : '#f0fdf4'}
                    rx="6"
                  />
                  <text
                    x={xStart + (layerWidth - 8) / 2}
                    y="24"
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="700"
                    fill="#065f46"
                    fontFamily="JetBrains Mono"
                  >
                    VARIATIONAL LAYER {lIdx + 1}
                  </text>
                </g>
              );
            })}

            {/* Measurement Banner */}
            <rect
              x={210 + layers * layerWidth + 6}
              y="8"
              width={90}
              height={svgHeight - 16}
              fill="#f8fafc"
              rx="6"
            />
            <text
              x={210 + layers * layerWidth + 51}
              y="24"
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="#475569"
              fontFamily="JetBrains Mono"
            >
              MEASURE ⟨Z⟩
            </text>

            {/* Qubit Wires */}
            {Array.from({ length: qubits }).map((_, qIdx) => {
              const y = 50 + qIdx * wireHeight;
              const featName = featureNames[qIdx] || `Feature ${qIdx}`;
              const featVal = getFeatureDisplay(qIdx);

              return (
                <g key={`wire-${qIdx}`}>
                  {/* Wire Label & State */}
                  <text
                    x="12"
                    y={y + 4}
                    fontSize="11"
                    fontWeight="700"
                    fill="#064e3b"
                    fontFamily="JetBrains Mono"
                  >
                    q_{qIdx}
                  </text>
                  <text
                    x="36"
                    y={y + 3}
                    fontSize="9"
                    fill="#64748b"
                    fontFamily="JetBrains Mono"
                  >
                    |0⟩
                  </text>

                  {/* Horizontal Wire Line */}
                  <line
                    x1="55"
                    y1={y}
                    x2={210 + layers * layerWidth + 85}
                    y2={y}
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                  />

                  {/* Animation pulse when predicting */}
                  {isSimulating && (
                    <circle cx="55" cy={y} r="3" fill="#84cc16">
                      <animate
                        attributeName="cx"
                        from="55"
                        to={210 + layers * layerWidth + 85}
                        dur={`${1.2 + qIdx * 0.12}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Angle Embedding Stage: Hadamard Gate */}
                  <rect
                    x="82"
                    y={y - 12}
                    width="24"
                    height="24"
                    rx="4"
                    fill="#064e3b"
                    className="cursor-pointer hover:brightness-110"
                    onClick={() => setSelectedGate('hadamard')}
                  />
                  <text
                    x="94"
                    y={y + 4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="JetBrains Mono"
                  >
                    H
                  </text>

                  {/* Angle Embedding Stage: RZ(θ) Gate */}
                  <rect
                    x="118"
                    y={y - 12}
                    width="38"
                    height="24"
                    rx="4"
                    fill="#047857"
                    className="cursor-pointer hover:brightness-110"
                    onClick={() => setSelectedGate('rz-angle')}
                  />
                  <text
                    x="137"
                    y={y + 4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="JetBrains Mono"
                  >
                    Rz(θ_{qIdx})
                  </text>

                  {/* Variational Layers: Rotations RX, RY, RZ per layer */}
                  {Array.from({ length: layers }).map((_, lIdx) => {
                    const layerStartX = 210 + lIdx * layerWidth;
                    const rotX = layerStartX + 14;

                    return (
                      <g key={`rot-${lIdx}-${qIdx}`}>
                        {/* Compact 3-Rotation Block */}
                        <rect
                          x={rotX}
                          y={y - 12}
                          width="52"
                          height="24"
                          rx="4"
                          fill="#022c22"
                          className="cursor-pointer hover:brightness-125"
                          onClick={() => setSelectedGate('variational-rot')}
                        />
                        <text
                          x={rotX + 26}
                          y={y + 3.5}
                          textAnchor="middle"
                          fill="#84cc16"
                          fontSize="8.5"
                          fontWeight="700"
                          fontFamily="JetBrains Mono"
                        >
                          R_{'{xyz}'}
                        </text>
                      </g>
                    );
                  })}

                  {/* Measurement Meter Symbol ⟨Z⟩ */}
                  <g
                    transform={`translate(${210 + layers * layerWidth + 30}, ${y - 13})`}
                    className="cursor-pointer"
                    onClick={() => setSelectedGate('pauli-z')}
                  >
                    <rect width="28" height="26" rx="4" fill="#1e293b" />
                    {/* Meter dial */}
                    <path
                      d="M 6 18 A 8 8 0 0 1 22 18"
                      fill="none"
                      stroke="#84cc16"
                      strokeWidth="1.2"
                    />
                    <line x1="14" y1="18" x2="19" y2="10" stroke="#84cc16" strokeWidth="1.5" />
                    <text
                      x="14"
                      y="23"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="6.5"
                      fontFamily="JetBrains Mono"
                    >
                      ⟨Z⟩
                    </text>
                  </g>
                </g>
              );
            })}

            {/* CNOT Entanglement Links per Layer */}
            {Array.from({ length: layers }).map((_, lIdx) => {
              const layerStartX = 210 + lIdx * layerWidth;
              const cnotX = layerStartX + 85;
              const pairs = getCnotPairs(lIdx);

              return (
                <g key={`cnots-layer-${lIdx}`}>
                  {pairs.map(([ctrl, tgt], pairIdx) => {
                    const y1 = 50 + ctrl * wireHeight;
                    const y2 = 50 + tgt * wireHeight;
                    const shiftX = cnotX + (pairIdx % 2 === 0 ? -4 : 6);

                    return (
                      <g key={`cnot-${lIdx}-${ctrl}-${tgt}`}>
                        {/* Connecting Line between control and target */}
                        <line
                          x1={shiftX}
                          y1={y1}
                          x2={shiftX}
                          y2={y2}
                          stroke="#059669"
                          strokeWidth="1.8"
                        />
                        {/* Control Dot (●) */}
                        <circle cx={shiftX} cy={y1} r="4" fill="#047857" stroke="#ffffff" strokeWidth="1" />
                        {/* Target Cross-Hair Target (⊕) */}
                        <circle cx={shiftX} cy={y2} r="6" fill="#ffffff" stroke="#047857" strokeWidth="1.5" />
                        <line x1={shiftX - 4} y1={y2} x2={shiftX + 4} y2={y2} stroke="#047857" strokeWidth="1.2" />
                        <line x1={shiftX} y1={y2 - 4} x2={shiftX} y2={y2 + 4} stroke="#047857" strokeWidth="1.2" />
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Gate Documentation & Mathematical Details */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div
          onClick={() => setSelectedGate('hadamard')}
          className={`p-3 rounded-lg border cursor-pointer transition-all ${
            selectedGate === 'hadamard'
              ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300'
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
          }`}
        >
          <div className="font-semibold text-emerald-950 flex items-center justify-between">
            <span>Hadamard (H)</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-white">
              Stage 1
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Creates equal superposition (|0⟩ + |1⟩)/√2 on each wire prior to angle embedding.
          </p>
        </div>

        <div
          onClick={() => setSelectedGate('rz-angle')}
          className={`p-3 rounded-lg border cursor-pointer transition-all ${
            selectedGate === 'rz-angle'
              ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300'
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
          }`}
        >
          <div className="font-semibold text-emerald-950 flex items-center justify-between">
            <span>Angle Embedding Rz(θ)</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-white">
              Stage 2
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Rotates qubit around Z-axis by normalized angle $\theta \in [0, \pi]$ representing agricultural inputs.
          </p>
        </div>

        <div
          onClick={() => setSelectedGate('variational-rot')}
          className={`p-3 rounded-lg border cursor-pointer transition-all ${
            selectedGate === 'variational-rot'
              ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300'
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
          }`}
        >
          <div className="font-semibold text-emerald-950 flex items-center justify-between">
            <span>Variational Rx, Ry, Rz</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-white">
              Stage 3
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Parameterized rotations trained via optimizer gradients ({layers * qubits * 3} trainable angles).
          </p>
        </div>

        <div
          onClick={() => setSelectedGate('cnot-entangle')}
          className={`p-3 rounded-lg border cursor-pointer transition-all ${
            selectedGate === 'cnot-entangle'
              ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-300'
              : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
          }`}
        >
          <div className="font-semibold text-emerald-950 flex items-center justify-between">
            <span>{entanglement.toUpperCase()} CNOTs</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-white">
              Entangle
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            Generates quantum entanglement across qubits, mapping non-linear synergies like moisture and soil nutrients.
          </p>
        </div>
      </div>
    </div>
  );
};
