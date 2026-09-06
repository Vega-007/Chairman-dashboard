'use client';

import React, { useState } from 'react';
import { Building2, GraduationCap, Wifi } from 'lucide-react';
import { Users } from 'lucide-react';
import { ACADEMIC_PORTALS, BUSINESS_UNIT_PORTALS, COMMUNITY_PORTALS } from '@/data/mock/portals.mock';
import { ExecutiveCategorySection } from '@/components/chairman/executive-category-section';
import { ChairmanHeader } from '@/components/chairman/chairman-header';
import { cn } from '@/lib/utils';

export default function RootPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ backgroundColor: '#F0F4F8' }}>

      {/* Background texture — subtle diagonal lines */}
      <div
        className="fixed inset-0 pointer-events-none -z-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(203,213,225,0.35) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(203,213,225,0.35) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
        }}
      />

      {/* Top subtle color wash */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse 70% 30% at 50% 0%, rgba(30,58,138,0.05) 0%, transparent 70%)',
        }}
      />

      <ChairmanHeader />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 py-7">

        <div className="space-y-8">

          {/* Academic & Institutional Systems */}
          <ExecutiveCategorySection
            title="Academic & Institutional Systems"
            subtitle="Live institutional analytics, governance, research and academic intelligence platforms."
            portals={ACADEMIC_PORTALS}
            icon={GraduationCap}
            onToast={showToast}
            gridClass="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
            sectionTheme="academic"
          />

          {/* Business Unit Systems — compact 4-col grid */}
          <ExecutiveCategorySection
            title="Business Unit Dashboard"
            subtitle="Operational intelligence across SRM business verticals. Integrations launching soon."
            portals={BUSINESS_UNIT_PORTALS}
            icon={Building2}
            onToast={showToast}
            gridClass="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8"
            sectionTheme="business"
          />

          {/* Community & Network Systems */}
          <ExecutiveCategorySection
            title="Community & Network"
            subtitle="Global alumni networks and community engagement platforms."
            portals={COMMUNITY_PORTALS}
            icon={Users}
            onToast={showToast}
            gridClass="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
            sectionTheme="academic"
          />

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full mt-8 py-4 px-5 sm:px-8 border-t" style={{ borderColor: 'rgba(226,232,240,0.7)', backgroundColor: 'rgba(255,255,255,0.6)' }}>
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
            Executive Governance Platform · Strictly Confidential
          </span>
          <span className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} SRM Group of Institutions
          </span>
        </div>
      </footer>

      {/* Toast Notification */}
      <div
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out",
          toastMessage ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 pointer-events-none"
        )}
      >
        <div className="bg-slate-900 text-white px-5 py-3 rounded-lg shadow-2xl border border-slate-800 font-medium text-[13px] flex items-center gap-2.5 max-w-sm">
          <Wifi className="w-4 h-4 text-blue-400 shrink-0" />
          {toastMessage}
        </div>
      </div>

    </div>
  );
}
