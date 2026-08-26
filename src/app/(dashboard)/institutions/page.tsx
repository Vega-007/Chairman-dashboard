'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/primitives/page-header';
import { Building2, MapPin, School } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function InstitutionsPage() {
  const campuses = [
    {
      id: 'ramapuram',
      name: 'Chennai – Ramapuram',
      description: 'Main constituent engineering, management, and dental colleges',
      icon: <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
      color: 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50',
      hover: 'hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md',
    },
    {
      id: 'trichy',
      name: 'Tiruchirappalli',
      description: 'SRM Institute of Science and Technology, Trichy Campus',
      icon: <Building2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
      color: 'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/50',
      hover: 'hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md',
    },
    {
      id: 'west-mambalam',
      name: 'West Mambalam – School',
      description: 'SRM Public School & related pre-university education',
      icon: <School className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
      color: 'bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50',
      hover: 'hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Institutional Hierarchy"
        subtitle="Select a campus to explore its constituent colleges and departments"
        breadcrumbs={[
          { label: 'SRM Group', href: '/overview' },
          { label: 'Institutions', isCurrent: true },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {campuses.map((campus) => (
          <Link
            key={campus.id}
            href={`/institutions/campus/${campus.id}`}
            className={cn(
              "flex flex-col p-6 rounded-xl border transition-all duration-300",
              campus.color,
              campus.hover
            )}
          >
            <div className="mb-4 p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm w-fit">
              {campus.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {campus.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {campus.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
