import React from 'react';

export interface PageHeroProps {
  tag: string;
  title: string;
  description: string;
  /** Optional background gradient preset for uniqueness per page */
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  tag,
  title,
  description,
}) => {
  return (
    <div className="relative bg-indigo-50/50 border border-indigo-100 rounded-3xl overflow-hidden mb-8 sm:mb-12 shadow-sm">
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

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-14">
        {/* Left Content */}
        <div className="lg:col-span-8 space-y-6">
          <span className="inline-block px-3 py-1 bg-white text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wider shadow-sm border border-indigo-100">
            {tag}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 tracking-tight leading-[1.1]">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>

        {/* Right Decorative Element */}
        <div className="hidden lg:flex lg:col-span-4 items-center justify-end relative">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative group">
            {/* Window header */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono font-medium ml-2 uppercase">Brandex.Network</div>
            </div>
            
            {/* Content body */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Active Members</div>
                  <div className="text-2xl font-display font-bold text-slate-900">1,204</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">System Status</div>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-mono bg-slate-50 p-2 rounded">
                  <span className="text-emerald-500">●</span> All systems operational
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
