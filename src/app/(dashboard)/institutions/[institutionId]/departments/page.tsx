'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/primitives/page-header';
import { getInstitutionById } from '@/data/mock/institutions.mock';
import { Users, BookOpen } from 'lucide-react';
import { StatusBadge } from '@/components/primitives/status-badge';

export default function InstitutionDepartmentsPage() {
  const params = useParams();
  const institutionId = typeof params?.institutionId === 'string' ? params.institutionId : '';
  const institution = getInstitutionById(institutionId);

  if (!institution) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Institution Not Found</h2>
      </div>
    );
  }

  const campusHref =
    institution.campus === 'Trichy'
      ? '/institutions/campus/trichy'
      : institution.campus === 'Ramapuram'
      ? '/institutions/campus/ramapuram'
      : '/institutions';

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={`${institution.name} Departments`}
        subtitle="Select a department to view parameter performance"
        breadcrumbs={[
          { label: 'Institutions', href: '/institutions' },
          { label: institution.campusDisplayName, href: campusHref },
          { label: institution.code, isCurrent: true },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {institution.departments.map((dept) => (
          <Link
            key={dept.id}
            href={`/institutions/${institution.id}/departments/${dept.id}`}
            className="flex flex-col p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-mono font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
                {dept.code}
              </span>
              <StatusBadge status={dept.status} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {dept.name}
            </h3>
            
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>{dept.facultyCount} Faculty</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{dept.studentCount} Students</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
