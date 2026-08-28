import React from 'react';

interface MarqueeProps {
  items: string[];
  reverse?: boolean;
  speed?: 'normal' | 'fast' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
  itemClassName?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({
  items,
  reverse = false,
  speed = 'normal',
  pauseOnHover = true,
  className = '',
  itemClassName = '',
}) => {
  const duplicatedItems = [...items, ...items, ...items, ...items];
  const animationClass = reverse ? 'animate-marquee-reverse' : 'animate-marquee';

  return (
    <div
      className={`relative w-full overflow-hidden bg-slate-50 border-y border-slate-200 py-3 ${className}`}
      aria-hidden="true"
    >
      <div
        className={`flex whitespace-nowrap gap-8 items-center ${animationClass} ${
          pauseOnHover ? 'hover:[animation-play-state:paused]' : ''
        }`}
      >
        {duplicatedItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-8 shrink-0">
            <span
              className={`text-xs font-semibold text-slate-600 flex items-center gap-2.5 tracking-wide uppercase ${itemClassName}`}
            >
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full inline-block" />
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
