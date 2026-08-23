import React from 'react';
import { History } from 'lucide-react';
import { TrendIndicator } from '@/components/primitives/trend-indicator';
import { cn } from '@/lib/utils';

interface TrendSummaryZoneProps {
  currentYear: string;
  previousYear: string;
  currentScore: number;
  previousScore: number;
  delta: number;
  className?: string;
}

export const TrendSummaryZone: React.FC<TrendSummaryZoneProps> = ({
  currentYear,
  previousYear,
  currentScore,
  previousScore,
  delta,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 shrink-0">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Year-over-Year Momentum Summary
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comparing AY {currentYear} performance against baseline AY {previousYear}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
        <div className="text-left md:text-right">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
            Baseline ({previousYear})
          </span>
          <span className="text-base font-semibold text-slate-600 dark:text-slate-300">
            {previousScore.toFixed(1)}%
          </span>
        </div>

        <div className="text-slate-300 dark:text-slate-700">→</div>

        <div className="text-left md:text-right">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
            Current ({currentYear})
          </span>
          <span className="text-xl font-extrabold text-slate-950 dark:text-white">
            {currentScore.toFixed(1)}%
          </span>
        </div>

        <div className="pl-2 border-l border-slate-200 dark:border-slate-800">
          <TrendIndicator delta={delta} size="md" label="YoY Delta" />
        </div>
      </div>
    </div>
  );
};
