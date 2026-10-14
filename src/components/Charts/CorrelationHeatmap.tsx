import React from 'react';

interface CorrelationCell {
  x: string;
  y: string;
  val: number;
}

export const CorrelationHeatmap: React.FC = () => {
  const features = ['Rainfall', 'Fertilizer', 'Area', 'Rain × Fert', 'Yield'];

  const matrix: number[][] = [
    [1.0, 0.22, -0.06, 0.74, 0.58],  // Rainfall
    [0.22, 1.0, 0.04, 0.69, 0.69],   // Fertilizer
    [-0.06, 0.04, 1.0, -0.02, -0.14], // Area
    [0.74, 0.69, -0.02, 1.0, 0.81],  // Rain x Fert
    [0.58, 0.69, -0.14, 0.81, 1.0]   // Yield
  ];

  // Helper for color mapping
  const getColor = (v: number) => {
    if (v === 1) return '#064e3b'; // Strongest emerald
    if (v >= 0.7) return '#047857';
    if (v >= 0.5) return '#059669';
    if (v >= 0.2) return '#10b981';
    if (v >= 0.0) return '#ecfdf5';
    if (v >= -0.2) return '#fef2f2';
    return '#f87171';
  };

  const getTextColor = (v: number) => {
    if (Math.abs(v) >= 0.5) return '#ffffff';
    return '#0f172a';
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
      <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-emerald-950 font-sans">
            Agro-Climatic Feature Correlation Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pearson r coefficients highlighting synergistic cross-term coupling (Rainfall ⊗ Fertilizer)
          </p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-100 text-lime-900 font-semibold">
          High QML Fit
        </span>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[420px] max-w-lg mx-auto">
          {/* Header row */}
          <div className="grid grid-cols-6 gap-1 text-[11px] font-semibold text-slate-500 text-center mb-1">
            <div></div>
            {features.map((f) => (
              <div key={f} className="truncate px-1">
                {f}
              </div>
            ))}
          </div>

          {/* Matrix rows */}
          {matrix.map((row, rIdx) => (
            <div key={features[rIdx]} className="grid grid-cols-6 gap-1 mb-1 items-center">
              <div className="text-[11px] font-semibold text-slate-700 truncate pr-1 text-right">
                {features[rIdx]}
              </div>
              {row.map((val, cIdx) => {
                const bg = getColor(val);
                const txt = getTextColor(val);
                return (
                  <div
                    key={cIdx}
                    style={{ backgroundColor: bg, color: txt }}
                    className="h-10 rounded flex items-center justify-center font-mono text-xs font-bold transition-transform hover:scale-105 shadow-2xs cursor-default"
                    title={`${features[rIdx]} vs ${features[cIdx]}: r = ${val.toFixed(2)}`}
                  >
                    {val.toFixed(2)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-emerald-50/70 border border-emerald-100/80 text-xs text-emerald-950">
        <span className="font-semibold text-emerald-900">Quantum Advantage Insight: </span>
        The high correlation between <span className="font-mono text-emerald-900 font-bold">Rainfall × Fertilizer</span> and <span className="font-mono text-emerald-900 font-bold">Yield (r = 0.81)</span> reflects the physical biological truth: fertilizer without moisture cannot dissolve, while excessive moisture leaches nitrates. VQR models this 2-qubit interaction naturally via ZZ entanglement.
      </div>
    </div>
  );
};
