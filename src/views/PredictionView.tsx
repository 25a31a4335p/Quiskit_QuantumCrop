import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Cpu,
  Layers,
  Sparkles,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  Info,
  ChevronRight,
  TrendingUp,
  BarChart2,
  Calculator,
  ChevronDown,
  ChevronUp,
  Table as TableIcon
} from 'lucide-react';
import {
  CROPS_CONFIG,
  DEFAULT_PREDICTION_INPUT,
  HISTORICAL_RECORDS,
  INDIAN_STATES,
  SAMPLE_INPUT_PRESETS,
  SEASONS
} from '../data/agriData';
import {
  IndianCrop,
  IndianSeason,
  IndianState,
  PredictionInput,
  PredictionResult
} from '../types/agriculture';
import { validatePredictionInput, ValidationResult } from '../models/validation';
import { modelRegistry } from '../models/modelRegistry';
import { MetricCard } from '../components/MetricCard';
import { QuantumCircuitView } from '../components/QuantumCircuitView';

interface PredictionViewProps {
  initialInput?: PredictionInput;
  currentResult?: PredictionResult;
  onPredictionChange?: (res: PredictionResult) => void;
}

export const PredictionView: React.FC<PredictionViewProps> = ({
  initialInput,
  currentResult,
  onPredictionChange
}) => {
  const [input, setInput] = useState<PredictionInput>(
    initialInput || DEFAULT_PREDICTION_INPUT
  );

  const [validation, setValidation] = useState<ValidationResult>(() =>
    validatePredictionInput(input)
  );

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStage, setSimulationStage] = useState<string>('Ready');
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);
  const [showSampleDataset, setShowSampleDataset] = useState<boolean>(false);

  const [result, setResult] = useState<PredictionResult>(
    () => currentResult || (modelRegistry.getActiveEngine().predict(input) as PredictionResult)
  );

  const cropMeta = CROPS_CONFIG[input.crop];
  const stateMeta = INDIAN_STATES.find((s) => s.name === input.state);

  // Validate on input changes
  useEffect(() => {
    setValidation(validatePredictionInput(input));
  }, [input]);

  // Sync if initialInput changes from preset selection
  useEffect(() => {
    if (initialInput) {
      setInput(initialInput);
      const updated = modelRegistry.getActiveEngine().predict(initialInput) as PredictionResult;
      setResult(updated);
      onPredictionChange?.(updated);
    }
  }, [initialInput]);

  const handlePredict = async () => {
    const valid = validatePredictionInput(input);
    setValidation(valid);
    if (!valid.isValid) {
      return;
    }

    setIsSimulating(true);
    setSimulationStage('Initializing 6-Qubit State |000000⟩...');

    setTimeout(() => {
      setSimulationStage('Applying ZZ-Feature Map Phase Encodings...');
    }, 250);

    setTimeout(() => {
      setSimulationStage('Optimizing Variational Ansatz Ry(θ)...');
    }, 550);

    setTimeout(() => {
      setSimulationStage('Evaluating Pauli-Z Observable ⟨Z⟩...');
    }, 850);

    setTimeout(async () => {
      const updated = (await modelRegistry.predict(input)) as PredictionResult;
      setResult(updated);
      setIsSimulating(false);
      setSimulationStage('Simulation Complete');
      onPredictionChange?.(updated);
    }, 1100);
  };

  const handleReset = () => {
    setInput(DEFAULT_PREDICTION_INPUT);
    const updated = modelRegistry.getActiveEngine().predict(DEFAULT_PREDICTION_INPUT) as PredictionResult;
    setResult(updated);
    onPredictionChange?.(updated);
  };

  const handleCropChange = (crop: IndianCrop) => {
    const newCropMeta = CROPS_CONFIG[crop];
    setInput((prev) => ({
      ...prev,
      crop,
      season: newCropMeta.standardSeasons[0] || 'Kharif',
      rainfallMm: newCropMeta.idealRainfallMm,
      fertilizerKg: newCropMeta.idealFertilizerKg
    }));
  };

  const handleStateChange = (state: IndianState) => {
    const s = INDIAN_STATES.find((item) => item.name === state);
    setInput((prev) => ({
      ...prev,
      state,
      rainfallMm: s ? s.defaultRainfall : prev.rainfallMm
    }));
  };

  const vqr = result.allModels.VQR;
  const rf = result.allModels.RF;
  const xgb = result.allModels.XGB;
  const ridge = result.allModels.Ridge;
  const primary = result.primaryPrediction;

  const handleToggleEngine = (targetMode: 'real' | 'demo') => {
    const engineId = targetMode === 'real' ? 'real-trained-engine' : 'demo-agronomic-engine';
    modelRegistry.setActiveEngine(engineId);
    const updated = modelRegistry.getActiveEngine().predict(input) as PredictionResult;
    setResult(updated);
    onPredictionChange?.(updated);
  };

  // Filter historical benchmark records relevant to current crop or state
  const relevantBenchmarks = HISTORICAL_RECORDS.filter(
    (r) => r.crop === input.crop || r.state === input.state
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Mode Status Banner */}
      {result.isDemoMode ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-amber-800 shrink-0" />
            <div>
              <span className="font-bold text-amber-900">DEMO MODE:</span>{' '}
              <span>{result.demoNotice}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleToggleEngine('real')}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-900 hover:bg-emerald-800 text-white transition-colors cursor-pointer"
            >
              Switch to Real Trained ML
            </button>
            <button
              onClick={handleReset}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors cursor-pointer"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-emerald-950">VERIFIED ML INFERENCE:</span>{' '}
              <span>{result.demoNotice}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleToggleEngine('demo')}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              Switch to Demo Mode
            </button>
            <button
              onClick={handleReset}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-white hover:bg-emerald-100 text-emerald-950 border border-emerald-300 transition-colors cursor-pointer"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      )}

      {/* Top Description & Presets Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200">
        <div>
          <h2 className="text-base font-bold text-emerald-950">
            Multi-Variable Crop Yield Simulation
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure Indian agro-climatic parameters to simulate Quantum VQR expectation values vs classical ensembles.
          </p>
        </div>

        {/* Quick Scenario Picker */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-medium shrink-0">Presets:</span>
          {SAMPLE_INPUT_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(p.input);
                const updated = modelRegistry.getActiveEngine().predict(p.input) as PredictionResult;
                setResult(updated);
                onPredictionChange?.(updated);
              }}
              className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 text-slate-600 transition-colors whitespace-nowrap"
            >
              {p.input.state} {p.input.crop.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input Form (Left 5 Cols) + Prediction & Insights (Right 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 6 Mandatory Agricultural Inputs */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-900">
                <Sliders className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-emerald-950 font-sans">
                Field Parameter Inputs
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              6 Agronomic Dimensions
            </span>
          </div>

          {/* Input 1: Indian State */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="state-select">1. Indian State</label>
              <span className="text-[11px] font-mono text-slate-400">
                Zone: {stateMeta?.zone.split(' ')[0]}
              </span>
            </div>
            <select
              id="state-select"
              value={input.state}
              onChange={(e) => handleStateChange(e.target.value as IndianState)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} ({s.zone})
                </option>
              ))}
            </select>
            {validation.errors.state && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> {validation.errors.state}
              </p>
            )}
          </div>

          {/* Input 2: Crop */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="crop-select">2. Cultivated Crop</label>
              <span className="text-[11px] font-mono text-emerald-800 font-semibold">
                {cropMeta.category}
              </span>
            </div>
            <select
              id="crop-select"
              value={input.crop}
              onChange={(e) => handleCropChange(e.target.value as IndianCrop)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              {Object.keys(CROPS_CONFIG).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {validation.errors.crop && (
              <p className="text-[11px] text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3" /> {validation.errors.crop}
              </p>
            )}
          </div>

          {/* Input 3: Season */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label>3. Cropping Season</label>
              <span className="text-[11px] font-mono text-slate-400">
                Typical: {cropMeta.standardSeasons.join(', ')}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SEASONS.map((s) => {
                const isSelected = input.season === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setInput((prev) => ({ ...prev, season: s }))}
                    className={`py-1.5 px-2 text-xs font-medium rounded-lg border text-center transition-colors ${
                      isSelected
                        ? 'bg-emerald-950 text-white border-emerald-950 font-semibold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {validation.warnings.season && (
              <p className="text-[11px] text-amber-700 flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3 h-3 shrink-0" /> {validation.warnings.season}
              </p>
            )}
          </div>

          {/* Input 4: Rainfall in mm */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="rainfall-input">4. Seasonal Rainfall</label>
              <div className="flex items-center gap-1 font-mono">
                <input
                  id="rainfall-input"
                  type="number"
                  min={10}
                  max={4000}
                  value={input.rainfallMm}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      rainfallMm: Number(e.target.value)
                    }))
                  }
                  className="w-18 px-2 py-0.5 text-right font-bold text-emerald-950 border border-slate-200 rounded text-xs focus:outline-none focus:border-emerald-600"
                />
                <span className="text-slate-400 text-[11px]">mm</span>
              </div>
            </div>
            <input
              type="range"
              min={100}
              max={3000}
              step={10}
              value={input.rainfallMm}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, rainfallMm: Number(e.target.value) }))
              }
              className="w-full accent-emerald-800 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Arid (200mm)</span>
              <span className="text-emerald-700 font-semibold">
                Crop Ideal: {cropMeta.idealRainfallMm}mm
              </span>
              <span>Monsoon Deluge (2800mm)</span>
            </div>
            {validation.errors.rainfallMm && (
              <p className="text-[11px] text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {validation.errors.rainfallMm}
              </p>
            )}
            {validation.warnings.rainfallMm && (
              <p className="text-[11px] text-amber-700 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 shrink-0" /> {validation.warnings.rainfallMm}
              </p>
            )}
          </div>

          {/* Input 5: Fertilizer Quantity in kg */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="fert-input">5. Fertilizer Dosage (NPK)</label>
              <div className="flex items-center gap-1 font-mono">
                <input
                  id="fert-input"
                  type="number"
                  min={0}
                  max={600}
                  value={input.fertilizerKg}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      fertilizerKg: Number(e.target.value)
                    }))
                  }
                  className="w-18 px-2 py-0.5 text-right font-bold text-emerald-950 border border-slate-200 rounded text-xs focus:outline-none focus:border-emerald-600"
                />
                <span className="text-slate-400 text-[11px]">kg/ha</span>
              </div>
            </div>
            <input
              type="range"
              min={10}
              max={500}
              step={5}
              value={input.fertilizerKg}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, fertilizerKg: Number(e.target.value) }))
              }
              className="w-full accent-emerald-800 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Low (30kg)</span>
              <span className="text-emerald-700 font-semibold">
                Optimum: {cropMeta.idealFertilizerKg}kg
              </span>
              <span>Intensive (450kg)</span>
            </div>
            {validation.errors.fertilizerKg && (
              <p className="text-[11px] text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {validation.errors.fertilizerKg}
              </p>
            )}
            {validation.warnings.fertilizerKg && (
              <p className="text-[11px] text-amber-700 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 shrink-0" /> {validation.warnings.fertilizerKg}
              </p>
            )}
          </div>

          {/* Input 6: Cultivated Area in Hectares */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <label htmlFor="area-input">6. Cultivated Land Area</label>
              <div className="flex items-center gap-1 font-mono">
                <input
                  id="area-input"
                  type="number"
                  min={1}
                  max={5000}
                  value={input.cultivatedAreaHa}
                  onChange={(e) =>
                    setInput((prev) => ({
                      ...prev,
                      cultivatedAreaHa: Number(e.target.value)
                    }))
                  }
                  className="w-18 px-2 py-0.5 text-right font-bold text-emerald-950 border border-slate-200 rounded text-xs focus:outline-none focus:border-emerald-600"
                />
                <span className="text-slate-400 text-[11px]">Hectares</span>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={250}
              step={1}
              value={input.cultivatedAreaHa}
              onChange={(e) =>
                setInput((prev) => ({ ...prev, cultivatedAreaHa: Number(e.target.value) }))
              }
              className="w-full accent-emerald-800 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Smallholder (2 ha)</span>
              <span>Medium (25 ha)</span>
              <span>Commercial (200 ha)</span>
            </div>
            {validation.errors.cultivatedAreaHa && (
              <p className="text-[11px] text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {validation.errors.cultivatedAreaHa}
              </p>
            )}
          </div>

          {/* Action Row: Predict Yield + Reset */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handlePredict}
              disabled={isSimulating || !validation.isValid}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-emerald-950 hover:bg-emerald-900 text-white shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 text-lime-400 animate-spin" />
                  <span>Simulating Quantum Circuit...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-lime-400" />
                  <span>{result.isDemoMode ? 'Predict Yield (VQR Demo)' : 'Predict Yield (Run ML Models)'}</span>
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              title="Reset to default settings"
              className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          {isSimulating && (
            <div className="mt-2 text-center text-[11px] font-mono text-emerald-800 animate-pulse">
              {simulationStage}
            </div>
          )}
        </div>

        {/* Right Columns: Prediction KPIs, Quantum vs Classical Breakdown, & Circuit */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top 3 Prediction Result Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard
              label={result.isDemoMode ? "Predicted Yield (VQR Demo)" : `Predicted Yield (${primary.shortName})`}
              value={primary.yieldTonnesPerHa.toFixed(2)}
              unit="Tonnes / Ha"
              subtext={`95% CI: [${primary.confidenceInterval[0]} - ${primary.confidenceInterval[1]}]`}
              badge={result.isDemoMode ? "Demo VQR" : `Trained ${primary.shortName}`}
              trend={{
                value: `+${((primary.yieldTonnesPerHa / (rf.yieldTonnesPerHa || 1) - 1) * 100).toFixed(1)}%`,
                isPositive: true,
                label: 'vs RF'
              }}
            />

            <MetricCard
              label="Total Harvest Output"
              value={primary.totalProductionTonnes.toLocaleString()}
              unit="Metric Tonnes"
              subtext={`Across ${input.cultivatedAreaHa} Hectares`}
              icon={<Sprout className="w-4 h-4 text-emerald-800" />}
            />

            <MetricCard
              label="Water / Stress Status"
              value={result.agronomicInsights.waterStressIndex}
              subtext={`Nutrient: ${result.agronomicInsights.nutrientEfficiency.split(' ')[0]}`}
              badge={
                result.agronomicInsights.waterStressIndex === 'Optimal'
                  ? 'Favorable'
                  : 'Alert'
              }
            />
          </div>

          {/* Model Comparison Breakdown Table */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-emerald-950 font-sans">
                  Algorithm Yield Estimation Breakdown
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Side-by-side comparison for this specific agro-climatic parameter state
                </p>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  result.isDemoMode
                    ? 'bg-amber-50 text-amber-900 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                }`}
              >
                {result.isDemoMode ? 'Illustrative Demo Output' : 'Verified ML Experiment'}
              </span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="pb-2 pl-1">Model Architecture</th>
                    <th className="pb-2 text-right">Yield (t/ha)</th>
                    <th className="pb-2 text-right">Total (Tonnes)</th>
                    <th className="pb-2 text-right">95% Conf. Interval</th>
                    <th className="pb-2 text-right">Inference Latency</th>
                    <th className="pb-2 text-right pr-1">Benchmark R²</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* VQR (Primary Model) */}
                  <tr className="bg-emerald-50/60 font-semibold text-emerald-950">
                    <td className="py-2.5 pl-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-lime-500 inline-block"></span>
                      <span>Variational Quantum Regressor (VQR)</span>
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-emerald-950 font-bold">
                      {vqr.yieldTonnesPerHa.toFixed(2)}
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums">
                      {vqr.totalProductionTonnes.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-600">
                      [{vqr.confidenceInterval[0]} - {vqr.confidenceInterval[1]}]
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-600">
                      {vqr.executionTimeMs} ms
                    </td>
                    <td className="py-2.5 text-right pr-2 font-mono tabular-nums text-emerald-800">
                      {vqr.accuracyR2}
                    </td>
                  </tr>

                  {/* XGBoost */}
                  <tr className="text-slate-700 hover:bg-slate-50/60">
                    <td className="py-2.5 pl-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-500 inline-block"></span>
                      <span>XGBoost Regressor</span>
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums font-semibold">
                      {xgb.yieldTonnesPerHa.toFixed(2)}
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums">
                      {xgb.totalProductionTonnes.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-500">
                      [{xgb.confidenceInterval[0]} - {xgb.confidenceInterval[1]}]
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-500">
                      {xgb.executionTimeMs} ms
                    </td>
                    <td className="py-2.5 text-right pr-2 font-mono tabular-nums text-slate-700">
                      {xgb.accuracyR2}
                    </td>
                  </tr>

                  {/* Random Forest */}
                  <tr className="text-slate-700 hover:bg-slate-50/60">
                    <td className="py-2.5 pl-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-400 inline-block"></span>
                      <span>Random Forest (100 Trees)</span>
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums font-semibold">
                      {rf.yieldTonnesPerHa.toFixed(2)}
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums">
                      {rf.totalProductionTonnes.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-500">
                      [{rf.confidenceInterval[0]} - {rf.confidenceInterval[1]}]
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-500">
                      {rf.executionTimeMs} ms
                    </td>
                    <td className="py-2.5 text-right pr-2 font-mono tabular-nums text-slate-700">
                      {rf.accuracyR2}
                    </td>
                  </tr>

                  {/* Ridge Regression */}
                  <tr className="text-slate-500 hover:bg-slate-50/60">
                    <td className="py-2.5 pl-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-300 inline-block"></span>
                      <span>Ridge Regression (Linear L2)</span>
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums font-semibold">
                      {ridge.yieldTonnesPerHa.toFixed(2)}
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums">
                      {ridge.totalProductionTonnes.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-400">
                      [{ridge.confidenceInterval[0]} - {ridge.confidenceInterval[1]}]
                    </td>
                    <td className="py-2.5 text-right font-mono tabular-nums text-slate-400">
                      {ridge.executionTimeMs} ms
                    </td>
                    <td className="py-2.5 text-right pr-2 font-mono tabular-nums text-slate-500">
                      {ridge.accuracyR2}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Toggle: View Deterministic Calculation Steps */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowFormulaDetails(!showFormulaDetails)}
                className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-emerald-950 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calculator className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Inspect Deterministic Calculation Steps & Agronomic Formulas</span>
                </div>
                {showFormulaDetails ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showFormulaDetails && (
                <div className="mt-3 p-3.5 rounded-lg bg-emerald-50/40 border border-emerald-100 space-y-2.5 text-xs">
                  <div className="text-[11px] font-mono text-emerald-900 font-bold">
                    Calculation Pipeline Trace:
                  </div>
                  <div className="space-y-2">
                    {result.calculationSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded bg-white border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-semibold text-emerald-950">
                            {idx + 1}. {step.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {step.formula} · Input: {step.inputValue}
                          </div>
                          <div className="text-[11px] text-slate-600 mt-0.5">
                            {step.interpretation}
                          </div>
                        </div>
                        <div className="text-right sm:self-center font-mono font-bold text-emerald-900 text-xs px-2 py-1 rounded bg-slate-50 border border-slate-200 shrink-0">
                          Factor: {step.computedFactor}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 text-[11px] text-emerald-900">
                    <strong>{result.isDemoMode ? 'Demo Physiological Formula:' : 'Ensemble & Quantum Formulation:'}</strong>{' '}
                    {result.isDemoMode ? (
                      <>
                        <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 font-mono">
                          Y = Y_base · W(R) · F(N) · S_state · S_season · (1 + Q_zz)
                        </code>{' '}
                        = {cropMeta.baseYieldTonnesPerHa} · {result.formulaBreakdown.waterFactor} · {result.formulaBreakdown.fertFactor} · {result.formulaBreakdown.stateFactor} · {result.formulaBreakdown.seasonFactor} · {(1 + result.formulaBreakdown.quantumCouplingBonus).toFixed(3)} = <strong className="text-emerald-950">{vqr.yieldTonnesPerHa} t/ha</strong>.
                      </>
                    ) : (
                      <>
                        <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 font-mono">
                          XGB = Ensemble(Z_features) · VQR = ⟨ψ(θ, W)|Z₀|ψ(θ, W)⟩ · σ_y + μ_y
                        </code>{' '}
                        — Verified Test R²: XGBoost = <strong className="text-emerald-950">{xgb.accuracyR2}</strong>, RF = <strong className="text-emerald-950">{rf.accuracyR2}</strong>, VQR = <strong className="text-emerald-950">{vqr.accuracyR2}</strong>.
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Toggle: Regional Historical Sample Dataset Preview */}
            <div className="mt-3">
              <button
                onClick={() => setShowSampleDataset(!showSampleDataset)}
                className="w-full py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <TableIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sample Dataset Quick Reference ({input.state} & {input.crop})</span>
                </div>
                {showSampleDataset ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showSampleDataset && (
                <div className="mt-2 overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="py-2 px-2.5">ID</th>
                        <th className="py-2 px-2.5">State</th>
                        <th className="py-2 px-2.5">Crop</th>
                        <th className="py-2 px-2.5">Season</th>
                        <th className="py-2 px-2.5 text-right">Rainfall</th>
                        <th className="py-2 px-2.5 text-right">Fertilizer</th>
                        <th className="py-2 px-2.5 text-right">Yield (t/ha)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {relevantBenchmarks.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50">
                          <td className="py-2 px-2.5 font-mono text-slate-400">{rec.id}</td>
                          <td className="py-2 px-2.5 font-medium text-slate-800">{rec.state}</td>
                          <td className="py-2 px-2.5 text-slate-700">{rec.crop}</td>
                          <td className="py-2 px-2.5 text-slate-500">{rec.season}</td>
                          <td className="py-2 px-2.5 text-right font-mono">{rec.rainfallMm} mm</td>
                          <td className="py-2 px-2.5 text-right font-mono">{rec.fertilizerKg} kg</td>
                          <td className="py-2 px-2.5 text-right font-mono font-bold text-emerald-950">{rec.yieldTonnesPerHa}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Quantum Circuit Visualizer */}
          <QuantumCircuitView
            isSimulating={isSimulating}
            activeFeatureValues={{
              rainfall: input.rainfallMm,
              fertilizer: input.fertilizerKg,
              crop: input.crop,
              state: input.state
            }}
          />
        </div>
      </div>
    </div>
  );
};
