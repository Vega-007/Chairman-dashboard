'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X, MapPin, ArrowLeft, Award, ChevronRight } from 'lucide-react';

import { TrendIndicator, InstitutionLogo, StatusBadge } from '@/components/primitives';
import { getInstitutionById } from '@/data/mock/institutions.mock';
import { scorecardRepository } from '@/lib/data-access/scorecard.repository';
import { InstitutionCategoryDetail } from '@/lib/types/performance';
import { PerformanceStatus } from '@/lib/types/common';
import { ParameterCard } from '@/components/institutions/parameter-card';
import { ParameterDetailModal } from '@/components/institutions/parameter-detail-modal';
import { cn } from '@/lib/utils';

export default function DepartmentScorecardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const institutionId = typeof params?.institutionId === 'string' ? params.institutionId : '';
  const departmentId = typeof params?.departmentId === 'string' ? params.departmentId : '';
  
  const institution = getInstitutionById(institutionId);
  const department = institution?.departments.find(
    (d) => d.id.toLowerCase() === departmentId.toLowerCase() || d.code.toLowerCase() === departmentId.toLowerCase()
  );

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

  // Load all 14 categories for this department
  const allCategories = useMemo(() => {
    if (!institution || !department) return [];
    return scorecardRepository.getDepartmentScorecard(institution.id, department.id);
  }, [institution, department]);

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

  if (!institution || !department) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Department Not Found</h2>
        <p className="text-xs text-slate-500">The requested department does not exist in the dataset.</p>
        <Link
          href={`/institutions/${institutionId}/departments`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-blue-900 text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Departments</span>
        </Link>
      </div>
    );
  }

  const campusHref =
    institution.campus === 'Trichy'
      ? '/institutions/campus/trichy'
      : institution.campus === 'Ramapuram'
      ? '/institutions/campus/ramapuram'
      : '/institutions/campus/west-mambalam';

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
      {/* ── 0. UNIVERSAL BREADCRUMB ── */}
      <nav className="flex items-center gap-2 text-[11px] font-medium text-slate-500 overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/overview" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">SRM Group</Link>
        <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700 shrink-0" />
        <Link href="/institutions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Institutions</Link>
        <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700 shrink-0" />
        <Link href={campusHref} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{institution.campusDisplayName}</Link>
        <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700 shrink-0" />
        <Link href={`/institutions/${institution.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{institution.code}</Link>
        <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700 shrink-0" />
        <span className="text-slate-900 dark:text-white font-semibold">{department.code}</span>
      </nav>

      {/* ── 1. DEPARTMENT SCORECARD HEADER ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg shadow-xs">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <InstitutionLogo institutionIdOrCode={institution.id} name={institution.name} />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {department.code}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {institution.name}
                  </span>
                </div>
                <h1 className="text-xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-snug">
                  {department.name} Performance Scorecard
                </h1>
                <p className="text-xs text-slate-500 mt-1">Department-level execution across 14 governance parameters</p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <span className="text-2xl font-extrabold text-slate-950 dark:text-white block font-mono leading-none">
                  {department.performanceScore.toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Overall Score</span>
              </div>
              <StatusBadge status={department.status} size="lg" />
              <Link
                href={`/institutions/${institution.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ml-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to College</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Status Tally + High-level Stats */}
        <div className="p-4 flex flex-wrap items-center justify-between gap-2 text-xs bg-slate-50/50 dark:bg-slate-900/50 rounded-b-lg">
          <div className="flex items-center gap-3 font-mono">
            <button
              type="button"
              onClick={() => setCategoryStatusFilter(categoryStatusFilter === 'GREEN' ? 'ALL' : 'GREEN')}
              className={cn(
                'px-2 py-0.5 rounded transition-all font-semibold',
                categoryStatusFilter === 'GREEN'
                  ? 'bg-emerald-700 text-white'
                  : 'text-emerald-700 dark:text-emerald-400 hover:underline'
              )}
            >
              Achieved
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setCategoryStatusFilter(categoryStatusFilter === 'ORANGE' ? 'ALL' : 'ORANGE')}
              className={cn(
                'px-2 py-0.5 rounded transition-all font-semibold',
                categoryStatusFilter === 'ORANGE'
                  ? 'bg-amber-700 text-white'
                  : 'text-amber-700 dark:text-amber-400 hover:underline'
              )}
            >
              Needs Impr.
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setCategoryStatusFilter(categoryStatusFilter === 'RED' ? 'ALL' : 'RED')}
              className={cn(
                'px-2 py-0.5 rounded transition-all font-semibold',
                categoryStatusFilter === 'RED'
                  ? 'bg-rose-700 text-white'
                  : 'text-rose-700 dark:text-rose-400 hover:underline'
              )}
            >
              Action Req.
            </button>
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
        </div>

        {/* Active Filter Reminder */}
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
              isSelected={modalCategory?.id === cat.id}
              onSelect={(cat) => router.push(`/institutions/${institution.id}/departments/${department.id}/parameters/${cat.slug}`)}
              onOpenDetails={setModalCategory}
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
