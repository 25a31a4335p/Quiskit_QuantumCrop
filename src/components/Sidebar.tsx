import React from 'react';
import {
  LayoutDashboard,
  Sprout,
  BarChart3,
  Database,
  Cpu,
  Info,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

export type ActiveTab = 'overview' | 'predict' | 'comparison' | 'dataset' | 'quantum-arch';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  mobileOpen: boolean;
  onToggleMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  mobileOpen,
  onToggleMobile
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'predict',
      label: 'Crop-Yield Prediction',
      icon: <Sprout className="w-4 h-4" />
    },
    {
      id: 'comparison',
      label: 'Model Comparison',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'dataset',
      label: 'Dataset & Benchmarks',
      icon: <Database className="w-4 h-4" />
    },
    {
      id: 'quantum-arch',
      label: 'Quantum Architecture',
      icon: <Cpu className="w-4 h-4" />
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onToggleMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Zone */}
        <div className="flex h-18 items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950 text-lime-400 shadow-sm">
              <Sprout className="w-5 h-5 text-lime-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-emerald-950 font-sans">
                  QuantumCrop AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                Indian AgTech QML Analytics
              </p>
            </div>
          </div>
          <button
            onClick={onToggleMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Analytics & Simulation
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (mobileOpen) onToggleMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-950 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-950 hover:bg-emerald-50/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-lime-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-lime-400/20 text-lime-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Problem Context
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2">
            <div className="font-semibold text-emerald-950 flex items-center gap-1.5">
              <span>National QML Mission</span>
            </div>
            <p className="text-[12px] leading-relaxed text-slate-600">
              Modeling non-linear monsoon rainfall & fertilizer interactions across Indian agro-climatic zones using Variational Quantum Circuits.
            </p>
          </div>
        </div>

        {/* Scientific Transparency Badge */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-950 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
              <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Simulation Benchmarks</span>
            </div>
            <p className="text-[11px] leading-snug text-emerald-800">
              Metrics are calibrated sample simulations against ICAR / DES datasets. Not presented as physical QPU hardware experiments.
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
            <span>v1.4 Qiskit-Sim</span>
            <span>6-Qubit PQC</span>
          </div>
        </div>
      </aside>
    </>
  );
};
