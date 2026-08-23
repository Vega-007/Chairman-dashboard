'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/primitives';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Reports & Exports"
        subtitle="Generate institution-wide and department-level MIS summaries in PDF and CSV formats"
        breadcrumbs={[
          { label: 'Overview', href: '/overview' },
          { label: 'Reports', isCurrent: true },
        ]}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-6 shadow-xs">
        <EmptyState
          title="Report Generation Suite"
          description="Executive summary generation, historical year-over-year exports, and compliance packs will be available here."
          icon={<FileText className="w-6 h-6 text-slate-600" />}
        />
      </div>
    </div>
  );
}
