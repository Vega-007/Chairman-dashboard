'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronRight,
  Building,
  MapPin,
  Search,
  Layers,
  ArrowRight,
  RotateCcw,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { InstitutionSummary, GroupHierarchy, CampusName } from '@/lib/types/institution';
import { PerformanceStatus } from '@/lib/types/common';
import { ScoreRangeFilter } from '@/lib/types/identity';
import { StatusBadge } from '@/components/primitives/status-badge';
import { InstitutionLogo } from '@/components/primitives/institution-logo';
import { DepartmentBadge } from '@/components/primitives/department-badge';
import { cn } from '@/lib/utils';

interface HierarchyTreeProps {
  hierarchy: GroupHierarchy;
  selectedInstitutionId: string | null;
  onSelectInstitution: (institution: InstitutionSummary) => void;
  initialCampus?: CampusName | 'ALL';
  className?: string;
}

export const HierarchyTree: React.FC<HierarchyTreeProps> = ({
  hierarchy,
  selectedInstitutionId,
  onSelectInstitution,
  initialCampus = 'ALL',
  className,
}) => {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [campusFilter, setCampusFilter] = useState<CampusName | 'ALL'>(initialCampus);
  const [statusFilter, setStatusFilter] = useState<'ALL' | PerformanceStatus>('ALL');
  const [scoreRangeFilter, setScoreRangeFilter] = useState<ScoreRangeFilter>('ALL');

  // User-toggled expanded Tree State
  const [isGroupExpanded, setIsGroupExpanded] = useState(true);
  const [expandedCampuses, setExpandedCampuses] = useState<Record<string, boolean>>({
    Ramapuram: true,
    Trichy: true,
  });
  const [expandedInstitutions, setExpandedInstitutions] = useState<Record<string, boolean>>({});

  const hasSearch = searchQuery.trim().length > 0;
  const hasFilterActive =
    hasSearch ||
    campusFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    scoreRangeFilter !== 'ALL';

  const clearFilters = () => {
    setSearchQuery('');
    setCampusFilter('ALL');
    setStatusFilter('ALL');
    setScoreRangeFilter('ALL');
  };

  const expandAll = () => {
    setIsGroupExpanded(true);
    setExpandedCampuses({ Ramapuram: true, Trichy: true });
    const allInsts: Record<string, boolean> = {};
    hierarchy.campuses.forEach((c) => {
      c.institutions.forEach((i) => {
        allInsts[i.id] = true;
      });
    });
    setExpandedInstitutions(allInsts);
  };

  const collapseAll = () => {
    setIsGroupExpanded(false);
    setExpandedCampuses({ Ramapuram: false, Trichy: false });
    setExpandedInstitutions({});
  };

  const toggleCampus = (campus: string) => {
    setExpandedCampuses((prev) => ({
      ...prev,
      [campus]: !prev[campus],
    }));
  };

  const toggleInstitution = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedInstitutions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filtered dataset
  const filteredCampuses = useMemo(() => {
    return hierarchy.campuses
      .filter((c) => campusFilter === 'ALL' || c.campus === campusFilter)
      .map((c) => {
        const matchingInstitutions = c.institutions.filter((inst) => {
          // Status filter
          if (statusFilter !== 'ALL' && inst.status !== statusFilter) {
            return false;
          }

          // Score range filter
          if (scoreRangeFilter !== 'ALL') {
            if (scoreRangeFilter === '90_100' && inst.overallScore < 90) return false;
            if (scoreRangeFilter === '70_89' && (inst.overallScore < 70 || inst.overallScore >= 90)) return false;
            if (scoreRangeFilter === 'BELOW_70' && inst.overallScore >= 70) return false;
          }

          // Search query filter (matches name, code, shortName, campus, or department name)
          if (hasSearch) {
            const query = searchQuery.toLowerCase();
            const matchesName = inst.name.toLowerCase().includes(query);
            const matchesCode = inst.code.toLowerCase().includes(query);
            const matchesShortName = inst.shortName.toLowerCase().includes(query);
            const matchesCampus =
              inst.campus.toLowerCase().includes(query) ||
              inst.campusDisplayName.toLowerCase().includes(query);
            const matchesDept = inst.departments.some((d) => d.name.toLowerCase().includes(query));
            return matchesName || matchesCode || matchesShortName || matchesCampus || matchesDept;
          }

          return true;
        });

        return {
          ...c,
          institutions: matchingInstitutions,
        };
      })
      .filter((c) => c.institutions.length > 0 || !hasSearch);
  }, [hierarchy, campusFilter, statusFilter, scoreRangeFilter, searchQuery, hasSearch]);

  const totalMatchedCount = useMemo(() => {
    return filteredCampuses.reduce((acc, c) => acc + c.institutions.length, 0);
  }, [filteredCampuses]);

  const groupExpanded = hasSearch || isGroupExpanded;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-3.5 shadow-xs space-y-3">
        {/* Search Field */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search institution by name, code (e.g. EEC, TSMC), campus, or department..."
            className="w-full pl-9 pr-14 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-colors"
          />
          {hasSearch && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Compact Filters & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          {/* Campus Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] font-medium">Campus:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md">
              {(['ALL', 'Ramapuram', 'Trichy'] as const).map((camp) => (
                <button
                  key={camp}
                  type="button"
                  onClick={() => setCampusFilter(camp)}
                  className={cn(
                    'px-2.5 py-1 text-[11px] font-medium rounded transition-colors',
                    campusFilter === camp
                      ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-300 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  {camp === 'ALL' ? 'All' : camp}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] font-medium">Status:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md">
              {[
                { label: 'All', value: 'ALL' as const },
                { label: 'Achieved', value: 'GREEN' as const },
                { label: 'Needs Impr.', value: 'ORANGE' as const },
                { label: 'Action Req.', value: 'RED' as const },
              ].map((st) => (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => setStatusFilter(st.value)}
                  className={cn(
                    'px-2.5 py-1 text-[11px] font-medium rounded transition-colors',
                    statusFilter === st.value
                      ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-300 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Score Range Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] font-medium">Score:</span>
            <select
              value={scoreRangeFilter}
              onChange={(e) => setScoreRangeFilter(e.target.value as ScoreRangeFilter)}
              className="px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Scores</option>
              <option value="90_100">Score 90–100%</option>
              <option value="70_89">Score 70–89%</option>
              <option value="BELOW_70">Score Below 70%</option>
            </select>
          </div>

          {/* Action Buttons: Clear & Expand/Collapse */}
          <div className="flex items-center gap-2 ml-auto">
            {hasFilterActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
            <button
              type="button"
              onClick={expandAll}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
              title="Expand all tree nodes"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Expand All</span>
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
              title="Collapse all tree nodes"
            >
              <Minimize2 className="w-3 h-3" />
              <span>Collapse All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hierarchical Expandable Tree View */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-700 dark:text-blue-400" />
            <h2 className="text-sm font-bold text-slate-950 dark:text-white tracking-tight">
              Institutional Hierarchy Tree
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Showing <strong className="text-slate-900 dark:text-white">{totalMatchedCount}</strong> of 19 Institutions
          </span>
        </div>

        {/* Tree Root: SRM GROUP */}
        <div className="space-y-3">
          <div
            onClick={() => setIsGroupExpanded(!isGroupExpanded)}
            className="flex items-center justify-between p-3.5 rounded-lg border-2 border-blue-900/30 dark:border-blue-700/50 bg-blue-50/50 dark:bg-blue-950/40 cursor-pointer hover:bg-blue-100/60 dark:hover:bg-blue-900/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="p-1 rounded text-blue-900 dark:text-blue-300 hover:bg-blue-200/50 dark:hover:bg-blue-800/50"
                aria-label={groupExpanded ? 'Collapse SRM Group' : 'Expand SRM Group'}
              >
                {groupExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              <div className="w-8 h-8 rounded-md bg-blue-900 dark:bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0">
                SRM
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-950 dark:text-white">
                    {hierarchy.name}
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-950 dark:text-blue-200">
                    Governance Root
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {hierarchy.totalInstitutions} Constituent Institutions · Ramapuram & Trichy
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-base font-extrabold text-slate-950 dark:text-white block font-mono">
                  {hierarchy.overallScore.toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-400">Group Score</span>
              </div>
              <StatusBadge status={hierarchy.status} size="sm" />
            </div>
          </div>

          {/* Level 1: Campuses */}
          {groupExpanded && (
            <div className="ml-5 pl-4 border-l-2 border-slate-200 dark:border-slate-800 space-y-4">
              {filteredCampuses.map((campus) => {
                const isCampusExpanded = hasSearch || expandedCampuses[campus.campus];

                return (
                  <div key={campus.campus} className="space-y-3 relative">
                    {/* Branch connector line */}
                    <div className="absolute -left-4 top-4.5 w-4 h-0.5 bg-slate-200 dark:border-slate-800" />

                    {/* Campus Node */}
                    <div
                      onClick={() => toggleCampus(campus.campus)}
                      className="flex items-center justify-between p-3 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          aria-label={isCampusExpanded ? `Collapse ${campus.displayName}` : `Expand ${campus.displayName}`}
                        >
                          {isCampusExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <div className="p-1.5 rounded bg-blue-100/70 dark:bg-blue-950 text-blue-900 dark:text-blue-300">
                          {campus.campus === 'Ramapuram' ? (
                            <MapPin className="w-3.5 h-3.5" />
                          ) : (
                            <Building className="w-3.5 h-3.5" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {campus.displayName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({campus.institutions.length} Institutions)
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-0.5">
                            <span className="whitespace-nowrap">{campus.greenCount} Achieved</span>
                            <span className="text-slate-300 dark:text-slate-700">·</span>
                            <span className="whitespace-nowrap">{campus.orangeCount} Needs Impr.</span>
                            <span className="text-slate-300 dark:text-slate-700">·</span>
                            <span className="whitespace-nowrap">{campus.redCount} Action Req.</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <span className="font-extrabold text-[11px] sm:text-xs text-slate-900 dark:text-white font-mono">
                          {campus.overallScore.toFixed(1)}%
                        </span>
                        <StatusBadge status={campus.status} size="sm" showDot={false} className="text-[10px] px-1.5 py-0" />
                        <Link
                          href={`/institutions/campus/${campus.campus.toLowerCase()}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[9px] sm:text-[10px] font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 transition-colors whitespace-nowrap"
                          title={`Open dedicated ${campus.displayName} overview page`}
                        >
                          <span className="hidden sm:inline">Campus View →</span>
                          <span className="sm:hidden">View →</span>
                        </Link>
                      </div>
                    </div>

                    {/* Level 2: Institutions */}
                    {isCampusExpanded && (
                      <div className="ml-5 pl-4 border-l-2 border-slate-200 dark:border-slate-800 space-y-2.5">
                        {campus.institutions.map((inst) => {
                          const matchesDeptSearch =
                            hasSearch &&
                            inst.departments.some((d) =>
                              d.name.toLowerCase().includes(searchQuery.toLowerCase())
                            );
                          const isInstExpanded = matchesDeptSearch || expandedInstitutions[inst.id];
                          const isSelected = selectedInstitutionId === inst.id;

                          return (
                            <div key={inst.id} className="space-y-2 relative">
                              {/* Branch connector */}
                              <div className="absolute -left-4 top-5 w-4 h-0.5 bg-slate-200 dark:border-slate-800" />

                              {/* Institution Card Node with InstitutionLogo */}
                              <div
                                onClick={() => onSelectInstitution(inst)}
                                className={cn(
                                  'group p-3 rounded-lg border transition-all cursor-pointer space-y-2',
                                  isSelected
                                    ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-xs ring-1 ring-blue-600/20'
                                    : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/40 dark:hover:bg-slate-800/40'
                                )}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-start gap-2.5 min-w-0">
                                    <InstitutionLogo
                                      institutionIdOrCode={inst.id}
                                      name={inst.shortName}
                                      size="sm"
                                      shape="rounded"
                                    />
                                    <div className="truncate">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                          {inst.code}
                                        </span>
                                        <span className="font-bold text-xs text-slate-950 dark:text-white truncate group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors">
                                          {inst.name}
                                        </span>
                                      </div>
                                      <span className="text-[10px] text-slate-400 block mt-0.5">
                                        {inst.campusDisplayName} · {inst.institutionType}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-xs font-extrabold text-slate-900 dark:text-white font-mono">
                                      {inst.overallScore.toFixed(1)}%
                                    </span>
                                    <StatusBadge status={inst.status} size="sm" />
                                  </div>
                                </div>

                                {/* Tally & Action Bar */}
                                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                                    <span className="flex items-center gap-0.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{inst.greenCount}</span>
                                    </span>
                                    <span className="text-slate-300 dark:text-slate-700">·</span>
                                    <span className="flex items-center gap-0.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                                      <span className="text-amber-700 dark:text-amber-400 font-semibold">{inst.orangeCount}</span>
                                    </span>
                                    <span className="text-slate-300 dark:text-slate-700">·</span>
                                    <span className="flex items-center gap-0.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                                      <span className="text-rose-700 dark:text-rose-400 font-semibold">{inst.redCount}</span>
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <button
                                      type="button"
                                      onClick={(e) => toggleInstitution(inst.id, e)}
                                      className="inline-flex items-center gap-1 font-medium text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
                                    >
                                      <span>Depts ({inst.departments.length})</span>
                                      {isInstExpanded ? (
                                        <ChevronDown className="w-3 h-3" />
                                      ) : (
                                        <ChevronRight className="w-3 h-3" />
                                      )}
                                    </button>

                                    <Link
                                      href={`/institutions/${inst.id}`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-0.5 font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-900 transition-colors"
                                    >
                                      <span>Detail</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </Link>
                                  </div>
                                </div>
                              </div>

                              {/* Level 3: Departments (when institution is expanded) */}
                              {isInstExpanded && (
                                <div className="ml-5 pl-4 border-l-2 border-dashed border-slate-200 dark:border-slate-800 space-y-1.5 py-1">
                                  {inst.departments.map((dept) => (
                                    <Link
                                      key={dept.id}
                                      href={`/institutions/${inst.id}/departments/${dept.id}`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="relative flex items-center justify-between p-2 rounded-md bg-slate-50 hover:bg-blue-50/70 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-100 hover:border-blue-200 dark:border-slate-800 dark:hover:border-slate-700 text-xs transition-colors group/dept"
                                    >
                                      {/* Branch line */}
                                      <div className="absolute -left-4 top-1/2 w-4 h-0.5 bg-slate-200 dark:border-slate-800" />

                                      <div className="flex items-center gap-2 truncate pr-2 min-w-0">
                                        <DepartmentBadge name={dept.name} id={dept.id} size="xs" />
                                        <div className="truncate">
                                          <span className="font-medium text-slate-800 dark:text-slate-200 group-hover/dept:text-blue-900 dark:group-hover/dept:text-blue-300 block truncate">
                                            {dept.name}
                                          </span>
                                          <span className="text-[10px] text-slate-400">
                                            {dept.facultyCount} Faculty · {dept.studentCount} Students
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0">
                                        <span className="font-bold text-slate-900 dark:text-white text-[11px] font-mono">
                                          {dept.performanceScore.toFixed(1)}%
                                        </span>
                                        <StatusBadge status={dept.status} size="sm" showDot={false} />
                                        <ArrowRight className="w-3 h-3 text-slate-400 group-hover/dept:text-blue-700 group-hover/dept:translate-x-0.5 transition-all" />
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
