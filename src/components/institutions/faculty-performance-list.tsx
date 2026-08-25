'use client';

import React, { useState } from 'react';
import { FacultyMetric } from '@/data/mock/faculty-performance.mock';
import { StatusBadge } from '@/components/primitives';
import { PerformanceStatus } from '@/lib/types/common';
import { cn } from '@/lib/utils';

interface FacultyPerformanceListProps {
  facultyMetrics: FacultyMetric[];
  metricUnit: string;
}

export const FacultyPerformanceList: React.FC<FacultyPerformanceListProps> = ({
  facultyMetrics,
  metricUnit,
}) => {
  const [statusFilter, setStatusFilter] = useState<PerformanceStatus | 'ALL'>('ALL');
  const [zeroCountFilter, setZeroCountFilter] = useState<'ALL' | 'ZERO'>('ALL');

  if (!facultyMetrics || facultyMetrics.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-md border border-dashed border-slate-200 dark:border-slate-800">
        No faculty data available for this department.
      </div>
    );
  }

  let filteredMetrics = facultyMetrics;
  if (statusFilter !== 'ALL') {
    filteredMetrics = filteredMetrics.filter(f => f.status === statusFilter);
  }
  if (zeroCountFilter === 'ZERO') {
    filteredMetrics = filteredMetrics.filter(f => f.zeroCountIndicator);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Local Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="inline-flex items-center p-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={cn('px-2 py-1 rounded transition-all font-semibold', statusFilter === 'ALL' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900')}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('GREEN')}
            className={cn('px-2 py-1 rounded transition-all font-semibold', statusFilter === 'GREEN' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-xs' : 'text-slate-500 hover:text-emerald-600')}
          >
            Green
          </button>
          <button
            onClick={() => setStatusFilter('ORANGE')}
            className={cn('px-2 py-1 rounded transition-all font-semibold', statusFilter === 'ORANGE' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 shadow-xs' : 'text-slate-500 hover:text-amber-600')}
          >
            Orange
          </button>
          <button
            onClick={() => setStatusFilter('RED')}
            className={cn('px-2 py-1 rounded transition-all font-semibold', statusFilter === 'RED' ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 shadow-xs' : 'text-slate-500 hover:text-rose-600')}
          >
            Red
          </button>
        </div>

        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />

        {/* Zero Count Filter */}
        <div className="inline-flex items-center p-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setZeroCountFilter('ALL')}
            className={cn('px-2 py-1 rounded transition-all font-semibold', zeroCountFilter === 'ALL' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900')}
          >
            All
          </button>
          <button
            onClick={() => setZeroCountFilter('ZERO')}
            className={cn('px-2 py-1 rounded transition-all font-semibold', zeroCountFilter === 'ZERO' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-xs' : 'text-slate-500 hover:text-indigo-600')}
          >
            Zero Count
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-md">
      <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px] font-semibold text-slate-500">
          <tr>
            <th className="px-3 py-2">Faculty Name</th>
            <th className="px-3 py-2">Designation</th>
            <th className="px-3 py-2 text-right">Metric ({metricUnit})</th>
            <th className="px-3 py-2 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredMetrics.map((faculty) => (
            <tr key={faculty.facultyId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="px-3 py-2 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                {faculty.name}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-slate-500">
                {faculty.designation}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-right font-mono font-semibold">
                {faculty.metricValue}
                {faculty.zeroCountIndicator && (
                  <span className="ml-1.5 text-[9px] px-1 py-0.5 rounded-sm bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                    ZERO
                  </span>
                )}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-center">
                <StatusBadge status={faculty.status} size="sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};
