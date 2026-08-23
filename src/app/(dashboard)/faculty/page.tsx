'use client';

import React from 'react';
import { Users, ExternalLink } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/primitives';

export default function FacultyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty Performance & Appraisals"
        subtitle="Departmental faculty metrics, appraisal completion rates, and integration with appraisal portal"
        breadcrumbs={[
          { label: 'Overview', href: '/overview' },
          { label: 'Faculty', isCurrent: true },
        ]}
        actions={
          <a
            href="https://faculty-appraisal-form-five.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-900 dark:bg-blue-600 text-white hover:bg-blue-800 transition-colors shadow-xs"
          >
            <span>Open Faculty Appraisal Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        }
      />

      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-6 shadow-xs">
        <EmptyState
          title="Faculty Performance Module"
          description="Appraisal summary scores, submission rates, and pending reviews by department will be presented here."
          icon={<Users className="w-6 h-6 text-blue-700" />}
        />
      </div>
    </div>
  );
}
