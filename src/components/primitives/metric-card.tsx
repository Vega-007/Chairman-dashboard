import React from 'react';
import { PerformanceStatus } from '@/lib/types/common';
import { StatusBadge } from './status-badge';
import { AchievementBar } from './achievement-bar';
import { TrendIndicator } from './trend-indicator';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  categoryCode?: string;
  actual: number | string;
  target: number | string;
  unit?: string;
  achievementPercentage: number;
  status: PerformanceStatus;
  trendDelta?: number;
  subtext?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  categoryCode,
  actual,
  target,
  unit,
  achievementPercentage,
  status,
  trendDelta,
  subtext,
  icon,
  onClick,
  className,
}) => {
  const isInteractive = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 shadow-sm transition-all duration-200 flex flex-col justify-between h-full min-h-[185px] w-full',
        isInteractive && 'hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md cursor-pointer',
        className
      )}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? 'button' : undefined}
      aria-label={`${title}: ${actual} of target ${target}, achievement ${achievementPercentage}%`}
    >
      {/* Header Container */}
      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Left Side: Icon & Title/Code stacked */}
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          {icon && (
            <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-tight leading-tight line-clamp-2 h-9 flex items-center">
              {title}
            </h3>
            {categoryCode ? (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block mt-0.5">
                {categoryCode}
              </span>
            ) : (
              <span className="text-[10px] opacity-0 block mt-0.5">-</span>
            )}
          </div>
        </div>

        {/* Right Side: Status Badge */}
        <div className="shrink-0 pt-0.5">
          <StatusBadge status={status} size="sm" className="whitespace-nowrap" />
        </div>
      </div>

      {/* Target vs Actual Numbers Area */}
      <div className="flex flex-col mb-3 mt-auto justify-end min-h-[3.25rem]">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white truncate">
            {typeof actual === 'number' ? actual.toLocaleString() : actual}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
            Target: <span className="font-bold text-slate-700 dark:text-slate-300">{typeof target === 'number' ? target.toLocaleString() : target}</span>
          </span>
        </div>
        <div className="h-4 flex items-center">
          {unit ? (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
              {unit}
            </span>
          ) : (
            <span className="text-xs opacity-0">-</span>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="mb-3">
        <AchievementBar
          percentage={achievementPercentage}
          status={status}
          size="sm"
          className="w-full"
        />
      </div>

      {/* Footer Info & Trend */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 mt-1">
        <span className="font-medium">{subtext || `${achievementPercentage}% achieved`}</span>
        {trendDelta !== undefined && (
          <TrendIndicator delta={trendDelta} size="sm" />
        )}
      </div>
    </div>
  );
};
