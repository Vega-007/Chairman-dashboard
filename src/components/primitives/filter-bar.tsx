'use client';

import React from 'react';
import { Search, X, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { CampusName } from '@/lib/types/institution';
import { PerformanceStatus } from '@/lib/types/common';
import { ScoreRangeFilter } from '@/lib/types/identity';
import { cn } from '@/lib/utils';

export interface FilterBarSortOption<T = string> {
  label: string;
  value: T;
}

export interface FilterBarProps<TSort = string> {
  // Search
  search?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;

  // Campus
  campus?: CampusName | 'ALL';
  onCampusChange?: (campus: CampusName | 'ALL') => void;
  showCampusFilter?: boolean;

  // Status
  status?: PerformanceStatus | 'ALL';
  onStatusChange?: (status: PerformanceStatus | 'ALL') => void;
  showStatusFilter?: boolean;

  // Score Range
  scoreRange?: ScoreRangeFilter;
  onScoreRangeChange?: (range: ScoreRangeFilter) => void;
  showScoreFilter?: boolean;

  // Sorting
  sortBy?: TSort;
  onSortChange?: (sort: TSort) => void;
  sortOptions?: FilterBarSortOption<TSort>[];

  // Custom Select (e.g. Category or Institution select)
  customFilter?: React.ReactNode;

  // Reset
  hasActiveFilters?: boolean;
  onReset?: () => void;

  // Metadata / Counts
  totalCount?: number;
  filteredCount?: number;
  className?: string;
}

export function FilterBar<TSort = string>({
  search,
  onSearchChange,
  searchPlaceholder = 'Search by name, code, department...',
  campus,
  onCampusChange,
  showCampusFilter = true,
  status,
  onStatusChange,
  showStatusFilter = true,
  scoreRange,
  onScoreRangeChange,
  showScoreFilter = false,
  sortBy,
  onSortChange,
  sortOptions,
  customFilter,
  hasActiveFilters,
  onReset,
  totalCount,
  filteredCount,
  className,
}: FilterBarProps<TSort>) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-3.5 shadow-xs space-y-3',
        className
      )}
    >
      {/* Primary Row: Search + Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Search Input */}
        {onSearchChange !== undefined && (
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600/30 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            {search && search.length > 0 && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Filter Controls Cluster */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Campus Selector */}
          {showCampusFilter && onCampusChange && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md">
              {(['ALL', 'Ramapuram', 'Trichy'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onCampusChange(c)}
                  className={cn(
                    'px-2 py-1 text-[11px] font-medium rounded transition-colors',
                    campus === c
                      ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-300 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  )}
                >
                  {c === 'ALL' ? 'All Campuses' : c}
                </button>
              ))}
            </div>
          )}

          {/* Status Selector */}
          {showStatusFilter && onStatusChange && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md">
              {[
                { label: 'All Status', value: 'ALL' as const },
                { label: 'Achieved (≥90%)', value: 'GREEN' as const },
                { label: 'Needs Impr. (70-89%)', value: 'ORANGE' as const },
                { label: 'Action Req. (<70%)', value: 'RED' as const },
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => onStatusChange(s.value)}
                  className={cn(
                    'px-2 py-1 text-[11px] font-medium rounded transition-colors',
                    status === s.value
                      ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-300 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Score Range Filter */}
          {showScoreFilter && onScoreRangeChange && (
            <div className="flex items-center gap-1">
              <select
                value={scoreRange || 'ALL'}
                onChange={(e) => onScoreRangeChange(e.target.value as ScoreRangeFilter)}
                className="px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-medium text-slate-800 dark:text-slate-200"
                aria-label="Score Range Filter"
              >
                <option value="ALL">All Scores</option>
                <option value="90_100">Score 90–100%</option>
                <option value="70_89">Score 70–89%</option>
                <option value="BELOW_70">Score Below 70%</option>
              </select>
            </div>
          )}

          {/* Custom Filter Selects (Category, Institution) */}
          {customFilter}

          {/* Sort Dropdown */}
          {sortOptions && onSortChange && sortBy !== undefined && (
            <div className="flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={String(sortBy)}
                onChange={(e) => onSortChange(e.target.value as unknown as TSort)}
                className="px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-medium text-slate-800 dark:text-slate-200"
                aria-label="Sort Options"
              >
                {sortOptions.map((opt) => (
                  <option key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reset Filters CTA */}
          {hasActiveFilters && onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition-colors"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Secondary Row: Active Count Indicator (if passed) */}
      {(filteredCount !== undefined || totalCount !== undefined) && (
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-1 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filteredCount ?? totalCount}</strong>
            {totalCount !== undefined && filteredCount !== undefined && filteredCount !== totalCount && (
              <span> of {totalCount} total items</span>
            )}
          </span>
          {hasActiveFilters && <span className="text-[11px] text-blue-700 dark:text-blue-400 font-sans">Filters Active</span>}
        </div>
      )}
    </div>
  );
}
