import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const PageLoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setVisible(false);
            if (onComplete) onComplete();
          }, 200);
          return 100;
        }
        return prev + 25;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-opacity duration-300">
      <div className="flex flex-col items-center gap-6 animate-fade-in max-w-xs w-full px-6">
        {/* Brandex Logo with Precision Orbital Ring */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Ambient Glow */}
          <div className="absolute inset-0 rounded-full bg-indigo-500/10 dark:bg-indigo-500/25 blur-xl animate-pulse" />
          
          {/* Outer Precision Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-indigo-600/20 dark:border-indigo-400/20 border-t-indigo-600 dark:border-t-indigo-400 animate-spin [animation-duration:1.6s]" />
          
          {/* Counter Orbit Ring */}
          <div className="absolute inset-2.5 rounded-full border border-dashed border-slate-300 dark:border-slate-700 border-r-indigo-500 animate-spin [animation-direction:reverse] [animation-duration:3.2s]" />

          {/* Logo Container */}
          <div className="relative z-10 w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl p-2.5 flex items-center justify-center shadow-lg border border-slate-200/80 dark:border-slate-800">
            <img
              src="/brandex-logo.webp"
              alt="Brandex"
              className="w-full h-full object-contain animate-pulse"
            />
          </div>
        </div>

        {/* Brand Identity & Tagline */}
        <div className="text-center space-y-1">
          <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white tracking-tight">
            Brandex
          </h2>
          <div className="font-mono text-[11px] tracking-widest text-slate-500 dark:text-slate-400 uppercase font-semibold">
            Technology · Education · Community
          </div>
        </div>

        {/* Minimal High-Precision Progress Line */}
        <div className="w-full h-[3px] bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden mt-1">
          <div
            className="absolute top-0 left-0 h-full bg-indigo-600 dark:bg-indigo-400 rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-full font-mono text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
          <span>Loading ecosystem...</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
