'use client';

import React from 'react';
import { Database, Info } from 'lucide-react';
import { useAppStore } from '@/lib/store/use-app-store';
import { cn } from '@/lib/utils';

interface DemoDataBadgeProps {
  className?: string;
}

export const DemoDataBadge: React.FC<DemoDataBadgeProps> = ({ className }) => {
  const { isDemoData } = useAppStore();

  if (!isDemoData) return null;

  return (
    <div
      className={cn(
        'group relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px] font-medium text-slate-600 dark:text-slate-300 transition-colors',
        className
      )}
      title="All statistics shown are simulated demo datasets (is_mock = true). Production database ingestion will replace this."
    >
      <Database className="w-3 h-3 text-slate-500 dark:text-slate-400 shrink-0" />
      <span className="font-semibold tracking-wide text-slate-700 dark:text-slate-200">DEMO DATA</span>
      <Info className="w-3 h-3 text-slate-400 opacity-60 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
