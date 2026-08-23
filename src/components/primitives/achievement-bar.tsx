import React from 'react';
import { PerformanceStatus, ThresholdConfig } from '@/lib/types/common';
import { getStatusColorClass, DEFAULT_THRESHOLDS } from '@/lib/utils/status';
import { cn } from '@/lib/utils';

interface AchievementBarProps {
  percentage: number;
  status: PerformanceStatus;
  thresholds?: ThresholdConfig;
  showTicks?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AchievementBar: React.FC<AchievementBarProps> = ({
  percentage,
  status,
  thresholds = DEFAULT_THRESHOLDS,
  showTicks = true,
  showLabel = false,
  size = 'md',
  className,
}) => {
  const colors = getStatusColorClass(status);
  const clampedValue = Math.min(Math.max(percentage, 0), 100);

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }[size];

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>Achievement</span>
          <span className={cn('font-semibold', colors.text)}>
            {percentage.toFixed(1)}%
          </span>
        </div>
      )}

      <div
        className={cn(
          'relative w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-700/60',
          heightClass
        )}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Achievement: ${percentage.toFixed(1)}%`}
      >
        {/* Progress fill */}
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colors.bar)}
          style={{ width: `${clampedValue}%` }}
        />

        {/* 70% Orange threshold marker */}
        {showTicks && (
          <div
            className="absolute top-0 bottom-0 w-[1.5px] bg-amber-500/70 dark:bg-amber-400/80 z-10"
            style={{ left: `${thresholds.orange}%` }}
            title={`Attention Threshold (${thresholds.orange}%)`}
          />
        )}

        {/* 90% Green threshold marker */}
        {showTicks && (
          <div
            className="absolute top-0 bottom-0 w-[1.5px] bg-emerald-600/80 dark:bg-emerald-400/90 z-10"
            style={{ left: `${thresholds.green}%` }}
            title={`Target Threshold (${thresholds.green}%)`}
          />
        )}
      </div>
    </div>
  );
};
