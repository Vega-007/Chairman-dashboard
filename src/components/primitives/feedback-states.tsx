'use client';

import React from 'react';
import { SearchX, AlertCircle, RefreshCw, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  onReset?: () => void;
  resetLabel?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Records Found',
  description = 'There are currently no performance records or matching data points available for this selection.',
  icon,
  actionLabel,
  onAction,
  onReset,
  resetLabel = 'Reset All Filters',
  className,
}) => {
  const handleAction = onReset || onAction;
  const label = onReset ? resetLabel : actionLabel;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-lg border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-1">
        {icon || <SearchX className="w-6 h-6" />}
      </div>
      <div className="space-y-1 max-w-md mx-auto">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>
      {handleAction && (
        <div className="pt-2">
          <button
            type="button"
            onClick={handleAction}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export interface LoadingSkeletonProps {
  variant?: 'card' | 'stat' | 'table' | 'text' | 'header' | 'metric';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 3,
  className,
}) => {
  const items = Array.from({ length: count });

  if (variant === 'header') {
    return (
      <div className={cn('animate-pulse space-y-2 py-4', className)}>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2" />
      </div>
    );
  }

  if (variant === 'metric' || variant === 'stat') {
    return (
      <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-3', className)}>
        {items.map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 animate-pulse space-y-3"
          >
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
            <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn('bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 animate-pulse space-y-3', className)}>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-4" />
        {items.map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100 dark:border-slate-800/60">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded flex-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {items.map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 animate-pulse space-y-3"
        >
          <div className="flex justify-between">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6" />
          </div>
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-full" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while retrieving information. Please retry or contact technical support.',
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-6 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-center flex flex-col items-center justify-center',
        className
      )}
      role="alert"
    >
      <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-200 mb-1">
        {title}
      </h3>
      <p className="text-xs text-rose-700/80 dark:text-rose-400/80 max-w-sm mb-4">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      )}
    </div>
  );
};
