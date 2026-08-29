import { useSEO } from '../hooks/useSEO';
import React, { useEffect, useState } from 'react';
import { Play, Image as ImageIcon, Video, Filter, Maximize2 } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { MediaCard } from '../components/cards/MediaCard';
import { BackButton } from '../components/ui/BackButton';
import { VideoModalPlayer } from '../components/ui/VideoModalPlayer';
import { PhotoLightboxModal } from '../components/showcase/PhotoLightboxModal';
import { EmptyState } from '../components/ui/EmptyState';
import { getMediaItems, getPhotos, getVideos } from '../repositories/repository';
import { MediaItem, Photo, YouTubeVideo, Media } from '../models/types';

export const MediaPage: React.FC = () => {
  useSEO("Media & Photo Vault", "Explore recordings, photo archives, and video highlights from our circles and summits.");
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);

  // Modals state
  const [activeVideoMedia, setActiveVideoMedia] = useState<Media | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    async function loadMediaData() {
      const items = await getMediaItems(activeFilter);
      setMediaItems(items);

      const pList = await getPhotos();
      setPhotos(pList);

      const vList = await getVideos();
      setVideos(vList);
    }
    loadMediaData();
  }, [activeFilter]);

  const handleOpenVideo = (item: MediaItem) => {
    if (item.type === 'video') {
      const convertedMedia: Media = {
        id: item.id,
        institutionId: item.institutionId || 'inst-brandex-01',
        slug: item.slug,
        title: item.title,
        shortDescription: item.shortDescription,
        type: 'video',
        thumbnail: item.thumbnail,
        mediaUrl: item.mediaUrl,
        category: item.category,
        publishedAt: item.publishedAt,
        featured: item.featured,
        status: item.status
      };
      setActiveVideoMedia(convertedMedia);
      setIsVideoOpen(true);
    } else if (item.type === 'photo') {
      const photoIdx = photos.findIndex(p => p.image === item.thumbnail || p.id === item.id);
      if (photoIdx !== -1) {
        setLightboxIndex(photoIdx);
      } else {
        setLightboxIndex(0);
      }
      setIsLightboxOpen(true);
    }
  };

  const handleOpenPhotoLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setIsLightboxOpen(true);
  };

  const filters = ['ALL', 'PHOTOS', 'VIDEOS', 'ARTIFICIAL INTELLIGENCE', 'CYBERSECURITY', 'EDUCATION'];

  return (
    <div className="space-y-6 pb-16 pt-24 w-full px-4 sm:px-8 lg:px-12 xl:px-24 bg-white text-slate-900 font-sans">
      <BackButton />
      
      {/* Hero Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wider">
          Digital Showcase Archive
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 tracking-tight">
          Brandex Media & Photography Vault
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          High-resolution photo coverage from live workshops, school series, hackathons, and YouTube keynote recordings.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeFilter === f
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {mediaItems.length === 0 ? (
        <EmptyState
          title="No media entries found."
          description="Try selecting a different filter."
          actionText="Show All Media"
          onAction={() => setActiveFilter('ALL')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenVideo(item)}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden group cursor-pointer hover:border-indigo-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                <span className="absolute top-3 left-3 text-[10px] font-semibold bg-slate-900/90 text-white px-2 py-0.5 rounded uppercase">
                  {item.type}
                </span>

                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current translate-x-0.5" />
                    </div>
                  </div>
                )}

                {item.type === 'photo' && (
                  <div className="absolute bottom-3 right-3 p-2 rounded-full bg-slate-900/80 text-white group-hover:bg-indigo-600 transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="text-indigo-600 font-semibold">{item.category}</span>
                    <span>{item.publishedAt}</span>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  {item.shortDescription && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.shortDescription}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Visual Photo Gallery Section */}
      <section className="pt-8 border-t border-slate-200">
        <SectionHeading
          tag="PHOTO GALLERY"
          title="Event & Workshop Photography"
          subtitle="Real imagery captured during school workshops, technical summits, and wargames. Click to view in full lightbox."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => handleOpenPhotoLightbox(idx)}
              className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 group cursor-pointer border border-slate-200 shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={photo.image}
                alt={photo.altText}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity p-4 flex flex-col justify-end">
                <span className="text-[10px] text-indigo-300 font-semibold">{photo.category} • {photo.date}</span>
                <p className="font-display font-semibold text-xs text-white line-clamp-1">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Modal Player */}
      <VideoModalPlayer
        media={activeVideoMedia}
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />

      {/* Photo Lightbox Modal */}
      <PhotoLightboxModal
        photos={photos}
        currentIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />

    </div>
  );
};
