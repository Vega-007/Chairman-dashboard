'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  Award,
  Search,
  X,
} from 'lucide-react';
import { TrendIndicator, InstitutionLogo, StatusBadge } from '@/components/primitives';
import { getInstitutionById } from '@/data/mock/institutions.mock';
import { scorecardRepository } from '@/lib/data-access/scorecard.repository';
import { InstitutionCategoryDetail } from '@/lib/types/performance';
import { PerformanceStatus } from '@/lib/types/common';
import { ParameterCard } from '@/components/institutions/parameter-card';
import { ParameterDetailModal } from '@/components/institutions/parameter-detail-modal';
import { cn } from '@/lib/utils';

export default function InstitutionDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const institutionId = typeof params?.institutionId === 'string' ? params.institutionId : '';
  const institution = getInstitutionById(institutionId);

  // Status filter from URL query param (?filter=achieved | improvement | action)
  const urlFilter = searchParams.get('filter');
  const defaultStatusFilter: PerformanceStatus | 'ALL' =
    urlFilter === 'achieved'
      ? 'GREEN'
      : urlFilter === 'improvement'
      ? 'ORANGE'
      : urlFilter === 'action'
      ? 'RED'
      : 'ALL';

  const [userStatusFilter, setUserStatusFilter] = useState<PerformanceStatus | 'ALL' | null>(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [modalCategory, setModalCategory] = useState<InstitutionCategoryDetail | null>(null);

  // Effective status filter: user selection takes precedence, otherwise fallback to URL filter
  const categoryStatusFilter = userStatusFilter !== null ? userStatusFilter : defaultStatusFilter;
  const setCategoryStatusFilter = (val: PerformanceStatus | 'ALL') => setUserStatusFilter(val);

  // Load all 14 categories for this institution
  const allCategories = useMemo(() => {
    if (!institution) return [];
    return scorecardRepository.getInstitutionCategories(institution.id);
  }, [institution]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    let list = [...allCategories];

    if (categorySearch.trim()) {
      const q = categorySearch.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    if (categoryStatusFilter !== 'ALL') {
      list = list.filter((c) => c.status === categoryStatusFilter);
    }

    return list;
  }, [allCategories, categorySearch, categoryStatusFilter]);

  if (!institution) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Institution Not Found</h2>
        <p className="text-xs text-slate-500">The requested institution ID &quot;{institutionId}&quot; does not exist in the dataset.</p>
        <Link
          href="/overview"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-blue-900 text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Chairman Overview</span>
        </Link>
      </div>
    );
  }

  const campusHref =
    institution.campus === 'Trichy'
      ? '/institutions/campus/trichy'
      : institution.campus === 'Ramapuram'
      ? '/institutions/campus/ramapuram'
      : '/overview';

  const clearUrlFilter = () => {
    setCategoryStatusFilter('ALL');
    router.push(`/institutions/${institution.id}`);
  };

  const handleSelectCategory = (cat: InstitutionCategoryDetail) => {
    // Navigate to the new parameter drill-down page
    router.push(`/institutions/${institution.id}/parameters/${cat.id}`);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* ── 1. COMPACT INSTITUTION HEADER ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          {/* Left: Logo + Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <InstitutionLogo
              institutionIdOrCode={institution.id}
              name={institution.shortName}
              size="lg"
              shape="rounded"
              className="shadow-xs border-2 border-slate-200 dark:border-slate-700 bg-white shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {institution.code}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {institution.institutionType}
                </span>
                <Link
                  href={campusHref}
                  className="text-[11px] text-slate-500 hover:text-blue-700 dark:hover:text-blue-400 font-medium flex items-center gap-0.5"
                >
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {institution.campusDisplayName}
                </Link>
              </div>
              <h1 className="text-base font-extrabold text-slate-950 dark:text-white tracking-tight leading-snug">
                {institution.name}
              </h1>
            </div>
          </div>

          {/* Right: Score + Status + Back */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-2xl font-extrabold text-slate-950 dark:text-white block font-mono leading-none">
                {institution.overallScore.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Overall Score</span>
            </div>
            <StatusBadge status={institution.status} size="md" />
            <Link
              href="/overview"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Overview</span>
            </Link>
          </div>
        </div>

        {/* Status Tally + High-level Stats */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Status Tally — greenCount/orangeCount/redCount are explicitly defined
              in the InstitutionSummary mock data, not derived from departments */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px]">
            <button
              onClick={() => setCategoryStatusFilter(categoryStatusFilter === 'GREEN' ? 'ALL' : 'GREEN')}
              className={cn(
                'flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer transition-colors',
                categoryStatusFilter === 'GREEN' ? 'bg-emerald-100 dark:bg-emerald-950/60 font-bold' : 'hover:bg-slate-100'
              )}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{institution.greenCount} Achieved</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <button
              onClick={() => setCategoryStatusFilter(categoryStatusFilter === 'ORANGE' ? 'ALL' : 'ORANGE')}
              className={cn(
                'flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer transition-colors',
                categoryStatusFilter === 'ORANGE' ? 'bg-amber-100 dark:bg-amber-950/60 font-bold' : 'hover:bg-slate-100'
              )}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span className="text-amber-700 dark:text-amber-400 font-semibold">{institution.orangeCount} Needs Impr.</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <button
              onClick={() => setCategoryStatusFilter(categoryStatusFilter === 'RED' ? 'ALL' : 'RED')}
              className={cn(
                'flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer transition-colors',
                categoryStatusFilter === 'RED' ? 'bg-rose-100 dark:bg-rose-950/60 font-bold' : 'hover:bg-slate-100'
              )}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span className="text-rose-700 dark:text-rose-400 font-semibold">{institution.redCount} Action Req.</span>
            </button>
          </div>

          {/* Secondary stats — only explicitly defined mock values */}
          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
            <span><strong className="text-slate-700 dark:text-slate-300">{institution.departmentCount}</strong> Depts</span>
            <TrendIndicator delta={institution.trendDelta} size="sm" label="vs Prev AY" />
          </div>
        </div>
      </div>

      {/* ── 2. KEY PERFORMANCE CATEGORIES (ALL 14 CATEGORIES) ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-3">
        {/* Section Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
            <h2 className="text-sm font-extrabold text-slate-950 dark:text-white tracking-tight">
              Key Performance Categories
            </h2>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              ({filteredCategories.length} of 14 Categories)
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative min-w-0 sm:w-48">
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search parameter..."
                className="w-full pl-7 pr-6 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600/30 text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              {categorySearch.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCategorySearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Status Filter Pills */}
            <div className="inline-flex items-center p-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setCategoryStatusFilter('ALL')}
                className={cn(
                  'px-2 py-0.5 rounded font-semibold transition-all',
                  categoryStatusFilter === 'ALL'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                )}
              >
                All (14)
              </button>
              <button
                type="button"
                onClick={() => setCategoryStatusFilter('GREEN')}
                className={cn(
                  'px-2 py-0.5 rounded font-semibold transition-all',
                  categoryStatusFilter === 'GREEN'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-500 hover:text-emerald-600'
                )}
              >
                ✓ Achieved
              </button>
              <button
                type="button"
                onClick={() => setCategoryStatusFilter('ORANGE')}
                className={cn(
                  'px-2 py-0.5 rounded font-semibold transition-all',
                  categoryStatusFilter === 'ORANGE'
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 shadow-xs'
                    : 'text-slate-500 hover:text-amber-600'
                )}
              >
                ⚠ Improve
              </button>
              <button
                type="button"
                onClick={() => setCategoryStatusFilter('RED')}
                className={cn(
                  'px-2 py-0.5 rounded font-semibold transition-all',
                  categoryStatusFilter === 'RED'
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 shadow-xs'
                    : 'text-slate-500 hover:text-rose-600'
                )}
              >
                ! Action
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Reminder / URL Query Indicator */}
        {(categoryStatusFilter !== 'ALL' || categorySearch.trim().length > 0) && (
          <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-md">
            <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
              Filtering parameters: <strong>{categoryStatusFilter !== 'ALL' ? categoryStatusFilter : 'Search'}</strong> ({filteredCategories.length} matched)
            </span>
            <button
              onClick={clearUrlFilter}
              className="text-[11px] text-blue-700 dark:text-blue-400 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* 14-Parameter Compact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {filteredCategories.map((cat) => (
            <ParameterCard
              key={cat.id}
              category={cat}
              onSelect={handleSelectCategory}
              onOpenDetails={(c) => setModalCategory(c)}
            />
          ))}
        </div>

        <p className="text-[10px] text-slate-400 font-mono text-center pt-1">
          💡 Click any parameter card to open its department drill-down · Click &quot;Details&quot; for key sub-metrics
        </p>

      </div>

      {/* ── 3. PARAMETER DETAIL MODAL ── */}
      <ParameterDetailModal
        category={modalCategory}
        institutionName={institution.shortName}
        isOpen={Boolean(modalCategory)}
        onClose={() => setModalCategory(null)}
        onSelectForDrillDown={(c) => {
          router.push(`/institutions/${institution.id}/parameters/${c.id}`);
        }}
      />
    </div>
  );
}
