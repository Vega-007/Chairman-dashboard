'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Layers,
  Search,
  X,
  ArrowRight,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Minus,
  Flag,
} from 'lucide-react';
import { InstitutionCategoryDetail, DepartmentCategoryMetric } from '@/lib/types/performance';
import { PerformanceStatus } from '@/lib/types/common';
import { DepartmentBadge } from '@/components/primitives/department-badge';
import { EmptyState } from '@/components/primitives/feedback-states';
import { getStatusColorClass } from '@/lib/utils/status';
import { cn } from '@/lib/utils';
import { useFlagStore } from '@/lib/store/use-flag-store';
import { MOCK_INSTITUTIONS } from '@/data/mock/institutions.mock';
import { FlagModal } from './flag-modal';
import { PriorityLevel } from '@/lib/types/flag';


interface DepartmentPerformanceGridProps {
  institutionId: string;
  departments: DepartmentCategoryMetric[];
  selectedCategory?: InstitutionCategoryDetail;
  isUnavailable?: boolean;
  onClearCategorySelection?: () => void;
  className?: string;
}

export const DepartmentPerformanceGrid: React.FC<DepartmentPerformanceGridProps> = ({
  institutionId,
  departments,
  selectedCategory,
  isUnavailable = false,
  onClearCategorySelection,
  className,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PerformanceStatus | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'SCORE_DESC' | 'SCORE_ASC' | 'NAME_ASC' | 'FACULTY_DESC'>('SCORE_DESC');

  // Flag workflow state
  const [flaggingDept, setFlaggingDept] = useState<DepartmentCategoryMetric | null>(null);
  const { flags, addFlag } = useFlagStore();

  const institution = MOCK_INSTITUTIONS.find(
    (i) => i.id.toLowerCase() === institutionId.toLowerCase() || i.code.toLowerCase() === institutionId.toLowerCase()
  );
  const institutionName = institution ? institution.name : institutionId;

  // Filter and sort departments
  const filteredDepartments = useMemo(() => {
    let list = [...departments];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.departmentName.toLowerCase().includes(q) ||
          d.departmentCode.toLowerCase().includes(q) ||
          d.departmentId.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'ALL') {
      list = list.filter((d) => d.status === statusFilter);
    }

    switch (sortBy) {
      case 'SCORE_DESC':
        list.sort((a, b) => {
          const valA = typeof a.achievementPercentage === 'number' ? a.achievementPercentage : 0;
          const valB = typeof b.achievementPercentage === 'number' ? b.achievementPercentage : 0;
          return valB - valA;
        });
        break;
      case 'SCORE_ASC':
        list.sort((a, b) => {
          const valA = typeof a.achievementPercentage === 'number' ? a.achievementPercentage : 0;
          const valB = typeof b.achievementPercentage === 'number' ? b.achievementPercentage : 0;
          return valA - valB;
        });
        break;
      case 'NAME_ASC':
        list.sort((a, b) => a.departmentName.localeCompare(b.departmentName));
        break;
      case 'FACULTY_DESC':
        list.sort((a, b) => b.facultyCount - a.facultyCount);
        break;
    }

    return list;
  }, [departments, search, statusFilter, sortBy]);

  const greenCount = departments.filter((d) => d.status === 'GREEN').length;
  const orangeCount = departments.filter((d) => d.status === 'ORANGE').length;
  const redCount = departments.filter((d) => d.status === 'RED').length;

  const handleFlagClick = (e: React.MouseEvent | React.TouchEvent, dept: DepartmentCategoryMetric) => {
    e.preventDefault();
    e.stopPropagation();
    setFlaggingDept(dept);
  };

  const handleFlagSubmit = (data: { reason: string; priority: PriorityLevel }) => {
    if (!flaggingDept) return;
    addFlag({
      institutionId: institutionId,
      institutionName: institutionName,
      departmentId: flaggingDept.departmentId,
      departmentName: flaggingDept.departmentName,
      departmentCode: flaggingDept.departmentCode,
      parameterId: selectedCategory ? selectedCategory.id : 'overall',
      parameterName: selectedCategory ? selectedCategory.name : 'Overall Performance',
      parameterCode: selectedCategory ? selectedCategory.code : 'OVERALL',
      actualValue: flaggingDept.actual,
      targetValue: flaggingDept.target,
      unit: flaggingDept.unit,
      priority: data.priority,
      reason: data.reason,
      status: 'FLAGGED',
      assignedTo: 'Designated HOD (Mock)',
      createdBy: "Chairman's Office (Mock)",
    });
    setFlaggingDept(null);
  };

  if (isUnavailable && selectedCategory) {
    return (
      <div className={cn('bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-6 shadow-xs space-y-4', className)}>
        <div className="text-center space-y-2">
          <Layers className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Department-level data unavailable</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Parameter-specific metrics for <strong>{selectedCategory.name} ({selectedCategory.code})</strong> are not currently available at the department level in the dataset.
            </p>
          </div>
        </div>

        {/* Operational intervention registry for constituent departments */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden max-w-xl mx-auto">
          <div className="bg-slate-50 dark:bg-slate-850 p-2.5 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Intervention Registry — Constituent Departments
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[220px] overflow-y-auto">
            {departments.map((dept) => {
              const isFlagged = flags.some(
                (f) =>
                  f.departmentId === dept.departmentId &&
                  f.parameterId === selectedCategory.id &&
                  f.status !== 'RESOLVED'
              );
              return (
                <div key={dept.departmentId} className="p-2.5 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <div className="min-w-0 pr-4">
                    <span className="font-semibold text-slate-850 dark:text-slate-200 block truncate">{dept.departmentName}</span>
                    <span className="text-[9px] text-slate-400 font-mono">{dept.departmentCode}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isFlagged ? (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[9px] font-bold bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-450 border border-rose-250 dark:border-rose-900">
                        ⚑ FLAGGED
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => handleFlagClick(e, dept)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-900 hover:bg-rose-800 text-[10px] font-bold text-white transition-colors"
                      >
                        <Flag className="w-2.5 h-2.5" />
                        <span>Flag ⚑</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          {onClearCategorySelection && (
            <button
              type="button"
              onClick={onClearCategorySelection}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Overall View</span>
            </button>
          )}
        </div>

        {/* Flag intervention modal */}
        <FlagModal
          isOpen={Boolean(flaggingDept)}
          onClose={() => setFlaggingDept(null)}
          onSubmit={handleFlagSubmit}
          institutionName={institutionName}
          departmentName={flaggingDept ? flaggingDept.departmentName : ''}
          parameterName={selectedCategory ? selectedCategory.name : 'Overall Performance'}
          parameterCode={selectedCategory ? selectedCategory.code : 'OVERALL'}
          currentStatus={flaggingDept ? flaggingDept.status : 'GREEN'}
          targetValue={selectedCategory ? selectedCategory.target : 100}
          actualValue={flaggingDept ? flaggingDept.actual : 0}
          unit={selectedCategory ? selectedCategory.unit : '%'}
        />
      </div>
    );
  }

  return (
    <div className={cn('bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 shadow-xs space-y-3.5', className)}>
      {/* Contextual Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Layers className="w-4 h-4 text-blue-700 dark:text-blue-400 shrink-0" />
            <h2 className="text-sm font-extrabold text-slate-950 dark:text-white tracking-tight">
              {selectedCategory ? (
                <span>
                  Department Performance —{' '}
                  <span className="text-blue-700 dark:text-blue-400">{selectedCategory.name}</span>
                </span>
              ) : (
                <span>Constituent Department Performance</span>
              )}
            </h2>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              ({filteredDepartments.length} of {departments.length} Units)
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {selectedCategory ? (
              <span>
                Viewing departmental breakdown for <strong>{selectedCategory.name} ({selectedCategory.code})</strong>. Target: {selectedCategory.target} {selectedCategory.unit}.
              </span>
            ) : (
              <span>Institutional breakdown showing overall performance index across all units. Target is 100%.</span>
            )}
          </p>
        </div>

        {/* Small count badge strip */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold shrink-0">
          <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/60">
            {greenCount} Achieved
          </span>
          <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-100 dark:border-amber-900/60">
            {orangeCount} Improve
          </span>
          <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-100 dark:border-rose-900/60">
            {redCount} Action
          </span>
        </div>
      </div>

      {/* Filter and search bar controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md placeholder-slate-400 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-hidden transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="p-0.5 text-slate-400 hover:text-slate-600 absolute right-2 top-2"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PerformanceStatus | 'ALL')}
            className="px-2 py-1 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-md font-medium text-slate-700 dark:text-slate-200"
            aria-label="Status filter"
          >
            <option value="ALL">All Statuses</option>
            <option value="GREEN">Achieved (Green)</option>
            <option value="ORANGE">Needs Improvement (Orange)</option>
            <option value="RED">Action Required (Red)</option>
          </select>

          {/* Sort selection */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'SCORE_DESC' | 'SCORE_ASC' | 'NAME_ASC' | 'FACULTY_DESC')}
            className="px-2 py-1 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-md font-medium text-slate-700 dark:text-slate-200"
            aria-label="Sort order"
          >
            <option value="SCORE_DESC">Highest Score</option>
            <option value="SCORE_ASC">Lowest Score</option>
            <option value="NAME_ASC">Department Name</option>
            <option value="FACULTY_DESC">Largest Faculty Size</option>
          </select>
        </div>
      </div>

      {/* Department Cards Grid */}
      {filteredDepartments.length === 0 ? (
        <EmptyState
          title="No Departments Match Criteria"
          description={`No department matched your current filters. Try resetting search or status filters.`}
          onReset={() => {
            setSearch('');
            setStatusFilter('ALL');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
          {filteredDepartments.map((dept) => {
            const colors = getStatusColorClass(dept.status);

            const isTrendNumber = typeof dept.trend === 'number';
            const trendIcon = !isTrendNumber
              ? null
              : (dept.trend as number) > 0
              ? <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
              : (dept.trend as number) < 0
              ? <TrendingDown className="w-2.5 h-2.5 text-rose-500" />
              : <Minus className="w-2.5 h-2.5 text-slate-400" />;

            const widthPercent = typeof dept.achievementPercentage === 'number'
              ? Math.min(dept.achievementPercentage, 100)
              : 0;

            const isVacancyNumber = typeof dept.openVacancies === 'number';

            // Check if this department-parameter combination is currently flagged
            const isFlagged = flags.some(
              (f) =>
                f.departmentId === dept.departmentId &&
                f.parameterId === (selectedCategory ? selectedCategory.id : 'overall') &&
                f.status !== 'RESOLVED'
            );

            return (
              <Link
                key={dept.departmentId}
                href={`/institutions/${institutionId}/departments/${dept.departmentId}`}
                className={cn(
                  'group p-3 rounded-lg border bg-white dark:bg-slate-900/60 flex flex-col justify-between transition-all duration-150 relative overflow-hidden',
                  'hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xs',
                  dept.status === 'RED'
                    ? 'border-l-4 border-l-rose-500 border-slate-200/90 dark:border-slate-800'
                    : dept.status === 'ORANGE'
                    ? 'border-l-4 border-l-amber-500 border-slate-200/90 dark:border-slate-800'
                    : 'border-l-4 border-l-emerald-500 border-slate-200/90 dark:border-slate-800'
                )}
                title={`View ${dept.departmentName} full department scorecard`}
              >
                {/* Top Row: Code Badge + Name + Status percentage */}
                <div>
                  <div className="flex items-start justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <DepartmentBadge name={dept.departmentName} id={dept.departmentId} size="sm" />
                      <div className="min-w-0">
                        <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 block">
                          {dept.departmentCode}
                        </span>
                        <h3 className="font-bold text-xs text-slate-950 dark:text-white truncate group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors">
                          {dept.departmentName}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isFlagged ? (
                        <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] font-bold bg-rose-55 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                          ⚑ FLAGGED
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleFlagClick(e, dept)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                          title="Flag department parameter for operational review"
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <span className={cn('text-xs font-extrabold font-mono', colors.text)}>
                        {typeof dept.achievementPercentage === 'number' ? `${dept.achievementPercentage}%` : dept.achievementPercentage}
                      </span>
                    </div>
                  </div>

                  {/* Metric Row */}
                  <div className="flex items-baseline justify-between text-[10px] ml-1 mt-1 font-mono">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {typeof dept.actual === 'number' ? dept.actual.toLocaleString() : dept.actual}
                      <span className="font-normal text-slate-400 ml-0.5">{dept.unit}</span>
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">
                      Target: {typeof dept.target === 'number' ? dept.target.toLocaleString() : dept.target}
                    </span>
                  </div>

                  {/* Compact Progress bar */}
                  <div className="mt-1.5 ml-1">
                    <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-300', colors.bar)}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer: Faculty / Students / Vacancies + Arrow */}
                <div className="flex items-center justify-between text-[9px] text-slate-400 mt-2.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span>{dept.facultyCount} Fac</span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span>{dept.studentCount} Stu</span>
                    {isVacancyNumber && (dept.openVacancies as number) > 0 && (
                      <>
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                          {dept.openVacancies} Vac
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {dept.trend !== 'Not available' && (
                      <span className="flex items-center gap-0.5">
                        {trendIcon}
                        <span>{isTrendNumber && (dept.trend as number) > 0 ? '+' : ''}{dept.trend}%</span>
                      </span>
                    )}
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-700 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Flag Modal */}
      <FlagModal
        isOpen={Boolean(flaggingDept)}
        onClose={() => setFlaggingDept(null)}
        onSubmit={handleFlagSubmit}
        institutionName={institutionName}
        departmentName={flaggingDept ? flaggingDept.departmentName : ''}
        parameterName={selectedCategory ? selectedCategory.name : 'Overall Performance'}
        parameterCode={selectedCategory ? selectedCategory.code : 'OVERALL'}
        currentStatus={flaggingDept ? flaggingDept.status : 'GREEN'}
        targetValue={selectedCategory ? selectedCategory.target : 100}
        actualValue={flaggingDept ? flaggingDept.actual : 0}
        unit={selectedCategory ? selectedCategory.unit : '%'}
      />
    </div>
  );
};
