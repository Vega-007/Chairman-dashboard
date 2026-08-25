'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
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
      statusBadge: 'bg-emerald-600 dark:bg-emerald-500',
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
      statusBadge: 'bg-amber-500 dark:bg-amber-400',
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
      statusBadge: 'bg-rose-600 dark:bg-rose-500',
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
        'group border rounded-lg transition-all duration-200',
        'flex flex-col justify-between gap-3 p-3 w-full min-w-0 box-border relative overflow-hidden',
        currentStyle.cardClass,
        currentStyle.glowClass,
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

        {/* THREE STATUS BOXES — ✓ OK, △ IMP, × ACT
            greenCount / orangeCount / redCount are explicitly defined in the
            InstitutionSummary mock data — NOT derived from generateMockDepartments */}
        <div className="grid grid-cols-3 gap-1">
          {/* ACHIEVED */}
          <button
            onClick={(e) => handleStatusBoxClick(e, 'achieved')}
            className={cn(
              'flex items-center justify-center gap-1 rounded px-1.5 py-1 border text-center text-[11px] font-bold transition-all duration-150 hover:scale-[1.03] cursor-pointer',
              'bg-emerald-100/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/70 text-emerald-800 dark:text-emerald-400'
            )}
            title={`${institution.greenCount} Achieved — Click to filter`}
          >
            <span className="font-sans">✓</span>
            <span className="font-mono">{institution.greenCount}</span>
            <span className="text-[8px] font-semibold opacity-75">OK</span>
          </button>

          {/* NEEDS IMPROVEMENT */}
          <button
            onClick={(e) => handleStatusBoxClick(e, 'improvement')}
            className={cn(
              'flex items-center justify-center gap-1 rounded px-1.5 py-1 border text-center text-[11px] font-bold transition-all duration-150 hover:scale-[1.03] cursor-pointer',
              'bg-amber-100/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/70 text-amber-800 dark:text-amber-400'
            )}
            title={`${institution.orangeCount} Needs Improvement — Click to filter`}
          >
            <span className="font-sans">△</span>
            <span className="font-mono">{institution.orangeCount}</span>
            <span className="text-[8px] font-semibold opacity-75">IMP</span>
          </button>

          {/* ACTION REQUIRED */}
          <button
            onClick={(e) => handleStatusBoxClick(e, 'action')}
            className={cn(
              'flex items-center justify-center gap-1 rounded px-1.5 py-1 border text-center text-[11px] font-bold transition-all duration-150 hover:scale-[1.03] cursor-pointer',
              'bg-rose-100/70 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/70 text-rose-800 dark:text-rose-400'
            )}
            title={`${institution.redCount} Action Required — Click to filter`}
          >
            <span className="font-sans">×</span>
            <span className="font-mono">{institution.redCount}</span>
            <span className="text-[8px] font-semibold opacity-75">ACT</span>
          </button>
        </div>
      </div>

      {/* FOOTER: Scorecard link only — faculty/student counts removed (fabricated values) */}
      <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800/60 flex items-center justify-between gap-1 text-[10px]">
        <span className="text-slate-400 dark:text-slate-500 font-mono text-[9px]">
          {institution.campusDisplayName}
        </span>
        <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
          <span>Scorecard</span>
          <ArrowRight className="w-2.5 h-2.5" />
        </span>
      </div>
    </Link>
  );
};
