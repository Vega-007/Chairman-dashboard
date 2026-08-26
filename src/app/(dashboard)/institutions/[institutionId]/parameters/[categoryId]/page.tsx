'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Flag } from 'lucide-react';
import { getInstitutionById } from '@/data/mock/institutions.mock';
import { scorecardRepository } from '@/lib/data-access/scorecard.repository';
import { StatusBadge } from '@/components/primitives';
import { PerformanceStatus } from '@/lib/types/common';
import { FacultyPerformanceList } from '@/components/institutions/faculty-performance-list';
import { useFlagStore } from '@/lib/store/use-flag-store';
import { FlagModal } from '@/components/institutions/flag-modal';
import { PriorityLevel } from '@/lib/types/flag';
import { DepartmentCategoryMetric } from '@/lib/types/performance';
import { cn } from '@/lib/utils';

export default function ParameterDetailPage() {
  const params = useParams();
  const router = useRouter();

  const institutionId = typeof params?.institutionId === 'string' ? params.institutionId : '';
  const categoryId = typeof params?.categoryId === 'string' ? params.categoryId : '';

  const institution = getInstitutionById(institutionId);
  const categories = useMemo(() => institution ? scorecardRepository.getInstitutionCategories(institution.id) : [], [institution]);
  const category = useMemo(() => categories.find((c) => c.id === categoryId), [categories, categoryId]);

  const [statusFilter, setStatusFilter] = useState<PerformanceStatus | 'ALL'>('ALL');
  const [zeroCountFilter, setZeroCountFilter] = useState<'ALL' | 'ZERO'>('ALL');
  
  // Track which department is expanded to see faculty
  const [expandedDeptId, setExpandedDeptId] = useState<string | null>(null);

  // Flag system state
  const { flags, addFlag } = useFlagStore();
  const [flaggingDept, setFlaggingDept] = useState<DepartmentCategoryMetric | null>(null);

  const handleFlagSubmit = (data: { reason: string; priority: PriorityLevel }) => {
    if (!flaggingDept || !institution || !category) return;
    addFlag({
      institutionId: institution.id,
      institutionName: institution.name,
      departmentId: flaggingDept.departmentId,
      departmentName: flaggingDept.departmentName,
      departmentCode: flaggingDept.departmentCode,
      parameterId: category.id,
      parameterName: category.name,
      parameterCode: category.code,
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

  const { departments } = useMemo(() => {
    if (!institution || !category) return { departments: [] };
    // Fetch the list of departments. Note: parameter-level metrics are Not Available at dept level
    return scorecardRepository.getDepartmentCategoryPerformance(institution.id, category.id);
  }, [institution, category]);

  // facultyBreakdown removed as it's unused at the top level (loaded per row instead)

  if (!institution || !category) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Page Not Found</h2>
        <p className="text-xs text-slate-500">The requested parameter detail page could not be found.</p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-blue-900 text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  const campusHref =
    institution.campus === 'Trichy'
      ? '/institutions/campus/trichy'
      : institution.campus === 'Ramapuram'
      ? '/institutions/campus/ramapuram'
      : '/overview';

  const expandedDept = departments.find(d => d.departmentId === expandedDeptId);

  return (
    <div className="space-y-4 pb-12">
      {/* ── 1. UNIVERSAL BREADCRUMB ── */}
      <nav className="flex items-center gap-2 text-[11px] font-medium text-slate-500 overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/overview" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Institutions</Link>
        <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700 shrink-0" />
        <Link href={campusHref} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{institution.campusDisplayName}</Link>
        <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700 shrink-0" />
        <Link href={`/institutions/${institution.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{institution.shortName}</Link>
        <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700 shrink-0" />
        <span className={cn(expandedDeptId ? 'hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors' : 'text-slate-900 dark:text-white font-semibold')} onClick={() => expandedDeptId && setExpandedDeptId(null)}>
          {category.name}
        </span>
        {expandedDept && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700 shrink-0" />
            <span className="text-slate-900 dark:text-white font-semibold">{expandedDept.departmentName}</span>
          </>
        )}
      </nav>

      {/* ── 2. PARAMETER HEADER ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {institution.code}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">{category.code}</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-snug">
            {category.name} Performance
          </h1>
          <p className="text-xs text-slate-500 mt-1">{category.description}</p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <span className="text-2xl font-extrabold text-slate-950 dark:text-white block font-mono leading-none">
              {category.achievementPercentage}%
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Achieved</span>
          </div>
          <StatusBadge status={category.status} size="lg" />
          <Link
            href={`/institutions/${institution.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ml-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Scorecard</span>
          </Link>
        </div>
      </div>

      {/* ── 3. DEPARTMENT BREAKDOWN & FACULTY DRILL-DOWN ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg shadow-xs overflow-hidden">
        {/* Filters Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-extrabold text-slate-950 dark:text-white tracking-tight">
              Department Breakdown — {category.name}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="inline-flex items-center p-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={cn('px-2 py-1 rounded transition-all font-semibold', statusFilter === 'ALL' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900')}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('GREEN')}
                className={cn('px-2 py-1 rounded transition-all font-semibold', statusFilter === 'GREEN' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-xs' : 'text-slate-500 hover:text-emerald-600')}
              >
                Green
              </button>
              <button
                onClick={() => setStatusFilter('ORANGE')}
                className={cn('px-2 py-1 rounded transition-all font-semibold', statusFilter === 'ORANGE' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 shadow-xs' : 'text-slate-500 hover:text-amber-600')}
              >
                Orange
              </button>
              <button
                onClick={() => setStatusFilter('RED')}
                className={cn('px-2 py-1 rounded transition-all font-semibold', statusFilter === 'RED' ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 shadow-xs' : 'text-slate-500 hover:text-rose-600')}
              >
                Red
              </button>
            </div>

            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />

            {/* Zero Count Filter */}
            <div className="inline-flex items-center p-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">
              <button
                onClick={() => setZeroCountFilter('ALL')}
                className={cn('px-2 py-1 rounded transition-all font-semibold', zeroCountFilter === 'ALL' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900')}
              >
                All
              </button>
              <button
                onClick={() => setZeroCountFilter('ZERO')}
                className={cn('px-2 py-1 rounded transition-all font-semibold', zeroCountFilter === 'ZERO' ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-xs' : 'text-slate-500 hover:text-indigo-600')}
              >
                Zero Count
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {departments.map((dept) => {
            const isExpanded = expandedDeptId === dept.departmentId;
            // Apply Filters to Department Segregation
            if (statusFilter !== 'ALL' && dept.status !== statusFilter) {
              return null;
            }

            // Fetch mocked faculty data for filtering
            const deptFacultyBreakdown = scorecardRepository.getFacultyCategoryPerformance(institution.id, dept.departmentId, category.id);
            
            // Apply Filters to Faculty
            let deptFaculty = deptFacultyBreakdown.facultyMetrics;
            if (statusFilter !== 'ALL') {
              deptFaculty = deptFaculty.filter((f) => f.status === statusFilter);
            }
            if (zeroCountFilter === 'ZERO') {
              deptFaculty = deptFaculty.filter((f) => f.zeroCountIndicator);
            }

            // Determine left border color based on department status
            let borderClass = 'border-l-[3px] border-l-slate-200 dark:border-l-slate-700';
            if (dept.status === 'GREEN') borderClass = 'border-l-[3px] border-l-emerald-500';
            else if (dept.status === 'ORANGE') borderClass = 'border-l-[3px] border-l-amber-500';
            else if (dept.status === 'RED') borderClass = 'border-l-[3px] border-l-rose-500';

            const isFlagged = flags.some((f) => f.departmentId === dept.departmentId && f.parameterId === category.id && f.status === 'FLAGGED');

            return (
              <div key={dept.departmentId} className={cn("flex flex-col bg-white dark:bg-transparent border-t first:border-t-0 border-slate-100 dark:border-slate-800", borderClass)}>
                <div 
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 group",
                    isExpanded ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                  )}
                  onClick={() => setExpandedDeptId(isExpanded ? null : dept.departmentId)}
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 w-10 sm:w-12 shrink-0">
                      {dept.departmentCode}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {dept.departmentName}
                    </h3>
                    <span className="text-[11px] text-slate-500 hidden sm:inline-block shrink-0">
                      {dept.facultyCount} Faculty
                    </span>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 shrink-0 pl-2 sm:pl-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isFlagged) setFlaggingDept(dept);
                      }}
                      disabled={isFlagged}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all focus:outline-none",
                        isFlagged
                          ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 cursor-not-allowed"
                          : "text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      )}
                    >
                      <Flag className={cn("w-3.5 h-3.5", isFlagged ? "fill-rose-200 dark:fill-rose-900/40" : "")} />
                      <span className="hidden sm:inline-block">{isFlagged ? 'Flagged' : 'Flag'}</span>
                    </button>
                    
                    <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 w-auto sm:w-20 text-right">
                      {isExpanded ? 'Hide' : 'Drill-down'}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                    {deptFacultyBreakdown.isUnavailable ? (
                      <div className="py-8 text-center text-sm text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-900">
                        Faculty-level data unavailable
                      </div>
                    ) : (
                      <FacultyPerformanceList 
                        facultyMetrics={deptFaculty} 
                        metricUnit={category.unit} 
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
          
          {departments.length === 0 && (
             <div className="p-8 text-center text-sm text-slate-500">No departments found.</div>
          )}
        </div>
      </div>

      <FlagModal
        isOpen={!!flaggingDept}
        onClose={() => setFlaggingDept(null)}
        onSubmit={handleFlagSubmit}
        institutionName={institution?.name || ''}
        departmentName={flaggingDept?.departmentName || ''}
        parameterName={category?.name || ''}
        parameterCode={category?.code || ''}
        currentStatus={flaggingDept?.status || 'GREEN'}
        targetValue={category?.target || 0}
        actualValue={flaggingDept?.actual || 0}
        unit={category?.unit || ''}
      />
    </div>
  );
}
