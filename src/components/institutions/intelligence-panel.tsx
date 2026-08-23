'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  ArrowRight,
  Users,
  GraduationCap,
  Layers,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { InstitutionSummary } from '@/lib/types/institution';
import { StatusBadge } from '@/components/primitives/status-badge';
import { AchievementBar } from '@/components/primitives/achievement-bar';
import { TrendIndicator } from '@/components/primitives/trend-indicator';
import { InstitutionLogo } from '@/components/primitives/institution-logo';
import { DepartmentBadge } from '@/components/primitives/department-badge';
import { cn } from '@/lib/utils';

interface IntelligencePanelProps {
  institution: InstitutionSummary | null;
  className?: string;
}

export const IntelligencePanel: React.FC<IntelligencePanelProps> = ({ institution, className }) => {
  if (!institution) {
    return (
      <div
        className={cn(
          'min-h-[460px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-8 shadow-xs flex flex-col items-center justify-center text-center',
          className
        )}
      >
        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3.5">
          <Layers className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
          Institutional Intelligence Panel
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
          Select any campus or institution node in the hierarchy tree to inspect its performance profile, leadership metrics, and department health.
        </p>
      </div>
    );
  }

  const totalFaculty = institution.departments.reduce((acc, d) => acc + d.facultyCount, 0);
  const totalStudents = institution.departments.reduce((acc, d) => acc + d.studentCount, 0);

  // Map top & lowest categories to real slugs for deep-linking
  const topCatSlug = institution.topCategory?.toLowerCase().includes('pub')
    ? 'publication'
    : institution.topCategory?.toLowerCase().includes('pat')
    ? 'patent'
    : institution.topCategory?.toLowerCase().includes('proj')
    ? 'funded-project'
    : institution.topCategory?.toLowerCase().includes('adm')
    ? 'admission'
    : 'placement';

  const lowestCatSlug = institution.lowestCategory?.toLowerCase().includes('proj')
    ? 'funded-project'
    : institution.lowestCategory?.toLowerCase().includes('nptel')
    ? 'nptel'
    : institution.lowestCategory?.toLowerCase().includes('cons')
    ? 'consultancy'
    : 'patent';

  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-5 shadow-xs flex flex-col justify-between space-y-5',
        className
      )}
    >
      <div className="space-y-5">
        {/* Header with Large InstitutionLogo & Metadata */}
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <InstitutionLogo
              institutionIdOrCode={institution.id}
              name={institution.shortName}
              size="lg"
              shape="rounded"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {institution.code}
                </span>
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {institution.campusDisplayName}
                </span>
                <span className="text-[10px] text-slate-400 ml-auto font-mono">
                  {institution.institutionType}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-950 dark:text-white leading-snug">
                {institution.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Overall Score & Status Card */}
        <div className="p-4 rounded-lg bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Overall Performance Index
            </span>
            <StatusBadge status={institution.status} size="sm" />
          </div>

          <div className="flex items-baseline justify-between font-mono">
            <span className="text-3xl font-extrabold text-slate-950 dark:text-white">
              {institution.overallScore.toFixed(1)}%
            </span>
            <TrendIndicator delta={institution.trendDelta} size="sm" />
          </div>

          <AchievementBar percentage={institution.overallScore} status={institution.status} size="md" />

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-mono">
            <div className="flex items-center gap-2">
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{institution.greenCount} Achieved</span>
              <span>·</span>
              <span className="text-amber-700 dark:text-amber-400 font-semibold">{institution.orangeCount} Needs Impr.</span>
              <span>·</span>
              <span className="text-rose-700 dark:text-rose-400 font-semibold">{institution.redCount} Action Req.</span>
            </div>
          </div>
        </div>

        {/* 3 Core Demographic Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <Layers className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Depts</span>
            <span className="text-sm font-extrabold text-slate-950 dark:text-white font-mono">
              {institution.departmentCount}
            </span>
          </div>

          <div className="p-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <Users className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Faculty</span>
            <span className="text-sm font-extrabold text-slate-950 dark:text-white font-mono">
              {totalFaculty}
            </span>
          </div>

          <div className="p-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
            <GraduationCap className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Students</span>
            <span className="text-sm font-extrabold text-slate-950 dark:text-white font-mono">
              {totalStudents.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Category Extremes Highlights */}
        {(institution.topCategory || institution.lowestCategory) && (
          <div className="space-y-2 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] block">
              Performance Indicators
            </span>

            {institution.topCategory && (
              <div className="p-2.5 rounded-md bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate pr-2">
                  <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold block uppercase">
                      Top Performing Category
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white truncate block">
                      {institution.topCategory}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/performance/${topCatSlug}`}
                  className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-900 hover:underline shrink-0"
                >
                  View Category →
                </Link>
              </div>
            )}

            {institution.lowestCategory && (
              <div className="p-2.5 rounded-md bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate pr-2">
                  <TrendingUp className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-rose-800 dark:text-rose-300 font-bold block uppercase">
                      Needs Attention
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white truncate block">
                      {institution.lowestCategory}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/performance/${lowestCatSlug}`}
                  className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-900 hover:underline shrink-0"
                >
                  View Category →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Constituent Departments Sample */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Constituent Departments</span>
            <span className="text-slate-400 text-[11px] font-mono">
              {institution.departments.length} Units
            </span>
          </div>

          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            {institution.departments.map((dept) => (
              <div
                key={dept.id}
                className="flex items-center justify-between p-2 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <div className="flex items-center gap-2 truncate pr-2 min-w-0">
                  <DepartmentBadge name={dept.name} id={dept.id} size="xs" />
                  <div className="truncate">
                    <span className="font-medium text-slate-900 dark:text-white block truncate">
                      {dept.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {dept.facultyCount} Faculty · {dept.studentCount} Students
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-[11px]">
                    {dept.performanceScore.toFixed(1)}%
                  </span>
                  <StatusBadge status={dept.status} size="sm" showDot={false} />
                  <Link
                    href={`/institutions/${institution.id}/departments/${dept.id}`}
                    className="p-1 rounded text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                    title={`Inspect ${dept.name}`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Bottom CTA */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <Link
          href={`/institutions/${institution.id}`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors shadow-xs group"
        >
          <span>View Institution Scorecard</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
