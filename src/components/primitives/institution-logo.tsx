'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getInstitutionIdentity } from '@/data/mock/institution-identities';
import { cn } from '@/lib/utils';

export type InstitutionLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface InstitutionLogoProps {
  institutionIdOrCode: string;
  name?: string;
  size?: InstitutionLogoSize;
  className?: string;
  shape?: 'rounded' | 'square' | 'circle';
  showInitialsOnly?: boolean;
}

const SIZE_CONFIG: Record<
  InstitutionLogoSize,
  {
    containerSize: string;
    imagePx: number;
    textSize: string;
    badgePadding: string;
  }
> = {
  xs: {
    containerSize: 'w-5 h-5 min-w-5',
    imagePx: 20,
    textSize: 'text-[9px] font-bold tracking-tighter',
    badgePadding: 'p-0.5',
  },
  sm: {
    containerSize: 'w-7 h-7 min-w-7',
    imagePx: 28,
    textSize: 'text-[10px] font-extrabold tracking-tight',
    badgePadding: 'p-0.5',
  },
  md: {
    containerSize: 'w-9 h-9 min-w-9',
    imagePx: 36,
    textSize: 'text-xs font-black tracking-tight',
    badgePadding: 'p-1',
  },
  lg: {
    containerSize: 'w-12 h-12 min-w-12',
    imagePx: 48,
    textSize: 'text-sm font-black tracking-tight',
    badgePadding: 'p-1.5',
  },
  xl: {
    containerSize: 'w-16 h-16 min-w-16',
    imagePx: 64,
    textSize: 'text-base font-black tracking-tight',
    badgePadding: 'p-2',
  },
};

export const InstitutionLogo: React.FC<InstitutionLogoProps> = ({
  institutionIdOrCode,
  name,
  size = 'md',
  className,
  shape = 'rounded',
  showInitialsOnly = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const identity = getInstitutionIdentity(institutionIdOrCode);

  const config = SIZE_CONFIG[size];
  const initials = identity?.fallbackInitials || identity?.code || institutionIdOrCode.slice(0, 4).toUpperCase();
  const displayName = name || identity?.shortName || identity?.officialName || institutionIdOrCode;

  const shapeClass =
    shape === 'circle'
      ? 'rounded-full'
      : shape === 'square'
      ? 'rounded-none'
      : size === 'xl' || size === 'lg'
      ? 'rounded-lg'
      : 'rounded-md';

  // If user requested initials only or image is missing/errored -> intentional professional fallback
  const hasLogoUrl = Boolean(identity?.logoUrl) && !imageError && !showInitialsOnly;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center select-none shrink-0 overflow-hidden border transition-all',
        config.containerSize,
        shapeClass,
        hasLogoUrl
          ? 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 p-0.5'
          : 'bg-blue-900 dark:bg-blue-950 text-white border-blue-950/80 dark:border-blue-800 shadow-2xs',
        className
      )}
      title={displayName}
      aria-label={`Logo of ${displayName}`}
    >
      {hasLogoUrl && identity?.logoUrl ? (
        <Image
          src={identity.logoUrl}
          alt={`${displayName} logo`}
          width={config.imagePx}
          height={config.imagePx}
          className="object-contain w-full h-full"
          onError={() => setImageError(true)}
          unoptimized
        />
      ) : (
        <span
          className={cn(
            'font-mono uppercase leading-none text-center px-0.5 select-none font-bold text-white',
            config.textSize
          )}
        >
          {initials}
        </span>
      )}
    </div>
  );
};
