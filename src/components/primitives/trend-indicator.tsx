import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendIndicatorProps {
  delta: number;
  direction?: 'up' | 'down' | 'flat';
  label?: string;
  isPositiveGood?: boolean; // For metrics where higher is better (e.g. placements: true, dropouts: false)
  size?: 'sm' | 'md';
  className?: string;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  delta,
  direction = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat',
  label,
  isPositiveGood = true,
  size = 'sm',
  className,
}) => {
  const isUp = direction === 'up';
  const isDown = direction === 'down';
  const isFlat = direction === 'flat';

  let colorClasses = 'text-slate-500 dark:text-slate-400';

  if (isUp) {
    colorClasses = isPositiveGood
      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
      : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60';
  } else if (isDown) {
    colorClasses = isPositiveGood
      ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60'
      : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60';
  } else {
    colorClasses = 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700';
  }

  const iconSizes = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-xs font-medium',
        colorClasses,
        className
      )}
    >
      {isUp && <TrendingUp className={iconSizes} aria-hidden="true" />}
      {isDown && <TrendingDown className={iconSizes} aria-hidden="true" />}
      {isFlat && <Minus className={iconSizes} aria-hidden="true" />}
      <span>
        {delta > 0 ? `+${delta}%` : `${delta}%`}
        {label && <span className="ml-1 opacity-80 text-[11px] font-normal">{label}</span>}
      </span>
    </span>
  );
};
