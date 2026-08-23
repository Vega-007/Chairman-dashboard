'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { useAppStore } from '@/lib/store/use-app-store';
import { Sidebar, getMainNavItems } from './sidebar';
import { Topbar } from './topbar';
import { cn } from '@/lib/utils';

interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const pathname = usePathname();
  const { isMobileNavOpen, setMobileNavOpen, user } = useAppStore();
  const navItems = getMainNavItems();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Desktop Sidebar (Only 7 top-level items) */}
      <Sidebar />

      {/* Mobile Drawer Navigation */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative flex flex-col w-full max-w-xs bg-white dark:bg-slate-900 h-full z-10 shadow-xl">
            <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-900 dark:bg-blue-600 text-white flex items-center justify-center font-black text-sm tracking-wider">
                  SRM
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-950 dark:text-white">
                    CHAIRMAN MIS
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    Ramapuram & Trichy
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/overview' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0 text-slate-500" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60">
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                {user.name}
              </div>
              <div className="text-[11px] text-slate-500">
                {user.role} · {user.campusScope}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
