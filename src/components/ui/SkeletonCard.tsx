import React from 'react';

interface SkeletonCardProps {
  count?: number;
  type?: 'card' | 'row' | 'stat';
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ count = 3, type = 'card', className = '' }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-slate-50 border border-slate-200/80 rounded-2xl p-6 animate-pulse space-y-4 ${className}`}
        >
          {type === 'card' && (
            <>
              <div className="w-full h-40 bg-slate-200/80 rounded-xl" />
              <div className="h-4 w-1/4 bg-slate-200/80 rounded" />
              <div className="h-6 w-3/4 bg-slate-200/80 rounded" />
              <div className="space-y-2">
                <div className="h-3 w-full bg-slate-200/60 rounded" />
                <div className="h-3 w-5/6 bg-slate-200/60 rounded" />
              </div>
              <div className="pt-2 flex justify-between">
                <div className="h-4 w-20 bg-slate-200/80 rounded" />
                <div className="h-8 w-24 bg-slate-200/80 rounded-lg" />
              </div>
            </>
          )}

          {type === 'row' && (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-slate-200/80 rounded-xl shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-slate-200/80 rounded" />
                  <div className="h-3 w-2/3 bg-slate-200/60 rounded" />
                </div>
              </div>
              <div className="h-8 w-20 bg-slate-200/80 rounded-lg" />
            </div>
          )}

          {type === 'stat' && (
            <div className="space-y-2">
              <div className="h-8 w-16 bg-slate-200/80 rounded" />
              <div className="h-4 w-24 bg-slate-200/60 rounded" />
            </div>
          )}
        </div>
      ))}
    </>
  );
};
