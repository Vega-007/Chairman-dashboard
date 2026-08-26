'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
} from 'lucide-react';
import { InstitutionCategoryDetail } from '@/lib/types/performance';
import { cn } from '@/lib/utils';

interface ParameterCardProps {
  category: InstitutionCategoryDetail;
  isSelected?: boolean;
  onSelect: (category: InstitutionCategoryDetail) => void;
  onOpenDetails: (category: InstitutionCategoryDetail) => void;
}

// Premium status styles: colored left border + soft ambient background tint
const STATUS_STYLES = {
  GREEN: {
    card: 'border-l-[3px] border-l-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-200/80 dark:border-emerald-900 hover:border-emerald-300 dark:hover:border-emerald-800 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20',
    dot: 'bg-emerald-600 dark:bg-emerald-400',
    bar: 'bg-emerald-600 dark:bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-400',
    selected: 'border-l-[3px] border-l-emerald-500 ring-2 ring-emerald-500/25 bg-emerald-50/40 dark:bg-emerald-950/25 shadow-sm border-emerald-300 dark:border-emerald-800',
  },
  ORANGE: {
    card: 'border-l-[3px] border-l-amber-500 bg-amber-50/20 dark:bg-amber-950/10 border-amber-200/80 dark:border-amber-900 hover:border-amber-300 dark:hover:border-amber-800 hover:bg-amber-50/40 dark:hover:bg-amber-950/20',
    dot: 'bg-amber-500 dark:bg-amber-400',
    bar: 'bg-amber-500 dark:bg-amber-400',
    text: 'text-amber-700 dark:text-amber-400',
    selected: 'border-l-[3px] border-l-amber-500 ring-2 ring-amber-500/25 bg-amber-50/40 dark:bg-amber-950/25 shadow-sm border-amber-300 dark:border-amber-800',
  },
  RED: {
    card: 'border-l-[3px] border-l-rose-600 bg-rose-50/20 dark:bg-rose-950/10 border-rose-200/80 dark:border-rose-900 hover:border-rose-300 dark:hover:border-rose-800 hover:bg-rose-50/40 dark:hover:bg-rose-950/20',
    dot: 'bg-rose-600 dark:bg-rose-400',
    bar: 'bg-rose-600 dark:bg-rose-500',
    text: 'text-rose-700 dark:text-rose-400',
    selected: 'border-l-[3px] border-l-rose-600 ring-2 ring-rose-500/25 bg-rose-50/40 dark:bg-rose-950/25 shadow-sm border-rose-300 dark:border-rose-800',
  },
} as const;

export const ParameterCard: React.FC<ParameterCardProps> = ({
  category,
  isSelected = false,
  onSelect,
  onOpenDetails,
}) => {
  const colors = STATUS_STYLES[category.status];

  const trendIcon =
    category.trend === undefined || category.trend === null ? null : category.trend > 0 ? (
      <TrendingUp className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
    ) : category.trend < 0 ? (
      <TrendingDown className="w-2.5 h-2.5 text-rose-500 shrink-0" />
    ) : (
      <Minus className="w-2.5 h-2.5 text-slate-400 shrink-0" />
    );

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenDetails(category);
  };

  return (
    <div
      onClick={() => onSelect(category)}
      className={cn(
        'group relative border rounded-md p-2.5 transition-all duration-150 cursor-pointer flex flex-col justify-between select-none',
        isSelected ? colors.selected : colors.card
      )}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`${category.name}: ${category.actual} of target ${category.target}, ${category.achievementPercentage}% achieved`}
    >
      {/* Top row: Status indicator + Name/Code + Percentage */}
      <div>
        <div className="flex items-start justify-between gap-1.5 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={cn('w-2 h-2 rounded-full shrink-0', colors.dot)}
              aria-label={
                category.status === 'GREEN'
                  ? 'Achieved'
                  : category.status === 'ORANGE'
                  ? 'Needs Improvement'
                  : 'Action Required'
              }
            />
            <h3 className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors truncate">
              {category.name}
            </h3>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span className={cn('text-xs font-extrabold font-mono', colors.text)}>
              {category.achievementPercentage}%
            </span>
          </div>
        </div>

        {/* Code & Actual vs Target */}
        <div className="flex items-baseline justify-between text-[10px] ml-3.5 mt-0.5">
          <span className="font-bold text-slate-900 dark:text-white truncate">
            {typeof category.actual === 'number' ? category.actual.toLocaleString() : category.actual}
            {category.unit ? <span className="font-normal text-slate-500 ml-0.5">{category.unit}</span> : null}
          </span>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono shrink-0">
            Target: {typeof category.target === 'number' ? category.target.toLocaleString() : category.target}
          </span>
        </div>

        {/* Compact Progress bar */}
        <div className="mt-1.5 ml-3.5">
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all duration-300', colors.bar)}
              style={{ width: `${typeof category.achievementPercentage === 'number' ? Math.min(category.achievementPercentage, 100) : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer: Trend + Details Action Button */}
      <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400">
        <div className="flex items-center gap-1 ml-3.5">
          {category.trend !== undefined && (
            <span className="flex items-center gap-0.5 font-mono">
              {trendIcon}
              <span>{category.trend > 0 ? '+' : ''}{category.trend}%</span>
            </span>
          )}
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="font-mono uppercase text-slate-400 dark:text-slate-500">{category.code}</span>
        </div>

        <button
          type="button"
          onClick={handleDetailsClick}
          className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-slate-500 hover:text-blue-700 dark:hover:text-blue-400 transition-colors p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          title={`View details for ${category.name}`}
          aria-label={`View details for ${category.name}`}
        >
          <span>Details</span>
          <ChevronRight className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
};
