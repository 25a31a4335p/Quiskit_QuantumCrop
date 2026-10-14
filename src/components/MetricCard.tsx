import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  icon?: React.ReactNode;
  badge?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  subtext,
  icon,
  badge,
  trend
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white p-5 border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-900">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-emerald-950 font-mono tabular-nums">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-semibold text-slate-500 font-sans">
            {unit}
          </span>
        )}
      </div>

      {(subtext || trend || badge) && (
        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
          {subtext && <span className="truncate">{subtext}</span>}
          {trend && (
            <span
              className={`font-mono text-[11px] font-semibold tabular-nums ml-auto ${
                trend.isPositive ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {trend.value} {trend.label && <span className="font-normal text-slate-400 font-sans">{trend.label}</span>}
            </span>
          )}
          {badge && (
            <span className="ml-auto text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-lime-100 text-lime-800">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
