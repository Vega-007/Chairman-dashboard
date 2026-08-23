'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Users, GraduationCap } from 'lucide-react';
import { InstitutionSummary } from '@/lib/types/institution';
import { InstitutionLogo } from '@/components/primitives/institution-logo';
import { cn } from '@/lib/utils';

interface InstitutionChairmanCardProps {
  institution: InstitutionSummary;
  className?: string;
}

export const InstitutionChairmanCard: React.FC<InstitutionChairmanCardProps> = ({
  institution,
  className,
}) => {
  const router = useRouter();

  const totalFaculty = institution.departments.reduce((acc, d) => acc + d.facultyCount, 0);
  const totalStudents = institution.departments.reduce((acc, d) => acc + d.studentCount, 0);

  // Subtle style config based on status
  const statusStyles = {
    GREEN: {
      cardClass: 'bg-emerald-50/20 hover:bg-emerald-50/40 dark:bg-emerald-950/10 dark:hover:bg-emerald-950/20 border-emerald-250 dark:border-emerald-900 hover:border-emerald-400',
      scoreColor: 'text-emerald-700 dark:text-emerald-450',
    },
    ORANGE: {
      cardClass: 'bg-amber-50/20 hover:bg-amber-50/40 dark:bg-amber-950/10 dark:hover:bg-amber-950/20 border-amber-250 dark:border-amber-900 hover:border-amber-400',
      scoreColor: 'text-amber-700 dark:text-amber-450',
    },
    RED: {
      cardClass: 'bg-rose-50/20 hover:bg-rose-50/40 dark:bg-rose-950/10 dark:hover:bg-rose-950/20 border-rose-250 dark:border-rose-900 hover:border-rose-400',
      scoreColor: 'text-rose-700 dark:text-rose-450',
    },
  };

  const currentStyle = statusStyles[institution.status] || statusStyles.ORANGE;

  const handleStatusBoxClick = (e: React.MouseEvent, filter: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/institutions/${institution.id}?filter=${filter}`);
  };

  return (
    <Link
      href={`/institutions/${institution.id}`}
      className={cn(
        'group border rounded-lg shadow-xs hover:shadow-md transition-all duration-200',
        'flex flex-col justify-between gap-3 p-3 w-full min-w-0 box-border relative overflow-hidden',
        currentStyle.cardClass,
        className
      )}
      aria-label={`View scorecard for ${institution.name}`}
    >
      <div className="space-y-3">
        {/* HEADER ROW: Logo + Code & Type + Full Name */}
        <div className="flex items-start gap-2.5 min-w-0">
          <InstitutionLogo
            institutionIdOrCode={institution.id}
            name={institution.shortName}
            size="md"
            shape="circle"
            className="shrink-0 shadow-2xs mt-0.5 bg-white border border-slate-200/90 dark:border-slate-800"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                {institution.code}
              </span>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate">
                • {institution.institutionType}
              </span>
            </div>
            <h3
              className="text-[13px] font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[2.4rem]"
              title={institution.name}
            >
              {institution.name}
            </h3>
          </div>
        </div>

        {/* CENTER ROW: Overall Score & Label */}
        <div className="text-center py-0.5">
          <span className={cn('text-2xl font-extrabold font-mono leading-none tracking-tight block', currentStyle.scoreColor)}>
            {institution.overallScore.toFixed(1)}%
          </span>
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 block mt-0.5">Score</span>
        </div>

        {/* THREE STATUS BOXES — ✓ OK, △ IMP, × ACT */}
        <div className="grid grid-cols-3 gap-1">
          {/* ACHIEVED */}
          <button
            onClick={(e) => handleStatusBoxClick(e, 'achieved')}
            className={cn(
              'flex items-center justify-center gap-1 rounded px-1.5 py-0.5 border text-center text-[11px] font-bold transition-all duration-150 hover:scale-[1.02] cursor-pointer',
              'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-450'
            )}
            title={`${institution.greenCount} Achieved — Click to filter`}
          >
            <span className="font-sans">✓</span>
            <span className="font-mono">{institution.greenCount}</span>
            <span className="text-[8px] font-semibold opacity-80">OK</span>
          </button>

          {/* NEEDS IMPROVEMENT */}
          <button
            onClick={(e) => handleStatusBoxClick(e, 'improvement')}
            className={cn(
              'flex items-center justify-center gap-1 rounded px-1.5 py-0.5 border text-center text-[11px] font-bold transition-all duration-150 hover:scale-[1.02] cursor-pointer',
              'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-450'
            )}
            title={`${institution.orangeCount} Needs Improvement — Click to filter`}
          >
            <span className="font-sans">△</span>
            <span className="font-mono">{institution.orangeCount}</span>
            <span className="text-[8px] font-semibold opacity-80">IMP</span>
          </button>

          {/* ACTION REQUIRED */}
          <button
            onClick={(e) => handleStatusBoxClick(e, 'action')}
            className={cn(
              'flex items-center justify-center gap-1 rounded px-1.5 py-0.5 border text-center text-[11px] font-bold transition-all duration-150 hover:scale-[1.02] cursor-pointer',
              'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-450'
            )}
            title={`${institution.redCount} Action Required — Click to filter`}
          >
            <span className="font-sans">×</span>
            <span className="font-mono">{institution.redCount}</span>
            <span className="text-[8px] font-semibold opacity-80">ACT</span>
          </button>
        </div>
      </div>

      {/* FOOTER: Stats + Scorecard link */}
      <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between gap-1 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
        <div className="flex items-center gap-1">
          <span className="flex items-center gap-0.5" title={`${totalFaculty} Faculty`}>
            <Users className="w-2.5 h-2.5" />
            <span>{totalFaculty}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-0.5" title={`${totalStudents.toLocaleString()} Students`}>
            <GraduationCap className="w-2.5 h-2.5" />
            <span>{totalStudents.toLocaleString()}</span>
          </span>
        </div>

        <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
          <span>Scorecard</span>
          <ArrowRight className="w-2.5 h-2.5" />
        </span>
      </div>
    </Link>
  );
};
