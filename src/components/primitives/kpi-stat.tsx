import React from 'react';
import { PerformanceStatus } from '@/lib/types/common';
import { getStatusColorClass } from '@/lib/utils/status';
import { TrendIndicator } from './trend-indicator';
import { cn } from '@/lib/utils';

interface KPIStatProps {
  label: string;
  value: string | number;
  subtext?: string;
  status?: PerformanceStatus;
  trendDelta?: number;
  icon?: React.ReactNode;
  className?: string;
}

export const KPIStat: React.FC<KPIStatProps> = ({
  label,
  value,
  subtext,
  status,
  trendDelta,
  icon,
  className,
}) => {
  const statusColors = status ? getStatusColorClass(status) : null;

  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 shadow-sm flex flex-col justify-between',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </span>
        {icon && (
          <div className="text-slate-400 dark:text-slate-500">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2 my-1">
        <span className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>

        {status && (
          <span
            className={cn('inline-block w-2.5 h-2.5 rounded-full', statusColors?.dot)}
            title={`Status: ${status}`}
          />
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
        <span>{subtext || ''}</span>
        {trendDelta !== undefined && (
          <TrendIndicator delta={trendDelta} size="sm" />
        )}
      </div>
    </div>
  );
};
