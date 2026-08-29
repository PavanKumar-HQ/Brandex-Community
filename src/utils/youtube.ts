/**
 * Safely extracts YouTube Video ID from various URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
}

export function getYouTubeEmbedUrl(urlOrId?: string): string | null {
  if (!urlOrId) return null;
  const videoId = extractYouTubeId(urlOrId) || (urlOrId.length === 11 ? urlOrId : null);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0`;
}

export function getYouTubeThumbnailUrl(urlOrId?: string, quality: 'hqdefault' | 'maxresdefault' = 'hqdefault'): string {
  if (!urlOrId) return '/brandex-full-logo.webp';
  const videoId = extractYouTubeId(urlOrId) || (urlOrId.length === 11 ? urlOrId : null);
  if (!videoId) return '/brandex-full-logo.webp';
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}
