'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
} from 'lucide-react';
import { InstitutionCategoryDetail } from '@/lib/types/performance';
import { getStatusColorClass } from '@/lib/utils/status';
import { cn } from '@/lib/utils';

interface ParameterCardProps {
  category: InstitutionCategoryDetail;
  isSelected?: boolean;
  onSelect: (category: InstitutionCategoryDetail) => void;
  onOpenDetails: (category: InstitutionCategoryDetail) => void;
}

export const ParameterCard: React.FC<ParameterCardProps> = ({
  category,
  isSelected = false,
  onSelect,
  onOpenDetails,
}) => {
  const colors = getStatusColorClass(category.status);

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
        'group relative bg-white dark:bg-slate-900 border rounded-md p-2.5 transition-all duration-150 cursor-pointer flex flex-col justify-between select-none',
        isSelected
          ? 'border-blue-600 dark:border-blue-500 ring-2 ring-blue-600/20 shadow-sm bg-blue-50/20 dark:bg-blue-950/20'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
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
              style={{ width: `${Math.min(category.achievementPercentage, 100)}%` }}
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
