import React from 'react';
import Link from 'next/link';
import { Trophy, AlertOctagon, ChevronRight } from 'lucide-react';
import { InstitutionSummary } from '@/lib/types/institution';
import { StatusBadge } from '@/components/primitives/status-badge';
import { AchievementBar } from '@/components/primitives/achievement-bar';
import { cn } from '@/lib/utils';

interface PerformersDualZoneProps {
  institutions: InstitutionSummary[];
  className?: string;
}

export const PerformersDualZone: React.FC<PerformersDualZoneProps> = ({
  institutions,
  className,
}) => {
  // Deterministic sorting
  const sorted = [...institutions].sort((a, b) => b.overallScore - a.overallScore);
  const top5 = sorted.slice(0, 5);
  const bottom5 = [...sorted].reverse().slice(0, 5);

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4', className)}>
      {/* Top 5 Performers */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-950 dark:text-white">
              Top Performing Institutions (Top 5)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Ranked by overall performance score</p>
          </div>
        </div>

        <div className="space-y-2">
          {top5.map((inst, idx) => (
            <Link
              key={inst.id}
              href="/institutions"
              className="group flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span className="w-5 text-center text-xs font-bold text-slate-400 font-mono">
                  #{idx + 1}
                </span>
                <div className="truncate">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 block truncate group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors">
                    {inst.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {inst.campus} Campus
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <div className="w-16 text-right">
                  <span className="font-bold text-slate-900 dark:text-white text-xs block">
                    {inst.overallScore.toFixed(1)}%
                  </span>
                  <AchievementBar
                    percentage={inst.overallScore}
                    status={inst.status}
                    showTicks={false}
                    size="sm"
                  />
                </div>
                <StatusBadge status={inst.status} size="sm" />
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom 5 Needs Intervention */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="p-1.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-950 dark:text-white">
              Institutions Requiring Intervention (Bottom 5)
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Ranked by performance gap and severity</p>
          </div>
        </div>

        <div className="space-y-2">
          {bottom5.map((inst, idx) => (
            <Link
              key={inst.id}
              href="/institutions"
              className="group flex items-center justify-between p-2 rounded-md hover:bg-rose-50/30 dark:hover:bg-rose-950/20 transition-colors text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span className="w-5 text-center text-xs font-bold text-rose-400 font-mono">
                  #{idx + 1}
                </span>
                <div className="truncate">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 block truncate group-hover:text-rose-900 dark:group-hover:text-rose-300 transition-colors">
                    {inst.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {inst.campus} Campus
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <div className="w-16 text-right">
                  <span className="font-bold text-slate-900 dark:text-white text-xs block">
                    {inst.overallScore.toFixed(1)}%
                  </span>
                  <AchievementBar
                    percentage={inst.overallScore}
                    status={inst.status}
                    showTicks={false}
                    size="sm"
                  />
                </div>
                <StatusBadge status={inst.status} size="sm" />
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
