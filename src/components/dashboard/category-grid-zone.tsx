import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Award,
  Briefcase,
  TrendingUp,
  UserCheck,
  GraduationCap,
  BookOpen,
  Handshake,
  Shield,
  Lightbulb,
  Rocket,
  CheckCircle,
  Users,
  Building,
  ArrowUpRight,
} from 'lucide-react';
import { PerformanceCategorySummary } from '@/lib/types/performance';
import { MetricCard } from '@/components/primitives/metric-card';
import { cn } from '@/lib/utils';

interface CategoryGridZoneProps {
  categories: PerformanceCategorySummary[];
  className?: string;
}

// Icon mapping per category slug
function getCategoryIcon(slug: string) {
  switch (slug) {
    case 'publication':
      return <FileText className="w-4 h-4 text-blue-700 dark:text-blue-400" />;
    case 'patent':
      return <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    case 'funded-project':
      return <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
    case 'consultancy':
      return <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    case 'placement':
      return <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case 'admission':
      return <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    case 'nptel':
      return <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
    case 'mou':
      return <Handshake className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
    case 'coe':
      return <Shield className="w-4 h-4 text-slate-700 dark:text-slate-300" />;
    case 'scholars':
      return <Lightbulb className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
    case 'startup':
      return <Rocket className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
    case 'graduation':
      return <CheckCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />;
    case 'graduate-outcome':
      return <Building className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />;
    case 'faculty-performance':
      return <Users className="w-4 h-4 text-blue-800 dark:text-blue-400" />;
    default:
      return <FileText className="w-4 h-4 text-slate-500" />;
  }
}

export const CategoryGridZone: React.FC<CategoryGridZoneProps> = ({
  categories,
  className,
}) => {
  const router = useRouter();

  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">
              Key Performance Categories (14 Categories)
            </h2>
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              Illustrative demo values
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Group-wide targets vs actual delivery across core academic and operational verticals
          </p>
        </div>

        <Link
          href="/performance"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-800 transition-colors shrink-0"
        >
          <span>View Full Matrix</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 14 Balanced Cards Grid (1 to 4 columns depending on viewport) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <MetricCard
            key={cat.id}
            title={cat.name}
            categoryCode={cat.code}
            actual={cat.actual}
            target={cat.target}
            unit={cat.unit}
            achievementPercentage={cat.achievementPercentage}
            status={cat.status}
            trendDelta={cat.trend}
            icon={getCategoryIcon(cat.slug)}
            onClick={() => router.push(`/performance/${cat.slug}`)}
            className="p-3"
          />
        ))}
      </div>
    </div>
  );
};
