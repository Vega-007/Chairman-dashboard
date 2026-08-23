'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  GraduationCap,
  Layers,
  Building,
} from 'lucide-react';
import { getDepartmentById } from '@/data/mock/institutions.mock';
import { MOCK_PERFORMANCE_CATEGORIES } from '@/data/mock/performance.mock';
import { PageHeader } from '@/components/primitives/page-header';
import { StatusBadge } from '@/components/primitives/status-badge';
import { AchievementBar } from '@/components/primitives/achievement-bar';
import { MetricCard } from '@/components/primitives/metric-card';
import { InstitutionLogo } from '@/components/primitives/institution-logo';
import { DepartmentBadge } from '@/components/primitives/department-badge';

export default function DepartmentDetailPage() {
  const params = useParams();
  const institutionId = typeof params?.institutionId === 'string' ? params.institutionId : '';
  const departmentId = typeof params?.departmentId === 'string' ? params.departmentId : '';

  const result = getDepartmentById(institutionId, departmentId);

  if (!result) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Department Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested department ID &quot;{departmentId}&quot; under institution &quot;{institutionId}&quot; does not exist.
        </p>
        <Link
          href={`/institutions/${institutionId}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-900 text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Institution Scorecard</span>
        </Link>
      </div>
    );
  }

  const { institution, department } = result;

  // Faculty-to-Student Ratio
  const ratio = Math.round(department.studentCount / department.facultyCount);

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Page Header with Full Hierarchy Breadcrumb */}
      <PageHeader
        title={department.name}
        subtitle={`Constituent Department of ${institution.shortName} · ${institution.campusDisplayName} Campus`}
        breadcrumbs={[
          { label: 'SRM Group', href: '/overview' },
          { label: 'Institutions', href: '/institutions' },
          { label: institution.campusDisplayName, href: `/institutions?campus=${institution.campus}` },
          { label: institution.shortName, href: `/institutions/${institution.id}` },
          { label: department.name, isCurrent: true },
        ]}
        status={department.status}
        statusLabel={
          department.status === 'GREEN'
            ? 'Target Achieved'
            : department.status === 'ORANGE'
            ? 'Needs Improvement'
            : 'Action Required'
        }
        actions={
          <Link
            href={`/institutions/${institution.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{institution.code} Scorecard</span>
          </Link>
        }
      />

      {/* Top Department Intelligence Summary Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <InstitutionLogo
              institutionIdOrCode={institution.id}
              name={institution.shortName}
              size="lg"
              shape="rounded"
              className="bg-white"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <DepartmentBadge name={department.name} id={department.id} size="sm" />
                <span className="text-xs text-slate-500 font-medium">{institution.shortName}</span>
                <span className="text-xs text-slate-400 font-medium">·</span>
                <span className="text-xs text-slate-400 font-medium">{institution.campusDisplayName}</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-950 dark:text-white">
                {department.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-3xl font-extrabold text-slate-950 dark:text-white block font-mono">
                {department.performanceScore.toFixed(1)}%
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Department Achievement Score</span>
            </div>
            <StatusBadge status={department.status} size="lg" />
          </div>
        </div>

        {/* Achievement Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
            <span>Overall Department Target Progress</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {department.performanceScore.toFixed(1)}% / 100%
            </span>
          </div>
          <AchievementBar percentage={department.performanceScore} status={department.status} size="md" />
        </div>

        {/* 4 Stat Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Faculty Strength</span>
            </div>
            <span className="text-base font-extrabold text-slate-950 dark:text-white block">
              {department.facultyCount} Members
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Student Enrolled</span>
            </div>
            <span className="text-base font-extrabold text-slate-950 dark:text-white block">
              {department.studentCount.toLocaleString()} Students
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Faculty-Student Ratio</span>
            </div>
            <span className="text-base font-extrabold text-slate-950 dark:text-white block font-mono">
              1 : {ratio}
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Building className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Campus Location</span>
            </div>
            <span className="text-xs font-extrabold text-slate-950 dark:text-white block truncate">
              {institution.campusDisplayName}
            </span>
          </div>
        </div>
      </div>

      {/* Key Category Delivery Indicators (Sample Breakdown for Department) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              Departmental Category Indicators
            </h3>
            <p className="text-xs text-slate-500">
              Performance metrics for {department.name} mapped across key category standards
            </p>
          </div>
          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
            Illustrative demo values
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-3.5">
          {MOCK_PERFORMANCE_CATEGORIES.slice(0, 8).map((cat) => {
            // Compute deterministic department variation around department performanceScore
            const deptPct = Math.min(
              Math.max(
                Math.round(
                  (department.performanceScore + ((cat.displayOrder % 3) - 1) * 3.2) * 10
                ) / 10,
                45
              ),
              98
            );
            const status =
              deptPct >= 90 ? 'GREEN' : deptPct >= 70 ? 'ORANGE' : 'RED';

            return (
              <MetricCard
                key={cat.id}
                title={cat.name}
                categoryCode={cat.code}
                actual={Math.round((cat.target * deptPct) / 100)}
                target={cat.target}
                unit={cat.unit}
                achievementPercentage={deptPct}
                status={status}
                trendDelta={cat.trend}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
