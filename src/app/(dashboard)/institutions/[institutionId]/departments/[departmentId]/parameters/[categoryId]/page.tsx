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
import { cn } from '@/lib/utils';

export default function DepartmentParameterDetailPage() {
  const params = useParams();
  const router = useRouter();

  const institutionId = typeof params?.institutionId === 'string' ? params.institutionId : '';
  const departmentId = typeof params?.departmentId === 'string' ? params.departmentId : '';
  const categoryId = typeof params?.categoryId === 'string' ? params.categoryId : '';

  const institution = getInstitutionById(institutionId);
  const department = institution?.departments.find(
    (d) => d.id.toLowerCase() === departmentId.toLowerCase() || d.code.toLowerCase() === departmentId.toLowerCase()
  );

  const categories = useMemo(() => institution && department ? scorecardRepository.getDepartmentScorecard(institution.id, department.id) : [], [institution, department]);
  const category = useMemo(() => categories.find((c) => c.slug === categoryId || c.id === categoryId), [categories, categoryId]);

  const [statusFilter, setStatusFilter] = useState<PerformanceStatus | 'ALL'>('ALL');
  const [zeroCountFilter, setZeroCountFilter] = useState<'ALL' | 'ZERO'>('ALL');
  
  // Flag system state
  const { flags, addFlag } = useFlagStore();
  const [isFlagging, setIsFlagging] = useState(false);

  const handleFlagSubmit = (data: { reason: string; priority: PriorityLevel }) => {
    if (!department || !institution || !category) return;
    addFlag({
      institutionId: institution.id,
      institutionName: institution.name,
      departmentId: department.id,
      departmentName: department.name,
      departmentCode: department.code,
      parameterId: category.id,
      parameterName: category.name,
      parameterCode: category.code,
      actualValue: category.actual, // Since parameter actuals aren't mocked, it's 'Not available'
      targetValue: category.target,
      unit: category.unit,
      priority: data.priority,
      reason: data.reason,
      status: 'FLAGGED',
      assignedTo: 'Designated HOD (Mock)',
      createdBy: "Chairman's Office (Mock)",
    });
    setIsFlagging(false);
  };

  const { facultyMetrics, isUnavailable } = useMemo(() => {
    if (!institution || !department || !category) return { facultyMetrics: [], isUnavailable: true };
    return scorecardRepository.getFacultyCategoryPerformance(institution.id, department.id, category.id);
  }, [institution, department, category]);

  if (!institution || !department || !category) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Page Not Found</h2>
        <p className="text-xs text-slate-500">The requested parameter detail page could not be found.</p>
        <Link
          href="/institutions"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold bg-blue-900 text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Go Back</span>
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

  // Apply Filters to Faculty
  let filteredFaculty = facultyMetrics;
  if (statusFilter !== 'ALL') {
    filteredFaculty = filteredFaculty.filter((f) => f.status === statusFilter);
  }
  if (zeroCountFilter === 'ZERO') {
    filteredFaculty = filteredFaculty.filter((f) => f.zeroCountIndicator);
  }

  const isFlagged = flags.some((f) => f.departmentId === department.id && f.parameterId === category.id && f.status === 'FLAGGED');

  return (
    <div className="space-y-4 pb-12">
      {/* ── 1. UNIVERSAL BREADCRUMB ── */}
      <nav className="flex items-center gap-2 text-[11px] font-medium text-slate-500 overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/overview" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">SRM Group</Link>
        <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700 shrink-0" />
        <Link href="/institutions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Institutions</Link>
        <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700 shrink-0" />
        <Link href={campusHref} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{institution.campusDisplayName}</Link>
        <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700 shrink-0" />
        <Link href={`/institutions/${institution.id}/departments`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{institution.code}</Link>
        <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700 shrink-0" />
        <Link href={`/institutions/${institution.id}/departments/${department.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{department.code}</Link>
        <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700 shrink-0" />
        <span className="text-slate-900 dark:text-white font-semibold">
          {category.name}
        </span>
      </nav>

      {/* ── 2. PARAMETER HEADER ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {department.code}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">{category.code}</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-snug">
            {category.name} Performance
          </h1>
          <p className="text-xs text-slate-500 mt-1">{category.description}</p>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <Link
            href={`/institutions/${institution.id}/departments/${department.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Department</span>
          </Link>
          <button
            onClick={() => !isFlagged && setIsFlagging(true)}
            disabled={isFlagged}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all focus:outline-none",
              isFlagged
                ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 cursor-not-allowed border border-rose-200 dark:border-rose-900/40"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-rose-600 hover:border-rose-200 dark:hover:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-900/20"
            )}
          >
            <Flag className={cn("w-3.5 h-3.5", isFlagged ? "fill-rose-200 dark:fill-rose-900/40" : "")} />
            <span>{isFlagged ? 'Flagged for Action' : 'Flag Department'}</span>
          </button>
        </div>
      </div>

      {/* ── 3. FACULTY DRILL-DOWN ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg shadow-xs overflow-hidden">
        {/* Filters Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-extrabold text-slate-950 dark:text-white tracking-tight">
              Faculty Breakdown
            </h2>
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              ({filteredFaculty.length} of {facultyMetrics.length} Faculty)
            </span>
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
        <div className="p-4">
          {isUnavailable ? (
            <div className="py-8 text-center text-sm text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-md bg-slate-50 dark:bg-slate-900/50">
              Faculty-level mock data is currently unavailable for {category.name}.
            </div>
          ) : (
            <FacultyPerformanceList 
              facultyMetrics={filteredFaculty} 
              metricUnit={category.unit} 
            />
          )}
        </div>
      </div>

      <FlagModal
        isOpen={isFlagging}
        onClose={() => setIsFlagging(false)}
        onSubmit={handleFlagSubmit}
        institutionName={institution.name}
        departmentName={department.name}
        parameterName={category.name}
        parameterCode={category.code}
        currentStatus={category.status}
        targetValue={category.target}
        actualValue={category.actual}
        unit={category.unit}
      />
    </div>
  );
}
