import React from 'react';
import { cn } from '@/lib/utils';

interface StatusDistributionZoneProps {
  total: number;
  greenCount: number;
  orangeCount: number;
  redCount: number;
  className?: string;
}

export const StatusDistributionZone: React.FC<StatusDistributionZoneProps> = ({
  total,
  greenCount,
  orangeCount,
  redCount,
  className,
}) => {
  const greenPct = Math.round((greenCount / total) * 1000) / 10;
  const orangePct = Math.round((orangeCount / total) * 1000) / 10;
  const redPct = Math.round((redCount / total) * 1000) / 10;

  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-3',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Institutional Health Distribution
        </h3>
        <span className="text-[11px] text-slate-400 font-mono">
          {total} Total Institutions
        </span>
      </div>

      {/* Segmented Distribution Bar */}
      <div
        className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex"
        role="progressbar"
        aria-valuenow={greenPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Institutional status distribution: ${greenCount} healthy, ${orangeCount} attention, ${redCount} critical`}
      >
        <div
          className="bg-emerald-600 dark:bg-emerald-500 h-full transition-all duration-500"
          style={{ width: `${greenPct}%` }}
          title={`Healthy: ${greenCount} (${greenPct}%)`}
        />
        <div
          className="bg-amber-500 dark:bg-amber-400 h-full transition-all duration-500"
          style={{ width: `${orangePct}%` }}
          title={`Attention: ${orangeCount} (${orangePct}%)`}
        />
        <div
          className="bg-rose-600 dark:bg-rose-500 h-full transition-all duration-500"
          style={{ width: `${redPct}%` }}
          title={`Action Required: ${redCount} (${redPct}%)`}
        />
      </div>

      {/* Compact Legend with Counts & Percentages */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
          <span className="truncate">
            <strong className="text-slate-950 dark:text-white font-semibold">{greenCount}</strong> Achieved ({greenPct}%)
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
          <span className="truncate">
            <strong className="text-slate-950 dark:text-white font-semibold">{orangeCount}</strong> Needs Impr. ({orangePct}%)
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0" />
          <span className="truncate">
            <strong className="text-slate-950 dark:text-white font-semibold">{redCount}</strong> Action Req. ({redPct}%)
          </span>
        </div>
      </div>
    </div>
  );
};
