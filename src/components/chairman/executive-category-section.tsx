import React from 'react';
import { DashboardPortal } from '@/data/mock/portals.mock';
import { ExecutivePortalCard } from './executive-portal-card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ExecutiveCategorySectionProps {
  title: string;
  subtitle: string;
  portals: DashboardPortal[];
  icon: LucideIcon;
  onToast: (message: string) => void;
  gridClass?: string;
  sectionTheme?: 'academic' | 'business';
}

export const ExecutiveCategorySection: React.FC<ExecutiveCategorySectionProps> = ({
  title,
  subtitle,
  portals,
  icon: Icon,
  onToast,
  gridClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  sectionTheme = 'academic',
}) => {
  const isAcademic = sectionTheme === 'academic';

  return (
    <section className="flex flex-col">
      {/* Section Banner */}
      <div
        className="rounded-2xl overflow-hidden mb-5 relative"
        style={{
          background: isAcademic
            ? 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #312e81 100%)'
            : 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
        }}
      >
        {/* Subtle texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative z-10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Icon Box */}
            <div
              className="flex items-center justify-center rounded-xl shrink-0"
              style={{
                width: 40,
                height: 40,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.18)',
              }}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>

            {/* Title + Subtitle */}
            <div>
              <h2 className="text-[16px] font-bold text-white tracking-tight leading-none mb-1">
                {title}
              </h2>
              <p className="text-[12px] leading-snug" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {subtitle}
              </p>
            </div>
          </div>

          {/* Portal count badge */}
          <div
            className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 shrink-0"
            style={{
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <span className="text-[13px] font-bold text-white">{portals.length}</span>
            <span className="text-[10px] font-medium text-white/60 uppercase tracking-widest">
              {isAcademic ? 'Systems' : 'Units'}
            </span>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="h-[2px]"
          style={{
            background: isAcademic
              ? 'linear-gradient(90deg, transparent, rgba(147,197,253,0.6), rgba(196,181,253,0.6), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(251,191,36,0.5), rgba(245,158,11,0.5), transparent)',
          }}
        />
      </div>

      {/* Grid of Portal Cards */}
      <div className={cn('grid gap-4', gridClass)}>
        {portals.map((portal) => (
          <ExecutivePortalCard
            key={portal.id}
            portal={portal}
            onToast={onToast}
            compact={!isAcademic}
          />
        ))}
      </div>
    </section>
  );
};
