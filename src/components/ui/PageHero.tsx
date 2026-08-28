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
    <div className="relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden mb-8 sm:mb-12 shadow-lg">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3"></div>
        
        {/* Subtle grid */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-14">
        {/* Left Content */}
        <div className="lg:col-span-8 space-y-6">
          <span className="inline-block px-3 py-1 bg-white/10 text-indigo-300 text-xs font-semibold rounded-full uppercase tracking-wider backdrop-blur-sm border border-white/10">
            {tag}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-[1.1]">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>

        {/* Right Decorative Element */}
        <div className="hidden lg:flex lg:col-span-4 items-center justify-end relative">
          {/* Abstract floating shapes */}
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-blue-400 rounded-[2rem] rotate-12 opacity-80 mix-blend-screen animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-purple-500 to-indigo-400 rounded-full -rotate-6 opacity-80 mix-blend-screen shadow-2xl backdrop-blur-3xl"></div>
            <div className="absolute inset-0 bg-white/10 border border-white/20 rounded-2xl rotate-45 backdrop-blur-md flex items-center justify-center shadow-inner">
               <div className="w-16 h-16 rounded-full bg-white/20 animate-ping"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
