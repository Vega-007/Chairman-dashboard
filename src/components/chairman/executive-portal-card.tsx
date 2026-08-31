'use client';

import React from 'react';
import { ArrowUpRight, Clock } from 'lucide-react';
import { DashboardPortal, PortalAccent } from '@/data/mock/portals.mock';
import { cn } from '@/lib/utils';

interface ExecutivePortalCardProps {
  portal: DashboardPortal;
  onToast: (message: string) => void;
  compact?: boolean;
}

// Each accent defines the visual identity of the portal card
const ACCENT_MAP: Record<PortalAccent, {
  headerBg: string;
  headerBgDark: string;
  headerMuted: string;
  headerMutedDark: string;
  iconColor: string;
  badge: string;
  ctaBg: string;
  ctaText: string;
  glow: string;
  borderColor: string;
}> = {
  'royal-blue': {
    headerBg: '#1d4ed8',
    headerBgDark: '#1e3a8a',
    headerMuted: 'rgba(29,78,216,0.45)',
    headerMutedDark: 'rgba(30,58,138,0.6)',
    iconColor: '#fff',
    badge: 'rgba(255,255,255,0.18)',
    ctaBg: '#1d4ed8',
    ctaText: '#fff',
    glow: 'rgba(29,78,216,0.12)',
    borderColor: '#bfdbfe',
  },
  'violet': {
    headerBg: '#7c3aed',
    headerBgDark: '#5b21b6',
    headerMuted: 'rgba(124,58,237,0.45)',
    headerMutedDark: 'rgba(91,33,182,0.6)',
    iconColor: '#fff',
    badge: 'rgba(255,255,255,0.18)',
    ctaBg: '#7c3aed',
    ctaText: '#fff',
    glow: 'rgba(124,58,237,0.12)',
    borderColor: '#ddd6fe',
  },
  'amber': {
    headerBg: '#d97706',
    headerBgDark: '#92400e',
    headerMuted: 'rgba(217,119,6,0.45)',
    headerMutedDark: 'rgba(146,64,14,0.6)',
    iconColor: '#fff',
    badge: 'rgba(255,255,255,0.18)',
    ctaBg: '#d97706',
    ctaText: '#fff',
    glow: 'rgba(217,119,6,0.12)',
    borderColor: '#fde68a',
  },
  'indigo': {
    headerBg: '#4338ca',
    headerBgDark: '#312e81',
    headerMuted: 'rgba(67,56,202,0.45)',
    headerMutedDark: 'rgba(49,46,129,0.6)',
    iconColor: '#fff',
    badge: 'rgba(255,255,255,0.18)',
    ctaBg: '#4338ca',
    ctaText: '#fff',
    glow: 'rgba(67,56,202,0.12)',
    borderColor: '#c7d2fe',
  },
  'emerald': {
    headerBg: '#059669',
    headerBgDark: '#065f46',
    headerMuted: 'rgba(5,150,105,0.45)',
    headerMutedDark: 'rgba(6,95,70,0.6)',
    iconColor: '#fff',
    badge: 'rgba(255,255,255,0.18)',
    ctaBg: '#059669',
    ctaText: '#fff',
    glow: 'rgba(5,150,105,0.12)',
    borderColor: '#a7f3d0',
  },
  'teal': {
    headerBg: '#0891b2',
    headerBgDark: '#164e63',
    headerMuted: 'rgba(8,145,178,0.45)',
    headerMutedDark: 'rgba(22,78,99,0.6)',
    iconColor: '#fff',
    badge: 'rgba(255,255,255,0.18)',
    ctaBg: '#0891b2',
    ctaText: '#fff',
    glow: 'rgba(8,145,178,0.12)',
    borderColor: '#a5f3fc',
  },
  'orange': {
    headerBg: '#ea580c',
    headerBgDark: '#7c2d12',
    headerMuted: 'rgba(234,88,12,0.45)',
    headerMutedDark: 'rgba(124,45,18,0.6)',
    iconColor: '#fff',
    badge: 'rgba(255,255,255,0.18)',
    ctaBg: '#ea580c',
    ctaText: '#fff',
    glow: 'rgba(234,88,12,0.12)',
    borderColor: '#fed7aa',
  },
  'rose': {
    headerBg: '#e11d48',
    headerBgDark: '#881337',
    headerMuted: 'rgba(225,29,72,0.45)',
    headerMutedDark: 'rgba(136,19,55,0.6)',
    iconColor: '#fff',
    badge: 'rgba(255,255,255,0.18)',
    ctaBg: '#e11d48',
    ctaText: '#fff',
    glow: 'rgba(225,29,72,0.12)',
    borderColor: '#fecdd3',
  },
  'cyan': {
    headerBg: '#0284c7',
    headerBgDark: '#0c4a6e',
    headerMuted: 'rgba(2,132,199,0.45)',
    headerMutedDark: 'rgba(12,74,110,0.6)',
    iconColor: '#fff',
    badge: 'rgba(255,255,255,0.18)',
    ctaBg: '#0284c7',
    ctaText: '#fff',
    glow: 'rgba(2,132,199,0.12)',
    borderColor: '#bae6fd',
  },
  'slate': {
    headerBg: '#475569',
    headerBgDark: '#1e293b',
    headerMuted: 'rgba(71,85,105,0.45)',
    headerMutedDark: 'rgba(30,41,59,0.6)',
    iconColor: '#fff',
    badge: 'rgba(255,255,255,0.18)',
    ctaBg: '#475569',
    ctaText: '#fff',
    glow: 'rgba(71,85,105,0.12)',
    borderColor: '#cbd5e1',
  },
  'gold': {
    headerBg: '#b45309',
    headerBgDark: '#78350f',
    headerMuted: 'rgba(180,83,9,0.45)',
    headerMutedDark: 'rgba(120,53,15,0.6)',
    iconColor: '#fff',
    badge: 'rgba(255,255,255,0.18)',
    ctaBg: '#b45309',
    ctaText: '#fff',
    glow: 'rgba(180,83,9,0.12)',
    borderColor: '#fde68a',
  },
};

export const ExecutivePortalCard: React.FC<ExecutivePortalCardProps> = ({ portal, onToast, compact = false }) => {
  const Icon = portal.icon;
  const isLive = portal.status === 'LIVE';
  const accent = ACCENT_MAP[portal.accent] ?? ACCENT_MAP['slate'];

  const handleTriggerFeedback = () => {
    if (portal.category === 'BUSINESS_UNIT') {
      onToast('This dashboard will be integrated soon.');
    } else {
      onToast(`${portal.name} integration is coming soon.`);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    if (!isLive) {
      e.preventDefault();
      handleTriggerFeedback();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isLive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleTriggerFeedback();
    }
  };

  const CardInner = (
    <div className="flex flex-col h-full">
      {/* ====== COLORED HEADER AREA ====== */}
      <div
        className="relative overflow-hidden shrink-0"
        style={{
          background: `linear-gradient(135deg, ${accent.headerBg} 0%, ${accent.headerBgDark} 100%)`,
          padding: compact ? '14px 14px 12px' : '18px 18px 16px',
        }}
      >
        {/* Subtle dot pattern in header */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* Icon + Status row */}
        <div className="flex items-start justify-between relative z-10">
          {/* Icon box */}
          <div
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{
              width: compact ? 34 : 44,
              height: compact ? 34 : 44,
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.20)',
            }}
          >
            <Icon
              style={{
                width: compact ? 17 : 22,
                height: compact ? 17 : 22,
                color: 'rgba(255,255,255,0.9)',
              }}
            />
          </div>

          {/* Status Badge */}
          {isLive ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest shrink-0"
              style={{
                padding: '4px 10px',
                background: 'rgba(255,255,255,0.18)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              LIVE
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest shrink-0"
              style={{
                padding: '4px 8px',
                background: 'rgba(0,0,0,0.25)',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Clock className="w-2.5 h-2.5 shrink-0" />
              SOON
            </span>
          )}
        </div>

        {/* Portal name shown IN the header for bold identity */}
        <div className="relative z-10 mt-2.5">
          <h3
            className="font-bold leading-tight"
            style={{
              fontSize: compact ? '12px' : '15px',
              color: '#fff',
              letterSpacing: '-0.01em',
            }}
          >
            {portal.name}
          </h3>
        </div>
      </div>

      {/* ====== WHITE CONTENT AREA ====== */}
      <div className="flex flex-col flex-1 bg-white px-4 py-3.5">
        {/* Description */}
        <p className="text-[12.5px] font-semibold text-slate-700 leading-relaxed flex-1 line-clamp-2">
          {portal.description}
        </p>

        {/* CTA */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          {isLive ? (
            <div
              className="flex items-center justify-between w-full rounded-lg px-3 py-2 transition-all duration-150"
              style={{
                background: `${accent.glow}`,
                border: `1px solid ${accent.borderColor}`,
              }}
            >
              <span
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: accent.ctaBg }}
              >
                Open Dashboard
              </span>
              <ArrowUpRight
                className="w-3.5 h-3.5"
                style={{ color: accent.ctaBg, opacity: 0.9 }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Coming Soon
              </span>
              <Clock className="w-3 h-3 text-slate-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const wrapperClass = cn(
    'group flex flex-col h-full rounded-xl overflow-hidden border transition-all duration-200',
    isLive
      ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg'
      : 'cursor-default',
  );

  const wrapperStyle = {
    borderColor: isLive ? accent.borderColor : '#e2e8f0',
    boxShadow: isLive ? '0 4px 14px rgba(0,0,0,0.06)' : '0 1px 4px rgba(0,0,0,0.04)',
  };

  if (isLive && portal.url) {
    return (
      <a
        href={portal.url}
        target="_blank"
        rel="noopener noreferrer"
        className={wrapperClass}
        style={wrapperStyle}
        onClick={handleClick}
        aria-label={`Open ${portal.name} in a new tab`}
      >
        {CardInner}
      </a>
    );
  }

  return (
    <div
      className={wrapperClass}
      style={wrapperStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${portal.name} — Coming Soon`}
    >
      {CardInner}
    </div>
  );
};
