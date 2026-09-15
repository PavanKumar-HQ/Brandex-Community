import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'card';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text'
}) => {
  const baseClasses = 'animate-pulse bg-slate-200/80 dark:bg-slate-800/80';

  let variantClasses = 'rounded-md';
  if (variant === 'circular') {
    variantClasses = 'rounded-full';
  } else if (variant === 'card') {
    variantClasses = 'rounded-2xl';
  }

  return (
    <div
      aria-hidden="true"
      className={`${baseClasses} ${variantClasses} ${className}`}
    />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50 space-y-4 animate-pulse ${className}`}>
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-32 rounded-lg" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
    <Skeleton className="h-4 w-3/4 rounded" />
    <Skeleton className="h-4 w-1/2 rounded" />
    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
      <Skeleton className="h-4 w-24 rounded" />
      <Skeleton className="h-8 w-28 rounded-xl" />
    </div>
  </div>
);
