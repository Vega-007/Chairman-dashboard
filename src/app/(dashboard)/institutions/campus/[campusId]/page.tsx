'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  ArrowLeft,
  Building,
  Users,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { institutionsRepository } from '@/lib/data-access/institutions.repository';
import { CampusName } from '@/lib/types/institution';
import { PerformanceStatus } from '@/lib/types/common';
import { ScoreRangeFilter, InstitutionSortOption } from '@/lib/types/identity';
import { PageHeader } from '@/components/primitives/page-header';
import { StatusBadge } from '@/components/primitives/status-badge';
import { TrendIndicator } from '@/components/primitives/trend-indicator';
import { FilterBar, FilterBarSortOption } from '@/components/primitives/filter-bar';
import { ActiveFilterChips, ActiveChip } from '@/components/primitives/active-filter-chips';
import { EmptyState } from '@/components/primitives/feedback-states';
import { cn } from '@/lib/utils';
import { InstitutionChairmanCard } from '@/components/dashboard';

export default function CampusDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Campus Overview...</div>}>
      <CampusDetailContent />
    </Suspense>
  );
}

function CampusDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const rawCampusId = typeof params?.campusId === 'string' ? params.campusId.toLowerCase() : '';
  const campusName: CampusName = rawCampusId === 'trichy' ? 'Trichy' : 'Ramapuram';
  const campusDisplayName = campusName === 'Ramapuram' ? 'Chennai – Ramapuram' : 'Tiruchirappalli';

  // Read initial filter from URL query param if present (e.g. ?status=GREEN)
  const initialStatusParam = searchParams?.get('status') as PerformanceStatus | null;
  const initialStatus: PerformanceStatus | 'ALL' =
    initialStatusParam && ['GREEN', 'ORANGE', 'RED'].includes(initialStatusParam)
      ? initialStatusParam
      : 'ALL';

  // Filter state
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<PerformanceStatus | 'ALL'>(initialStatus);
  const [scoreRange, setScoreRange] = useState<ScoreRangeFilter>('ALL');
  const [sortBy, setSortBy] = useState<InstitutionSortOption>('SCORE_DESC');

  // Data queries
  const allCampusInstitutions = useMemo(() => {
    return institutionsRepository.getByCampus(campusName);
  }, [campusName]);

  const campusStats = useMemo(() => {
    const total = allCampusInstitutions.length;
    const green = allCampusInstitutions.filter((i) => i.status === 'GREEN').length;
    const orange = allCampusInstitutions.filter((i) => i.status === 'ORANGE').length;
    const red = allCampusInstitutions.filter((i) => i.status === 'RED').length;
    const avgScore =
      total > 0
        ? allCampusInstitutions.reduce((acc, i) => acc + i.overallScore, 0) / total
        : 0;
    const totalFaculty = allCampusInstitutions.reduce(
      (acc, i) => acc + i.departments.reduce((dAcc, d) => dAcc + d.facultyCount, 0),
      0
    );
    const totalStudents = allCampusInstitutions.reduce(
      (acc, i) => acc + i.departments.reduce((dAcc, d) => dAcc + d.studentCount, 0),
      0
    );
    const trendDelta = campusName === 'Ramapuram' ? 4.2 : 2.8;

    return {
      totalInstitutions: total,
      overallScore: avgScore,
      status: avgScore >= 90 ? ('GREEN' as const) : avgScore >= 70 ? ('ORANGE' as const) : ('RED' as const),
      greenCount: green,
      orangeCount: orange,
      redCount: red,
      totalFaculty,
      totalStudents,
      trendDelta,
    };
  }, [allCampusInstitutions, campusName]);

  // Filtered institutions
  const filteredInstitutions = useMemo(() => {
    let result = [...allCampusInstitutions];

    // Search
    if (search.trim().length > 0) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.code.toLowerCase().includes(q) ||
          i.shortName.toLowerCase().includes(q) ||
          i.departments.some((d) => d.name.toLowerCase().includes(q))
      );
    }

    // Status
    if (statusFilter !== 'ALL') {
      result = result.filter((i) => i.status === statusFilter);
    }

    // Score Range
    if (scoreRange !== 'ALL') {
      if (scoreRange === '90_100') result = result.filter((i) => i.overallScore >= 90);
      else if (scoreRange === '70_89') result = result.filter((i) => i.overallScore >= 70 && i.overallScore < 90);
      else if (scoreRange === 'BELOW_70') result = result.filter((i) => i.overallScore < 70);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'SCORE_DESC') return b.overallScore - a.overallScore;
      if (sortBy === 'SCORE_ASC') return a.overallScore - b.overallScore;
      if (sortBy === 'ATTENTION_FIRST') {
        const order = { RED: 0, ORANGE: 1, GREEN: 2 };
        return order[a.status] - order[b.status];
      }
      if (sortBy === 'IMPROVED_DESC') return b.trendDelta - a.trendDelta;
      if (sortBy === 'DECLINED_DESC') return a.trendDelta - b.trendDelta;
      if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
      if (sortBy === 'CODE_ASC') return a.code.localeCompare(b.code);
      return 0;
    });

    return result;
  }, [allCampusInstitutions, search, statusFilter, scoreRange, sortBy]);

  const hasActiveFilters =
    search.trim().length > 0 ||
    statusFilter !== 'ALL' ||
    scoreRange !== 'ALL' ||
    sortBy !== 'SCORE_DESC';

  const resetFilters = () => {
    setSearch('');
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
  if (statusFilter !== 'ALL') {
    activeChips.push({
      id: 'status',
      label: 'Status',
      value: statusFilter === 'GREEN' ? 'Achieved (≥90%)' : statusFilter === 'ORANGE' ? 'Needs Impr. (70-89%)' : 'Action Req. (<70%)',
      onRemove: () => setStatusFilter('ALL'),
    });
  }
  if (scoreRange !== 'ALL') {
    activeChips.push({
      id: 'score',
      label: 'Score Range',
      value: scoreRange === '90_100' ? '≥ 90%' : scoreRange === '70_89' ? '70% – 89%' : '< 70%',
      onRemove: () => setScoreRange('ALL'),
    });
  }

  const sortOptions: FilterBarSortOption<InstitutionSortOption>[] = [
    { label: 'Highest Score', value: 'SCORE_DESC' },
    { label: 'Lowest Score', value: 'SCORE_ASC' },
    { label: 'Needs Attention', value: 'ATTENTION_FIRST' },
    { label: 'Most Improved', value: 'IMPROVED_DESC' },
    { label: 'Most Declined', value: 'DECLINED_DESC' },
    { label: 'Alphabetical (A–Z)', value: 'NAME_ASC' },
    { label: 'Institution Code', value: 'CODE_ASC' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Page Header */}
      <PageHeader
        title={`${campusDisplayName} Campus`}
        subtitle={`Campus Performance Intelligence & Constituent Institutions (${campusStats.totalInstitutions} Colleges)`}
        breadcrumbs={[
          { label: 'SRM Group', href: '/overview' },
          { label: 'Institutions', href: '/institutions' },
          { label: campusDisplayName, isCurrent: true },
        ]}
        status={campusStats.status}
        statusLabel={
          campusStats.status === 'GREEN'
            ? 'Campus Target Achieved'
            : campusStats.status === 'ORANGE'
            ? 'Campus Needs Improvement'
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
              href="/institutions"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Campuses</span>
            </Link>
          </div>
        }
      />

      {/* ZONE 1 — CAMPUS EXECUTIVE KPI SUMMARY */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
              {campusName === 'Ramapuram' ? <MapPin className="w-6 h-6" /> : <Building className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {campusName.toUpperCase()}
                </span>
                <span className="text-xs text-slate-500 font-medium">{campusStats.totalInstitutions} Constituent Institutions</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">
                Campus Performance Summary
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 self-start md:self-auto">
            <div className="text-right">
              <span className="text-3xl font-extrabold text-slate-950 dark:text-white block font-mono">
                {campusStats.overallScore.toFixed(1)}%
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Campus Achievement Index</span>
            </div>
            <StatusBadge status={campusStats.status} size="lg" />
          </div>
        </div>

        {/* 4 Stat KPI Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] uppercase font-bold">Colleges</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white block">
              {campusStats.totalInstitutions} Institutions
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] uppercase font-bold">Faculty Strength</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white block">
              {campusStats.totalFaculty.toLocaleString()} Members
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] uppercase font-bold">Student Body</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white block">
              {campusStats.totalStudents.toLocaleString()} Enrolled
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] uppercase font-bold">YoY Momentum</span>
            </div>
            <div className="mt-0.5">
              <TrendIndicator delta={campusStats.trendDelta} size="sm" label="vs Prev AY" />
            </div>
          </div>
        </div>

        {/* Status Distribution Tally */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 font-mono">
            <button
              type="button"
              onClick={() => setStatusFilter(statusFilter === 'GREEN' ? 'ALL' : 'GREEN')}
              className={cn(
                'px-2 py-0.5 rounded transition-all font-semibold',
                statusFilter === 'GREEN'
                  ? 'bg-emerald-700 text-white'
                  : 'text-emerald-700 dark:text-emerald-400 hover:underline'
              )}
            >
              {campusStats.greenCount} Achieved (≥90%)
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setStatusFilter(statusFilter === 'ORANGE' ? 'ALL' : 'ORANGE')}
              className={cn(
                'px-2 py-0.5 rounded transition-all font-semibold',
                statusFilter === 'ORANGE'
                  ? 'bg-amber-700 text-white'
                  : 'text-amber-700 dark:text-amber-400 hover:underline'
              )}
            >
              {campusStats.orangeCount} Needs Impr. (70-89%)
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setStatusFilter(statusFilter === 'RED' ? 'ALL' : 'RED')}
              className={cn(
                'px-2 py-0.5 rounded transition-all font-semibold',
                statusFilter === 'RED'
                  ? 'bg-rose-700 text-white'
                  : 'text-rose-700 dark:text-rose-400 hover:underline'
              )}
            >
              {campusStats.redCount} Action Req. (&lt;70%)
            </button>
          </div>

          <span className="text-[11px] text-slate-400">
            Click status pills above to filter institutions
          </span>
        </div>
      </div>

      {/* ZONE 2 — FILTER BAR FOR INSTITUTIONS */}
      <div className="space-y-2">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder={`Search ${campusName} institutions by name, code, or department...`}
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
          totalCount={allCampusInstitutions.length}
          filteredCount={filteredInstitutions.length}
        />

        <ActiveFilterChips chips={activeChips} onClearAll={resetFilters} />
      </div>

      {/* ZONE 3 — CONSTITUENT INSTITUTIONS GRID */}
      {filteredInstitutions.length === 0 ? (
        <EmptyState
          title={`No ${campusName} Institutions Match Active Filters`}
          description="Try changing your search keywords, status filter, or score range."
          onReset={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {filteredInstitutions.map((inst) => (
            <InstitutionChairmanCard key={inst.id} institution={inst} />
          ))}
        </div>
      )}
    </div>
  );
}
