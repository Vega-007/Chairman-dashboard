'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { LayoutGrid, GraduationCap, Building2, Crown } from 'lucide-react';

export const ChairmanHeader: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }));
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-[#06091A] text-white relative overflow-hidden">
      {/* Top golden accent line */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 35%, #f59e0b 65%, #1e3a8a 100%)' }} />

      {/* Subtle dot matrix background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Left ambient glow */}
      <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }} />
      {/* Right ambient glow */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)' }} />

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="flex items-center h-[78px] gap-0">

          {/* SRM Logo Box */}
          <div className="flex items-center shrink-0 mr-6">
            <div className="flex items-center justify-center bg-white rounded-lg px-3 py-1.5" style={{ minWidth: 130 }}>
              <Image
                src="/Final-Logo.png"
                alt="SRM Group of Institutions"
                width={150}
                height={40}
                style={{ width: 'auto', height: '34px', objectFit: 'contain' }}
                priority
              />
            </div>
          </div>

          {/* Divider */}
          <div className="h-10 w-px bg-white/10 mr-6 shrink-0" />

          {/* Title + Subtitle */}
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-blue-400/80 truncate">
                Executive Governance Platform
              </span>
            </div>
            <h1 className="text-[18px] font-bold tracking-tight text-white leading-none">
              Chairman{' '}
              <span className="text-slate-400 font-normal">—</span>{' '}
              <span className="text-slate-200 font-semibold">Institutional Command Center</span>
            </h1>
          </div>

          {/* Right: Stats Badges */}
          <div className="hidden lg:flex items-center gap-3 ml-6 shrink-0">
            <StatBadge icon={<LayoutGrid className="w-3.5 h-3.5" />} value="13" label="Portals" color="blue" />
            <StatBadge icon={<GraduationCap className="w-3.5 h-3.5" />} value="6" label="Academic" color="indigo" />
            <StatBadge icon={<Building2 className="w-3.5 h-3.5" />} value="7" label="Business" color="amber" />
          </div>

          {/* Right: Chairman Badge */}
          <div className="hidden md:flex items-center gap-2.5 ml-4 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-2 shrink-0">
            <Crown className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-amber-300 leading-none">Chairman</span>
              <span className="text-[10px] text-amber-500/70 leading-none mt-0.5">SRM Group</span>
            </div>
          </div>

        </div>

        {/* Bottom meta strip */}
        {currentTime && (
          <div className="flex items-center gap-1.5 pb-2 -mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-slate-500 font-medium">
              Live · Last updated {currentTime}
            </span>
          </div>
        )}
      </div>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/[0.06]" />
    </header>
  );
};

interface StatBadgeProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: 'blue' | 'indigo' | 'amber';
}

const StatBadge: React.FC<StatBadgeProps> = ({ icon, value, label, color }) => {
  const colorMap = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
    indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
  };
  return (
    <div className={`flex items-center gap-1.5 border rounded-md px-3 py-1.5 ${colorMap[color]}`}>
      {icon}
      <span className="text-[13px] font-bold leading-none">{value}</span>
      <span className="text-[10px] font-medium text-slate-400 leading-none">{label}</span>
    </div>
  );
};
