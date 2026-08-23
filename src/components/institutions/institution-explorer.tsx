'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GroupHierarchy, InstitutionSummary } from '@/lib/types/institution';
import { HierarchyTree } from './hierarchy-tree';
import { IntelligencePanel } from './intelligence-panel';
import { PageHeader } from '@/components/primitives/page-header';

interface InstitutionExplorerProps {
  hierarchy: GroupHierarchy;
  initialInstitutions: InstitutionSummary[];
}

export const InstitutionExplorer: React.FC<InstitutionExplorerProps> = ({
  hierarchy,
  initialInstitutions,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const campusParam = searchParams.get('campus') as 'Ramapuram' | 'Trichy' | null;
  const selectedParam = searchParams.get('selected');

  // Initial selection logic: check selectedParam, or campusParam, or first institution
  const [selectedInstitution, setSelectedInstitution] = useState<InstitutionSummary | null>(() => {
    if (selectedParam) {
      const found = initialInstitutions.find(
        (i) => i.id.toLowerCase() === selectedParam.toLowerCase() || i.code.toLowerCase() === selectedParam.toLowerCase()
      );
      if (found) return found;
    }
    if (campusParam) {
      const foundCampus = initialInstitutions.find((i) => i.campus === campusParam);
      if (foundCampus) return foundCampus;
    }
    return initialInstitutions.length > 0 ? initialInstitutions[0] : null;
  });

  const handleSelectInstitution = (inst: InstitutionSummary) => {
    setSelectedInstitution(inst);
    // Deep linking update
    const params = new URLSearchParams(searchParams.toString());
    params.set('selected', inst.id);
    params.set('campus', inst.campus);
    router.replace(`/institutions?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="SRM Group Institutional Structure"
        subtitle="Consolidated governance hierarchy across Ramapuram and Trichy campuses"
        breadcrumbs={[
          { label: 'SRM Group', href: '/overview' },
          { label: 'Institutions', isCurrent: true },
        ]}
        status={hierarchy.status}
        statusLabel="Ecosystem Active"
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              19 Constituent Institutions
            </span>
          </div>
        }
      />

      {/* Two-part layout: Left Tree, Right Intelligence - Natural Page Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Hierarchical Tree */}
        <div className="lg:col-span-7 xl:col-span-7">
          <HierarchyTree
            hierarchy={hierarchy}
            selectedInstitutionId={selectedInstitution?.id || null}
            onSelectInstitution={handleSelectInstitution}
            initialCampus={campusParam || 'ALL'}
          />
        </div>

        {/* Right: Intelligence Panel (Natural scroll, no nested scroll trap) */}
        <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-6">
          <IntelligencePanel institution={selectedInstitution} />
        </div>
      </div>
    </div>
  );
};
