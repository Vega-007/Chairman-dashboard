'use client';

import React, { useEffect } from 'react';
import {
  X,
  Award,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { InstitutionCategoryDetail } from '@/lib/types/performance';
import { getStatusColorClass } from '@/lib/utils/status';
import { cn } from '@/lib/utils';

interface ParameterDetailModalProps {
  category: InstitutionCategoryDetail | null;
  institutionName: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectForDrillDown?: (category: InstitutionCategoryDetail) => void;
}

export const ParameterDetailModal: React.FC<ParameterDetailModalProps> = ({
  category,
  institutionName,
  isOpen,
  onClose,
  onSelectForDrillDown,
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !category) return null;

  const colors = getStatusColorClass(category.status);

  const statusLabel =
    category.status === 'GREEN'
      ? 'Target Achieved (≥90%)'
      : category.status === 'ORANGE'
      ? 'Needs Improvement (70–89%)'
      : 'Action Required (<70%)';

  const StatusIcon =
    category.status === 'GREEN'
      ? CheckCircle2
      : category.status === 'ORANGE'
      ? AlertTriangle
      : XCircle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-category-title"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden z-10 animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-start gap-3 min-w-0">
            <div className={cn('p-2 rounded-lg shrink-0 mt-0.5', colors.bg, colors.border, 'border')}>
              <Award className={cn('w-4 h-4', colors.text)} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {category.code}
                </span>
                <span className="text-[11px] text-slate-500 font-medium truncate">
                  {institutionName}
                </span>
              </div>
              <h2 id="modal-category-title" className="text-base font-extrabold text-slate-950 dark:text-white tracking-tight">
                {category.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Description */}
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {category.description}
          </p>

          {/* Primary Metric Strip */}
          <div className={cn('p-3 rounded-lg border flex items-center justify-between gap-3', colors.bg, colors.border)}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Institutional Achievement
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-extrabold font-mono text-slate-950 dark:text-white">
                  {typeof category.actual === 'number' ? category.actual.toLocaleString() : category.actual}
                  <span className="text-xs font-normal text-slate-500 ml-1">{category.unit}</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  / Target: {typeof category.target === 'number' ? category.target.toLocaleString() : category.target}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="flex items-center gap-1.5 justify-end">
                <StatusIcon className={cn('w-3.5 h-3.5', colors.text)} />
                <span className={cn('text-xl font-extrabold font-mono', colors.text)}>
                  {category.achievementPercentage}%
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 block mt-0.5">
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Secondary Highlights */}
          {category.highlights.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-mono">
                Key Dimension Highlights
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {category.highlights.map((h, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                  >
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                      {h.label}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
                      {h.value}
                    </span>
                    {h.note && (
                      <span className="text-[9px] text-slate-400 block mt-0.5">
                        {h.note}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Academic Year Multi-Year Comparison (if available, e.g. for Graduation) */}
          {category.yearComparison && category.yearComparison.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block font-mono">
                Multi-Year Academic Trend
              </span>
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-[10px] uppercase font-mono text-slate-500">
                    <tr>
                      <th className="px-3 py-1.5">Academic Year</th>
                      <th className="px-3 py-1.5 text-right">Performance Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {category.yearComparison.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="px-3 py-1.5 font-medium text-slate-800 dark:text-slate-200">
                          {row.ay}
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                          {row.unit === 'Not available' ? 'Not available' : `${row.value}${row.unit || ''}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>

          {onSelectForDrillDown && (
            <button
              onClick={() => {
                onSelectForDrillDown(category);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-900 dark:bg-blue-600 text-white hover:bg-blue-800 transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>View Department Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
