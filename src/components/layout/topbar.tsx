'use client';

import React from 'react';
import Link from 'next/link';
import {
  Menu,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { useAppStore } from '@/lib/store/use-app-store';
import { getAttentionItemsTotalCount } from '@/data/mock/performance.mock';
import { AcademicYearPicker } from '../primitives/academic-year-picker';
import { DemoDataBadge } from '../primitives/demo-data-badge';

export const Topbar: React.FC = () => {
  const { isMobileNavOpen, setMobileNavOpen, user } = useAppStore();
  const attentionCount = getAttentionItemsTotalCount();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      {/* Left: Mobile trigger & Breadcrumb area */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileNavOpen(!isMobileNavOpen)}
          className="lg:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/30"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dashboard Title */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Chairman&apos;s Analytics Dashboard
            </span>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
              Ramapuram • Trichy • School
            </span>
          </div>
        </div>
      </div>

      {/* Right: Academic Year Selector, Demo Data Pill, Notifications, Quick Actions, Profile */}
      <div className="flex items-center gap-2.5 md:gap-3.5">
        {/* Subtle Demo Data Badge */}
        <DemoDataBadge />

        {/* Academic Year Selector (Global State) */}
        <AcademicYearPicker />

        {/* Attention Items Counter */}
        <Link
          href="/attention"
          className="relative p-2 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/30"
          aria-label={`${attentionCount} Attention items requiring Chairman review`}
          title={`${attentionCount} Attention items requiring Chairman review`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
          </span>
        </Link>

        {/* Faculty Appraisal Link */}
        <a
          href="https://faculty-appraisal-form-five.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          title="Open External Faculty Appraisal System"
        >
          <span>Appraisal Portal</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>

        {/* User / Profile Dropdown Area */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-blue-900 dark:bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            RS
          </div>
          <div className="hidden xl:flex flex-col text-left leading-tight">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {user.name}
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {user.role} · {user.campusScope}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
