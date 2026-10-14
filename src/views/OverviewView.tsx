import React from 'react';
import {
  TrendingUp,
  Sprout,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart2,
  Calendar,
  CloudRain
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { BENCHMARK_MODELS, CROPS_CONFIG, SAMPLE_INPUT_PRESETS } from '../data/agriData';
import { ComparisonBarChart } from '../components/Charts/ComparisonBarChart';
import { ActiveTab } from '../components/Sidebar';
import { PredictionInput } from '../types/agriculture';

interface OverviewViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onSelectPreset: (preset: PredictionInput) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  onSelectPreset
}) => {
  return (
    <div className="space-y-6">
      {/* Hero Problem Statement & Quantum Mechanism Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 p-6 sm:p-8 text-white shadow-sm">
        {/* Subtle decorative grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#84cc16_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 text-lime-300 text-xs font-mono mb-4 border border-white/15">
            <Cpu className="w-3.5 h-3.5" />
            <span>Problem Statement · QML for Indian Agricultural Productivity</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white font-sans text-balance">
            Quantum-Enhanced Yield Modeling for Indian Agro-Ecosystems
          </h1>

          <p className="mt-3 text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
            Indian agriculture faces non-linear multi-factor unpredictability: erratic monsoon rainfall patterns, complex fertilizer kinetics, and diverse soil regimes. QuantumCrop AI leverages <strong className="text-lime-300 font-semibold">Variational Quantum Regression (VQR)</strong> with parametrized 2-qubit ZZ feature maps to uncover subtle non-linear interactions invisible to classical models.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('predict')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-400 text-emerald-950 font-bold text-xs sm:text-sm hover:bg-lime-300 transition-colors shadow-xs"
            >
              <Sprout className="w-4 h-4 text-emerald-950" />
              <span>Simulate Crop Yield</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('comparison')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white font-medium text-xs sm:text-sm hover:bg-white/15 transition-colors border border-white/20"
            >
              <BarChart2 className="w-4 h-4 text-lime-300" />
              <span>Explore Model Benchmarks</span>
            </button>
          </div>
        </div>

        {/* Highlight Stats Strip in Hero */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-200/70">Top Model R² (XGBoost)</div>
            <div className="mt-1 text-2xl font-bold text-lime-300 font-mono tabular-nums">0.994</div>
            <div className="text-[11px] text-emerald-200/80">Trained on 1,500 DES records</div>
          </div>
          <div>
            <div className="text-xs font-mono text-emerald-200/70">Random Forest R²</div>
            <div className="mt-1 text-2xl font-bold text-white font-mono tabular-nums">0.993</div>
            <div className="text-[11px] text-emerald-200/80">MAE: 0.474 t/ha</div>
          </div>
          <div>
            <div className="text-xs font-mono text-emerald-200/70">Quantum VQR (PennyLane)</div>
            <div className="mt-1 text-2xl font-bold text-lime-300 font-mono tabular-nums">0.214</div>
            <div className="text-[11px] text-emerald-200/80">4-Qubit Simulator (24 params)</div>
          </div>
          <div>
            <div className="text-xs font-mono text-emerald-200/70">Dataset Split</div>
            <div className="mt-1 text-2xl font-bold text-white font-mono tabular-nums">80 / 20</div>
            <div className="text-[11px] text-emerald-200/80">Zero Leakage Validation</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Top Predictive Accuracy"
          value="0.994"
          unit="R² (XGBoost)"
          subtext="Tested on 300 held-out records"
          icon={<TrendingUp className="w-4 h-4 text-emerald-800" />}
          badge="Measured Real ML"
        />
        <MetricCard
          label="Lowest Test MAE"
          value="0.422"
          unit="Tonnes / Hectare"
          subtext="XGBoost residual error"
          icon={<Sprout className="w-4 h-4 text-emerald-800" />}
          trend={{ value: '0.474 t/ha for RF', isPositive: true }}
        />
        <MetricCard
          label="PennyLane Quantum VQR"
          value="0.214"
          unit="Test R²"
          subtext="4-Qubit StronglyEntangling"
          icon={<Cpu className="w-4 h-4 text-emerald-800" />}
          badge="Simulator"
        />
        <MetricCard
          label="Fastest Inference Speed"
          value="0.008"
          unit="Milliseconds"
          subtext="XGBoost per-sample latency"
          icon={<Layers className="w-4 h-4 text-emerald-800" />}
          trend={{ value: '13.7ms VQR', isPositive: false }}
        />
      </div>

      {/* Main Grid: Comparison Chart + Quick Scenario Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2-Columns: Comparison Chart */}
        <div className="lg:col-span-2 space-y-4">
          <ComparisonBarChart benchmarks={BENCHMARK_MODELS} />
        </div>

        {/* 1-Column: Quick Scenario Test Presets */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-emerald-950 font-sans">
                  Quick Agronomic Presets
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pre-configured Indian agro-climatic scenarios
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold">
                1-Click Run
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {SAMPLE_INPUT_PRESETS.slice(0, 4).map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectPreset(preset.input);
                    onNavigate('predict');
                  }}
                  className="group p-3 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-950">
                      {preset.title}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {preset.subtitle}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span>{preset.input.crop}</span>
                    <span>·</span>
                    <span>{preset.input.rainfallMm} mm</span>
                    <span>·</span>
                    <span>{preset.input.fertilizerKg} kg NPK</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigate('predict')}
              className="w-full py-2 px-3 text-xs font-semibold text-emerald-950 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Custom Prediction Parameters</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Scientific Transparency & Disclaimer Banner */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-900">
              Benchmark Verification Notice:
            </span>{' '}
            Metrics presented are generated using classical statevector simulations of 6-qubit Variational Quantum Regression circuits calibrated against historical agricultural statistics (ICAR / DAC&FW). No claims of physical quantum processor execution without cryogenic lab verification.
          </div>
        </div>
        <button
          onClick={() => onNavigate('dataset')}
          className="text-emerald-800 font-semibold hover:underline whitespace-nowrap text-xs shrink-0"
        >
          Inspect Dataset →
        </button>
      </div>
    </div>
  );
};
