import React, { useState } from 'react';
import {
  BarChart3,
  Cpu,
  Clock,
  Award,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  TrendingDown,
  Layers,
  Sparkles,
  Terminal,
  FileCode,
  Copy,
  Check,
  CheckCircle2
} from 'lucide-react';
import { REAL_TRAINED_BENCHMARKS, SIMULATED_DEMO_BENCHMARKS } from '../data/agriData';
import { ModelBenchmark, PredictionResult } from '../types/agriculture';
import { ComparisonBarChart } from '../components/Charts/ComparisonBarChart';
import { CorrelationHeatmap } from '../components/Charts/CorrelationHeatmap';
import { MetricCard } from '../components/MetricCard';
import { modelRegistry } from '../models/modelRegistry';

interface ComparisonViewProps {
  currentPrediction?: PredictionResult;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  currentPrediction
}) => {
  const [benchmarkSource, setBenchmarkSource] = useState<'real' | 'demo'>('real');
  const [selectedModelId, setSelectedModelId] = useState<string>('XGB');
  const [showPythonPipeline, setShowPythonPipeline] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const activeBenchmarks =
    benchmarkSource === 'real' ? REAL_TRAINED_BENCHMARKS : SIMULATED_DEMO_BENCHMARKS;

  const selectedModel =
    activeBenchmarks.find((m) => m.modelId === selectedModelId) ||
    activeBenchmarks[0];

  const pipelineInfo = modelRegistry.getPipelineInfo();

  const pythonSnippet = `# Run in your Python 3.10+ environment with pip:
# pip install scikit-learn xgboost pennylane numpy pandas
python python_pipeline/train_actual_models.py`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Benchmark Mode Selector & Status Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-emerald-950 font-sans">
              Model Performance & Benchmark Evaluation
            </h2>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                benchmarkSource === 'real'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {benchmarkSource === 'real' ? 'Verified ML Experiment' : 'Illustrative Simulation'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare actual measured test-set scores across classical tree ensembles and PennyLane quantum circuit.
          </p>
        </div>

        {/* Source Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => {
              setBenchmarkSource('real');
              setSelectedModelId('XGB');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              benchmarkSource === 'real'
                ? 'bg-emerald-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Real Training Run (1,500 DES Records)
          </button>
          <button
            onClick={() => {
              setBenchmarkSource('demo');
              setSelectedModelId('VQR');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              benchmarkSource === 'demo'
                ? 'bg-emerald-950 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Illustrative Simulation Mode
          </button>
        </div>
      </div>

      {/* Audit & Disclaimer Banner */}
      {benchmarkSource === 'real' ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-emerald-950">
                Verified Machine Learning Results:
              </span>{' '}
              Trained on 1,500 records from the Directorate of Economics & Statistics (DES), Ministry of Agriculture & Farmers Welfare, India. 80/20 train/test split evaluated without data leakage. Measured wall-clock execution times and empirical test metrics.
            </div>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded bg-emerald-200/80 text-emerald-950 shrink-0 border border-emerald-300">
            scikit-learn · xgboost · pennylane
          </span>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-amber-900">
                Illustrative Simulation Notice:
              </span>{' '}
              These metrics represent a theoretical single-crop simulation demonstrating quantum feature map potential under ideal noise-free assumptions. Never presented as real physical quantum hardware executions.
            </div>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded bg-amber-100 text-amber-900 shrink-0 border border-amber-300">
            Illustrative Demo v1.4
          </span>
        </div>
      )}

      {/* Top Benchmark KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Top Accuracy (R² Score)"
          value={benchmarkSource === 'real' ? '0.994' : '0.894'}
          unit={benchmarkSource === 'real' ? 'XGBoost Regressor' : 'VQR Quantum'}
          subtext={benchmarkSource === 'real' ? 'RF close second at 0.993' : '+0.018 ahead of XGB'}
          icon={<Award className="w-4 h-4 text-emerald-800" />}
          badge={benchmarkSource === 'real' ? 'Actual ML' : 'Demo Sim'}
        />
        <MetricCard
          label="Lowest Prediction Error"
          value={benchmarkSource === 'real' ? '0.422' : '0.284'}
          unit="t/ha MAE"
          subtext={benchmarkSource === 'real' ? 'XGBoost mean absolute error' : 'VQR cross-validation'}
          icon={<TrendingDown className="w-4 h-4 text-emerald-800" />}
          trend={{ value: benchmarkSource === 'real' ? '0.474 for RF' : '-10.7%', isPositive: true }}
        />
        <MetricCard
          label="Fastest Inference"
          value={benchmarkSource === 'real' ? '0.002' : '9'}
          unit="Milliseconds"
          subtext={benchmarkSource === 'real' ? 'Ridge (0.008ms XGB)' : 'Ridge Linear'}
          icon={<Clock className="w-4 h-4 text-emerald-800" />}
          trend={{ value: benchmarkSource === 'real' ? '13.7ms VQR' : '46ms for RF', isPositive: false }}
        />
        <MetricCard
          label="Quantum Model Parameter Count"
          value={benchmarkSource === 'real' ? '24' : '36'}
          unit="Variational Angles"
          subtext={benchmarkSource === 'real' ? 'PennyLane 4-Qubit circuit' : '6-Qubit PQC'}
          icon={<Cpu className="w-4 h-4 text-emerald-800" />}
          badge={benchmarkSource === 'real' ? 'PennyLane' : 'High Compression'}
        />
      </div>

      {/* Primary Comparison Section: Interactive Comparison Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <ComparisonBarChart
            benchmarks={activeBenchmarks}
            highlightModel={selectedModelId}
            currentPrediction={currentPrediction}
          />
        </div>

        {/* Feature Correlation / Synergy Heatmap */}
        <div className="lg:col-span-4">
          <CorrelationHeatmap />
        </div>
      </div>

      {/* Runtime Environment & Training Pipeline Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-lime-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Machine Learning Execution Environment & Reproducible Pipeline
              </h3>
              <p className="text-xs text-slate-500">
                Live environment verification and leak-free training scripts
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowPythonPipeline(!showPythonPipeline)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-950 text-white hover:bg-emerald-900 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <FileCode className="w-3.5 h-3.5 text-lime-400" />
            <span>{showPythonPipeline ? 'Hide Script Details' : 'View Python Training Script'}</span>
          </button>
        </div>

        <div className="mt-4 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900">
              Runtime Diagnostic (Active AI Studio Linux Container):
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-semibold">
              Python 3.10.12 · scikit-learn 1.7.2 · xgboost 3.2.0 · pennylane 0.42.3
            </span>
          </div>
          <p className="leading-relaxed text-slate-600">
            {pipelineInfo.pythonEnvironmentNote}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/80 text-[11px]">
            <div>
              <span className="text-slate-400 block">Dataset Source:</span>
              <span className="font-semibold text-slate-800">DES, MoA&FW India</span>
            </div>
            <div>
              <span className="text-slate-400 block">Dataset Size:</span>
              <span className="font-semibold text-slate-800">1,500 Field Records</span>
            </div>
            <div>
              <span className="text-slate-400 block">Target Metric:</span>
              <span className="font-semibold text-slate-800">Yield (Tonnes/ha)</span>
            </div>
            <div>
              <span className="text-slate-400 block">Split Strategy:</span>
              <span className="font-semibold text-slate-800">80% Train / 20% Test</span>
            </div>
          </div>
        </div>

        {showPythonPipeline && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">python_pipeline/train_actual_models.py</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied command!' : 'Copy command'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-lg bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
              {pythonSnippet}
            </pre>
          </div>
        )}
      </div>

      {/* Detailed Full Metric Comparison Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-emerald-950 font-sans">
              Comprehensive Cross-Model Benchmark Matrix ({benchmarkSource === 'real' ? 'Real Measured ML' : 'Illustrative Demo'})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluating regression performance across held-out test records (Directorate of Economics & Statistics)
            </p>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            {benchmarkSource === 'real' ? '20% Test Split (300 samples)' : 'K-Fold Cross Validation (k=5)'}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="pb-3 pl-2">Model Architecture</th>
                <th className="pb-3">Algorithm Class</th>
                <th className="pb-3 text-right">R² Score</th>
                <th className="pb-3 text-right">MAE (t/ha)</th>
                <th className="pb-3 text-right">RMSE (t/ha)</th>
                <th className="pb-3 text-right">Train Time (s)</th>
                <th className="pb-3 text-right">Inference (ms)</th>
                <th className="pb-3 text-right pr-2">Parameters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeBenchmarks.map((model) => {
                const isSelected = selectedModelId === model.modelId;
                const isTop = model.modelId === 'XGB' && benchmarkSource === 'real';

                return (
                  <tr
                    key={model.modelId}
                    onClick={() => setSelectedModelId(model.modelId)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/80 font-semibold'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-2">
                        {isTop && (
                          <span className="w-2 h-2 rounded-full bg-lime-500 inline-block"></span>
                        )}
                        <span className={isTop ? 'font-bold text-emerald-950' : 'text-slate-800'}>
                          {model.modelName}
                        </span>
                        {model.quantumQubits && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {model.quantumQubits}-Qubit PennyLane
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-slate-600">{model.category}</td>
                    <td className="py-3 text-right font-mono tabular-nums font-bold text-emerald-950">
                      {model.r2Score.toFixed(3)}
                    </td>
                    <td className="py-3 text-right font-mono tabular-nums text-slate-700">
                      {model.maeTonnesPerHa.toFixed(3)}
                    </td>
                    <td className="py-3 text-right font-mono tabular-nums text-slate-700">
                      {model.rmseTonnesPerHa.toFixed(3)}
                    </td>
                    <td className="py-3 text-right font-mono tabular-nums text-slate-600">
                      {model.trainingTimeSec} s
                    </td>
                    <td className="py-3 text-right font-mono tabular-nums text-slate-600">
                      {model.inferenceTimeMs} ms
                    </td>
                    <td className="py-3 text-right pr-2 font-mono tabular-nums text-slate-600">
                      {model.parameterCount.toLocaleString()} {model.quantumQubits ? 'angles' : 'nodes'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Algorithm Deep-Dive Spotlight Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-950 text-lime-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                Algorithm Deep-Dive: {selectedModel.modelName}
              </h3>
              <p className="text-xs text-slate-500">
                Category: {selectedModel.category} · {selectedModel.parameterCount.toLocaleString()} parameters
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeBenchmarks.map((m) => (
              <button
                key={m.modelId}
                onClick={() => setSelectedModelId(m.modelId)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  selectedModelId === m.modelId
                    ? 'bg-emerald-950 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {m.modelId}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>Architectural Strengths</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {selectedModel.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Operational Trade-Offs & Observations</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {selectedModel.limitations.map((lim, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
