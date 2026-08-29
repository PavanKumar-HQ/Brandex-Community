import {
  Institution,
  Community,
  Event,
  Photo,
  YouTubeVideo,
  MediaItem,
  Media,
  Achievement,
  Story,
  Statistic,
  Announcement,
  TrainingProgram,
  Discussion,
  Workshop,
  Resource,
  Member,
  EventRegistration,
  AuditLog,
  Opportunity,
  Enquiry
} from '../models/types';
import {
  mockInstitution,
  mockStatistics,
  mockCommunities,
  mockEvents,
  mockPhotos,
  mockVideos,
  mockAchievements,
  mockStories,
  mockAnnouncements,
  mockTrainingPrograms,
  mockDiscussions,
  mockWorkshops,
  mockResources,
  mockMembers,
  mockOpportunities,
  mockEnquiries,
  defaultInstitutionId
} from '../data/mockData';
import { extractYouTubeId, getYouTubeThumbnailUrl } from '../utils/youtube';

// In-Memory Storage Layer
let institutionStore: Institution = { ...mockInstitution };
let statisticStore: Statistic[] = [...mockStatistics];
let communityStore: Community[] = [...mockCommunities];
let eventStore: Event[] = [...mockEvents];
let photoStore: Photo[] = [...mockPhotos];
let opportunityStore: Opportunity[] = [...mockOpportunities];
let enquiryStore: Enquiry[] = [...mockEnquiries];
let videoStore: YouTubeVideo[] = [...mockVideos];
let achievementStore: Achievement[] = [...mockAchievements];
let storyStore: Story[] = [...mockStories];
let announcementStore: Announcement[] = [...mockAnnouncements];
let trainingStore: TrainingProgram[] = [...mockTrainingPrograms];
let discussionStore: Discussion[] = [...mockDiscussions];
let workshopStore: Workshop[] = [...mockWorkshops];
let resourceStore: Resource[] = [...mockResources];
let memberStore: Member[] = [...mockMembers];
let registrationStore: EventRegistration[] = [];
let auditLogStore: AuditLog[] = [];

// Audit Helper
export async function logAuditAction(
  action: AuditLog['action'],
  entity: string,
  entityId: string,
  user: string = 'Admin Editor'
): Promise<AuditLog> {
  const log: AuditLog = {
    id: `audit-${Date.now()}`,
    institutionId: defaultInstitutionId,
    user,
    action,
    entity,
    entityId,
    timestamp: new Date().toISOString()
  };
  auditLogStore.unshift(log);
  return Promise.resolve(log);
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  return Promise.resolve([...auditLogStore]);
}

/* ==========================================
   INSTITUTION SHOWCASE
   ========================================== */

export async function getInstitution(slug: string = 'brandex'): Promise<Institution | null> {
  return Promise.resolve(institutionStore);
}

export async function updateInstitution(data: Partial<Institution>): Promise<Institution> {
  institutionStore = { ...institutionStore, ...data };
  await logAuditAction('update', 'institution', institutionStore.id);
  return Promise.resolve(institutionStore);
}

/* ==========================================
   STATISTICS
   ========================================== */

export async function getStatistics(): Promise<Statistic[]> {
  const visible = statisticStore.filter(s => s.visible).sort((a, b) => a.displayOrder - b.displayOrder);
  return Promise.resolve(visible);
}

export async function getAllStatisticsAdmin(): Promise<Statistic[]> {
  return Promise.resolve([...statisticStore]);
}

export async function updateStatistic(id: string, data: Partial<Statistic>): Promise<Statistic | null> {
  const idx = statisticStore.findIndex(s => s.id === id);
  if (idx === -1) return Promise.resolve(null);
  statisticStore[idx] = { ...statisticStore[idx], ...data };
  await logAuditAction('update', 'statistic', id);
  return Promise.resolve(statisticStore[idx]);
}

/* ==========================================
   COMMUNITIES
   ========================================== */

export async function getCommunities(category?: string): Promise<Community[]> {
  let list = communityStore.filter(c => c.status === 'published');
  if (category && category !== 'All') {
    list = list.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }
  return Promise.resolve(list.sort((a, b) => a.displayOrder - b.displayOrder));
}

export async function getCommunityCategories(category?: string): Promise<Community[]> {
  return getCommunities(category);
}

export async function getCommunityBySlug(slug: string): Promise<Community | null> {
  const found = communityStore.find(c => c.slug === slug);
  return Promise.resolve(found || null);
}

export async function getAllCommunitiesAdmin(): Promise<Community[]> {
  return Promise.resolve([...communityStore]);
}

export async function createCommunity(data: Partial<Community>): Promise<Community> {
  const newCommunity: Community = {
    id: `comm-${Date.now()}`,
    institutionId: defaultInstitutionId,
    name: data.name || 'Untitled Community',
    slug: data.slug || `comm-${Date.now()}`,
    description: data.description || '',
    shortDescription: data.shortDescription || '',
    category: data.category || 'Technology',
    activities: data.activities || [],
    featured: data.featured || false,
    displayOrder: communityStore.length + 1,
    status: data.status || 'draft',
  };
  communityStore.unshift(newCommunity);
  await logAuditAction('create', 'community', newCommunity.id);
  return Promise.resolve(newCommunity);
}

export async function updateCommunity(id: string, data: Partial<Community>): Promise<Community | null> {
  const idx = communityStore.findIndex(c => c.id === id);
  if (idx === -1) return Promise.resolve(null);
  communityStore[idx] = { ...communityStore[idx], ...data };
  await logAuditAction('update', 'community', id);
  return Promise.resolve(communityStore[idx]);
}

export async function archiveCommunity(id: string): Promise<boolean> {
  const item = communityStore.find(c => c.id === id);
  if (!item) return Promise.resolve(false);
  item.status = 'archived';
  await logAuditAction('archive', 'community', id);
  return Promise.resolve(true);
}

export async function deleteCommunity(id: string): Promise<boolean> {
  return archiveCommunity(id);
}

/* ==========================================
   EVENTS
   ========================================== */

export async function getEvents(filter?: 'upcoming' | 'past' | 'all'): Promise<Event[]> {
  let list = eventStore.filter(e => e.status === 'published');
  if (filter === 'upcoming') {
    list = list.filter(e => !e.isPast);
  } else if (filter === 'past') {
    list = list.filter(e => e.isPast);
  }
  return Promise.resolve(list.sort((a, b) => a.displayOrder - b.displayOrder));
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const found = eventStore.find(e => e.slug === slug);
  return Promise.resolve(found || null);
}

export async function getAllEventsAdmin(): Promise<Event[]> {
  return Promise.resolve([...eventStore]);
}

export async function createEvent(data: Partial<Event>): Promise<Event> {
  const ytId = extractYouTubeId(data.youtubeUrl);
  const newEvent: Event = {
    id: `evt-${Date.now()}`,
    institutionId: defaultInstitutionId,
    title: data.title || 'Untitled Event',
    slug: data.slug || `event-${Date.now()}`,
    shortDescription: data.shortDescription || '',
    description: data.description || '',
    coverImage: data.coverImage || '/brandex-full-logo.png',
    date: data.date || 'TBD',
    time: data.time || '10:00 AM',
    venue: data.venue || 'Brandex Hall',
    location: data.location || 'Main Campus',
    type: data.type || 'In-Person',
    category: data.category || 'Technology',
    speakers: data.speakers || [],
    registrationUrl: data.registrationUrl,
    gallery: data.gallery || [],
    youtubeUrl: data.youtubeUrl,
    youtubeId: ytId || undefined,
    featured: data.featured || false,
    displayOrder: eventStore.length + 1,
    status: data.status || 'draft',
    isPast: data.isPast || false
  };
  eventStore.unshift(newEvent);
  await logAuditAction('create', 'event', newEvent.id);
  return Promise.resolve(newEvent);
}

export async function updateEvent(id: string, data: Partial<Event>): Promise<Event | null> {
  const idx = eventStore.findIndex(e => e.id === id);
  if (idx === -1) return Promise.resolve(null);
  
  if (data.youtubeUrl) {
    data.youtubeId = extractYouTubeId(data.youtubeUrl) || undefined;
  }
  
  eventStore[idx] = { ...eventStore[idx], ...data };
  await logAuditAction('update', 'event', id);
  return Promise.resolve(eventStore[idx]);
}

export async function archiveEvent(id: string): Promise<boolean> {
  const item = eventStore.find(e => e.id === id);
  if (!item) return Promise.resolve(false);
  item.status = 'archived';
  await logAuditAction('archive', 'event', id);
  return Promise.resolve(true);
}

export async function deleteEvent(id: string): Promise<boolean> {
  return archiveEvent(id);
}

/* ==========================================
   PHOTOS GALLERY
   ========================================== */

export async function getPhotos(category?: string): Promise<Photo[]> {
  let list = photoStore.filter(p => p.status === 'published');
  if (category && category !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  return Promise.resolve(list.sort((a, b) => a.displayOrder - b.displayOrder));
}

export async function getAllPhotosAdmin(): Promise<Photo[]> {
  return Promise.resolve([...photoStore]);
}

export async function createPhoto(data: Partial<Photo>): Promise<Photo> {
  const newPhoto: Photo = {
    id: `pho-${Date.now()}`,
    institutionId: defaultInstitutionId,
    image: data.image || '/brandex-full-logo.png',
    caption: data.caption || '',
    altText: data.altText || 'Brandex Photo',
    category: data.category || 'Events',
    date: data.date || new Date().toISOString().split('T')[0],
    featured: data.featured || false,
    displayOrder: photoStore.length + 1,
    status: data.status || 'published'
  };
  photoStore.unshift(newPhoto);
  await logAuditAction('create', 'photo', newPhoto.id);
  return Promise.resolve(newPhoto);
}

export async function updatePhoto(id: string, data: Partial<Photo>): Promise<Photo | null> {
  const idx = photoStore.findIndex(p => p.id === id);
  if (idx === -1) return Promise.resolve(null);
  photoStore[idx] = { ...photoStore[idx], ...data };
  await logAuditAction('update', 'photo', id);
  return Promise.resolve(photoStore[idx]);
}

export async function archivePhoto(id: string): Promise<boolean> {
  const item = photoStore.find(p => p.id === id);
  if (!item) return Promise.resolve(false);
  item.status = 'archived';
  await logAuditAction('archive', 'photo', id);
  return Promise.resolve(true);
}

/* ==========================================
   YOUTUBE VIDEOS SYSTEM
   ========================================== */

export async function getVideos(category?: string): Promise<YouTubeVideo[]> {
  let list = videoStore.filter(v => v.status === 'published');
  if (category && category !== 'All') {
    list = list.filter(v => v.category.toLowerCase() === category.toLowerCase());
  }
  return Promise.resolve(list.sort((a, b) => a.displayOrder - b.displayOrder));
}

export async function getAllVideosAdmin(): Promise<YouTubeVideo[]> {
  return Promise.resolve([...videoStore]);
}

export async function createVideo(data: Partial<YouTubeVideo>): Promise<YouTubeVideo> {
  const ytId = extractYouTubeId(data.youtubeUrl) || 'dQw4w9WgXcQ';
  const thumb = getYouTubeThumbnailUrl(ytId);

  const newVideo: YouTubeVideo = {
    id: `vid-${Date.now()}`,
    institutionId: defaultInstitutionId,
    youtubeUrl: data.youtubeUrl || `https://www.youtube.com/watch?v=${ytId}`,
    youtubeId: ytId,
    title: data.title || 'Untitled Session Video',
    description: data.description || '',
    thumbnail: data.thumbnail || thumb,
    category: data.category || 'Technology',
    publishedDate: data.publishedDate || new Date().toISOString().split('T')[0],
    featured: data.featured || false,
    displayOrder: videoStore.length + 1,
    status: data.status || 'published'
  };
  videoStore.unshift(newVideo);
  await logAuditAction('create', 'video', newVideo.id);
  return Promise.resolve(newVideo);
}

export async function updateVideo(id: string, data: Partial<YouTubeVideo>): Promise<YouTubeVideo | null> {
  const idx = videoStore.findIndex(v => v.id === id);
  if (idx === -1) return Promise.resolve(null);
  
  if (data.youtubeUrl) {
    data.youtubeId = extractYouTubeId(data.youtubeUrl) || videoStore[idx].youtubeId;
    data.thumbnail = getYouTubeThumbnailUrl(data.youtubeId);
  }

  videoStore[idx] = { ...videoStore[idx], ...data };
  await logAuditAction('update', 'video', id);
  return Promise.resolve(videoStore[idx]);
}

export async function archiveVideo(id: string): Promise<boolean> {
  const item = videoStore.find(v => v.id === id);
  if (!item) return Promise.resolve(false);
  item.status = 'archived';
  await logAuditAction('archive', 'video', id);
  return Promise.resolve(true);
}

/* ==========================================
   MEDIA HUB
   ========================================== */

export async function getMediaItems(typeFilter?: string): Promise<MediaItem[]> {
  const publishedVideos = videoStore.filter(v => v.status === 'published').map(v => ({
    id: v.id,
    institutionId: v.institutionId,
    title: v.title,
    slug: v.id,
    shortDescription: v.description,
    type: 'video' as const,
    thumbnail: v.thumbnail,
    mediaUrl: v.youtubeUrl,
    youtubeId: v.youtubeId,
    category: v.category,
    eventId: v.eventId,
    publishedAt: v.publishedDate,
    featured: v.featured,
    status: v.status
  }));

  const publishedPhotos = photoStore.filter(p => p.status === 'published').map(p => ({
    id: p.id,
    institutionId: p.institutionId,
    title: p.caption || 'Event Photograph',
    slug: p.id,
    shortDescription: p.altText,
    type: 'photo' as const,
    thumbnail: p.image,
    mediaUrl: p.image,
    category: p.category,
    eventId: p.eventId,
    publishedAt: p.date,
    featured: p.featured,
    status: p.status
  }));

  let combined: MediaItem[] = [...publishedVideos, ...publishedPhotos];

  if (typeFilter && typeFilter !== 'All' && typeFilter !== 'ALL') {
    const filterLower = typeFilter.toLowerCase();
    if (filterLower === 'photos') combined = combined.filter(m => m.type === 'photo');
    else if (filterLower === 'videos') combined = combined.filter(m => m.type === 'video');
    else combined = combined.filter(m => m.category.toLowerCase() === filterLower);
  }

  return Promise.resolve(combined.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)));
}

export async function getMedia(category?: string): Promise<MediaItem[]> {
  return getMediaItems(category);
}

export async function getAllMediaAdmin(): Promise<MediaItem[]> {
  return getMediaItems('ALL');
}

export async function createMedia(data: Partial<MediaItem>): Promise<MediaItem> {
  const vid = await createVideo({
    title: data.title,
    youtubeUrl: data.mediaUrl,
    category: data.category,
    status: data.status
  });
  return {
    id: vid.id,
    institutionId: vid.institutionId,
    title: vid.title,
    slug: vid.id,
    shortDescription: vid.description,
    type: 'video',
    thumbnail: vid.thumbnail,
    mediaUrl: vid.youtubeUrl,
    youtubeId: vid.youtubeId,
    category: vid.category,
    publishedAt: vid.publishedDate,
    featured: vid.featured,
    status: vid.status
  };
}

export async function updateMedia(id: string, data: Partial<MediaItem>): Promise<MediaItem | null> {
  const vid = await updateVideo(id, { title: data.title, status: data.status });
  if (!vid) return null;
  return {
    id: vid.id,
    institutionId: vid.institutionId,
    title: vid.title,
    slug: vid.id,
    shortDescription: vid.description,
    type: 'video',
    thumbnail: vid.thumbnail,
    mediaUrl: vid.youtubeUrl,
    youtubeId: vid.youtubeId,
    category: vid.category,
    publishedAt: vid.publishedDate,
    featured: vid.featured,
    status: vid.status
  };
}

export async function deleteMedia(id: string): Promise<boolean> {
  return archiveVideo(id);
}

/* ==========================================
   ACHIEVEMENTS
   ========================================== */

export async function getAchievements(): Promise<Achievement[]> {
  const published = achievementStore.filter(a => a.status === 'published').sort((a, b) => a.displayOrder - b.displayOrder);
  return Promise.resolve(published);
}

export async function getAllAchievementsAdmin(): Promise<Achievement[]> {
  return Promise.resolve([...achievementStore]);
}

export async function createAchievement(data: Partial<Achievement>): Promise<Achievement> {
  const newAchievement: Achievement = {
    id: `ach-${Date.now()}`,
    institutionId: defaultInstitutionId,
    title: data.title || 'Untitled Achievement',
    description: data.description || '',
    date: data.date || new Date().toISOString().split('T')[0],
    category: data.category || 'Recognition',
    recipientName: data.recipientName || 'Brandex Team',
    externalUrl: data.externalUrl,
    featured: data.featured || false,
    displayOrder: achievementStore.length + 1,
    status: data.status || 'published'
  };
  achievementStore.unshift(newAchievement);
  await logAuditAction('create', 'achievement', newAchievement.id);
  return Promise.resolve(newAchievement);
}

export async function updateAchievement(id: string, data: Partial<Achievement>): Promise<Achievement | null> {
  const idx = achievementStore.findIndex(a => a.id === id);
  if (idx === -1) return Promise.resolve(null);
  achievementStore[idx] = { ...achievementStore[idx], ...data };
  await logAuditAction('update', 'achievement', id);
  return Promise.resolve(achievementStore[idx]);
}

export async function archiveAchievement(id: string): Promise<boolean> {
  const item = achievementStore.find(a => a.id === id);
  if (!item) return Promise.resolve(false);
  item.status = 'archived';
  await logAuditAction('archive', 'achievement', id);
  return Promise.resolve(true);
}

/* ==========================================
   STORIES
   ========================================== */

export async function getStories(): Promise<Story[]> {
  const published = storyStore.filter(s => s.status === 'published').sort((a, b) => a.displayOrder - b.displayOrder);
  return Promise.resolve(published);
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  const found = storyStore.find(s => s.slug === slug);
  return Promise.resolve(found || null);
}

export async function getAllStoriesAdmin(): Promise<Story[]> {
  return Promise.resolve([...storyStore]);
}

export async function createStory(data: Partial<Story>): Promise<Story> {
  const newStory: Story = {
    id: `sto-${Date.now()}`,
    institutionId: defaultInstitutionId,
    title: data.title || 'Untitled Story',
    slug: data.slug || `story-${Date.now()}`,
    excerpt: data.excerpt || '',
    content: data.content || '',
    coverImage: data.coverImage || '/brandex-full-logo.png',
    author: data.author || 'Brandex Team',
    date: data.date || new Date().toISOString().split('T')[0],
    category: data.category || 'Story',
    featured: data.featured || false,
    displayOrder: storyStore.length + 1,
    status: data.status || 'published'
  };
  storyStore.unshift(newStory);
  await logAuditAction('create', 'story', newStory.id);
  return Promise.resolve(newStory);
}

export async function updateStory(id: string, data: Partial<Story>): Promise<Story | null> {
  const idx = storyStore.findIndex(s => s.id === id);
  if (idx === -1) return Promise.resolve(null);
  storyStore[idx] = { ...storyStore[idx], ...data };
  await logAuditAction('update', 'story', id);
  return Promise.resolve(storyStore[idx]);
}

export async function archiveStory(id: string): Promise<boolean> {
  const item = storyStore.find(s => s.id === id);
  if (!item) return Promise.resolve(false);
  item.status = 'archived';
  await logAuditAction('archive', 'story', id);
  return Promise.resolve(true);
}

/* ==========================================
   ANNOUNCEMENTS
   ========================================== */

export async function getAnnouncements(): Promise<Announcement[]> {
  const published = announcementStore.filter(a => a.status === 'published');
  return Promise.resolve(published);
}

export async function getAllAnnouncementsAdmin(): Promise<Announcement[]> {
  return Promise.resolve([...announcementStore]);
}

export async function createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
  const newAnnouncement: Announcement = {
    id: `ann-${Date.now()}`,
    institutionId: defaultInstitutionId,
    title: data.title || 'Untitled Announcement',
    slug: data.slug || `ann-${Date.now()}`,
    summary: data.summary || '',
    content: data.content || '',
    publishedDate: data.publishedDate || new Date().toISOString().split('T')[0],
    category: data.category || 'General',
    important: data.important || false,
    featured: data.featured || false,
    status: data.status || 'published'
  };
  announcementStore.unshift(newAnnouncement);
  await logAuditAction('create', 'announcement', newAnnouncement.id);
  return Promise.resolve(newAnnouncement);
}

export async function updateAnnouncement(id: string, data: Partial<Announcement>): Promise<Announcement | null> {
  const idx = announcementStore.findIndex(a => a.id === id);
  if (idx === -1) return Promise.resolve(null);
  announcementStore[idx] = { ...announcementStore[idx], ...data };
  await logAuditAction('update', 'announcement', id);
  return Promise.resolve(announcementStore[idx]);
}

export async function archiveAnnouncement(id: string): Promise<boolean> {
  const item = announcementStore.find(a => a.id === id);
  if (!item) return Promise.resolve(false);
  item.status = 'archived';
  await logAuditAction('archive', 'announcement', id);
  return Promise.resolve(true);
}

/* ==========================================
   TRAINING SHOWCASE
   ========================================== */

export async function getTrainingPrograms(category?: string, level?: string): Promise<TrainingProgram[]> {
  let list = trainingStore.filter(t => t.status === 'published');
  if (category && category !== 'All') {
    list = list.filter(t => t.category.toLowerCase() === category.toLowerCase());
  }
  if (level && level !== 'All') {
    list = list.filter(t => t.level.toLowerCase() === level.toLowerCase());
  }
  return Promise.resolve(list);
}

export async function getTrainingProgramBySlug(slug: string): Promise<TrainingProgram | null> {
  const found = trainingStore.find(t => t.slug === slug);
  return Promise.resolve(found || null);
}

export async function getAllTrainingProgramsAdmin(): Promise<TrainingProgram[]> {
  return Promise.resolve([...trainingStore]);
}

export async function createTrainingProgram(data: Partial<TrainingProgram>): Promise<TrainingProgram> {
  const newProgram: TrainingProgram = {
    id: `tp-${Date.now()}`,
    institutionId: defaultInstitutionId,
    title: data.title || 'Untitled Training',
    slug: data.slug || `tp-${Date.now()}`,
    shortDescription: data.shortDescription || '',
    description: data.description || '',
    category: data.category || 'Technology',
    level: data.level || 'Beginner',
    duration: data.duration || '4 Weeks',
    instructor: data.instructor || 'Brandex Team',
    date: data.date || 'TBD',
    venue: data.venue || 'Main Campus',
    registrationUrl: data.registrationUrl || 'https://brandex.org/join',
    status: data.status || 'published',
    featured: data.featured || false
  };
  trainingStore.unshift(newProgram);
  await logAuditAction('create', 'training', newProgram.id);
  return Promise.resolve(newProgram);
}

export async function updateTrainingProgram(id: string, data: Partial<TrainingProgram>): Promise<TrainingProgram | null> {
  const idx = trainingStore.findIndex(t => t.id === id);
  if (idx === -1) return Promise.resolve(null);
  trainingStore[idx] = { ...trainingStore[idx], ...data };
  await logAuditAction('update', 'training', id);
  return Promise.resolve(trainingStore[idx]);
}

export async function archiveTrainingProgram(id: string): Promise<boolean> {
  const item = trainingStore.find(t => t.id === id);
  if (!item) return Promise.resolve(false);
  item.status = 'archived';
  await logAuditAction('archive', 'training', id);
  return Promise.resolve(true);
}

export async function deleteTrainingProgram(id: string): Promise<boolean> {
  return archiveTrainingProgram(id);
}

/* ==========================================
   DISCUSSIONS, WORKSHOPS, RESOURCES, MEMBERS, RSVPs
   ========================================== */

export async function getDiscussions(): Promise<Discussion[]> {
  return Promise.resolve([...discussionStore]);
}

export async function getWorkshops(): Promise<Workshop[]> {
  return Promise.resolve([...workshopStore]);
}

export async function getResources(): Promise<Resource[]> {
  return Promise.resolve([...resourceStore]);
}

export async function getMembers(): Promise<Member[]> {
  return Promise.resolve([...memberStore]);
}

export async function registerForEvent(data: Partial<EventRegistration>): Promise<EventRegistration> {
  const reg: EventRegistration = {
    id: `reg-${Date.now()}`,
    eventId: data.eventId || 'evt-1',
    eventTitle: data.eventTitle || 'Event Registration',
    name: data.name || 'Participant',
    email: data.email || 'participant@example.com',
    phone: data.phone,
    organization: data.organization,
    experienceLevel: data.experienceLevel || 'Intermediate',
    registeredAt: new Date().toISOString()
  };
  registrationStore.unshift(reg);
  await logAuditAction('create', 'registration', reg.id, reg.email);
  return Promise.resolve(reg);
}

export async function getAllRegistrationsAdmin(): Promise<EventRegistration[]> {
  return Promise.resolve([...registrationStore]);
}

/* ==========================================
   OPPORTUNITIES
   ========================================== */

export async function getOpportunities(): Promise<Opportunity[]> {
  const published = opportunityStore.filter(o => o.status === 'published');
  return Promise.resolve(published);
}

export async function getAllOpportunitiesAdmin(): Promise<Opportunity[]> {
  return Promise.resolve([...opportunityStore]);
}

export async function createOpportunity(data: Partial<Opportunity>): Promise<Opportunity> {
  const opp: Opportunity = {
    id: `opp-${Date.now()}`,
    title: data.title || 'New Opportunity',
    type: data.type || 'circle_seat',
    category: data.category || 'General',
    description: data.description || '',
    deadline: data.deadline,
    seatsTotal: data.seatsTotal || 10,
    seatsFilled: data.seatsFilled || 0,
    requirements: data.requirements || [],
    actionText: data.actionText || 'Apply',
    actionUrl: data.actionUrl || '/community',
    status: data.status || 'published'
  };
  opportunityStore.unshift(opp);
  await logAuditAction('create', 'opportunity', opp.id);
  return Promise.resolve(opp);
}

/* ==========================================
   ENQUIRIES (Lean Lifecycle)
   ========================================== */

export async function getEnquiries(): Promise<Enquiry[]> {
  return Promise.resolve([...enquiryStore]);
}

export async function createEnquiry(data: Omit<Enquiry, 'id' | 'createdAt' | 'expiresAt' | 'status'>): Promise<Enquiry> {
  const now = new Date();
  const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days expiry
  const enq: Enquiry = {
    id: `enq-${Date.now()}`,
    type: data.type,
    orgName: data.orgName,
    contactName: data.contactName,
    email: data.email,
    phone: data.phone,
    message: data.message,
    status: 'new',
    adminNotes: data.adminNotes || '',
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString()
  };
  enquiryStore.unshift(enq);
  await logAuditAction('create', 'enquiry', enq.id, enq.email);
  return Promise.resolve(enq);
}

export async function updateEnquiryStatus(id: string, status: Enquiry['status'], adminNotes?: string): Promise<Enquiry | null> {
  const idx = enquiryStore.findIndex(e => e.id === id);
  if (idx === -1) return Promise.resolve(null);
  enquiryStore[idx] = {
    ...enquiryStore[idx],
    status,
    ...(adminNotes !== undefined ? { adminNotes } : {})
  };
  await logAuditAction('update', 'enquiry', id, `status:${status}`);
  return Promise.resolve(enquiryStore[idx]);
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const idx = enquiryStore.findIndex(e => e.id === id);
  if (idx === -1) return Promise.resolve(false);
  enquiryStore.splice(idx, 1);
  await logAuditAction('archive', 'enquiry', id);
  return Promise.resolve(true);
}

