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
    <div className="relative bg-indigo-50/50 border border-indigo-100 rounded-3xl overflow-hidden mb-3 sm:mb-4 shadow-sm">
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

        {/* Right Decorative Element */}
        <div className="hidden lg:flex lg:col-span-4 items-center justify-end relative">
          <div className="w-full max-w-[240px] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative group">
            {/* Window header */}
            <div className="bg-slate-50 border-b border-slate-200 px-2.5 py-1 flex items-center gap-1.5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono font-medium ml-2 uppercase">{widgetTitle}</div>
            </div>
            
            {/* Content body */}
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="space-y-0.5">
                  <div className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider">{widgetStatLabel}</div>
                  <div className="text-lg font-display font-bold text-slate-900">{widgetStatValue}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider">{widgetStatusLabel}</div>
                <div className="flex items-center gap-1 text-[10px] text-slate-700 font-mono bg-slate-50 p-1 rounded">
                  <span className="text-emerald-500 text-[8px]">●</span> {widgetStatusText}
                </div>
              </div>
            </div>
            
            {/* Decorative background glow */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
