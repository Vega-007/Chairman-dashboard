'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { BarChart3, ArrowRight } from 'lucide-react';
import { performanceRepository } from '@/lib/data-access/performance.repository';
import { institutionsRepository } from '@/lib/data-access/institutions.repository';
import { PerformanceStatus } from '@/lib/types/common';
import { ScoreRangeFilter, CategorySortOption } from '@/lib/types/identity';
import { PageHeader } from '@/components/primitives/page-header';
import { StatusBadge } from '@/components/primitives/status-badge';
import { AchievementBar } from '@/components/primitives/achievement-bar';
import { TrendIndicator } from '@/components/primitives/trend-indicator';
import { FilterBar } from '@/components/primitives/filter-bar';
import { ActiveFilterChips, ActiveChip } from '@/components/primitives/active-filter-chips';
import { EmptyState } from '@/components/primitives/feedback-states';
import { computePerformanceStatus } from '@/lib/utils/status';

export default function PerformancePage() {
  const group = institutionsRepository.getGroupHealthSummary();
  const groupStatus = computePerformanceStatus(group.overallScore, 100).status;

  // Filter & Sort State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PerformanceStatus | 'ALL'>('ALL');
  const [scoreRange, setScoreRange] = useState<ScoreRangeFilter>('ALL');
  const [sortBy, setSortBy] = useState<CategorySortOption>('ORDER');

  const categories = useMemo(() => {
    return performanceRepository.getCategories({
      search,
      status: statusFilter,
      scoreRange,
      sortBy,
    });
  }, [search, statusFilter, scoreRange, sortBy]);

  const allCategories = useMemo(() => performanceRepository.getCategories(), []);
  const greenCategories = allCategories.filter((c) => c.status === 'GREEN').length;
  const orangeCategories = allCategories.filter((c) => c.status === 'ORANGE').length;
  const redCategories = allCategories.filter((c) => c.status === 'RED').length;

  const hasActiveFilters = search.trim().length > 0 || statusFilter !== 'ALL' || scoreRange !== 'ALL' || sortBy !== 'ORDER';

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setScoreRange('ALL');
    setSortBy('ORDER');
  };

  // Active filter chips
  const activeChips: ActiveChip[] = [];
  if (search.trim().length > 0) {
    activeChips.push({
      id: 'search',
      label: 'Search',
      value: search,
      onRemove: () => setSearch(''),
    });
  }
  if (statusFilter !== 'ALL') {
    activeChips.push({
      id: 'status',
      label: 'Status',
      value: statusFilter === 'GREEN' ? 'Achieved' : statusFilter === 'ORANGE' ? 'Needs Impr.' : 'Action Req.',
      onRemove: () => setStatusFilter('ALL'),
    });
  }
  if (scoreRange !== 'ALL') {
    activeChips.push({
      id: 'score',
      label: 'Score',
      value: scoreRange === '90_100' ? '90–100%' : scoreRange === '70_89' ? '70–89%' : '<70%',
      onRemove: () => setScoreRange('ALL'),
    });
  }

  const sortOptions = [
    { label: 'Standard Catalog Order', value: 'ORDER' as const },
    { label: 'Highest Achievement First', value: 'ACHIEVEMENT_DESC' as const },
    { label: 'Lowest Achievement First', value: 'ACHIEVEMENT_ASC' as const },
    { label: 'Largest Target Gap', value: 'GAP_DESC' as const },
    { label: 'Most Improved (YoY)', value: 'TREND_DESC' as const },
    { label: 'Most Declined (YoY)', value: 'TREND_ASC' as const },
    { label: 'Category Code (A-Z)', value: 'CODE' as const },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Page Header */}
      <PageHeader
        title="Performance Intelligence Directory"
        subtitle="14 Key Academic and Operational Performance Categories across SRM Group"
        breadcrumbs={[
          { label: 'SRM Group', href: '/overview' },
          { label: 'Performance', isCurrent: true },
        ]}
        status={groupStatus}
        statusLabel="Ecosystem Active"
        actions={
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-help"
              title="Performance values shown are illustrative mock data for demonstration purposes and are not official institutional records."
            >
              DEMO DATA
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              14 Categories Tracked
            </span>
          </div>
        }
      />

      {/* Top Executive Summary Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">
                Category Delivery Standards Matrix
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Group-wide performance distribution across core academic, research, and operational indicators
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="p-3.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">
              Achieved Categories
            </span>
            <span className="text-xl font-extrabold text-emerald-900 dark:text-emerald-200 block">
              {greenCategories} / 14
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 block">
              Needs Improvement
            </span>
            <span className="text-xl font-extrabold text-amber-900 dark:text-amber-200 block">
              {orangeCategories} / 14
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 space-y-1">
            <span className="text-[10px] uppercase font-bold text-rose-800 dark:text-rose-300 block">
              Action Required
            </span>
            <span className="text-xl font-extrabold text-rose-900 dark:text-rose-200 block">
              {redCategories} / 14
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Group Composite Score
            </span>
            <span className="text-xl font-extrabold text-slate-950 dark:text-white block">
              {group.overallScore.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Reusable Filter Bar for Categories */}
      <div className="space-y-2">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search categories by name, code, or description..."
          showCampusFilter={false}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          showStatusFilter={true}
          scoreRange={scoreRange}
          onScoreRangeChange={setScoreRange}
          showScoreFilter={true}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOptions={sortOptions}
          hasActiveFilters={hasActiveFilters}
          onReset={resetFilters}
          totalCount={allCategories.length}
          filteredCount={categories.length}
        />

        <ActiveFilterChips chips={activeChips} onClearAll={resetFilters} />
      </div>

      {/* 14 Categories Cards Grid */}
      {categories.length === 0 ? (
        <EmptyState
          title="No Categories Match Your Filters"
          description="Try broadening your status, score range, or search criteria."
          onReset={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/performance/${cat.slug}`}
              className="group bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 shadow-xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between space-y-3 relative"
            >
              <div className="space-y-2.5">
                {/* Header: Code & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shrink-0">
                    {cat.code}
                  </span>
                  <StatusBadge status={cat.status} size="sm" />
                </div>

                {/* Name & Description */}
                <div>
                  <h3 className="text-sm font-bold text-slate-950 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 min-h-[2rem] leading-tight">
                    {cat.description}
                  </p>
                </div>

                {/* Target vs Actual */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      Actual / Target
                    </span>
                    <span className="font-mono font-bold text-slate-950 dark:text-white">
                      {cat.actual.toLocaleString()} / {cat.target.toLocaleString()} {cat.unit}
                    </span>
                  </div>

                  <AchievementBar percentage={cat.achievementPercentage} status={cat.status} size="sm" />

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {cat.achievementPercentage.toFixed(1)}% Achieved
                    </span>
                    <TrendIndicator delta={cat.trend} size="sm" />
                  </div>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-blue-700 dark:text-blue-400 group-hover:text-blue-900 dark:group-hover:text-blue-300 transition-colors">
                <span>Inspect Category Intelligence</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
