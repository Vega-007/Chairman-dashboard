import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { KpiData } from '@/data/mock/business-units.mock';
import { cn } from '@/lib/utils';

interface BUKPIsProps {
  kpis: KpiData[];
}

export const BUKPIs: React.FC<BUKPIsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {kpis.map((kpi, idx) => (
        <div 
          key={idx}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-1"
        >
          <span className="text-[13px] font-semibold text-slate-500">
            {kpi.label}
          </span>
          <div className="flex items-end gap-3 mt-1">
            <span className="text-2xl font-bold text-slate-900 leading-none">
              {kpi.value}
            </span>
            {kpi.trend && (
              <span 
                className={cn(
                  "flex items-center gap-0.5 text-[12px] font-bold pb-0.5",
                  kpi.trendUp ? "text-emerald-500" : "text-rose-500"
                )}
              >
                {kpi.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.trend}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
