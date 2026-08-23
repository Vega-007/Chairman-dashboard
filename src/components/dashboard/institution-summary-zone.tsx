'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Network, MapPin, Building, ArrowRight } from 'lucide-react';
import { CampusStats, InstitutionSummary, CampusName } from '@/lib/types/institution';
import { StatusBadge } from '@/components/primitives/status-badge';
import { InstitutionOverviewCard } from './institution-overview-card';
import { cn } from '@/lib/utils';

interface InstitutionSummaryZoneProps {
  total: number;
  ramapuram: CampusStats;
  trichy: CampusStats;
  institutions: InstitutionSummary[];
  className?: string;
}

export const InstitutionSummaryZone: React.FC<InstitutionSummaryZoneProps> = ({
  total,
  ramapuram,
  trichy,
  institutions,
  className,
}) => {
  const [campusFilter, setCampusFilter] = useState<CampusName | 'ALL'>('ALL');

  const ramapuramInstitutions = institutions.filter((i) => i.campus === 'Ramapuram');
  const trichyInstitutions = institutions.filter((i) => i.campus === 'Trichy');

  return (
    <div className={cn('space-y-6', className)}>
      {/* Zone Main Header with Campus Filter Toggle */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 shrink-0">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">
                  Constituent Institutions Ecosystem ({total} Institutions)
                </h2>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  All 19 Entities Tracked
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Individual performance scorecards and capacity metrics grouped by campus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-between md:justify-end">
            {/* Simple Clean Campus Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md text-xs">
              {(['ALL', 'Ramapuram', 'Trichy'] as const).map((camp) => (
                <button
                  key={camp}
                  type="button"
                  onClick={() => setCampusFilter(camp)}
                  className={cn(
                    'px-2.5 py-1 text-[11px] font-medium rounded transition-colors',
                    campusFilter === camp
                      ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-300 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  )}
                >
                  {camp === 'ALL'
                    ? `All (${total})`
                    : camp === 'Ramapuram'
                    ? `Ramapuram (${ramapuramInstitutions.length})`
                    : `Trichy (${trichyInstitutions.length})`}
                </button>
              ))}
            </div>

            <Link
              href="/institutions"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-900 dark:bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors shadow-xs shrink-0 group"
            >
              <span>Hierarchy Explorer</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION 1: CHENNAI – RAMAPURAM (7 Institutions) */}
      {(campusFilter === 'ALL' || campusFilter === 'Ramapuram') && (
        <div className="space-y-3.5">
          {/* Campus Header Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-blue-100/70 dark:bg-blue-950 text-blue-900 dark:text-blue-300">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-wider">
                    Chennai – Ramapuram Campus
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {ramapuramInstitutions.length} Institutions
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {ramapuram.greenCount} Achieved · {ramapuram.orangeCount} Needs Improvement · {ramapuram.redCount} Action Required
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-sm font-extrabold text-slate-950 dark:text-white block font-mono">
                  {ramapuram.overallScore.toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400">Campus Score</span>
              </div>
              <StatusBadge status={ramapuram.status} size="sm" />
            </div>
          </div>

          {/* Ramapuram 3-Column Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ramapuramInstitutions.map((inst) => (
              <InstitutionOverviewCard key={inst.id} institution={inst} />
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: TIRUCHIRAPPALLI (12 Institutions) */}
      {(campusFilter === 'ALL' || campusFilter === 'Trichy') && (
        <div className="space-y-3.5 pt-2">
          {/* Campus Header Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-blue-100/70 dark:bg-blue-950 text-blue-900 dark:text-blue-300">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-wider">
                    Tiruchirappalli Campus
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {trichyInstitutions.length} Institutions
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {trichy.greenCount} Achieved · {trichy.orangeCount} Needs Improvement · {trichy.redCount} Action Required
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-sm font-extrabold text-slate-950 dark:text-white block font-mono">
                  {trichy.overallScore.toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400">Campus Score</span>
              </div>
              <StatusBadge status={trichy.status} size="sm" />
            </div>
          </div>

          {/* Trichy 3-Column Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trichyInstitutions.map((inst) => (
              <InstitutionOverviewCard key={inst.id} institution={inst} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
