'use client';

import React, { Suspense } from 'react';
import { getInstitutionalHierarchy, MOCK_INSTITUTIONS } from '@/data/mock/institutions.mock';
import { InstitutionExplorer } from '@/components/institutions';

export default function InstitutionsPage() {
  const hierarchy = getInstitutionalHierarchy();

  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading Institutional Explorer...</div>}>
      <InstitutionExplorer
        hierarchy={hierarchy}
        initialInstitutions={MOCK_INSTITUTIONS}
      />
    </Suspense>
  );
}
