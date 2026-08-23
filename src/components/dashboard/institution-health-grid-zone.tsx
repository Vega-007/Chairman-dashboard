import React from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { InstitutionSummary } from '@/lib/types/institution';
import { StatusBadge } from '@/components/primitives/status-badge';
import { AchievementBar } from '@/components/primitives/achievement-bar';
import { cn } from '@/lib/utils';

interface InstitutionHealthGridZoneProps {
  institutions: InstitutionSummary[];
  className?: string;
}

export const InstitutionHealthGridZone: React.FC<InstitutionHealthGridZoneProps> = ({
  institutions,
  className,
}) => {
  const ramapuram = institutions.filter((i) => i.campus === 'Ramapuram');
  const trichy = institutions.filter((i) => i.campus === 'Trichy');

  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-5',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">
              Institutional Health Matrix (19 Institutions)
            </h2>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              Illustrative demo values
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Institutional Status Overview across Ramapuram and Trichy campuses
          </p>
        </div>

        <Link
          href="/institutions"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 transition-colors shrink-0"
        >
          <span>Open Full Browser</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ramapuram Column (7 Institutions) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              RAMAPURAM ({ramapuram.length})
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Score · Status · Categories</span>
          </div>

          <div className="space-y-1.5">
            {ramapuram.map((inst) => (
              <InstitutionHealthRow key={inst.id} institution={inst} />
            ))}
          </div>
        </div>

        {/* Trichy Column (12 Institutions) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              TRICHY ({trichy.length})
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Score · Status · Categories</span>
          </div>

          <div className="space-y-1.5">
            {trichy.map((inst) => (
              <InstitutionHealthRow key={inst.id} institution={inst} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface InstitutionHealthRowProps {
  institution: InstitutionSummary;
}

const InstitutionHealthRow: React.FC<InstitutionHealthRowProps> = ({ institution }) => {
  return (
    <Link
      href="/institutions"
      title={institution.name}
      aria-label={`${institution.name}: ${institution.overallScore}% score, ${institution.status}`}
      className="group flex items-center justify-between p-2.5 rounded-md border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/30 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 hover:border-slate-200 dark:hover:border-slate-700 transition-all text-xs"
    >
      {/* Left: Code, Name & Department count */}
      <div className="flex items-center gap-2.5 min-w-0 pr-2">
        <span
          className="w-14 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-center shrink-0"
          title={`Official Code: ${institution.code}`}
        >
          {institution.code}
        </span>
        <div className="truncate">
          <span
            className="font-semibold text-slate-900 dark:text-slate-100 block truncate group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors"
            title={institution.name}
          >
            {institution.shortName}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate block">
            {institution.name}
          </span>
        </div>
      </div>

      {/* Right: Score, Mini Achievement Bar & Category Indicators */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Green/Orange/Red Dots Count */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-slate-400">
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

        {/* Mini progress bar & Score */}
        <div className="w-20 text-right">
          <span className="font-bold text-slate-900 dark:text-slate-100 block text-xs">
            {institution.overallScore.toFixed(1)}%
          </span>
          <AchievementBar
            percentage={institution.overallScore}
            status={institution.status}
            showTicks={false}
            size="sm"
          />
        </div>

        {/* Status Badge */}
        <StatusBadge status={institution.status} size="sm" />

        <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors shrink-0" />
      </div>
    </Link>
  );
};
