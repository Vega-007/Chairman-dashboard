'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/primitives/page-header';
import { getInstitutionById } from '@/data/mock/institutions.mock';
import { Users, BookOpen } from 'lucide-react';
import { StatusBadge } from '@/components/primitives/status-badge';
import { scorecardRepository } from '@/lib/data-access/scorecard.repository';
import { InstitutionCategoryDetail } from '@/lib/types/performance';

export default function InstitutionDepartmentsPage() {
  const params = useParams();
  const institutionId = typeof params?.institutionId === 'string' ? params.institutionId : '';
  const institution = getInstitutionById(institutionId);

  if (!institution) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Institution Not Found</h2>
      </div>
    );
  }

  const campusHref =
    institution.campus === 'Trichy'
      ? '/institutions/campus/trichy'
      : institution.campus === 'Ramapuram'
      ? '/institutions/campus/ramapuram'
      : '/institutions';

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={`${institution.name} Departments`}
        subtitle="Select a department to view parameter performance"
        breadcrumbs={[
          { label: 'Institutions', href: '/institutions' },
          { label: institution.campusDisplayName, href: campusHref },
          { label: institution.code, isCurrent: true },
        ]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
        {institution.departments.map((dept) => {
          // Compute parameter tallies dynamically for the department
          const deptScorecard = scorecardRepository.getDepartmentScorecard(institution.id, dept.id);
          const greenCount = deptScorecard.filter((c: InstitutionCategoryDetail) => c.status === 'GREEN').length;
          const orangeCount = deptScorecard.filter((c: InstitutionCategoryDetail) => c.status === 'ORANGE').length;
          const redCount = deptScorecard.filter((c: InstitutionCategoryDetail) => c.status === 'RED').length;
          
          // Premium status style config — stronger ambient glow + tinted background + colored left accent
          const statusStyles = {
            GREEN: {
              cardClass: [
                'border-l-[3px] border-l-emerald-500',
                'bg-emerald-50/30 hover:bg-emerald-50/50',
                'dark:bg-emerald-950/15 dark:hover:bg-emerald-950/25',
                'border-emerald-200 dark:border-emerald-900',
                'hover:border-emerald-300 dark:hover:border-emerald-800',
                'hover:shadow-[0_2px_12px_rgba(16,185,129,0.18)] dark:hover:shadow-[0_2px_12px_rgba(16,185,129,0.12)]',
              ].join(' '),
              scoreColor: 'text-emerald-700 dark:text-emerald-400',
              glowClass: 'shadow-[0_1px_6px_rgba(16,185,129,0.10)] dark:shadow-[0_1px_6px_rgba(16,185,129,0.08)]',
            },
            ORANGE: {
              cardClass: [
                'border-l-[3px] border-l-amber-500',
                'bg-amber-50/30 hover:bg-amber-50/50',
                'dark:bg-amber-950/15 dark:hover:bg-amber-950/25',
                'border-amber-200 dark:border-amber-900',
                'hover:border-amber-300 dark:hover:border-amber-800',
                'hover:shadow-[0_2px_12px_rgba(245,158,11,0.18)] dark:hover:shadow-[0_2px_12px_rgba(245,158,11,0.12)]',
              ].join(' '),
              scoreColor: 'text-amber-700 dark:text-amber-400',
              glowClass: 'shadow-[0_1px_6px_rgba(245,158,11,0.10)] dark:shadow-[0_1px_6px_rgba(245,158,11,0.08)]',
            },
            RED: {
              cardClass: [
                'border-l-[3px] border-l-rose-600',
                'bg-rose-50/30 hover:bg-rose-50/50',
                'dark:bg-rose-950/15 dark:hover:bg-rose-950/25',
                'border-rose-200 dark:border-rose-900',
                'hover:border-rose-300 dark:hover:border-rose-800',
                'hover:shadow-[0_2px_12px_rgba(239,68,68,0.22)] dark:hover:shadow-[0_2px_12px_rgba(239,68,68,0.14)]',
              ].join(' '),
              scoreColor: 'text-rose-700 dark:text-rose-400',
              glowClass: 'shadow-[0_1px_6px_rgba(239,68,68,0.13)] dark:shadow-[0_1px_6px_rgba(239,68,68,0.10)]',
            },
          };

          const currentStyle = statusStyles[dept.status] || statusStyles.ORANGE;
          
          return (
            <Link
              key={dept.id}
              href={`/institutions/${institution.id}/departments/${dept.id}`}
              className={`group border rounded-lg transition-all duration-200 flex flex-col justify-between gap-3 p-3 w-full min-w-0 box-border relative overflow-hidden ${currentStyle.cardClass} ${currentStyle.glowClass}`}
            >
              <div className="space-y-3">
                {/* HEADER ROW */}
                <div className="flex items-start justify-between min-w-0">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                        {dept.code}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight break-words group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                      {dept.name}
                    </h3>
                  </div>
                </div>

                {/* SCORE ROW */}
                <div className="flex flex-col items-center justify-center py-2 mb-2">
                  <span className={`text-2xl font-extrabold font-mono tracking-tighter leading-none ${currentStyle.scoreColor}`}>
                    {dept.performanceScore.toFixed(1)}%
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                    Score
                  </span>
                </div>

                {/* THREE STATUS BOXES */}
                <div className="grid grid-cols-3 gap-1">
                  {/* ACHIEVED */}
                  <div className="flex items-center justify-center gap-1 rounded px-1.5 py-1 border text-center text-[11px] font-bold bg-emerald-100/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/70 text-emerald-800 dark:text-emerald-400">
                    <span className="font-sans">✓</span>
                    <span className="font-mono">{greenCount}</span>
                    <span className="text-[8px] font-semibold opacity-75">OK</span>
                  </div>

                  {/* NEEDS IMPROVEMENT */}
                  <div className="flex items-center justify-center gap-1 rounded px-1.5 py-1 border text-center text-[11px] font-bold bg-amber-100/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/70 text-amber-800 dark:text-amber-400">
                    <span className="font-sans">△</span>
                    <span className="font-mono">{orangeCount}</span>
                    <span className="text-[8px] font-semibold opacity-75">IMP</span>
                  </div>

                  {/* ACTION REQUIRED */}
                  <div className="flex items-center justify-center gap-1 rounded px-1.5 py-1 border text-center text-[11px] font-bold bg-rose-100/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/70 text-rose-800 dark:text-rose-400">
                    <span className="font-sans">×</span>
                    <span className="font-mono">{redCount}</span>
                    <span className="text-[8px] font-semibold opacity-75">ACT</span>
                  </div>
                </div>
              </div>
              
              {/* FOOTER ROW */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wide uppercase">
                    <Users className="w-3 h-3" />
                    <span>{dept.facultyCount}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wide uppercase">
                    <BookOpen className="w-3 h-3" />
                    <span>{dept.studentCount}</span>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 text-blue-600 dark:text-blue-500 text-[10px] font-bold uppercase tracking-wider group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                  <span>Scorecard</span>
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
