'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '@/lib/store/use-app-store';
import { MOCK_INSTITUTIONS } from '@/data/mock/institutions.mock';
import { InstitutionLogo } from '@/components/primitives/institution-logo';
import { cn } from '@/lib/utils';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: 'red' | 'neutral';
}

export function getMainNavItems(): NavItem[] {
  const institutionsCount = MOCK_INSTITUTIONS.length;

  return [
    {
      label: 'Overview',
      href: '/overview',
      icon: LayoutDashboard,
    },
    {
      label: 'Institutions',
      href: '/institutions',
      icon: Building2,
      badge: institutionsCount,
      badgeVariant: 'neutral',
    },
    {
      label: 'Faculty Performance',
      href: '/faculty',
      icon: Users,
    },
    {
      label: 'Reports',
      href: '/reports',
      icon: FileText,
    },
    {
      label: 'Administration',
      href: '/administration',
      icon: Settings,
    },
  ];
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar, user } = useAppStore();
  const navItems = getMainNavItems();

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 transition-all duration-300 ease-in-out select-none z-30 shrink-0',
        isSidebarCollapsed ? 'w-18' : 'w-64'
      )}
      aria-label="Main Navigation"
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <Link
          href="/overview"
          className="flex items-center gap-2.5 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-600/30 rounded"
        >
          {!isSidebarCollapsed ? (
            <Image 
              src="/Final-Logo.png" 
              alt="SRM Logo" 
              width={180} 
              height={48} 
              style={{ width: 'auto', height: '48px' }} 
              priority 
            />
          ) : (
            <InstitutionLogo
              institutionIdOrCode="srm-group"
              name="SRM Group"
              size="sm"
              shape="rounded"
              className="bg-white border border-slate-200 dark:border-slate-700 shadow-xs shrink-0"
            />
          )}
        </Link>

        <button
          type="button"
          onClick={toggleSidebar}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600/30"
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main 7 Navigation Items ONLY */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Sidebar Menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/overview' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all group relative',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-950 dark:hover:text-white'
              )}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-700 dark:bg-blue-400 rounded-r"
                  aria-hidden="true"
                />
              )}

              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isActive
                    ? 'text-blue-700 dark:text-blue-400'
                    : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                )}
              />

              {!isSidebarCollapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}

              {!isSidebarCollapsed && item.badge !== undefined && (
                <span
                  className={cn(
                    'px-1.5 py-0.5 rounded text-[10px] font-semibold font-mono tracking-tight',
                    item.badgeVariant === 'red'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Executive Profile */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-xs shrink-0 border border-slate-300 dark:border-slate-600">
            RS
          </div>
          {!isSidebarCollapsed && (
            <div className="flex-1 truncate leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {user.name}
                </span>
                <span title="Chairman Role" className="inline-flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                {user.role}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
