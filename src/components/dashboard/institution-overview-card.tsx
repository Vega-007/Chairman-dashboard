'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Users, GraduationCap, ArrowRight, Layers } from 'lucide-react';
import { InstitutionSummary } from '@/lib/types/institution';
import { StatusBadge } from '@/components/primitives/status-badge';
import { AchievementBar } from '@/components/primitives/achievement-bar';
import { InstitutionLogo } from '@/components/primitives/institution-logo';
import { cn } from '@/lib/utils';

interface InstitutionOverviewCardProps {
  institution: InstitutionSummary;
  className?: string;
}

export const InstitutionOverviewCard: React.FC<InstitutionOverviewCardProps> = ({
  institution,
  className,
}) => {
  // Aggregate faculty and student totals from departments
  const totalFaculty = institution.departments.reduce((acc, d) => acc + d.facultyCount, 0);
  const totalStudents = institution.departments.reduce((acc, d) => acc + d.studentCount, 0);

  return (
    <Link
      href={`/institutions/${institution.id}`}
      className={cn(
        'group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between space-y-3 relative',
        className
      )}
    >
      <div className="space-y-2.5">
        {/* Top Header: Logo + Code + Type Badge + Status Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <InstitutionLogo
              institutionIdOrCode={institution.id}
              name={institution.shortName}
              size="md"
              shape="rounded"
              className="bg-white border border-slate-200 dark:border-slate-700"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  title={`Institution Code: ${institution.code}`}
                >
                  {institution.code}
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  {institution.institutionType}
                </span>
              </div>
            </div>
          </div>

          <StatusBadge status={institution.status} size="sm" />
        </div>

        {/* Institution Name & Campus */}
        <div>
          <h3
            className="text-sm font-bold text-slate-950 dark:text-white leading-snug group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[2.5rem]"
            title={institution.name}
          >
            {institution.name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{institution.campusDisplayName}</span>
          </div>
        </div>

        {/* Performance Score & Progress Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Overall Performance
            </span>
            <span className="text-sm font-extrabold text-slate-950 dark:text-white font-mono">
              {institution.overallScore.toFixed(1)}%
            </span>
          </div>

          <AchievementBar
            percentage={institution.overallScore}
            status={institution.status}
            showTicks={false}
            size="sm"
          />

          {/* Status Breakdown Pills */}
          <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{institution.greenCount}</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                <span className="text-amber-700 dark:text-amber-400 font-semibold">{institution.orangeCount}</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                <span className="text-rose-700 dark:text-rose-400 font-semibold">{institution.redCount}</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              {institution.greenCount + institution.orangeCount + institution.redCount} Categories
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Demographic Metadata & CTA */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2 text-[11px]">
          <div className="flex items-center gap-1" title={`${institution.departmentCount} Constituent Departments`}>
            <Layers className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{institution.departmentCount} Depts</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1" title={`${totalFaculty} Faculty Members`}>
            <Users className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{totalFaculty} Fac</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1" title={`${totalStudents.toLocaleString()} Students Enrolled`}>
            <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{totalStudents.toLocaleString()}</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 dark:text-blue-400 group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors shrink-0 ml-1">
          <span>View Details</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
