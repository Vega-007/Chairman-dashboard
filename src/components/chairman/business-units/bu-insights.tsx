import React from 'react';
import { AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { BusinessUnitMock } from '@/data/mock/business-units.mock';

interface BUInsightsProps {
  insights: BusinessUnitMock['insights'];
}

export const BUInsights: React.FC<BUInsightsProps> = ({ insights }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Key Observations */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-blue-500" />
          <h3 className="text-[14px] font-bold text-slate-800 uppercase tracking-wide">
            Key Observations
          </h3>
        </div>
        <ul className="space-y-3">
          {insights.observations.map((obs, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[13px] text-slate-700 leading-relaxed font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              {obs}
            </li>
          ))}
        </ul>
      </div>

      {/* Risks */}
      <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
          <h3 className="text-[14px] font-bold text-slate-800 uppercase tracking-wide">
            Identified Risks
          </h3>
        </div>
        <ul className="space-y-3">
          {insights.risks.map((risk, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[13px] text-slate-700 leading-relaxed font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              {risk}
            </li>
          ))}
        </ul>
      </div>

      {/* Opportunities */}
      <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-emerald-500" />
          <h3 className="text-[14px] font-bold text-slate-800 uppercase tracking-wide">
            Opportunities
          </h3>
        </div>
        <ul className="space-y-3">
          {insights.opportunities.map((opp, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[13px] text-slate-700 leading-relaxed font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              {opp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
