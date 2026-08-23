import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { GroupHealthSummary } from '@/lib/types/performance';
import { StatusBadge } from '@/components/primitives/status-badge';
import { TrendIndicator } from '@/components/primitives/trend-indicator';
import { cn } from '@/lib/utils';

interface GroupHealthZoneProps {
  summary: GroupHealthSummary;
  className?: string;
}

export const GroupHealthZone: React.FC<GroupHealthZoneProps> = ({ summary, className }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-5 shadow-xs',
        className
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        {/* Main Health Score & Identity */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-900 dark:bg-blue-600 text-white flex flex-col items-center justify-center font-bold shadow-xs shrink-0">
            <ShieldCheck className="w-6 h-6 mb-0.5 text-blue-200 dark:text-blue-100" />
            <span className="text-[9px] uppercase tracking-wider text-blue-100">MIS</span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                SRM Group Health Index · AY {summary.academicYear}
              </span>
              <StatusBadge status={summary.status} size="sm" />
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                {summary.overallScore.toFixed(1)}%
              </span>
              <div
                className="group relative inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 cursor-help"
                title="Demo composite score computed from mock institutional data. The production aggregation and category weighting model will be configurable by administrators when actual metric definitions are finalized."
              >
                <span>Composite Score (19 Institutions)</span>
                <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <TrendIndicator delta={summary.trendDelta} size="sm" label="vs prev AY" />
            </div>
          </div>
        </div>

        {/* Quick Executive KPI Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 lg:pl-6">
          <div className="px-3 py-2 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
              Total Institutions
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {summary.totalInstitutions}
            </span>
          </div>

          <div className="px-3 py-2 rounded-md bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Achieved</span>
            </div>
            <span className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
              {summary.greenCount}
            </span>
          </div>

          <div className="px-3 py-2 rounded-md bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
            <div className="flex items-center gap-1 text-[11px] font-medium text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Needs Impr.</span>
            </div>
            <span className="text-lg font-bold text-amber-900 dark:text-amber-200">
              {summary.orangeCount}
            </span>
          </div>

          <div className="px-3 py-2 rounded-md bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
            <div className="flex items-center gap-1 text-[11px] font-medium text-rose-800 dark:text-rose-300">
              <AlertCircle className="w-3 h-3 text-rose-600" />
              <span>Action Req.</span>
            </div>
            <span className="text-lg font-bold text-rose-900 dark:text-rose-200">
              {summary.redCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
