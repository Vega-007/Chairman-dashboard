'use client';

import React from "react";
import Link from "next/link";
import { MapPin, ChevronRight, Building2, School2 } from "lucide-react";
import { MOCK_INSTITUTIONS } from "@/data/mock/institutions.mock";
import { InstitutionChairmanCard } from "@/components/dashboard/institution-chairman-card";
import { cn } from "@/lib/utils";

// Group institutions by campus — NHSS is now 'School', not 'Ramapuram'
const ramapuramInstitutions = MOCK_INSTITUTIONS.filter((i) => i.campus === "Ramapuram");
const trichyInstitutions = MOCK_INSTITUTIONS.filter((i) => i.campus === "Trichy");
const schoolInstitutions = MOCK_INSTITUTIONS.filter((i) => i.campus === "School");

// Summary stats for a group of institutions
function getCampusTally(institutions: typeof MOCK_INSTITUTIONS) {
  if (institutions.length === 0) return { total: 0, green: 0, orange: 0, red: 0, avgScore: 0 };
  return {
    total: institutions.length,
    green: institutions.filter((i) => i.status === "GREEN").length,
    orange: institutions.filter((i) => i.status === "ORANGE").length,
    red: institutions.filter((i) => i.status === "RED").length,
    avgScore:
      Math.round(
        (institutions.reduce((acc, i) => acc + i.overallScore, 0) / institutions.length) * 10
      ) / 10,
  };
}

interface SectionProps {
  title: string;
  campusSlug?: string;         // undefined = not clickable to campus page
  institutions: typeof MOCK_INSTITUTIONS;
  dotColor: string;
  isSchool?: boolean;
}

function InstitutionSection({
  title,
  campusSlug,
  institutions,
  dotColor,
  isSchool,
}: SectionProps) {
  const tally = getCampusTally(institutions);

  return (
    <section 
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4.5 shadow-sm space-y-4"
      aria-label={title + " section"}
    >
      {/* Visual Section Header Container */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn("p-2 rounded-lg text-white shrink-0", dotColor)}>
            {isSchool ? (
              <School2 className="w-5 h-5" />
            ) : (
              <MapPin className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-extrabold text-slate-950 dark:text-white tracking-tight mb-0.5">
              {title}
            </h2>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono">
              {tally.total} {tally.total === 1 ? "Institution" : "Institutions"} · Avg {tally.avgScore}%
            </span>
          </div>
        </div>

        {campusSlug && (
          <Link
            href={`/institutions/campus/${campusSlug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-2xs whitespace-nowrap"
          >
            <span>View all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Grid of Institution Cards (responsive, exactly 6 columns at 1400px+) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 min-[1200px]:grid-cols-5 min-[1400px]:grid-cols-6 gap-2.5">
        {institutions.map((institution) => (
          <InstitutionChairmanCard key={institution.id} institution={institution} />
        ))}
      </div>
    </section>
  );
}

export default function OverviewPage() {
  const totalInstitutions = MOCK_INSTITUTIONS.length;
  const groupGreen = MOCK_INSTITUTIONS.filter((i) => i.status === "GREEN").length;
  const groupOrange = MOCK_INSTITUTIONS.filter((i) => i.status === "ORANGE").length;
  const groupRed = MOCK_INSTITUTIONS.filter((i) => i.status === "RED").length;
  const groupAvg =
    Math.round(
      (MOCK_INSTITUTIONS.reduce((acc, i) => acc + i.overallScore, 0) / totalInstitutions) * 10
    ) / 10;

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Page Header */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-lg font-extrabold text-slate-950 dark:text-white tracking-tight">
            Chairman&apos;s Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            All 19 constituent institutions across Ramapuram, Trichy &amp; School
          </p>
        </div>

        {/* Group-level KPI Summary Pills (Aligned Exactly with Reference Image) */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Building2 className="w-4 h-4 text-slate-400" />
            <strong>{totalInstitutions}</strong>
            <span className="text-slate-500">Institutions</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs text-xs font-semibold text-slate-700 dark:text-slate-300">
            <strong>{groupAvg.toFixed(1)}%</strong>
            <span className="text-slate-500">Avg Score</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <strong>{groupGreen}</strong>
            <span>Achieved</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900 text-xs font-bold text-amber-700 dark:text-amber-400">
            <strong>{groupOrange}</strong>
            <span>Improve</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-250 dark:border-rose-900 text-xs font-bold text-rose-700 dark:text-rose-400">
            <strong>{groupRed}</strong>
            <span>Action</span>
          </div>
        </div>
      </div>

      {/* SECTION 1 — CHENNAI RAMAPURAM CAMPUS */}
      <InstitutionSection
        title="Chennai – Ramapuram Campus"
        campusSlug="ramapuram"
        institutions={ramapuramInstitutions}
        dotColor="bg-blue-600 dark:bg-blue-500"
      />

      {/* SECTION 2 — TIRUCHIRAPPALLI CAMPUS */}
      <InstitutionSection
        title="Tiruchirappalli Campus"
        campusSlug="trichy"
        institutions={trichyInstitutions}
        dotColor="bg-blue-600 dark:bg-blue-500"
      />

      {/* SECTION 3 — SCHOOL (West Mambalam) */}
      <InstitutionSection
        title="West Mambalam – School"
        institutions={schoolInstitutions}
        dotColor="bg-blue-600 dark:bg-blue-500"
        isSchool
      />
    </div>
  );
}
