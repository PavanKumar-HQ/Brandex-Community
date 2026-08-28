import React from 'react';
import { Play, Image as ImageIcon, FileText } from 'lucide-react';

interface MediaPlaceholderProps {
  type?: 'video' | 'image' | 'article' | 'recording';
  title?: string;
  category?: string;
  src?: string;
  alt?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  onPlayClick?: () => void;
}

export const MediaPlaceholderCard: React.FC<MediaPlaceholderProps> = ({
  type = 'video',
  title = 'Brandex Session',
  category = 'Technology',
  src,
  alt,
  className = '',
  aspectRatio = 'video',
  onPlayClick,
}) => {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: 'h-auto',
  }[aspectRatio];

  if (src) {
    return (
      <div className={`relative overflow-hidden bg-slate-100 group ${aspectClasses} ${className}`}>
        <img
          src={src}
          alt={alt || title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {type === 'video' && (
          <button
            onClick={onPlayClick}
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform"
          >
            <div className="w-12 h-12 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-lg">
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            </div>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onPlayClick}
      className={`relative overflow-hidden bg-slate-900 text-white p-6 flex flex-col justify-between group cursor-pointer hover:opacity-95 transition-all ${aspectClasses} ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <img src="/brandex-icon.png" alt="Brandex" className="h-4 w-auto opacity-90" />
          <span className="text-[10px] tracking-wider text-slate-400 font-semibold uppercase">
            Brandex Archive
          </span>
        </div>
        
        <span className="text-[10px] uppercase text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded font-semibold border border-indigo-800/50">
          {category}
        </span>
      </div>

      <div className="my-auto py-4 flex flex-col items-center justify-center text-center space-y-3">
        {type === 'video' && (
          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 fill-current translate-x-0.5" />
          </div>
        )}
        {type === 'image' && (
          <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
        )}
        {type === 'article' && (
          <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        )}

        <h4 className="font-display font-semibold text-sm uppercase text-slate-100 group-hover:text-white line-clamp-2 max-w-xs">
          {title}
        </h4>
      </div>

      <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[10px] text-slate-400 font-medium">
        <span>SESSION RECORDING</span>
        <span className="text-indigo-400 font-semibold">PLAY ▶</span>
      </div>
    </div>
  );
};
