import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Layers,
  Zap,
  Activity,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  TrendingDown,
  Info,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Clock,
  Gauge,
  History,
  ShieldAlert
} from 'lucide-react';
import {
  dynamicQuantumEngine,
  EntanglementStrategy,
  QuantumOptimizer,
  calculateCircuitTelemetry,
  VQRRunMetrics
} from '../models/dynamicQuantumEngine';
import { QuantumCircuitView } from '../components/QuantumCircuitView';
import { MetricCard } from '../components/MetricCard';

export const QuantumArchitectureView: React.FC = () => {
  const [config, setConfig] = useState(dynamicQuantumEngine.getConfig());
  const [metrics, setMetrics] = useState<VQRRunMetrics>(dynamicQuantumEngine.getActiveMetrics());
  const [history, setHistory] = useState<VQRRunMetrics[]>(dynamicQuantumEngine.getRunHistory());
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingMessage, setTrainingMessage] = useState<string>('');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Subscribe to engine state updates
  useEffect(() => {
    const unsubscribe = dynamicQuantumEngine.subscribe(() => {
      setConfig(dynamicQuantumEngine.getConfig());
      setMetrics(dynamicQuantumEngine.getActiveMetrics());
      setHistory(dynamicQuantumEngine.getRunHistory());
    });
    return unsubscribe;
  }, []);

  const telemetry = calculateCircuitTelemetry(config.qubits, config.layers, config.entanglement);

  const handleQubitChange = (q: number) => {
    setErrorNotice(null);
    dynamicQuantumEngine.updateConfig({ qubits: q });
  };

  const handleLayerChange = (l: number) => {
    setErrorNotice(null);
    dynamicQuantumEngine.updateConfig({ layers: l });
  };

  const handleEntanglementChange = (strategy: EntanglementStrategy) => {
    setErrorNotice(null);
    dynamicQuantumEngine.updateConfig({ entanglement: strategy });
  };

  const handleOptimizerChange = (opt: QuantumOptimizer) => {
    setErrorNotice(null);
    dynamicQuantumEngine.updateConfig({ optimizer: opt });
  };

  const handleEpochsChange = (epochs: number) => {
    dynamicQuantumEngine.updateConfig({ epochs });
  };

  const handleLearningRateChange = (lr: number) => {
    dynamicQuantumEngine.updateConfig({ learningRate: lr });
  };

  const handleToggleAutoRetrain = (val: boolean) => {
    dynamicQuantumEngine.updateConfig({ autoRetrain: val });
  };

  const handleTriggerTrain = async () => {
    setErrorNotice(null);
    setIsTraining(true);
    setTrainingMessage('Submitting configuration to PennyLane quantum engine...');

    try {
      const res = await dynamicQuantumEngine.trainModel(undefined, (msg) => {
        setTrainingMessage(msg);
      });
      if (res.status === 'error') {
        setErrorNotice(res.errorMessage || 'Training failed');
      }
    } catch (err: any) {
      setErrorNotice(err.message || 'An unexpected training error occurred.');
    } finally {
      setIsTraining(false);
      setTrainingMessage('');
    }
  };

  const isStale = metrics.status === 'stale_needs_retrain';

  return (
    <div className="space-y-6">
      {/* Top Banner & Theory Intro */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-950 text-lime-400">
                <Cpu className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-emerald-950 font-sans">
                Dynamic PennyLane Quantum Architecture & Variational Circuit Tuning
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Dynamically configure qubits, variational layers, and entanglement topologies to analyze their empirical impact on crop yield predictions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span
              className={`px-2.5 py-1 rounded font-semibold ${
                metrics.status === 'trained'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : metrics.status === 'training'
                  ? 'bg-amber-100 text-amber-900 animate-pulse border border-amber-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              {metrics.status === 'trained'
                ? 'Model Trained & Active'
                : metrics.status === 'training'
                ? 'Training in Progress...'
                : 'Architecture Modified · Pending Retrain'}
            </span>
          </div>
        </div>

        {/* 4-Step Real Pipeline Flow */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between font-mono text-slate-400 text-[10px]">
              <span>STAGE 1</span>
              <span>x ∈ ℝ⁵</span>
            </div>
            <h4 className="font-bold text-emerald-950 text-xs">Angle Embedding</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Standardizes rainfall, fertilizer, area, crop, and state, mapped into $[0, \pi]$ rotation angles.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 space-y-1">
            <div className="flex items-center justify-between font-mono text-emerald-700 text-[10px]">
              <span>STAGE 2</span>
              <span>U_v(θ)</span>
            </div>
            <h4 className="font-bold text-emerald-950 text-xs">Variational Rotations</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Trains $R_x, R_y, R_z$ unitary gates per wire across {config.layers} repetitions ({config.layers * config.qubits * 3} parameters).
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between font-mono text-slate-400 text-[10px]">
              <span>STAGE 3</span>
              <span>CNOT Lattice</span>
            </div>
            <h4 className="font-bold text-emerald-950 text-xs">{config.entanglement.toUpperCase()} Entanglement</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Generates quantum entanglement across wires to capture non-linear agro-climatic interactions.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 space-y-1">
            <div className="flex items-center justify-between font-mono text-emerald-700 text-[10px]">
              <span>STAGE 4</span>
              <span>⟨Z⟩ → Ŷ</span>
            </div>
            <h4 className="font-bold text-emerald-950 text-xs">Observable Readout</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Measures Pauli-Z expectation values and linearly scales them to physical yields (t/ha).
            </p>
          </div>
        </div>
      </div>

      {/* Main Control Panel & Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Configuration Panel */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                Quantum Architecture Controls
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure hyperparameters and retrain the PennyLane model
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-100 text-lime-900 font-semibold">
              Live Config
            </span>
          </div>

          {/* Qubit Count Slider (2 to 12) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label>Number of Qubits (Wires N)</label>
              <span className="font-mono font-bold text-emerald-950 px-2 py-0.5 rounded bg-slate-100">
                {config.qubits} Qubits
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={12}
              value={config.qubits}
              disabled={isTraining}
              onChange={(e) => handleQubitChange(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>2 Qubits</span>
              <span>4 (Default)</span>
              <span>8 (Advanced)</span>
              <span>12 Qubits</span>
            </div>
            {telemetry.complexityWarning && (
              <div className="flex items-start gap-1.5 p-2 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                <span>{telemetry.complexityWarning}</span>
              </div>
            )}
          </div>

          {/* Variational Layers Slider (1 to 8) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label>Variational Layers (Depth L)</label>
              <span className="font-mono font-bold text-emerald-950 px-2 py-0.5 rounded bg-slate-100">
                {config.layers} Layers
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={8}
              value={config.layers}
              disabled={isTraining}
              onChange={(e) => handleLayerChange(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>L=1 (Shallow)</span>
              <span>L=2 (Standard)</span>
              <span>L=4</span>
              <span>L=8 (Deep)</span>
            </div>
          </div>

          {/* Entanglement Strategy */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-semibold text-slate-700 block">
              Entanglement Strategy
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['linear', 'circular', 'nearest-neighbor'] as EntanglementStrategy[]).map((strat) => (
                <button
                  key={strat}
                  type="button"
                  disabled={isTraining}
                  onClick={() => handleEntanglementChange(strat)}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all capitalize ${
                    config.entanglement === strat
                      ? 'bg-emerald-950 text-white border-emerald-950 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {strat.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Optimizer & Training Hyperparameters */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Optimizer</label>
              <select
                value={config.optimizer}
                disabled={isTraining}
                onChange={(e) => handleOptimizerChange(e.target.value as QuantumOptimizer)}
                className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                <option value="Adam">Adam</option>
                <option value="GradientDescent">Gradient Descent</option>
                <option value="COBYLA">COBYLA</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <label>Epochs</label>
                <span className="font-mono text-emerald-900">{config.epochs}</span>
              </div>
              <input
                type="range"
                min={2}
                max={30}
                value={config.epochs}
                disabled={isTraining}
                onChange={(e) => handleEpochsChange(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
            </div>
          </div>

          {/* Learning Rate & Auto-Retrain Toggle */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 items-center">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Learning Rate (η)</label>
              <input
                type="number"
                step="0.01"
                min="0.005"
                max="0.3"
                value={config.learningRate}
                disabled={isTraining}
                onChange={(e) => handleLearningRateChange(Number(e.target.value))}
                className="w-full py-1 px-2.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-medium text-slate-700">Auto-Retrain</div>
              <input
                type="checkbox"
                checked={config.autoRetrain}
                disabled={isTraining}
                onChange={(e) => handleToggleAutoRetrain(e.target.checked)}
                className="w-4 h-4 accent-emerald-800 cursor-pointer"
              />
            </div>
          </div>

          {/* Train / Retrain Button & Progress */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            {isStale && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Architecture has changed. Click Retrain to evaluate new parameters.</span>
              </div>
            )}

            {errorNotice && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0" />
                <span>{errorNotice}</span>
              </div>
            )}

            <button
              type="button"
              disabled={isTraining}
              onClick={handleTriggerTrain}
              className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                isTraining
                  ? 'bg-slate-200 text-slate-500 cursor-wait'
                  : isStale
                  ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                  : 'bg-emerald-950 hover:bg-emerald-900 text-white shadow-xs'
              }`}
            >
              {isTraining ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{trainingMessage || 'Training Quantum Model...'}</span>
                </>
              ) : isStale ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retrain New Architecture ({config.qubits} Qubits · {config.layers} Layers)</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Train / Retrain with PennyLane</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Telemetry & Empirical Evaluation */}
        <div className="lg:col-span-7 space-y-5">
          {/* Key Derived Architecture Telemetry */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Hilbert Space</div>
              <div className="text-base font-bold text-emerald-950 font-mono mt-0.5">
                2^{config.qubits} = {telemetry.hilbertDimension.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Quantum basis states</div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Trainable Params</div>
              <div className="text-base font-bold text-emerald-950 font-mono mt-0.5">
                {telemetry.totalParameters}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">θ rotations + readout</div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Entangling CNOTs</div>
              <div className="text-base font-bold text-emerald-950 font-mono mt-0.5">
                {telemetry.entanglingGates}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{config.entanglement} lattice</div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Circuit Depth</div>
              <div className="text-base font-bold text-emerald-950 font-mono mt-0.5">
                {telemetry.circuitDepth}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Sequential gate steps</div>
            </div>
          </div>

          {/* Loss Convergence & Training Trajectory */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-sm font-bold text-emerald-950 font-sans">
                  Loss Optimization Trajectory ({config.optimizer})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mean Squared Error (MSE) loss across training iterations on held-out split
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold">
                  Final Loss: {metrics.lossHistory.slice(-1)[0] ?? '0.224'}
                </span>
              </div>
            </div>

            {/* SVG Loss Trajectory Chart */}
            <div className="mt-4">
              <div className="relative h-48 w-full">
                <svg viewBox="0 0 500 180" className="w-full h-full overflow-visible select-none">
                  {/* Grid lines */}
                  {[0.2, 0.4, 0.6, 0.8].map((val) => {
                    const y = 150 - ((val - 0.1) / 0.8) * 120;
                    return (
                      <g key={val}>
                        <line x1="40" y1={y} x2="480" y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2 2" />
                        <text x="34" y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="JetBrains Mono">
                          {val.toFixed(1)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Gradient Area */}
                  <defs>
                    <linearGradient id="vqrLossGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {metrics.lossHistory.length > 1 && (
                    <>
                      {/* Area Fill */}
                      <path
                        d={`M 50 ${150 - ((metrics.lossHistory[0] - 0.1) / 0.8) * 120} ` +
                          metrics.lossHistory
                            .map((loss, idx) => {
                              const x = 50 + (idx / (metrics.lossHistory.length - 1)) * 410;
                              const y = 150 - ((loss - 0.1) / 0.8) * 120;
                              return `L ${x} ${y}`;
                            })
                            .join(' ') +
                          ` L 460 150 L 50 150 Z`}
                        fill="url(#vqrLossGrad)"
                      />

                      {/* Stroke Line */}
                      <path
                        d={`M 50 ${150 - ((metrics.lossHistory[0] - 0.1) / 0.8) * 120} ` +
                          metrics.lossHistory
                            .map((loss, idx) => {
                              const x = 50 + (idx / (metrics.lossHistory.length - 1)) * 410;
                              const y = 150 - ((loss - 0.1) / 0.8) * 120;
                              return `L ${x} ${y}`;
                            })
                            .join(' ')}
                        fill="none"
                        stroke="#047857"
                        strokeWidth="2.5"
                      />

                      {/* Data dots */}
                      {metrics.lossHistory.map((loss, idx) => {
                        const x = 50 + (idx / (metrics.lossHistory.length - 1)) * 410;
                        const y = 150 - ((loss - 0.1) / 0.8) * 120;
                        return (
                          <g key={idx}>
                            <circle cx={x} cy={y} r="3" fill="#84cc16" stroke="#064e3b" strokeWidth="1.5" />
                            {idx % 2 === 0 && (
                              <text x={x} y={y - 7} textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono" fill="#475569">
                                {loss.toFixed(3)}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </>
                  )}

                  {/* Axis */}
                  <line x1="40" y1="150" x2="480" y2="150" stroke="#cbd5e1" strokeWidth="1" />
                  <text x="260" y="168" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="JetBrains Mono">
                    Training Iterations (Epochs)
                  </text>
                </svg>
              </div>
            </div>

            {/* Empirical Performance Metrics for Current Architecture */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100">
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-mono block">R² Test Score</span>
                <span className="text-sm font-bold text-emerald-950 font-mono">
                  {metrics.status === 'stale_needs_retrain' ? 'Pending' : metrics.r2Score.toFixed(3)}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-mono block">MAE (t/ha)</span>
                <span className="text-sm font-bold text-emerald-950 font-mono">
                  {metrics.status === 'stale_needs_retrain' ? 'Pending' : `${metrics.maeTonnesPerHa.toFixed(3)}`}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-mono block">Training Time</span>
                <span className="text-sm font-bold text-emerald-950 font-mono">
                  {metrics.status === 'stale_needs_retrain' ? 'Pending' : `${metrics.trainingTimeSec}s`}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 font-mono block">Inference Latency</span>
                <span className="text-sm font-bold text-emerald-950 font-mono">
                  {metrics.status === 'stale_needs_retrain' ? 'Pending' : `${metrics.inferenceTimeMs}ms`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Synchronized Quantum Circuit Visualization */}
      <QuantumCircuitView
        qubits={config.qubits}
        layers={config.layers}
        entanglement={config.entanglement}
        isSimulating={isTraining}
      />

      {/* Architecture Training Run History Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-900" />
            <h3 className="text-sm font-bold text-emerald-950">
              Evaluation & Training Run History
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {history.length} Saved Architecture Runs
          </span>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-mono text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-2 px-3">Run ID</th>
                <th className="py-2 px-3">Architecture</th>
                <th className="py-2 px-3">Entanglement</th>
                <th className="py-2 px-3">Optimizer</th>
                <th className="py-2 px-3">Params</th>
                <th className="py-2 px-3">R² Score</th>
                <th className="py-2 px-3">MAE (t/ha)</th>
                <th className="py-2 px-3">Latency</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {history.map((h, i) => (
                <tr key={h.runId || i} className={i === 0 ? 'bg-emerald-50/40 font-semibold' : ''}>
                  <td className="py-2.5 px-3 text-slate-700">{h.runId.slice(0, 16)}</td>
                  <td className="py-2.5 px-3 text-emerald-950">
                    {h.config.qubits} Qubits · {h.config.layers} Layers
                  </td>
                  <td className="py-2.5 px-3 capitalize text-slate-600">{h.config.entanglement}</td>
                  <td className="py-2.5 px-3 text-slate-600">{h.config.optimizer}</td>
                  <td className="py-2.5 px-3 text-slate-600">{h.config.layers * h.config.qubits * 3 + h.config.qubits + 1}</td>
                  <td className="py-2.5 px-3 text-emerald-800">{h.r2Score.toFixed(3)}</td>
                  <td className="py-2.5 px-3 text-slate-700">{h.maeTonnesPerHa.toFixed(3)}</td>
                  <td className="py-2.5 px-3 text-slate-600">{h.inferenceTimeMs}ms</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        h.status === 'trained'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
