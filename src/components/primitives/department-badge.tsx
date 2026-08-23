'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface DepartmentBadgeProps {
  name: string;
  id?: string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

/**
 * Extracts clean, recognizable 2-4 letter department acronyms (e.g., CSE, ECE, MEC, CIV, IT, MBA, ARCH).
 */
export function getDepartmentAcronym(name: string, id?: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('computer science') || lower.includes('cse') || lower.includes('ai') || lower.includes('software')) return 'CSE';
  if (lower.includes('electronics') || lower.includes('ece') || lower.includes('communication')) return 'ECE';
  if (lower.includes('electrical') || lower.includes('eee')) return 'EEE';
  if (lower.includes('mechanical') || lower.includes('mech')) return 'MEC';
  if (lower.includes('civil') || lower.includes('infrastructure')) return 'CIV';
  if (lower.includes('information technology') || lower.includes('it')) return 'IT';
  if (lower.includes('biomedical') || lower.includes('biotech')) return 'BIO';
  if (lower.includes('chemical') || lower.includes('chemistry')) return 'CHE';
  if (lower.includes('physics')) return 'PHY';
  if (lower.includes('mathematics') || lower.includes('maths')) return 'MAT';
  if (lower.includes('english') || lower.includes('languages')) return 'ENG';
  if (lower.includes('management') || lower.includes('business') || lower.includes('mba') || lower.includes('bba')) return 'MBA';
  if (lower.includes('commerce') || lower.includes('accounting') || lower.includes('b.com')) return 'COM';
  if (lower.includes('architecture') || lower.includes('design') || lower.includes('interior') || lower.includes('b.arch')) return 'ARC';
  if (lower.includes('dental') || lower.includes('orthodontics') || lower.includes('prosthodontics')) return 'DNT';
  if (lower.includes('nursing') || lower.includes('clinical')) return 'NUR';
  if (lower.includes('pharmacy') || lower.includes('pharmacology')) return 'PHM';
  if (lower.includes('physiotherapy') || lower.includes('pt')) return 'PHY';
  if (lower.includes('occupational therapy') || lower.includes('ot')) return 'OTH';
  if (lower.includes('hotel') || lower.includes('catering') || lower.includes('hospitality')) return 'IHM';
  if (lower.includes('allied health') || lower.includes('paramedical')) return 'AHS';
  if (lower.includes('medicine') || lower.includes('general medicine') || lower.includes('surgery')) return 'MED';

  // Fallback: extract initials from words
  const words = name.split(/\s+/).filter((w) => w.length > 0 && !['of', '&', 'and', 'the', 'school', 'department'].includes(w.toLowerCase()));
  if (words.length >= 2) {
    return (words[0][0] + words[1][0] + (words[2] ? words[2][0] : '')).toUpperCase().slice(0, 3);
  }
  if (id) {
    const cleanId = id.replace(/^dept-/, '').replace(/-\d+$/, '');
    return cleanId.slice(0, 3).toUpperCase();
  }
  return name.slice(0, 3).toUpperCase();
}

export const DepartmentBadge: React.FC<DepartmentBadgeProps> = ({
  name,
  id,
  size = 'sm',
  className,
}) => {
  const acronym = getDepartmentAcronym(name, id);

  const sizeClasses = {
    xs: 'text-[9px] px-1 py-0.5 min-w-5 h-4.5',
    sm: 'text-[10px] px-1.5 py-0.5 min-w-6.5 h-5.5',
    md: 'text-xs px-2 py-1 min-w-8 h-7',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-mono font-bold uppercase rounded text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shrink-0 select-none shadow-2xs',
        sizeClasses[size],
        className
      )}
      title={`Department: ${name}`}
    >
      {acronym}
    </span>
  );
};
