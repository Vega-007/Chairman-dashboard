'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Building,
  MapPin,
} from 'lucide-react';
import { performanceRepository } from '@/lib/data-access/performance.repository';
import { CampusName } from '@/lib/types/institution';
import { PerformanceStatus } from '@/lib/types/common';
import { ScoreRangeFilter } from '@/lib/types/identity';
import { PageHeader } from '@/components/primitives/page-header';
import { StatusBadge } from '@/components/primitives/status-badge';
import { AchievementBar } from '@/components/primitives/achievement-bar';
import { TrendIndicator } from '@/components/primitives/trend-indicator';
import { InstitutionLogo } from '@/components/primitives/institution-logo';
import { FilterBar } from '@/components/primitives/filter-bar';
import { ActiveFilterChips, ActiveChip } from '@/components/primitives/active-filter-chips';
import { EmptyState } from '@/components/primitives/feedback-states';
import { cn } from '@/lib/utils';

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryIdParam = typeof params?.categoryId === 'string' ? params.categoryId : '';

  const category = performanceRepository.getCategory(categoryIdParam);

  // Filters & Sorting state
  const [search, setSearch] = useState('');
  const [campusFilter, setCampusFilter] = useState<CampusName | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<PerformanceStatus | 'ALL'>('ALL');
  const [scoreRange, setScoreRange] = useState<ScoreRangeFilter>('ALL');
  const [sortBy, setSortBy] = useState<'SCORE_DESC' | 'SCORE_ASC' | 'GAP_DESC' | 'TREND_DESC' | 'CODE'>('SCORE_DESC');

  const rawBreakdown = useMemo(() => {
    return performanceRepository.getInstitutionBreakdown(categoryIdParam);
  }, [categoryIdParam]);

  const campusComparison = useMemo(() => {
    return performanceRepository.getCampusComparison(categoryIdParam);
  }, [categoryIdParam]);

  const filteredInstitutions = useMemo(() => {
    return performanceRepository.getInstitutionBreakdown(categoryIdParam, {
      search,
      campus: campusFilter,
      status: statusFilter,
      scoreRange,
      sortBy,
    });
  }, [categoryIdParam, search, campusFilter, statusFilter, scoreRange, sortBy]);

  const hasActiveFilters =
    search.trim().length > 0 ||
    campusFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    scoreRange !== 'ALL' ||
    sortBy !== 'SCORE_DESC';

  const resetFilters = () => {
    setSearch('');
    setCampusFilter('ALL');
    setStatusFilter('ALL');
    setScoreRange('ALL');
    setSortBy('SCORE_DESC');
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
  if (campusFilter !== 'ALL') {
    activeChips.push({
      id: 'campus',
      label: 'Campus',
      value: campusFilter,
      onRemove: () => setCampusFilter('ALL'),
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

  if (!category) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Category Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested performance category ID &quot;{categoryIdParam}&quot; does not exist in the catalog.
        </p>
        <Link
          href="/performance"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-900 text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Performance Directory</span>
        </Link>
      </div>
    );
  }

  const ramapuramList = filteredInstitutions.filter((i) => i.campus === 'Ramapuram');
  const trichyList = filteredInstitutions.filter((i) => i.campus === 'Trichy');
  const schoolList = filteredInstitutions.filter((i) => i.campus === 'School');

  const groupGap = Math.round((category.actual - category.target) * 10) / 10;
  const greenInstCount = rawBreakdown.filter((b) => b.status === 'GREEN').length;
  const orangeInstCount = rawBreakdown.filter((b) => b.status === 'ORANGE').length;
  const redInstCount = rawBreakdown.filter((b) => b.status === 'RED').length;

  const sortOptions = [
    { label: 'Highest Achievement First', value: 'SCORE_DESC' as const },
    { label: 'Lowest Achievement First', value: 'SCORE_ASC' as const },
    { label: 'Largest Deficit Gap', value: 'GAP_DESC' as const },
    { label: 'Most Improved (YoY)', value: 'TREND_DESC' as const },
    { label: 'Institution Code (A-Z)', value: 'CODE' as const },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Page Header */}
      <PageHeader
        title={category.name}
        subtitle={`Category Code: ${category.code} · ${category.description}`}
        breadcrumbs={[
          { label: 'SRM Group', href: '/overview' },
          { label: 'Performance', href: '/performance' },
          { label: category.name, isCurrent: true },
        ]}
        status={category.status}
        statusLabel={
          category.status === 'GREEN'
            ? 'Target Achieved'
            : category.status === 'ORANGE'
            ? 'Needs Improvement'
            : 'Action Required'
        }
        actions={
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-help"
              title="Performance values shown are illustrative mock data for demonstration purposes and are not official institutional records."
            >
              DEMO DATA
            </span>
            <Link
              href="/performance"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All 14 Categories</span>
            </Link>
          </div>
        }
      />

      {/* ZONE 1 — GROUP PERFORMANCE OVERVIEW */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {category.code}
              </span>
              <span className="text-xs text-slate-500 font-medium">{category.name}</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">
              Group Overall Performance
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right font-mono">
              <span className="text-3xl font-extrabold text-slate-950 dark:text-white block">
                {category.achievementPercentage.toFixed(1)}%
              </span>
              <span className="text-[11px] text-slate-400">Group Achievement Index</span>
            </div>
            <StatusBadge status={category.status} size="lg" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
            <span>Overall Target vs Actual Delivery</span>
            <span className="font-mono font-bold text-slate-950 dark:text-white">
              {category.actual.toLocaleString()} / {category.target.toLocaleString()} {category.unit} (Gap: {groupGap > 0 ? `+${groupGap}` : groupGap})
            </span>
          </div>
          <AchievementBar percentage={category.achievementPercentage} status={category.status} size="md" />
        </div>

        {/* Stat Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 font-mono">
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Actual Delivered</span>
            <span className="text-base font-extrabold text-slate-950 dark:text-white block">
              {category.actual.toLocaleString()} {category.unit}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Group Target</span>
            <span className="text-base font-extrabold text-slate-950 dark:text-white block">
              {category.target.toLocaleString()} {category.unit}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Performance Gap</span>
            <span className={cn('text-base font-extrabold block', groupGap < 0 ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400')}>
              {groupGap > 0 ? `+${groupGap}` : groupGap} {category.unit}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">YoY Momentum</span>
            <TrendIndicator delta={category.trend} size="md" />
          </div>
        </div>

        {/* Institution Distribution Tally */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-mono">
          <span>19-Institution Distribution for {category.name}:</span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{greenInstCount} Achieved</span>
            <span>·</span>
            <span className="text-amber-700 dark:text-amber-400 font-semibold">{orangeInstCount} Needs Impr.</span>
            <span>·</span>
            <span className="text-rose-700 dark:text-rose-400 font-semibold">{redInstCount} Action Req.</span>
          </div>
        </div>
      </div>

      {/* ZONE 2 — CAMPUS COMPARISON (Ramapuram vs Trichy) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              Campus Comparison: Chennai – Ramapuram vs Tiruchirappalli
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase">
            Head-to-head Delivery
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ramapuram Campus Card */}
          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-sm text-slate-950 dark:text-white">
                  Chennai – Ramapuram
                </h4>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                  7 Institutions
                </span>
              </div>
              <StatusBadge status={campusComparison.ramapuram.status} size="sm" />
            </div>

            <div className="flex items-baseline justify-between font-mono">
              <span className="text-2xl font-extrabold text-slate-950 dark:text-white">
                {campusComparison.ramapuram.achievementPercentage.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-500">
                {campusComparison.ramapuram.actual.toLocaleString()} / {campusComparison.ramapuram.target.toLocaleString()} {category.unit}
              </span>
            </div>

            <AchievementBar
              percentage={campusComparison.ramapuram.achievementPercentage}
              status={campusComparison.ramapuram.status}
              size="sm"
            />

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-mono">
              <span>Gap: {campusComparison.ramapuram.gap > 0 ? `+${campusComparison.ramapuram.gap}` : campusComparison.ramapuram.gap}</span>
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{campusComparison.ramapuram.greenCount}</span>
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                  <span className="text-amber-700 dark:text-amber-400 font-semibold">{campusComparison.ramapuram.orangeCount}</span>
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                  <span className="text-rose-700 dark:text-rose-400 font-semibold">{campusComparison.ramapuram.redCount}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Trichy Campus Card */}
          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-sm text-slate-950 dark:text-white">
                  Tiruchirappalli
                </h4>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                  12 Institutions
                </span>
              </div>
              <StatusBadge status={campusComparison.trichy.status} size="sm" />
            </div>

            <div className="flex items-baseline justify-between font-mono">
              <span className="text-2xl font-extrabold text-slate-950 dark:text-white">
                {campusComparison.trichy.achievementPercentage.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-500">
                {campusComparison.trichy.actual.toLocaleString()} / {campusComparison.trichy.target.toLocaleString()} {category.unit}
              </span>
            </div>

            <AchievementBar
              percentage={campusComparison.trichy.achievementPercentage}
              status={campusComparison.trichy.status}
              size="sm"
            />

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-mono">
              <span>Gap: {campusComparison.trichy.gap > 0 ? `+${campusComparison.trichy.gap}` : campusComparison.trichy.gap}</span>
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{campusComparison.trichy.greenCount}</span>
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                  <span className="text-amber-700 dark:text-amber-400 font-semibold">{campusComparison.trichy.orangeCount}</span>
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                  <span className="text-rose-700 dark:text-rose-400 font-semibold">{campusComparison.trichy.redCount}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ZONE 3 — CONSTITUENT INSTITUTIONS MATRIX WITH FILTER BAR */}
      <div className="space-y-4">
        {/* Working Filter Bar */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search institution by name, code, or type..."
          campus={campusFilter}
          onCampusChange={setCampusFilter}
          showCampusFilter={true}
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
          totalCount={rawBreakdown.length}
          filteredCount={filteredInstitutions.length}
        />

        <ActiveFilterChips chips={activeChips} onClearAll={resetFilters} />

        {filteredInstitutions.length === 0 ? (
          <EmptyState
            title="No Institutions Match Category Filters"
            description="Try changing your campus, status, score range, or search criteria."
            onReset={resetFilters}
          />
        ) : (
          <div className="space-y-5">
            {/* Section: Ramapuram Institutions */}
            {ramapuramList.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  <span>Chennai – Ramapuram ({ramapuramList.length} Institutions)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {ramapuramList.map((inst) => (
                    <Link
                      key={inst.institutionId}
                      href={`/institutions/${inst.institutionId}`}
                      className="group bg-white hover:bg-blue-50/40 dark:bg-slate-900 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800 rounded-lg p-3.5 transition-all space-y-2.5 block shadow-xs hover:shadow-md hover:border-blue-400"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <InstitutionLogo
                            institutionIdOrCode={inst.institutionId}
                            name={inst.institutionShortName}
                            size="md"
                            shape="rounded"
                            className="bg-white border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div className="truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                                {inst.code}
                              </span>
                              <span className="font-bold text-xs text-slate-950 dark:text-white truncate group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors">
                                {inst.institutionName}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {inst.institutionType}
                            </span>
                          </div>
                        </div>
                        <StatusBadge status={inst.status} size="sm" />
                      </div>

                      <div className="flex items-baseline justify-between text-xs font-mono">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          {inst.actual.toLocaleString()} / {inst.target.toLocaleString()} {category.unit}
                        </span>
                        <span className="font-extrabold text-slate-950 dark:text-white">
                          {inst.achievementPercentage.toFixed(1)}%
                        </span>
                      </div>

                      <AchievementBar percentage={inst.achievementPercentage} status={inst.status} size="sm" />

                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                        <span>Gap: {inst.gap > 0 ? `+${inst.gap}` : inst.gap}</span>
                        <span className="inline-flex items-center gap-0.5 text-blue-700 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                          Scorecard <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Section: Trichy Institutions */}
            {trichyList.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  <span>Tiruchirappalli ({trichyList.length} Institutions)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {trichyList.map((inst) => (
                    <Link
                      key={inst.institutionId}
                      href={`/institutions/${inst.institutionId}`}
                      className="group bg-white hover:bg-blue-50/40 dark:bg-slate-900 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800 rounded-lg p-3.5 transition-all space-y-2.5 block shadow-xs hover:shadow-md hover:border-blue-400"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <InstitutionLogo
                            institutionIdOrCode={inst.institutionId}
                            name={inst.institutionShortName}
                            size="md"
                            shape="rounded"
                            className="bg-white border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div className="truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                                {inst.code}
                              </span>
                              <span className="font-bold text-xs text-slate-950 dark:text-white truncate group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors">
                                {inst.institutionName}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {inst.institutionType}
                            </span>
                          </div>
                        </div>
                        <StatusBadge status={inst.status} size="sm" />
                      </div>

                      <div className="flex items-baseline justify-between text-xs font-mono">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          {inst.actual.toLocaleString()} / {inst.target.toLocaleString()} {category.unit}
                        </span>
                        <span className="font-extrabold text-slate-950 dark:text-white">
                          {inst.achievementPercentage.toFixed(1)}%
                        </span>
                      </div>

                      <AchievementBar percentage={inst.achievementPercentage} status={inst.status} size="sm" />

                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                        <span>Gap: {inst.gap > 0 ? `+${inst.gap}` : inst.gap}</span>
                        <span className="inline-flex items-center gap-0.5 text-blue-700 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                          Scorecard <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {/* Section: School (West Mambalam) */}
            {schoolList.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  <span>West Mambalam, Chennai ({schoolList.length} Institution)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {schoolList.map((inst) => (
                    <Link
                      key={inst.institutionId}
                      href={`/institutions/${inst.institutionId}`}
                      className="group bg-white hover:bg-blue-50/40 dark:bg-slate-900 dark:hover:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800 rounded-lg p-3.5 transition-all space-y-2.5 block shadow-xs hover:shadow-md hover:border-blue-400"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <InstitutionLogo
                            institutionIdOrCode={inst.institutionId}
                            name={inst.institutionShortName}
                            size="md"
                            shape="rounded"
                            className="bg-white border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div className="truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                                {inst.code}
                              </span>
                              <span className="font-bold text-xs text-slate-950 dark:text-white truncate group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors">
                                {inst.institutionName}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {inst.institutionType}
                            </span>
                          </div>
                        </div>
                        <StatusBadge status={inst.status} size="sm" />
                      </div>

                      <div className="flex items-baseline justify-between text-xs font-mono">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          {inst.actual.toLocaleString()} / {inst.target.toLocaleString()} {category.unit}
                        </span>
                        <span className="font-extrabold text-slate-950 dark:text-white">
                          {inst.achievementPercentage.toFixed(1)}%
                        </span>
                      </div>

                      <AchievementBar percentage={inst.achievementPercentage} status={inst.status} size="sm" />

                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                        <span>Gap: {inst.gap > 0 ? `+${inst.gap}` : inst.gap}</span>
                        <span className="inline-flex items-center gap-0.5 text-blue-700 dark:text-blue-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                          Scorecard <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
