import React, { useEffect, useState } from 'react';
import { X, Flag } from 'lucide-react';
import { getStatusColorClass } from '@/lib/utils/status';
import { cn } from '@/lib/utils';
import { PriorityLevel } from '@/lib/types/flag';
import { PerformanceStatus } from '@/lib/types/common';

interface FlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { reason: string; priority: PriorityLevel }) => void;
  institutionName: string;
  departmentName: string;
  parameterName: string;
  parameterCode: string;
  currentStatus: PerformanceStatus;
  targetValue: string | number;
  actualValue: string | number;
  unit: string;
}

export const FlagModal: React.FC<FlagModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  institutionName,
  departmentName,
  parameterName,
  parameterCode,
  currentStatus,
  targetValue,
  actualValue,
  unit,
}) => {
  const [reason, setReason] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('HIGH');

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

  if (!isOpen) return null;

  const colors = getStatusColorClass(currentStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onSubmit({ reason, priority });
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-flag-title"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden z-10 animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 shrink-0">
              <Flag className="w-4 h-4 text-rose-700 dark:text-rose-400" />
            </div>
            <div>
              <h2 id="modal-flag-title" className="text-sm font-extrabold text-slate-950 dark:text-white tracking-tight">
                FLAG DEPARTMENT FOR REVIEW
              </h2>
              <p className="text-[10px] text-slate-500 font-mono">Chairman Intervention System (Mock)</p>
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
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-150 dark:border-slate-800 text-xs">
            <div className="col-span-2">
              <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Institution</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{institutionName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Department</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{departmentName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Parameter</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {parameterName} ({parameterCode})
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Current Status</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', colors.dot)} />
                <span className={cn('font-bold', colors.text)}>
                  {currentStatus === 'GREEN' ? 'Achieved' : currentStatus === 'ORANGE' ? 'Needs Improvement' : 'Action Required'}
                </span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Performance (Actual / Target)</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {actualValue} / {targetValue} {unit}
              </span>
            </div>
          </div>

          {/* Reason Input */}
          <div className="space-y-1.5">
            <label htmlFor="flag-reason" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
              Reason for Intervention Flag <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="flag-reason"
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Detail the operational gap, specific concern, or required action from the HOD..."
              className="w-full text-xs p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-hidden transition-all resize-none"
            />
          </div>

          {/* Priority radio selection */}
          <div className="space-y-1.5">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
              Intervention Priority
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['HIGH', 'MEDIUM', 'LOW'] as PriorityLevel[]).map((level) => (
                <label
                  key={level}
                  className={cn(
                    'flex flex-col items-center justify-center p-2 rounded-lg border text-center cursor-pointer select-none transition-all',
                    priority === level
                      ? level === 'HIGH'
                        ? 'border-rose-500 bg-rose-50/30 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 ring-2 ring-rose-500/20 font-bold'
                        : level === 'MEDIUM'
                        ? 'border-amber-500 bg-amber-50/30 dark:bg-amber-950/20 text-amber-700 dark:text-amber-450 ring-2 ring-amber-500/20 font-bold'
                        : 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 ring-2 ring-blue-500/20 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500 text-xs'
                  )}
                >
                  <input
                    type="radio"
                    name="priority-level"
                    value={level}
                    checked={priority === level}
                    onChange={() => setPriority(level)}
                    className="sr-only"
                  />
                  <span className="text-[10px] font-mono font-bold tracking-wider">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-650 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-rose-900 dark:bg-rose-700 hover:bg-rose-800 dark:hover:bg-rose-600 text-white transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Flag Department</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
