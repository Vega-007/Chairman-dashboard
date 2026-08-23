'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowUpRight, ChevronRight, TrendingDown } from 'lucide-react';
import { AttentionItem } from '@/lib/types/performance';
import { CampusName } from '@/lib/types/institution';
import { StatusBadge } from '@/components/primitives/status-badge';
import { AchievementBar } from '@/components/primitives/achievement-bar';
import { InstitutionLogo } from '@/components/primitives/institution-logo';
import { cn } from '@/lib/utils';

interface AttentionPanelZoneProps {
  items: AttentionItem[];
  totalCount?: number;
  className?: string;
}

export const AttentionPanelZone: React.FC<AttentionPanelZoneProps> = ({ items, totalCount, className }) => {
  const [campusFilter, setCampusFilter] = useState<CampusName | 'ALL'>('ALL');

  const filteredItems = items.filter((item) => {
    if (campusFilter === 'ALL') return true;
    return item.campus === campusFilter;
  });

  const displayTotal = totalCount ?? items.length;

  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4',
        className
      )}
    >
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">
                Chairman&apos;s Attention Required
              </h2>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Showing {filteredItems.length} of {displayTotal} issues
              </span>
              {campusFilter !== 'ALL' && (
                <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                  Campus: {campusFilter}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Prioritized operational alerts sorted by severity, deficit, and negative trend
            </p>
          </div>
        </div>

        {/* Campus Filter Toggle Group */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs font-semibold">
            <span className="text-[10px] text-slate-400 font-mono px-1.5">Campus:</span>
            {(['ALL', 'Ramapuram', 'Trichy'] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCampusFilter(c)}
                className={cn(
                  'px-2.5 py-1 rounded text-xs transition-colors font-medium',
                  campusFilter === c
                    ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                )}
              >
                {c === 'ALL' ? 'All' : c}
              </button>
            ))}
          </div>

          <Link
            href="/attention"
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:text-rose-800 transition-colors shrink-0"
          >
            <span>Action Center ({displayTotal})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Actionable List */}
      {filteredItems.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
          No attention items found for {campusFilter} campus.
        </div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href="/attention"
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-rose-50/30 dark:hover:bg-rose-950/20 hover:border-rose-200 dark:hover:border-rose-900/60 transition-all gap-2 sm:gap-4"
            >
              {/* Left: Logo, Institution, & Category */}
              <div className="flex items-start gap-2.5 min-w-0">
                <InstitutionLogo
                  institutionIdOrCode={item.institutionId}
                  name={item.institutionShortName}
                  size="sm"
                  shape="rounded"
                  className="bg-white border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5"
                />
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-950 dark:text-white group-hover:text-rose-900 dark:group-hover:text-rose-300 transition-colors truncate">
                      {item.institutionShortName}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800">
                      {item.campus}
                    </span>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium block mt-0.5">
                    {item.categoryName} · Gap: <strong className="text-rose-700 dark:text-rose-400 font-semibold">{item.gap > 0 ? `+${item.gap}` : item.gap} {item.unit}</strong>
                  </span>
                </div>
              </div>

              {/* Right: Metrics & Status */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="w-24 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                      {item.achievementPercentage.toFixed(1)}%
                    </span>
                    {item.trend < 0 && (
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 flex items-center font-medium font-mono">
                        <TrendingDown className="w-3 h-3" />
                        {item.trend}%
                      </span>
                    )}
                  </div>
                  <AchievementBar
                    percentage={item.achievementPercentage}
                    status={item.status}
                    showTicks={false}
                    size="sm"
                  />
                </div>

                <div className="text-right text-[11px] text-slate-400 hidden md:block font-mono">
                  <span>{item.actual} / {item.target} {item.unit}</span>
                </div>

                <StatusBadge status={item.status} size="sm" />

                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
