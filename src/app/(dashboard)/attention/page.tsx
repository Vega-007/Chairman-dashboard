'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  Filter,
  Building,
  Layers,
  MapPin,
  Flag,
  X,
  Search,
} from 'lucide-react';
import { performanceRepository } from '@/lib/data-access/performance.repository';
import { institutionsRepository } from '@/lib/data-access/institutions.repository';
import { CampusName } from '@/lib/types/institution';
import { PerformanceStatus } from '@/lib/types/common';
import { PageHeader } from '@/components/primitives/page-header';
import { StatusBadge } from '@/components/primitives/status-badge';
import { TrendIndicator } from '@/components/primitives/trend-indicator';
import { InstitutionLogo } from '@/components/primitives/institution-logo';
import { DepartmentBadge } from '@/components/primitives/department-badge';
import { FilterBar } from '@/components/primitives/filter-bar';
import { ActiveFilterChips, ActiveChip } from '@/components/primitives/active-filter-chips';
import { EmptyState } from '@/components/primitives/feedback-states';
import { cn } from '@/lib/utils';
import { useFlagStore } from '@/lib/store/use-flag-store';
import { ActionPlanModal } from '@/components/institutions/action-plan-modal';
import { DepartmentFlag, PriorityLevel, FlagStatus } from '@/lib/types/flag';

export default function AttentionPage() {
  // Primary page tabs: queue (system deficits) vs intervention (chairman flags)
  const [primaryTab, setPrimaryTab] = useState<'queue' | 'flags'>('queue');

  // Filter state for system alerts queue
  const [search, setSearch] = useState<string>('');
  const [campusFilter, setCampusFilter] = useState<CampusName | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<PerformanceStatus | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [institutionFilter, setInstitutionFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'PRIORITY_FIRST' | 'GAP_DESC' | 'TREND_ASC' | 'SCORE_ASC'>('PRIORITY_FIRST');

  // Filter state for Chairman flags tab
  const [flagSearch, setFlagSearch] = useState<string>('');
  const [flagCampusFilter, setFlagCampusFilter] = useState<CampusName | 'ALL'>('ALL');
  const [flagPriorityFilter, setFlagPriorityFilter] = useState<PriorityLevel | 'ALL'>('ALL');
  const [flagStatusFilter, setFlagStatusFilter] = useState<FlagStatus | 'ALL'>('ALL');

  // Flag action modal state
  const [selectedFlag, setSelectedFlag] = useState<DepartmentFlag | null>(null);

  // Store data
  const { flags, updateActionPlan, resolveFlag } = useFlagStore();
  const summary = performanceRepository.getAttentionStats();
  const allCategories = performanceRepository.getCategories();
  const allInstitutions = institutionsRepository.getAll();

  // Load and filter system alerts queue items
  const filteredQueueItems = performanceRepository.getAttentionItems({
    search,
    campus: campusFilter,
    status: statusFilter,
    category: categoryFilter,
    institution: institutionFilter,
    sortBy,
  });

  const rawQueueAllItems = performanceRepository.getAttentionItems();

  const hasQueueFiltersActive =
    search.trim().length > 0 ||
    campusFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    categoryFilter !== 'ALL' ||
    institutionFilter !== 'ALL' ||
    sortBy !== 'PRIORITY_FIRST';

  const resetQueueFilters = () => {
    setSearch('');
    setCampusFilter('ALL');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setInstitutionFilter('ALL');
    setSortBy('PRIORITY_FIRST');
  };

  // Filter flagged items
  const filteredFlags = useMemo(() => {
    return flags.filter((f) => {
      // Search matches
      if (flagSearch.trim()) {
        const q = flagSearch.toLowerCase().trim();
        const matchesSearch =
          f.institutionName.toLowerCase().includes(q) ||
          f.departmentName.toLowerCase().includes(q) ||
          f.parameterName.toLowerCase().includes(q) ||
          f.parameterCode.toLowerCase().includes(q) ||
          f.departmentCode.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Campus filter
      if (flagCampusFilter !== 'ALL') {
        const inst = allInstitutions.find((i) => i.id === f.institutionId || i.code === f.institutionId);
        if (!inst || inst.campus !== flagCampusFilter) return false;
      }

      // Priority filter
      if (flagPriorityFilter !== 'ALL' && f.priority !== flagPriorityFilter) return false;

      // Status filter
      if (flagStatusFilter !== 'ALL' && f.status !== flagStatusFilter) return false;

      return true;
    });
  }, [flags, flagSearch, flagCampusFilter, flagPriorityFilter, flagStatusFilter, allInstitutions]);

  // Count flags for summary metrics
  const flagSummary = useMemo(() => {
    return {
      flagged: flags.filter((f) => f.status === 'FLAGGED').length,
      actionPlanSubmitted: flags.filter((f) => f.status === 'ACTION_PLAN_SUBMITTED').length,
      inProgress: flags.filter((f) => f.status === 'IN_PROGRESS').length,
      resolved: flags.filter((f) => f.status === 'RESOLVED').length,
      overdue: flags.filter((f) => f.status === 'OVERDUE').length,
    };
  }, [flags]);

  // Active filter chips for System Queue
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
      label: 'Priority',
      value: statusFilter === 'RED' ? 'Action Req.' : statusFilter === 'ORANGE' ? 'Needs Impr.' : 'Achieved',
      onRemove: () => setStatusFilter('ALL'),
    });
  }
  if (categoryFilter !== 'ALL') {
    const cat = allCategories.find((c) => c.id === categoryFilter || c.slug === categoryFilter);
    activeChips.push({
      id: 'category',
      label: 'Category',
      value: cat ? cat.name : categoryFilter,
      onRemove: () => setCategoryFilter('ALL'),
    });
  }
  if (institutionFilter !== 'ALL') {
    const inst = allInstitutions.find((i) => i.id === institutionFilter || i.code === institutionFilter);
    activeChips.push({
      id: 'institution',
      label: 'Institution',
      value: inst ? inst.code : institutionFilter,
      onRemove: () => setInstitutionFilter('ALL'),
    });
  }

  const sortOptions = [
    { label: 'Executive Priority (Severity)', value: 'PRIORITY_FIRST' as const },
    { label: 'Largest Deficit Gap First', value: 'GAP_DESC' as const },
    { label: 'Most Negative YoY Trend', value: 'TREND_ASC' as const },
    { label: 'Lowest Score First', value: 'SCORE_ASC' as const },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Page Header */}
      <PageHeader
        title="Chairman's Action Center"
        subtitle="Prioritized operational alerts, performance deficits, and executive intervention flags"
        breadcrumbs={[
          { label: 'SRM Group', href: '/overview' },
          { label: 'Action Center', isCurrent: true },
        ]}
        status={summary.redCount > 0 ? 'RED' : 'ORANGE'}
        statusLabel={`${summary.redCount} Alerts & ${flags.filter(f => f.status !== 'RESOLVED').length} Active Flags`}
        actions={
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-help"
              title="Operational tools shown are illustrative mock data for demonstration purposes."
            >
              DEMO WORKFLOW
            </span>
          </div>
        }
      />

      {/* Primary Dashboard Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-850">
        <button
          onClick={() => setPrimaryTab('queue')}
          className={cn(
            'px-5 py-3 text-sm font-extrabold border-b-2 -mb-px transition-all',
            primaryTab === 'queue'
              ? 'border-blue-600 text-blue-700 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          )}
        >
          Operational Deficits Queue ({filteredQueueItems.length})
        </button>
        <button
          onClick={() => setPrimaryTab('flags')}
          className={cn(
            'px-5 py-3 text-sm font-extrabold border-b-2 -mb-px transition-all flex items-center gap-1.5',
            primaryTab === 'flags'
              ? 'border-rose-500 text-rose-700 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          )}
        >
          <Flag className="w-3.5 h-3.5 shrink-0 text-rose-600 dark:text-rose-450" />
          <span>Chairman Intervention Flags ({flags.filter(f => f.status !== 'RESOLVED').length})</span>
        </button>
      </div>

      {primaryTab === 'queue' ? (
        <>
          {/* ZONE 1 — EXECUTIVE SUMMARY HIGHLIGHTS (5 KPI Blocks) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <h2 className="text-sm font-bold text-slate-950 dark:text-white tracking-tight">
                  Executive Deficits Summary
                </h2>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {summary.redCount + summary.orangeCount} Operational Deficits Alerting
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
              <div className="p-3.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 space-y-1">
                <div className="flex items-center gap-1.5 text-rose-800 dark:text-rose-350">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase font-bold font-sans">Action Req.</span>
                </div>
                <span className="text-2xl font-extrabold text-rose-900 dark:text-rose-200 block">
                  {summary.redCount}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-350">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase font-bold font-sans">Needs Impr.</span>
                </div>
                <span className="text-2xl font-extrabold text-amber-900 dark:text-amber-200 block">
                  {summary.orangeCount}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Building className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase font-bold font-sans">Institutions</span>
                </div>
                <span className="text-2xl font-extrabold text-slate-950 dark:text-white block">
                  {summary.institutionsAffectedCount}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Layers className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase font-bold font-sans">Departments</span>
                </div>
                <span className="text-2xl font-extrabold text-slate-950 dark:text-white block">
                  {summary.departmentsAffectedCount}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Filter className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase font-bold font-sans">Categories</span>
                </div>
                <span className="text-2xl font-extrabold text-slate-950 dark:text-white block">
                  {summary.criticalCategoriesCount}
                </span>
              </div>
            </div>
          </div>

          {/* ZONE 2 — WORKING FILTER BAR */}
          <div className="space-y-2">
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search deficits by name, category, or recommendation..."
              campus={campusFilter}
              onCampusChange={setCampusFilter}
              showCampusFilter={true}
              status={statusFilter}
              onStatusChange={setStatusFilter}
              showStatusFilter={true}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOptions={sortOptions}
              customFilter={
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Category Filter */}
                  <div className="flex items-center gap-1">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-medium text-slate-705 dark:text-slate-200 max-w-[160px] truncate"
                      aria-label="Category Filter"
                    >
                      <option value="ALL">All Categories</option>
                      {allCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.code} — {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Institution Filter */}
                  <div className="flex items-center gap-1">
                    <select
                      value={institutionFilter}
                      onChange={(e) => setInstitutionFilter(e.target.value)}
                      className="px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-medium text-slate-705 dark:text-slate-200 max-w-[170px] truncate"
                      aria-label="Institution Filter"
                    >
                      <option value="ALL">All Institutions</option>
                      {allInstitutions.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                          {inst.code} — {inst.shortName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              }
              hasActiveFilters={hasQueueFiltersActive}
              onReset={resetQueueFilters}
              totalCount={rawQueueAllItems.length}
              filteredCount={filteredQueueItems.length}
            />

            <ActiveFilterChips chips={activeChips} onClearAll={resetQueueFilters} />
          </div>

          {/* ZONE 3 — PRIORITIZED ACTION QUEUE */}
          <div className="space-y-4">
            {filteredQueueItems.length === 0 ? (
              <EmptyState
                title="No Attention Items Match Active Filters"
                description="Try changing your campus, status, category, or institution filter."
                onReset={resetQueueFilters}
              />
            ) : (
              <div className="space-y-4">
                {filteredQueueItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'bg-white dark:bg-slate-900 border rounded-lg p-5 shadow-xs space-y-4 transition-all',
                      item.status === 'RED'
                        ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                        : 'border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/10'
                    )}
                  >
                    {/* Header Row: Logo + Code + Name + Campus + Category Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <StatusBadge status={item.status} size="md" />

                        <InstitutionLogo
                          institutionIdOrCode={item.institutionId}
                          name={item.institutionShortName}
                          size="md"
                          shape="rounded"
                          className="bg-white border border-slate-200 dark:border-slate-700 shrink-0"
                        />

                        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {item.institutionShortName}
                        </span>

                        <span className="text-xs font-semibold text-slate-950 dark:text-white">
                          {item.institutionName}
                        </span>

                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.campus}
                        </span>

                        {item.departmentName && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
                            <DepartmentBadge name={item.departmentName} id={item.departmentId} size="xs" />
                            <span>{item.departmentName}</span>
                          </span>
                        )}
                      </div>

                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-900 text-white shrink-0 self-start sm:self-auto">
                        {item.categoryCode} · {item.categoryName}
                      </span>
                    </div>

                    {/* Metrics Breakdown Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block font-sans">Actual / Target</span>
                        <span className="text-sm font-extrabold text-slate-950 dark:text-white block mt-0.5">
                          {item.actual} / {item.target} {item.unit}
                        </span>
                      </div>

                      <div className="p-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block font-sans">Deficit Gap</span>
                        <span className="text-sm font-extrabold text-rose-700 dark:text-rose-450 block mt-0.5">
                          {item.gap > 0 ? `+${item.gap}` : item.gap} {item.unit}
                        </span>
                      </div>

                      <div className="p-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block font-sans">Achievement</span>
                        <span className="text-sm font-extrabold text-slate-950 dark:text-white block mt-0.5">
                          {item.achievementPercentage.toFixed(1)}%
                        </span>
                      </div>

                      <div className="p-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block font-sans">YoY Trend</span>
                        <div className="mt-0.5">
                          <TrendIndicator delta={item.trend} size="sm" />
                        </div>
                      </div>
                    </div>

                    {/* Recommended Action Box */}
                    <div className="p-3 rounded-md bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2.5">
                      <span className="font-bold text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-900 text-white shrink-0 mt-0.5">
                        Recommended Action
                      </span>
                      <p className="leading-relaxed font-medium">
                        {item.recommendedAction}
                      </p>
                    </div>

                    {/* Clickable Action Bar (3 Drill-Down Options) */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
                      <div className="flex items-center gap-4">
                        <Link
                          href={`/institutions/${item.institutionId}`}
                          className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                        >
                          <span>Inspect Institution Scorecard</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        {item.departmentId && (
                          <Link
                            href={`/institutions/${item.institutionId}/departments/${item.departmentId}`}
                            className="inline-flex items-center gap-1 text-indigo-700 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 transition-colors"
                          >
                            <span>Inspect Department</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>

                      <Link
                        href={`/performance/${item.categorySlug}`}
                        className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-350 hover:text-slate-950 dark:hover:text-white transition-colors"
                      >
                        <span>Inspect Category Intelligence</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* CHAIRMAN FLAG WORKFLOW TAB */
        <>
          {/* Summary counters for flags */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-center">
            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Flagged</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">
                {flagSummary.flagged}
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Plan Submitted</span>
              <span className="text-xl font-extrabold text-blue-700 dark:text-blue-400 mt-1 block">
                {flagSummary.actionPlanSubmitted}
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">In Progress</span>
              <span className="text-xl font-extrabold text-amber-700 dark:text-amber-400 mt-1 block">
                {flagSummary.inProgress}
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Resolved</span>
              <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-450 mt-1 block">
                {flagSummary.resolved}
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Overdue</span>
              <span className="text-xl font-extrabold text-rose-700 dark:text-rose-455 mt-1 block">
                {flagSummary.overdue}
              </span>
            </div>
          </div>

          {/* Flags Filter and Search controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs bg-slate-50 dark:bg-slate-850/30 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="relative w-full md:max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search flags by name, parameter..."
                value={flagSearch}
                onChange={(e) => setFlagSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md placeholder-slate-400 text-slate-800 dark:text-slate-100 outline-hidden focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
              />
              {flagSearch && (
                <button onClick={() => setFlagSearch('')} className="p-0.5 text-slate-400 absolute right-2.5 top-2">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
              {/* Campus Filter */}
              <select
                value={flagCampusFilter}
                onChange={(e) => setFlagCampusFilter(e.target.value as CampusName | 'ALL')}
                className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-medium text-slate-705 dark:text-slate-200"
                aria-label="Flag Campus filter"
              >
                <option value="ALL">All Campuses</option>
                <option value="Ramapuram">Ramapuram</option>
                <option value="Trichy">Trichy</option>
                <option value="School">School</option>
              </select>

              {/* Priority Filter */}
              <select
                value={flagPriorityFilter}
                onChange={(e) => setFlagPriorityFilter(e.target.value as PriorityLevel | 'ALL')}
                className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-medium text-slate-705 dark:text-slate-200"
                aria-label="Flag Priority filter"
              >
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>

              {/* Status Filter */}
              <select
                value={flagStatusFilter}
                onChange={(e) => setFlagStatusFilter(e.target.value as FlagStatus | 'ALL')}
                className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-medium text-slate-705 dark:text-slate-200"
                aria-label="Flag Status filter"
              >
                <option value="ALL">All Statuses</option>
                <option value="FLAGGED">Flagged</option>
                <option value="ACTION_PLAN_SUBMITTED">Plan Submitted</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="OVERDUE">Overdue</option>
              </select>

              {(flagSearch || flagCampusFilter !== 'ALL' || flagPriorityFilter !== 'ALL' || flagStatusFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setFlagSearch('');
                    setFlagCampusFilter('ALL');
                    setFlagPriorityFilter('ALL');
                    setFlagStatusFilter('ALL');
                  }}
                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-200 rounded-md font-bold"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Flags Cards Grid */}
          {filteredFlags.length === 0 ? (
            <EmptyState
              title="No Intervention Flags Found"
              description="No operational review flags matched your active search or filters."
              onReset={() => {
                setFlagSearch('');
                setFlagCampusFilter('ALL');
                setFlagPriorityFilter('ALL');
                setFlagStatusFilter('ALL');
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFlags.map((flag) => {
                const isHigh = flag.priority === 'HIGH';
                const isMed = flag.priority === 'MEDIUM';

                const statusColor =
                  flag.status === 'RESOLVED'
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-350 border-emerald-250 dark:border-emerald-900'
                    : flag.status === 'FLAGGED'
                    ? 'bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-455 border-rose-250 dark:border-rose-900'
                    : 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-450 border-amber-250 dark:border-amber-900';

                const priorityColor = isHigh
                  ? 'bg-rose-900 text-white'
                  : isMed
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-blue-500 text-white';

                // Monthly Follow-Up Calculations
                const isFollowUpRequired = flag.status !== 'RESOLVED' && flag.daysPending > 7;

                return (
                  <div
                    key={flag.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4.5 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top Row: Priority Badge + Header Context */}
                      <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={cn('px-1.5 py-0.5 rounded text-[8px] font-bold font-mono tracking-wider', priorityColor)}>
                              {flag.priority}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">⚑ Flag ID: {flag.id}</span>
                          </div>
                          <h3 className="font-extrabold text-sm text-slate-950 dark:text-white mt-1 leading-snug">
                            {flag.departmentName}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-medium truncate">{flag.institutionName}</p>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-350 border border-blue-100 dark:border-blue-900 shrink-0">
                          {flag.parameterCode} · {flag.parameterName}
                        </span>
                      </div>

                      {/* Performance Row */}
                      <div className="grid grid-cols-3 gap-2 py-2.5 border-b border-slate-100 dark:border-slate-800 font-mono text-[10px] text-center">
                        <div className="p-1 rounded bg-slate-50 dark:bg-slate-850">
                          <span className="text-slate-400 block text-[8px] uppercase">Actual</span>
                          <span className="text-xs font-bold text-slate-850 dark:text-slate-100">{flag.actualValue} {flag.unit}</span>
                        </div>
                        <div className="p-1 rounded bg-slate-50 dark:bg-slate-850">
                          <span className="text-slate-400 block text-[8px] uppercase">Target</span>
                          <span className="text-xs font-bold text-slate-850 dark:text-slate-100">{flag.targetValue} {flag.unit}</span>
                        </div>
                        <div className="p-1 rounded bg-slate-50 dark:bg-slate-850">
                          <span className="text-slate-400 block text-[8px] uppercase">HOD Rep</span>
                          <span className="text-[10px] font-bold text-slate-850 dark:text-slate-100 truncate block px-0.5">{flag.assignedTo}</span>
                        </div>
                      </div>

                      {/* Reason Box */}
                      <div className="text-[11px] text-slate-650 dark:text-slate-350 leading-relaxed py-2.5">
                        <span className="font-bold text-slate-400 uppercase text-[9px] font-mono block mb-0.5">Flag Reason</span>
                        <p>{flag.reason}</p>
                      </div>

                      {/* Monthly Follow-up Block */}
                      <div className="grid grid-cols-3 gap-2 p-2 bg-slate-50 dark:bg-slate-850/60 rounded border border-slate-150 dark:border-slate-800 text-[10px] font-mono">
                        <div>
                          <span className="text-slate-400 block text-[8px]">LAST REVIEW</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {new Date(flag.lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[8px]">NEXT REVIEW</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {new Date(new Date(flag.lastUpdated).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[8px]">DAYS PENDING</span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {flag.status === 'RESOLVED' ? '0 Days' : `${flag.daysPending} Days`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-850">
                      {/* Alerts / Status block */}
                      <div className="flex items-center justify-between gap-3 text-[10px]">
                        <span className={cn('px-2 py-0.5 rounded font-mono font-bold border uppercase shrink-0', statusColor)}>
                          {flag.status.replace(/_/g, ' ')}
                        </span>

                        {isFollowUpRequired && (
                          <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-extrabold animate-pulse font-sans">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Follow-up Required</span>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedFlag(flag)}
                        className="w-full inline-flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
                      >
                        <span>View HOD Action Plan & Timeline</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Action Plan timeline & submit modal */}
      <ActionPlanModal
        isOpen={Boolean(selectedFlag)}
        onClose={() => setSelectedFlag(null)}
        flag={selectedFlag}
        onSaveActionPlan={(flagId, plan, note) => {
          updateActionPlan(flagId, plan, note);
          // Sync active flag object in state so modal UI updates immediately
          if (selectedFlag && selectedFlag.id === flagId) {
            const updatedFlags = useFlagStore.getState().flags;
            const updated = updatedFlags.find((f) => f.id === flagId);
            if (updated) setSelectedFlag(updated);
          }
        }}
        onResolveFlag={(flagId, note) => {
          resolveFlag(flagId, note);
          if (selectedFlag && selectedFlag.id === flagId) {
            const updatedFlags = useFlagStore.getState().flags;
            const updated = updatedFlags.find((f) => f.id === flagId);
            if (updated) setSelectedFlag(updated);
          }
        }}
      />
    </div>
  );
}
