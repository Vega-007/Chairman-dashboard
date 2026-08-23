import React from 'react';
import { BreadcrumbItem, PerformanceStatus } from '@/lib/types/common';
import { Breadcrumbs } from './breadcrumbs';
import { StatusBadge } from './status-badge';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  status?: PerformanceStatus;
  statusLabel?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  status,
  statusLabel,
  actions,
  className,
}) => {
  return (
    <div className={cn('pb-5 border-b border-slate-200/80 dark:border-slate-800 mb-6', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-2.5">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
              {title}
            </h1>
            {status && (
              <StatusBadge status={status} label={statusLabel} size="md" />
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
