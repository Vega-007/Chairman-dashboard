'use client';

import React from 'react';
import { X, RotateCcw } from 'lucide-react';

export interface ActiveChip {
  id: string;
  label: string;
  value: string;
  onRemove: () => void;
}

export interface ActiveFilterChipsProps {
  chips: ActiveChip[];
  onClearAll: () => void;
  className?: string;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({
  chips,
  onClearAll,
  className,
}) => {
  if (chips.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 text-xs py-1 ${className || ''}`}>
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
        Active Filters:
      </span>

      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs"
        >
          <span className="text-slate-500 dark:text-slate-400 font-normal">{chip.label}:</span>
          <span className="font-semibold">{chip.value}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            className="p-0.5 rounded hover:bg-blue-200/60 dark:hover:bg-blue-800/60 text-blue-700 dark:text-blue-400 transition-colors"
            aria-label={`Remove filter for ${chip.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 underline ml-1"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Clear All</span>
      </button>
    </div>
  );
};
