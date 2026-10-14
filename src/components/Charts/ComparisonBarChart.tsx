import React, { useState } from 'react';
import { ModelBenchmark, PredictionResult } from '../../types/agriculture';

interface ComparisonBarChartProps {
  benchmarks: ModelBenchmark[];
  highlightModel?: string;
  currentPrediction?: PredictionResult;
}

type MetricType = 'r2' | 'rmse' | 'mae' | 'execution' | 'live_yield';

interface MetricMeta {
  label: string;
  unit: string;
  description: string;
  higherIsBetter: boolean;
  format: (val: number) => string;
}

const METRICS: Record<MetricType, MetricMeta> = {
  r2: {
    label: 'R² Score (Accuracy)',
    unit: 'Score [0 - 1.0]',
    description: 'Proportion of yield variance explained by the model (higher is better)',
    higherIsBetter: true,
    format: (v) => v.toFixed(3)
  },
  rmse: {
    label: 'RMSE (Root Mean Square Error)',
    unit: 'Tonnes / Hectare',
    description: 'Standard deviation of residuals; penalizes large outlier errors (lower is better)',
    higherIsBetter: false,
    format: (v) => `${v.toFixed(3)} t/ha`
  },
  mae: {
    label: 'MAE (Mean Absolute Error)',
    unit: 'Tonnes / Hectare',
    description: 'Average magnitude of errors in yield prediction (lower is better)',
    higherIsBetter: false,
    format: (v) => `${v.toFixed(3)} t/ha`
  },
  execution: {
    label: 'Execution Latency (Inference)',
    unit: 'Milliseconds (ms)',
    description: 'Single-instance prediction runtime (statevector simulator vs CPU threads)',
    higherIsBetter: false,
    format: (v) => `${Math.round(v)} ms`
  },
  live_yield: {
    label: 'Live Scenario Yield Output',
    unit: 'Tonnes / Hectare',
    description: 'Yield prediction generated for the currently configured field parameters',
    higherIsBetter: true,
    format: (v) => `${v.toFixed(2)} t/ha`
  }
};

export const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  benchmarks,
  highlightModel = 'VQR',
  currentPrediction
}) => {
  const [dataMode, setDataMode] = useState<'benchmark' | 'live'>(
    currentPrediction ? 'live' : 'benchmark'
  );
  const [selectedMetric, setSelectedMetric] = useState<MetricType>(
    currentPrediction ? 'live_yield' : 'r2'
  );
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);

  const activeMeta = METRICS[selectedMetric];

  // Helper to extract value based on active mode
  const getModelValue = (model: ModelBenchmark): number => {
    if (dataMode === 'live' && currentPrediction) {
      if (selectedMetric === 'live_yield') {
        const pred = currentPrediction.allModels[model.modelId];
        return pred ? pred.yieldTonnesPerHa : 0;
      }
      if (selectedMetric === 'execution') {
        const pred = currentPrediction.allModels[model.modelId];
        return pred ? pred.executionTimeMs : model.inferenceTimeMs;
      }
    }

    switch (selectedMetric) {
      case 'r2':
        return model.r2Score;
      case 'rmse':
        return model.rmseTonnesPerHa;
      case 'mae':
        return model.maeTonnesPerHa;
      case 'execution':
        return model.inferenceTimeMs;
      case 'live_yield':
        return currentPrediction?.allModels[model.modelId]?.yieldTonnesPerHa || 0;
      default:
        return model.r2Score;
    }
  };

  const values = benchmarks.map((m) => getModelValue(m));
  const maxVal = Math.max(0.1, ...values) * 1.18;

  // Colors per model
  const modelColors: Record<string, { bar: string; text: string; bg: string }> = {
    VQR: { bar: '#064e3b', text: '#064e3b', bg: '#ecfdf5' },
    XGB: { bar: '#0284c7', text: '#0369a1', bg: '#f0f9ff' },
    RF: { bar: '#64748b', text: '#475569', bg: '#f8fafc' },
    Ridge: { bar: '#94a3b8', text: '#64748b', bg: '#f1f5f9' }
  };

  const availableMetrics: MetricType[] =
    dataMode === 'live'
      ? ['live_yield', 'execution', 'r2', 'mae']
      : ['r2', 'rmse', 'mae', 'execution'];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-emerald-950 font-sans">
              Comparative Model Performance
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
              Demo Simulation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {activeMeta.description}
          </p>
        </div>

        {/* Mode & Metric Selector Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {currentPrediction && (
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg">
              <button
                onClick={() => {
                  setDataMode('live');
                  setSelectedMetric('live_yield');
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  dataMode === 'live'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Current Scenario
              </button>
              <button
                onClick={() => {
                  setDataMode('benchmark');
                  setSelectedMetric('r2');
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  dataMode === 'benchmark'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Historical Benchmark
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-lg overflow-x-auto">
            {availableMetrics.map((key) => {
              const meta = METRICS[key];
              const isSelected = selectedMetric === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedMetric(key)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-white text-emerald-950 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {key === 'live_yield' ? 'Live Yield' : key.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="mt-6">
        <div className="relative h-64 w-full">
          <svg viewBox="0 0 600 240" className="w-full h-full overflow-visible">
            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1.0].map((ratio) => {
              const y = 200 - ratio * 160;
              const gridVal = ratio * maxVal;
              return (
                <g key={ratio}>
                  <line
                    x1="45"
                    y1={y}
                    x2="580"
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <text
                    x="40"
                    y={y + 3.5}
                    textAnchor="end"
                    fontSize="9.5"
                    fill="#94a3b8"
                    fontFamily="JetBrains Mono"
                  >
                    {selectedMetric === 'execution'
                      ? Math.round(gridVal)
                      : gridVal.toFixed(2)}
                  </text>
                </g>
              );
            })}

            {/* Zero Axis */}
            <line x1="45" y1="200" x2="580" y2="200" stroke="#cbd5e1" strokeWidth="1" />

            {/* Bars */}
            {benchmarks.map((model, idx) => {
              const val = getModelValue(model);
              const barHeight = Math.max(4, (val / maxVal) * 160);
              const barWidth = 72;
              const spacing = 135;
              const x = 70 + idx * spacing;
              const y = 200 - barHeight;
              const isHovered = hoveredModel === model.modelId;
              const isVQR = model.modelId === 'VQR';
              const colors = modelColors[model.modelId] || modelColors.RF;

              return (
                <g
                  key={model.modelId}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredModel(model.modelId)}
                  onMouseLeave={() => setHoveredModel(null)}
                >
                  {isHovered && (
                    <rect
                      x={x - 15}
                      y="20"
                      width={barWidth + 30}
                      height="180"
                      fill="#f8fafc"
                      rx="6"
                    />
                  )}

                  {/* Main Bar */}
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="6"
                    fill={isVQR ? '#064e3b' : colors.bar}
                    opacity={isHovered ? 1 : 0.92}
                    className="transition-all duration-300"
                  />

                  {/* VQR Lime Top Accent */}
                  {isVQR && (
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height="4"
                      rx="2"
                      fill="#84cc16"
                    />
                  )}

                  {/* Value on Top */}
                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill={isVQR ? '#064e3b' : '#334155'}
                    fontFamily="JetBrains Mono"
                  >
                    {activeMeta.format(val)}
                  </text>

                  {/* Model Name */}
                  <text
                    x={x + barWidth / 2}
                    y="218"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight={isVQR ? '700' : '600'}
                    fill={isVQR ? '#064e3b' : '#475569'}
                    fontFamily="Plus Jakarta Sans"
                  >
                    {model.modelId}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y="232"
                    textAnchor="middle"
                    fontSize="9"
                    fill="#94a3b8"
                  >
                    {model.modelId === 'VQR' ? 'Quantum PQC' : model.category.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Legend & Details Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-950 inline-block"></span>
            <span className="font-medium text-slate-700">Variational Quantum Regressor (VQR)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-sky-600 inline-block"></span>
            <span className="text-slate-600">XGBoost</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-500 inline-block"></span>
            <span className="text-slate-600">Random Forest</span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          {dataMode === 'live' && currentPrediction
            ? `Evaluated on ${currentPrediction.input.crop} in ${currentPrediction.input.state} (${currentPrediction.input.rainfallMm}mm, ${currentPrediction.input.fertilizerKg}kg NPK)`
            : 'Evaluated across 400 test splits (ICAR baseline dataset)'}
        </div>
      </div>
    </div>
  );
};
