import React, { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Media } from '../../models/types';

interface VideoModalPlayerProps {
  media: Media | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModalPlayer: React.FC<VideoModalPlayerProps> = ({
  media,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !media) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl p-5 sm:p-6 text-slate-900 shadow-2xl space-y-4 border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {media.category} • {media.type.toUpperCase()}
            </span>
            <h3 id="video-modal-title" className="font-display font-bold text-lg sm:text-xl text-slate-900">
              {media.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            aria-label="Close video player"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-inner">
          {media.mediaUrl ? (
            <iframe
              src={media.mediaUrl}
              title={media.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-900 text-white">
              <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase">BRANDEX ARCHIVE</span>
              <p className="font-display font-bold text-lg max-w-md text-slate-100">
                {media.title}
              </p>
              <span className="text-xs text-indigo-400 font-semibold">
                [ User Controlled Stream Ready ]
              </span>
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-500 font-medium gap-2">
          <span>Published: {media.publishedAt} {media.duration && `• Duration: ${media.duration}`}</span>
          {media.mediaUrl && (
            <a
              href={media.mediaUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-semibold"
            >
              <span>Open External Stream</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
