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
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white text-[#0f142e] transition-opacity duration-300">
      {/* Brandex Logo Mark */}
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <img
          src="/brandex-logo.webp"
          alt="Brandex"
          className="h-20 w-auto object-contain"
        />
        
        <div className="text-center font-mono text-xs tracking-widest text-[#475569] uppercase font-semibold">
          Technology · Education · Community
        </div>

        {/* Minimal Progress Line */}
        <div className="w-48 h-[3px] bg-[#e2e8f0] relative overflow-hidden mt-4">
          <div
            className="absolute top-0 left-0 h-full bg-[#0f142e] transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="font-mono text-[10px] text-[#64748b] tracking-widest font-bold">
          {progress}%
        </span>
      </div>
    </div>
  );
};
