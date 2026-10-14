import React, { useState } from 'react';
import { Cpu, Zap, Activity, Info } from 'lucide-react';

interface QuantumCircuitViewProps {
  isSimulating?: boolean;
  activeFeatureValues?: {
    rainfall: number;
    fertilizer: number;
    crop: string;
    state: string;
  };
}

export const QuantumCircuitView: React.FC<QuantumCircuitViewProps> = ({
  isSimulating = false,
  activeFeatureValues
}) => {
  const [selectedGate, setSelectedGate] = useState<string | null>('zz');

  const qubits = [
    { id: 0, label: 'q₀', name: 'State Agro-Zone', feature: activeFeatureValues?.state || 'Punjab' },
    { id: 1, label: 'q₁', name: 'Crop Phenology', feature: activeFeatureValues?.crop || 'Wheat' },
    { id: 2, label: 'q₂', name: 'Cropping Season', feature: 'Rabi' },
    { id: 3, label: 'q₃', name: 'Rainfall (mm)', feature: `${activeFeatureValues?.rainfall ?? 480} mm` },
    { id: 4, label: 'q₄', name: 'Fertilizer (kg)', feature: `${activeFeatureValues?.fertilizer ?? 135} kg` },
    { id: 5, label: 'q₅', name: 'Cultivated Area', feature: '25 ha' }
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-950 text-lime-400">
              <Cpu className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-sm font-bold text-emerald-950 font-sans">
              6-Qubit Variational Quantum Circuit (VQR Architecture)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ZZ-Feature Map non-linear kernel encoding with 3-layer RealAmplitudes variational ansatz
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
            <span>Depth:</span>
            <span className="font-bold text-emerald-950">18 gates</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
            <span>Params θ:</span>
            <span className="font-bold text-emerald-950">36 vars</span>
          </div>
        </div>
      </div>

      {/* Circuit Schematic SVG */}
      <div className="relative mt-4 overflow-x-auto pb-2">
        <div className="min-w-[680px]">
          <svg viewBox="0 0 740 280" className="w-full text-slate-800 select-none">
            {/* Background grid lines */}
            <defs>
              <linearGradient id="quantumPulse" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#84cc16" stopOpacity="0" />
                <stop offset="50%" stopColor="#84cc16" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Circuit stage background banners */}
            <rect x="70" y="8" width="55" height="264" fill="#f8fafc" rx="4" />
            <text x="97" y="24" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748b">
              STATE PREP
            </text>

            <rect x="135" y="8" width="225" height="264" fill="#f1f5f9" rx="4" />
            <text x="247" y="24" textAnchor="middle" fontSize="9" fontWeight="600" fill="#334155">
              ZZ-FEATURE MAP U_Φ(x)
            </text>

            <rect x="370" y="8" width="230" height="264" fill="#ecfdf5" rx="4" />
            <text x="485" y="24" textAnchor="middle" fontSize="9" fontWeight="600" fill="#065f46">
              VARIATIONAL ANSATZ U_v(θ)
            </text>

            <rect x="610" y="8" width="80" height="264" fill="#f8fafc" rx="4" />
            <text x="650" y="24" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748b">
              MEASURE ⟨Z⟩
            </text>

            {/* Qubit Wires */}
            {qubits.map((q, idx) => {
              const y = 50 + idx * 40;
              return (
                <g key={q.id}>
                  {/* Wire label */}
                  <text x="10" y={y + 4} fontSize="11" fontWeight="700" fill="#064e3b" fontFamily="JetBrains Mono">
                    {q.label}
                  </text>
                  <text x="32" y={y + 3} fontSize="8.5" fill="#64748b" fontFamily="Plus Jakarta Sans">
                    |0⟩
                  </text>

                  {/* Horizontal Wire Line */}
                  <line x1="50" y1={y} x2="660" y2={y} stroke="#cbd5e1" strokeWidth="1.5" />

                  {/* Pulsing indicator when calculating */}
                  {isSimulating && (
                    <circle cx="50" cy={y} r="3" fill="#84cc16">
                      <animate
                        attributeName="cx"
                        from="50"
                        to="660"
                        dur={`${1.2 + idx * 0.15}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Stage 1: Hadamard Gates */}
                  <rect
                    x="82"
                    y={y - 12}
                    width="24"
                    height="24"
                    rx="4"
                    fill="#064e3b"
                    className="cursor-pointer hover:opacity-85"
                    onClick={() => setSelectedGate('hadamard')}
                  />
                  <text x="94" y={y + 4} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700" fontFamily="JetBrains Mono">
                    H
                  </text>

                  {/* Stage 2: Rz Feature Gates */}
                  <rect
                    x="150"
                    y={y - 12}
                    width="30"
                    height="24"
                    rx="4"
                    fill="#047857"
                    className="cursor-pointer hover:opacity-85"
                    onClick={() => setSelectedGate('rz')}
                  />
                  <text x="165" y={y + 4} textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="600" fontFamily="JetBrains Mono">
                    Rz(x{idx})
                  </text>

                  {/* Stage 3: Variational Ry Gates */}
                  <rect
                    x="385"
                    y={y - 12}
                    width="30"
                    height="24"
                    rx="4"
                    fill="#10b981"
                    className="cursor-pointer hover:opacity-85"
                    onClick={() => setSelectedGate('ry')}
                  />
                  <text x="400" y={y + 4} textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="600" fontFamily="JetBrains Mono">
                    Ry(θ{idx})
                  </text>

                  {/* Variational Rz Layer 2 */}
                  <rect
                    x="510"
                    y={y - 12}
                    width="30"
                    height="24"
                    rx="4"
                    fill="#059669"
                    className="cursor-pointer hover:opacity-85"
                    onClick={() => setSelectedGate('ry')}
                  />
                  <text x="525" y={y + 4} textAnchor="middle" fill="#ffffff" fontSize="8.5" fontWeight="600" fontFamily="JetBrains Mono">
                    Rz(θ{idx + 6})
                  </text>

                  {/* Stage 4: Pauli-Z Measurement */}
                  <rect x="625" y={y - 12} width="24" height="24" rx="4" fill="#334155" />
                  <path d={`M 631 ${y + 6} A 6 6 0 0 1 643 ${y + 6}`} fill="none" stroke="#f8fafc" strokeWidth="1.2" />
                  <line x1="637" y1={y + 6} x2="643" y2={y - 4} stroke="#84cc16" strokeWidth="1.2" />
                </g>
              );
            })}

            {/* ZZ Feature Map Entanglement: CNOT + Rz + CNOT between q3 (Rainfall) and q4 (Fertilizer) */}
            <g
              className="cursor-pointer hover:opacity-90"
              onClick={() => setSelectedGate('zz')}
            >
              {/* Entanglement Line */}
              <line x1="230" y1="170" x2="230" y2="210" stroke="#047857" strokeWidth="2" />
              {/* Control node on q3 */}
              <circle cx="230" cy="170" r="4.5" fill="#047857" />
              {/* Target XOR on q4 */}
              <circle cx="230" cy="210" r="8" fill="#ffffff" stroke="#047857" strokeWidth="2" />
              <line x1="225" y1="210" x2="235" y2="210" stroke="#047857" strokeWidth="2" />
              <line x1="230" y1="205" x2="230" y2="215" stroke="#047857" strokeWidth="2" />

              {/* Interaction Phase Box */}
              <rect x="250" y="180" width="60" height="22" rx="4" fill="#064e3b" />
              <text x="280" y="195" textAnchor="middle" fill="#a3e635" fontSize="8.5" fontWeight="600" fontFamily="JetBrains Mono">
                ZZ(Φ₃₄)
              </text>

              {/* Second CNOT unentangling */}
              <line x1="330" y1="170" x2="330" y2="210" stroke="#047857" strokeWidth="2" />
              <circle cx="330" cy="170" r="4.5" fill="#047857" />
              <circle cx="330" cy="210" r="8" fill="#ffffff" stroke="#047857" strokeWidth="2" />
              <line x1="325" y1="210" x2="335" y2="210" stroke="#047857" strokeWidth="2" />
              <line x1="330" y1="205" x2="330" y2="215" stroke="#047857" strokeWidth="2" />
            </g>

            {/* Variational CNOT Ring Layer */}
            <g onClick={() => setSelectedGate('ansatz')}>
              {/* CNOT between q0 and q1 */}
              <line x1="440" y1="50" x2="440" y2="90" stroke="#059669" strokeWidth="1.8" />
              <circle cx="440" cy="50" r="4" fill="#059669" />
              <circle cx="440" cy="90" r="6" fill="#fff" stroke="#059669" strokeWidth="1.8" />

              {/* CNOT between q2 and q3 */}
              <line x1="455" y1="130" x2="455" y2="170" stroke="#059669" strokeWidth="1.8" />
              <circle cx="455" cy="130" r="4" fill="#059669" />
              <circle cx="455" cy="170" r="6" fill="#fff" stroke="#059669" strokeWidth="1.8" />

              {/* CNOT between q4 and q5 */}
              <line x1="470" y1="210" x2="470" y2="250" stroke="#059669" strokeWidth="1.8" />
              <circle cx="470" cy="210" r="4" fill="#059669" />
              <circle cx="470" cy="250" r="6" fill="#fff" stroke="#059669" strokeWidth="1.8" />
            </g>
          </svg>
        </div>
      </div>

      {/* Interactive Explanation Box */}
      <div className="mt-4 rounded-lg bg-slate-50 p-3.5 border border-slate-200 text-xs">
        {selectedGate === 'zz' && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-semibold text-emerald-950 font-mono">
              <span className="text-lime-600">■</span> ZZ Feature Map Entanglement (q₃ Rainfall ⊗ q₄ Fertilizer)
            </div>
            <p className="text-slate-600">
              Encodes non-linear synergy: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">Φ(x₃, x₄) = 2(π - x₃)(π - x₄)</code>. This enables the model to represent how nitrogen fertilizer efficiency drops exponentially during drought or severe waterlogging without manual quadratic feature expansion.
            </p>
          </div>
        )}
        {selectedGate === 'hadamard' && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-semibold text-emerald-950 font-mono">
              <span className="text-lime-600">■</span> Hadamard Gate Layer H
            </div>
            <p className="text-slate-600">
              Transforms ground state <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">|0...0⟩</code> into an equal superposition across all 2⁶ = 64 computational basis states, establishing the Hilbert space basis prior to data encoding.
            </p>
          </div>
        )}
        {selectedGate === 'rz' && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-semibold text-emerald-950 font-mono">
              <span className="text-lime-600">■</span> 1-Qubit Rotation R_z(x_i)
            </div>
            <p className="text-slate-600">
              Maps continuous agricultural inputs (normalized rainfall, fertilizer dosage, acreage) into quantum phase rotations <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">e^(-i x_i Z / 2)</code> on the Bloch sphere.
            </p>
          </div>
        )}
        {selectedGate === 'ry' && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-semibold text-emerald-950 font-mono">
              <span className="text-lime-600">■</span> Variational Ansatz Rotations R_y(θ_j)
            </div>
            <p className="text-slate-600">
              36 tunable classical parameters optimized via COBYLA / Adam gradient descent to minimize Mean Squared Error (MSE) loss against field yield measurements.
            </p>
          </div>
        )}
        {selectedGate === 'ansatz' && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-semibold text-emerald-950 font-mono">
              <span className="text-lime-600">■</span> Entangling Layer (CNOT Mesh)
            </div>
            <p className="text-slate-600">
              Linear entanglement ladder creates quantum correlations across all six agricultural variables, capturing complex higher-order couplings across agro-climatic zones and seasonal variations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
