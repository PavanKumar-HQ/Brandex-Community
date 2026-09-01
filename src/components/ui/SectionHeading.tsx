import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SectionHeadingProps {
  number?: string;
  tag?: string;
  title: string;
  subtitle?: string;
  description?: string;
  actionText?: string;
  actionPath?: string;
  onActionClick?: () => void;
  asButton?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  tag,
  title,
  subtitle,
  description,
  actionText,
  actionPath,
  onActionClick,
  className = '',
}) => {
  const linkClasses = "w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 border border-indigo-700 text-white hover:bg-indigo-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 group text-center";

  return (
    <div className={`mb-8 sm:mb-12 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          {tag && (
            <span className="inline-block px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-100/50 uppercase tracking-widest">
              {tag}
            </span>
          )}
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">
            {title}
          </h2>

          {(subtitle || description) && (
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              {subtitle || description}
            </p>
          )}
        </div>

        {actionText && (
          <div className="shrink-0 pt-2 sm:pt-0 w-full sm:w-auto">
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
