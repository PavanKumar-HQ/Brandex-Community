import React from 'react';
import { Layers } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nothing scheduled yet.',
  description = "We're preparing the next Brandex session. Check back soon.",
  actionText,
  onAction,
}) => {
  return (
    <div className="border border-slate-200 rounded-2xl p-10 text-center bg-slate-50 my-8 space-y-4 max-w-xl mx-auto">
      <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm mx-auto flex items-center justify-center text-indigo-600">
        <Layers className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="font-display font-bold text-lg text-slate-900">
          {title}
        </h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {actionText && onAction && (
        <div className="pt-2">
          <button
            onClick={onAction}
            className="border border-slate-300 bg-white px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};
