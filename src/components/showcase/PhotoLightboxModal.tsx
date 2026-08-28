import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Tag } from 'lucide-react';
import { Photo } from '../../models/types';

interface PhotoLightboxModalProps {
  photos: Photo[];
  currentIndex: number | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || currentIndex === null) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        const prev = (currentIndex - 1 + photos.length) % photos.length;
        onNavigate(prev);
      }
      if (e.key === 'ArrowRight') {
        const next = (currentIndex + 1) % photos.length;
        onNavigate(next);
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
  }, [isOpen, currentIndex, photos, onClose, onNavigate]);

  if (!isOpen || currentIndex === null || !photos[currentIndex]) return null;

  const currentPhoto = photos[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prev = (currentIndex - 1 + photos.length) % photos.length;
    onNavigate(prev);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = (currentIndex + 1) % photos.length;
    onNavigate(next);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-5xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-600 rounded">
              {currentIndex + 1} / {photos.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {currentPhoto.category}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Lightbox"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Image Stage */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden p-4 min-h-[300px] sm:min-h-[450px]">
          <img
            src={currentPhoto.image}
            alt={currentPhoto.altText || currentPhoto.caption}
            className="max-h-[70vh] w-auto max-w-full object-contain select-none"
            loading="lazy"
          />

          {/* Controls */}
          <button
            onClick={handlePrev}
            aria-label="Previous Photo"
            className="absolute left-4 p-3 bg-slate-900/80 text-white rounded-full hover:bg-indigo-600 transition-colors shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next Photo"
            className="absolute right-4 p-3 bg-slate-900/80 text-white rounded-full hover:bg-indigo-600 transition-colors shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Caption & Metadata Footer */}
        <div className="p-5 bg-slate-900 border-t border-slate-800 text-white space-y-2">
          <p className="font-display font-semibold text-base sm:text-lg text-slate-100">
            {currentPhoto.caption}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              {currentPhoto.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              {currentPhoto.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
