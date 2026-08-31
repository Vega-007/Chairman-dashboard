'use client';

import React from 'react';
import { Monitor, Shield } from 'lucide-react';

export const ChairmanCommandCenter: React.FC = () => {
  return (
    <div className="w-full mb-8 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f1f3d 100%)' }}>
      {/* Inner layout */}
      <div className="relative px-7 py-6 md:py-7 flex flex-col md:flex-row md:items-center gap-6 md:gap-8">

        {/* Subtle inner grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Left: Icon + Description */}
        <div className="flex items-center gap-5 relative z-10 flex-1 min-w-0">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}>
            <Monitor className="w-6 h-6 text-blue-400" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold uppercase tracking-widest text-blue-300 mb-1.5">
              Institutional Analytic Dashboard
            </div>
            <p className="text-base text-slate-200 leading-snug">
              Unified access to institutional, academic and operational intelligence.
            </p>
          </div>
        </div>

        {/* Right: KPI Stats */}
        <div className="flex items-stretch gap-0 relative z-10 shrink-0 rounded-xl overflow-hidden border border-white/[0.06]">
          <KPIStat value="13" label="Integrated Portals" sublabel="Total" accent="#3b82f6" />
          <div className="w-px bg-white/[0.06]" />
          <KPIStat value="6" label="Academic Systems" sublabel="LIVE" accent="#818cf8" />
          <div className="w-px bg-white/[0.06]" />
          <KPIStat value="7" label="Business Units" sublabel="Pipeline" accent="#f59e0b" />
        </div>

        {/* Security badge */}
        <div className="hidden xl:flex items-center gap-2 relative z-10 shrink-0 rounded-lg px-3.5 py-2.5" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
          <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Secure Access</span>
        </div>

      </div>

      {/* Bottom strip */}
      <div className="h-[3px]" style={{ background: 'linear-gradient(90deg, #1d4ed8, #4f46e5, #0ea5e9, #f59e0b)' }} />
    </div>
  );
};

interface KPIStatProps {
  value: string;
  label: string;
  sublabel: string;
  accent: string;
}

const KPIStat: React.FC<KPIStatProps> = ({ value, label, sublabel, accent }) => (
  <div className="flex flex-col items-center justify-center px-5 py-3.5 gap-0.5" style={{ background: 'rgba(255,255,255,0.02)' }}>
    <span className="text-2xl font-bold leading-none" style={{ color: accent }}>{value}</span>
    <span className="text-[11px] font-semibold text-white/80 leading-none mt-1">{label}</span>
    <span className="text-[9px] font-medium uppercase tracking-widest leading-none mt-0.5" style={{ color: accent, opacity: 0.6 }}>{sublabel}</span>
  </div>
);
