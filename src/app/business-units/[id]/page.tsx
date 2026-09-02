import React from 'react';
import { notFound } from 'next/navigation';
import { BUSINESS_UNITS_DATA } from '@/data/mock/business-units.mock';
import { BUHeader } from '@/components/chairman/business-units/bu-header';
import { BUKPIs } from '@/components/chairman/business-units/bu-kpis';
import { BUCharts } from '@/components/chairman/business-units/bu-charts';
import { BUTables } from '@/components/chairman/business-units/bu-tables';
import { BUInsights } from '@/components/chairman/business-units/bu-insights';
import { ChairmanHeader } from '@/components/chairman/chairman-header';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BusinessUnitDashboard({ params }: PageProps) {
  // Await the params object before accessing properties
  const resolvedParams = await params;
  const unitId = resolvedParams.id;
  const data = BUSINESS_UNITS_DATA[unitId];

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen font-sans flex flex-col bg-slate-50">
      <ChairmanHeader />
      
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 py-7">
        
        {/* Header Section */}
        <BUHeader name={data.name} description={data.description} />

        {/* Executive KPIs */}
        <BUKPIs kpis={data.kpis} />

        {/* Performance & Financial Analytics */}
        <div className="mb-4">
          <h2 className="text-[14px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Performance Analytics
          </h2>
          <BUCharts charts={data.charts} />
        </div>

        {/* Operational Metrics / Tables */}
        {data.table && (
          <div className="mb-4">
            <h2 className="text-[14px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Operational Metrics
            </h2>
            <BUTables table={data.table} />
          </div>
        )}

        {/* Chairman Insights */}
        <div>
          <h2 className="text-[14px] font-bold text-slate-400 uppercase tracking-widest mb-4">
            Chairman Insights
          </h2>
          <BUInsights insights={data.insights} />
        </div>

      </main>

      <footer className="w-full mt-8 py-4 px-5 sm:px-8 border-t border-slate-200 bg-white">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
            Executive Governance Platform · Strictly Confidential
          </span>
          <span className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} SRM Group of Institutions
          </span>
        </div>
      </footer>
    </div>
  );
}
