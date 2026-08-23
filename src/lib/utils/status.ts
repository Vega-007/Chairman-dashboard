import { PerformanceStatus, ThresholdConfig } from '../types/common';

export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  green: 90,
  orange: 70,
};

export interface StatusComputationResult {
  achievementPercentage: number;
  status: PerformanceStatus;
  gap: number;
  isPositiveGap: boolean;
}

/**
 * Deterministic status computation based on Target, Actual, and Thresholds.
 * GREEN: >= green threshold (default 90%)
 * ORANGE: >= orange threshold and < green threshold (default 70% to 89.9%)
 * RED: < orange threshold (default < 70%)
 */
export function computePerformanceStatus(
  actual: number,
  target: number,
  thresholds: ThresholdConfig = DEFAULT_THRESHOLDS
): StatusComputationResult {
  if (target <= 0) {
    return {
      achievementPercentage: 0,
      status: 'RED',
      gap: 0,
      isPositiveGap: false,
    };
  }

  const achievementPercentage = Math.round((actual / target) * 1000) / 10;
  const gap = actual - target;
  const isPositiveGap = gap >= 0;

  let status: PerformanceStatus = 'RED';
  if (achievementPercentage >= thresholds.green) {
    status = 'GREEN';
  } else if (achievementPercentage >= thresholds.orange) {
    status = 'ORANGE';
  } else {
    status = 'RED';
  }

  return {
    achievementPercentage,
    status,
    gap,
    isPositiveGap,
  };
}

export function getStatusColorClass(status: PerformanceStatus) {
  switch (status) {
    case 'GREEN':
      return {
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
        dot: 'bg-emerald-600 dark:bg-emerald-400',
        bar: 'bg-emerald-600 dark:bg-emerald-500',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
        bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      };
    case 'ORANGE':
      return {
        badge: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
        dot: 'bg-amber-500 dark:bg-amber-400',
        bar: 'bg-amber-500 dark:bg-amber-400',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        bg: 'bg-amber-50/50 dark:bg-amber-950/20',
      };
    case 'RED':
      return {
        badge: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
        dot: 'bg-rose-600 dark:bg-rose-400',
        bar: 'bg-rose-600 dark:bg-rose-500',
        text: 'text-rose-700 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-800',
        bg: 'bg-rose-50/50 dark:bg-rose-950/20',
      };
  }
}

export function getStatusLabel(status: PerformanceStatus): string {
  switch (status) {
    case 'GREEN':
      return 'Achieved';
    case 'ORANGE':
      return 'Needs Improvement';
    case 'RED':
      return 'Action Required';
  }
}
