import React from 'react';
import { PerformanceStatus } from '@/lib/types/common';
import { getStatusColorClass, getStatusLabel } from '@/lib/utils/status';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: PerformanceStatus;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  showDot = true,
  className,
}) => {
  const colors = getStatusColorClass(status);
  const displayLabel = label ?? getStatusLabel(status);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }[size];

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }[size];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border tracking-wide transition-colors',
        colors.badge,
        sizeClasses,
        className
      )}
      role="status"
      aria-label={`Performance status: ${displayLabel}`}
    >
      {showDot && (
        <span
          className={cn('rounded-full shrink-0 animate-pulse', dotSizes, colors.dot)}
          aria-hidden="true"
        />
      )}
      <span>{displayLabel}</span>
    </span>
  );
};
