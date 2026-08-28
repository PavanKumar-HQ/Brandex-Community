import React from 'react';
import { NavLink } from 'react-router-dom';
import { Play, FileText, Image as ImageIcon, Radio, Eye } from 'lucide-react';
import { Media } from '../../models/types';
import { MediaPlaceholderCard } from '../ui/MediaPlaceholders';

interface MediaCardProps {
  media: Media;
  onPlayClick?: (media: Media) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ media, onPlayClick }) => {
  const cardType = media.type === 'photo' ? 'image' : (media.type as any);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between group hover:border-indigo-300 hover:shadow-lg transition-all duration-200">
      {/* Top Visual Thumbnail */}
      <div className="relative">
        <MediaPlaceholderCard
          type={cardType}
          src={media.thumbnail}
          title={media.title}
          category={media.category}
          aspectRatio="video"
          onPlayClick={() => onPlayClick && onPlayClick(media)}
        />

        {media.duration && (
          <span className="absolute bottom-3 right-3 text-[10px] bg-slate-900/90 text-white px-2 py-0.5 rounded font-semibold">
            {media.duration}
          </span>
        )}
      </div>

      {/* Meta Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="text-indigo-600 font-semibold">
              {media.category}
            </span>
            <span>{media.publishedAt}</span>
          </div>

          <button
            onClick={() => onPlayClick && onPlayClick(media)}
            className="block text-left w-full group-hover:text-indigo-600 transition-colors"
          >
            <h3 className="font-display font-bold text-base text-slate-900 leading-snug line-clamp-2">
              {media.title}
            </h3>
          </button>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {media.shortDescription}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5 text-slate-700">
            {media.type === 'video' && <Play className="w-3.5 h-3.5 text-indigo-600 fill-current" />}
            {(media.type === 'photo' || media.type === 'article') && <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />}
            {media.type === 'recording' && <Radio className="w-3.5 h-3.5 text-indigo-600" />}
            <span className="capitalize font-semibold">{media.type}</span>
          </div>

          {media.viewsCount && (
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {media.viewsCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
