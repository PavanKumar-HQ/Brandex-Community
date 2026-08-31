import React from 'react';

export interface PageHeroProps {
  tag: string;
  title: string;
  description: string;
  /** Optional background gradient preset for uniqueness per page */
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
  /** Optional right widget properties */
  widgetTitle?: string;
  widgetStatLabel?: string;
  widgetStatValue?: string;
  widgetStatusLabel?: string;
  widgetStatusText?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  tag,
  title,
  description,
  widgetTitle = "Brandex.Network",
  widgetStatLabel = "Active Members",
  widgetStatValue = "1,204",
  widgetStatusLabel = "System Status",
  widgetStatusText = "All systems operational",
}) => {
  return (
    <div className="relative bg-indigo-50/50 border border-indigo-100 rounded-2xl overflow-hidden mb-3 sm:mb-4 shadow-sm">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3"></div>
        
        {/* Subtle grid */}
        <div 
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 sm:p-6">
        {/* Left Content */}
        <div className="lg:col-span-8 space-y-2 sm:space-y-3">
          <span className="inline-block px-2 py-0.5 bg-white text-indigo-600 text-[9px] font-bold rounded-full uppercase tracking-wider shadow-sm border border-indigo-100">
            {tag}
          </span>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-slate-900 tracking-tight leading-[1.15]">
            {title}
          </h1>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>

        {/* Right Decorative Element: Logo */}
        <div className="hidden lg:flex lg:col-span-4 items-center justify-end relative">
          <div className="relative px-6 py-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-indigo-100 flex items-center justify-center">
            <img src="/brandex-full-logo.webp" alt="Brandex Logo" className="h-10 w-auto object-contain drop-shadow-xs" />
          </div>
        </div>
      </div>
    </div>
  );
};
