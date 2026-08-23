'use client';

import React from 'react';
import { Settings } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/primitives';

export default function AdministrationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="System Administration"
        subtitle="Configure target thresholds, manage RBAC user access, and maintain data source verification"
        breadcrumbs={[
          { label: 'Overview', href: '/overview' },
          { label: 'Administration', isCurrent: true },
        ]}
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-6 shadow-xs">
        <EmptyState
          title="Administration Center"
          description="Configurable green/orange threshold controls, data provenance management, and user role scoping will be configured here."
          icon={<Settings className="w-6 h-6 text-slate-600" />}
        />
      </div>
    </div>
  );
}
