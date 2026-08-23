import React from 'react';
import Link from 'next/link';
import { Building, MapPin, ArrowRight } from 'lucide-react';
import { CampusStats } from '@/lib/types/institution';
import { StatusBadge } from '@/components/primitives/status-badge';
import { AchievementBar } from '@/components/primitives/achievement-bar';
import { TrendIndicator } from '@/components/primitives/trend-indicator';
import { cn } from '@/lib/utils';

interface CampusComparisonZoneProps {
  ramapuram: CampusStats;
  trichy: CampusStats;
  className?: string;
}

export const CampusComparisonZone: React.FC<CampusComparisonZoneProps> = ({
  ramapuram,
  trichy,
  className,
}) => {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4', className)}>
      {/* Ramapuram Card */}
      <div className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 shadow-xs hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-3">
            <Link
              href="/institutions/campus/ramapuram"
              className="flex items-center gap-2.5 group/header focus:outline-none"
              title="Open Ramapuram Campus Performance Intelligence"
            >
              <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 group-hover/header:bg-blue-900 group-hover/header:text-white transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover/header:text-blue-700 dark:group-hover/header:text-blue-400 transition-colors flex items-center gap-1">
                  <span>RAMAPURAM CAMPUS</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover/header:opacity-100 group-hover/header:translate-x-0.5 transition-all" />
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-blue-700 hover:underline">
                  {ramapuram.totalInstitutions} Constituent Institutions
                </span>
              </div>
            </Link>

            <Link href="/institutions/campus/ramapuram">
              <StatusBadge status={ramapuram.status} size="sm" />
            </Link>
          </div>

          <Link href="/institutions/campus/ramapuram" className="block mb-2 group/score">
            <div className="flex items-baseline justify-between mb-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white font-mono group-hover/score:text-blue-700 dark:group-hover/score:text-blue-400 transition-colors">
                  {ramapuram.overallScore.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-500">Overall Score</span>
              </div>
              <TrendIndicator delta={ramapuram.trendDelta} size="sm" />
            </div>

            <AchievementBar
              percentage={ramapuram.overallScore}
              status={ramapuram.status}
              size="md"
            />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
          <Link
            href="/institutions/campus/ramapuram?status=GREEN"
            className="px-2 py-1 rounded bg-emerald-50/70 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 transition-colors block border border-emerald-100 dark:border-emerald-900/40"
            title="View Achieved institutions in Ramapuram"
          >
            <span className="font-bold text-sm block font-mono">{ramapuram.greenCount}</span>
            <span className="text-[10px]">Achieved</span>
          </Link>

          <Link
            href="/institutions/campus/ramapuram?status=ORANGE"
            className="px-2 py-1 rounded bg-amber-50/70 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 transition-colors block border border-amber-100 dark:border-amber-900/40"
            title="View Needs Improvement institutions in Ramapuram"
          >
            <span className="font-bold text-sm block font-mono">{ramapuram.orangeCount}</span>
            <span className="text-[10px]">Needs Impr.</span>
          </Link>

          <Link
            href="/institutions/campus/ramapuram?status=RED"
            className="px-2 py-1 rounded bg-rose-50/70 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-800 dark:text-rose-300 transition-colors block border border-rose-100 dark:border-rose-900/40"
            title="View Action Required institutions in Ramapuram"
          >
            <span className="font-bold text-sm block font-mono">{ramapuram.redCount}</span>
            <span className="text-[10px]">Action Req.</span>
          </Link>
        </div>
      </div>

      {/* Trichy Card */}
      <div className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 shadow-xs hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-3">
            <Link
              href="/institutions/campus/trichy"
              className="flex items-center gap-2.5 group/header focus:outline-none"
              title="Open Trichy Campus Performance Intelligence"
            >
              <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 group-hover/header:bg-blue-900 group-hover/header:text-white transition-colors">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-950 dark:text-white group-hover/header:text-blue-700 dark:group-hover/header:text-blue-400 transition-colors flex items-center gap-1">
                  <span>TRICHY CAMPUS</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover/header:opacity-100 group-hover/header:translate-x-0.5 transition-all" />
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-blue-700 hover:underline">
                  {trichy.totalInstitutions} Constituent Institutions
                </span>
              </div>
            </Link>

            <Link href="/institutions/campus/trichy">
              <StatusBadge status={trichy.status} size="sm" />
            </Link>
          </div>

          <Link href="/institutions/campus/trichy" className="block mb-2 group/score">
            <div className="flex items-baseline justify-between mb-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white font-mono group-hover/score:text-blue-700 dark:group-hover/score:text-blue-400 transition-colors">
                  {trichy.overallScore.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-500">Overall Score</span>
              </div>
              <TrendIndicator delta={trichy.trendDelta} size="sm" />
            </div>

            <AchievementBar
              percentage={trichy.overallScore}
              status={trichy.status}
              size="md"
            />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
          <Link
            href="/institutions/campus/trichy?status=GREEN"
            className="px-2 py-1 rounded bg-emerald-50/70 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 transition-colors block border border-emerald-100 dark:border-emerald-900/40"
            title="View Achieved institutions in Trichy"
          >
            <span className="font-bold text-sm block font-mono">{trichy.greenCount}</span>
            <span className="text-[10px]">Achieved</span>
          </Link>

          <Link
            href="/institutions/campus/trichy?status=ORANGE"
            className="px-2 py-1 rounded bg-amber-50/70 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 transition-colors block border border-amber-100 dark:border-amber-900/40"
            title="View Needs Improvement institutions in Trichy"
          >
            <span className="font-bold text-sm block font-mono">{trichy.orangeCount}</span>
            <span className="text-[10px]">Needs Impr.</span>
          </Link>

          <Link
            href="/institutions/campus/trichy?status=RED"
            className="px-2 py-1 rounded bg-rose-50/70 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 text-rose-800 dark:text-rose-300 transition-colors block border border-rose-100 dark:border-rose-900/40"
            title="View Action Required institutions in Trichy"
          >
            <span className="font-bold text-sm block font-mono">{trichy.redCount}</span>
            <span className="text-[10px]">Action Req.</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
