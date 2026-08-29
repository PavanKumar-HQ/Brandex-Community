import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs text-slate-500 mb-6 flex-wrap gap-1.5 ${className}`}>
      <NavLink
        to="/"
        className="inline-flex items-center gap-1 hover:text-indigo-600 transition-colors font-medium text-slate-600"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </NavLink>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            {item.path && !isLast ? (
              <NavLink
                to={item.path}
                className="hover:text-indigo-600 transition-colors font-medium text-slate-600 truncate max-w-[200px]"
              >
                {item.label}
              </NavLink>
            ) : (
              <span className="font-semibold text-slate-900 truncate max-w-[240px]">
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
