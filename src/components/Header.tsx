import React from 'react';
import { Menu, Sparkles, RefreshCw, Download } from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface HeaderProps {
  activeTab: ActiveTab;
  onToggleMobile: () => void;
  onQuickAction?: () => void;
  quickActionLabel?: string;
}

const TAB_TITLES: Record<ActiveTab, { title: string; subtitle: string }> = {
  overview: {
    title: 'Dashboard Overview',
    subtitle: 'Indian Agricultural Productivity & Quantum ML Summary'
  },
  predict: {
    title: 'Crop-Yield Prediction',
    subtitle: 'Variational Quantum Regression (VQR) Multi-Variable Inference'
  },
  comparison: {
    title: 'Model Benchmarking',
    subtitle: 'VQR vs. Random Forest vs. XGBoost Performance Evaluation'
  },
  dataset: {
    title: 'Dataset & Agro-Climatic Benchmarks',
    subtitle: 'Historical ICAR & Directorate of Economics and Statistics Records'
  },
  'quantum-arch': {
    title: 'Quantum Circuit Architecture',
    subtitle: 'ZZ-Feature Map, Entanglement Mesh & Variational Ansatz'
  }
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onToggleMobile,
  onQuickAction,
  quickActionLabel
}) => {
  const current = TAB_TITLES[activeTab];

  return (
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-xs">
      {/* Zone 1: Breadcrumbs & Page Identity */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>QuantumCrop AI</span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="text-emerald-950 font-semibold">{current.title}</span>
          </div>
          <span className="hidden sm:inline-block text-[13px] text-slate-500 truncate max-w-md">
            {current.subtitle}
          </span>
        </div>
      </div>

      {/* Zone 2: Informational Meta */}
      <div className="hidden xl:flex items-center gap-3 text-xs text-slate-500 font-mono">
        <span>MoA&FW / ICAR Calibrated</span>
        <span aria-hidden="true">·</span>
        <span>Statevector Simulation Mode</span>
      </div>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-2.5">
        {onQuickAction && quickActionLabel && (
          <button
            onClick={onQuickAction}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-950 rounded-lg hover:bg-emerald-900 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span className="whitespace-nowrap">{quickActionLabel}</span>
          </button>
        )}
      </div>
    </header>
  );
};
