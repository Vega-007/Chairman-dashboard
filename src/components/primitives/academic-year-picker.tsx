'use client';

import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/lib/store/use-app-store';
import { AcademicYearOption } from '@/lib/types/common';
import { cn } from '@/lib/utils';

interface AcademicYearPickerProps {
  className?: string;
}

export const AcademicYearPicker: React.FC<AcademicYearPickerProps> = ({ className }) => {
  const { academicYear, setAcademicYear, availableYears } = useAppStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative inline-block text-left', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-blue-600/30 transition-all shadow-xs"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
        <span>AY: <strong className="font-bold text-blue-900 dark:text-blue-400">{academicYear}</strong></span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-1.5 w-40 rounded-md bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800 py-1 focus:outline-none ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95 duration-100"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
            Select Academic Year
          </div>
          {availableYears.map((year) => {
            const isSelected = year === academicYear;
            return (
              <button
                key={year}
                type="button"
                onClick={() => {
                  setAcademicYear(year as AcademicYearOption);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors',
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                )}
                role="menuitem"
              >
                <span>{year}</span>
                {isSelected && (
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded font-mono">
                    ACTIVE
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
