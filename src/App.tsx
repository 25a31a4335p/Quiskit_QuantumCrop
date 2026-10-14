import React, { useState } from 'react';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewView } from './views/OverviewView';
import { PredictionView } from './views/PredictionView';
import { ComparisonView } from './views/ComparisonView';
import { DatasetView } from './views/DatasetView';
import { QuantumArchitectureView } from './views/QuantumArchitectureView';
import { PredictionInput, PredictionResult } from './types/agriculture';
import { DEFAULT_PREDICTION_INPUT } from './data/agriData';
import { modelRegistry } from './models/modelRegistry';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<PredictionInput>(DEFAULT_PREDICTION_INPUT);
  const [currentResult, setCurrentResult] = useState<PredictionResult>(() =>
    modelRegistry.getActiveEngine().predict(DEFAULT_PREDICTION_INPUT) as PredictionResult
  );

  const handleSelectPreset = (preset: PredictionInput) => {
    setActivePreset(preset);
    const updated = modelRegistry.getActiveEngine().predict(preset) as PredictionResult;
    setCurrentResult(updated);
    setActiveTab('predict');
  };

  const handlePredictionChange = (res: PredictionResult) => {
    setCurrentResult(res);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-800 flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        mobileOpen={mobileOpen}
        onToggleMobile={() => setMobileOpen(!mobileOpen)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
          onQuickAction={activeTab !== 'predict' ? () => setActiveTab('predict') : undefined}
          quickActionLabel={activeTab !== 'predict' ? 'Run Prediction' : undefined}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'overview' && (
            <OverviewView
              onNavigate={setActiveTab}
              onSelectPreset={handleSelectPreset}
            />
          )}

          {activeTab === 'predict' && (
            <PredictionView
              initialInput={activePreset}
              currentResult={currentResult}
              onPredictionChange={handlePredictionChange}
            />
          )}

          {activeTab === 'comparison' && (
            <ComparisonView currentPrediction={currentResult} />
          )}

          {activeTab === 'dataset' && (
            <DatasetView />
          )}

          {activeTab === 'quantum-arch' && (
            <QuantumArchitectureView />
          )}
        </main>

        {/* Clean Footer */}
        <footer className="border-t border-slate-200 bg-white py-5 px-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-emerald-950">QuantumCrop AI</span>
              <span aria-hidden="true">·</span>
              <span>Quantum Machine Learning for Indian Agricultural Productivity</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
              <span>Benchmark: ICAR & DAC&FW Open Agronomic Data</span>
              <span>·</span>
              <span>Deterministic Demo Engine v1.4</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
