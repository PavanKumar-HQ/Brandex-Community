import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SectionHeadingProps {
  number?: string;
  tag?: string;
  title: string;
  subtitle?: string;
  actionText?: string;
  actionPath?: string;
  onActionClick?: () => void;
  asButton?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  number,
  tag,
  title,
  subtitle,
  actionText,
  actionPath,
  onActionClick,
  asButton = false,
  className = '',
}) => {
  const linkClasses = asButton
    ? "inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm group"
    : "inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline group";

  return (
    <div className={`mb-8 sm:mb-10 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          {tag && (
            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wider">
              {tag}
            </span>
          )}
          
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            {title}
          </h2>

          {subtitle && (
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actionText && (
          <div className="shrink-0">
            {actionPath ? (
              <NavLink to={actionPath} className={linkClasses}>
                <span>{actionText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </NavLink>
            ) : (
              <button onClick={onActionClick} className={linkClasses}>
                <span>{actionText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
