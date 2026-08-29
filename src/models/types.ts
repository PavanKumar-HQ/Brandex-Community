export type ContentStatus = 'draft' | 'published' | 'archived' | 'cancelled';

export type EventType = 'In-Person' | 'Online' | 'Hybrid';

export interface SocialLinks {
  website?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  discord?: string;
}

export interface Institution {
  id: string;
  name: string;
  slug: string;
  logo: string;
  coverImage?: string;
  shortDescription: string;
  fullDescription: string;
  location: string;
  website: string;
  email: string;
  phone?: string;
  socialLinks: SocialLinks;
  institutionType: string;
  establishedYear: number;
  featured: boolean;
  status: ContentStatus;
}

export interface Community {
  id: string;
  institutionId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  coverImage?: string;
  logo?: string;
  activities: string[];
  socialLinks?: SocialLinks;
  contactEmail?: string;
  featured: boolean;
  displayOrder: number;
  status: ContentStatus;
  memberCount?: number;
  activeTopicsCount?: number;
}

export type CommunityCategory = Community;

export interface SpeakerInfo {
  name: string;
  role: string;
  organization: string;
  avatarUrl?: string;
}

export interface EventAgenda {
  time: string;
  title: string;
  description?: string;
  speaker?: string;
}

export interface Event {
  id: string;
  institutionId: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  coverImage?: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  type: EventType;
  category: string;
  speakers: SpeakerInfo[];
  registrationUrl?: string;
  recordingUrl?: string;
  gallery: string[];
  youtubeUrl?: string;
  youtubeId?: string;
  featured: boolean;
  displayOrder: number;
  status: ContentStatus;
  isPast?: boolean;
  capacity?: number;
  registeredCount?: number;
  agenda?: EventAgenda[];
}

export interface Photo {
  id: string;
  institutionId: string;
  image: string;
  caption: string;
  altText: string;
  eventId?: string;
  communityId?: string;
  category: string;
  date: string;
  featured: boolean;
  displayOrder: number;
  status: ContentStatus;
}

export interface YouTubeVideo {
  id: string;
  institutionId: string;
  youtubeUrl: string;
  youtubeId: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  eventId?: string;
  communityId?: string;
  publishedDate: string;
  featured: boolean;
  displayOrder: number;
  status: ContentStatus;
}

export interface MediaItem {
  id: string;
  institutionId: string;
  title: string;
  slug: string;
  shortDescription: string;
  type: 'video' | 'photo' | 'story' | 'article' | 'recording';
  thumbnail: string;
  mediaUrl?: string;
  youtubeId?: string;
  category: string;
  eventId?: string;
  publishedAt: string;
  duration?: string;
  viewsCount?: number;
  featured: boolean;
  status: ContentStatus;
}

export type Media = MediaItem;

export interface Achievement {
  id: string;
  institutionId: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image?: string;
  recipientName: string;
  externalUrl?: string;
  featured: boolean;
  displayOrder: number;
  status: ContentStatus;
}

export interface Story {
  id: string;
  institutionId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  date: string;
  category: string;
  featured: boolean;
  displayOrder: number;
  status: ContentStatus;
}

export interface Statistic {
  id: string;
  institutionId: string;
  label: string;
  number: number;
  suffix?: string;
  description: string;
  icon?: string;
  displayOrder: number;
  visible: boolean;
}

export interface Announcement {
  id: string;
  institutionId: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image?: string;
  publishedDate: string;
  category: string;
  important: boolean;
  featured: boolean;
  status: ContentStatus;
}

export interface TrainingModule {
  id: string;
  order: number;
  title: string;
  description: string;
  topics: string[];
}

export interface Instructor {
  id?: string;
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
}

export interface TrainingProgram {
  id: string;
  institutionId: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  instructor: string | Instructor;
  date: string;
  venue: string;
  registrationUrl?: string;
  gallery?: string[];
  status: ContentStatus;
  featured: boolean;
  outcomes?: string[];
  modules?: TrainingModule[];
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Discussion {
  id: string;
  title: string;
  category: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  repliesCount: number;
  lastActive: string;
  pinned: boolean;
}

export interface Workshop {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  date: string;
  duration: string;
  instructor: string;
  level: string;
  seatsRemaining: number;
}

export interface Resource {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  type: string;
  fileSize: string;
  publishedAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
  avatarUrl: string;
  domains: string[];
  bio: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  experienceLevel: string;
  registeredAt: string;
}

export interface AuditLog {
  id: string;
  institutionId: string;
  user: string;
  action: 'create' | 'update' | 'publish' | 'unpublish' | 'archive' | 'restore';
  entity: string;
  entityId: string;
  timestamp: string;
}

export type OpportunityType = 'circle_seat' | 'workshop_slot' | 'ambassador_slot' | 'volunteer';

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  category: string;
  description: string;
  deadline?: string;
  seatsTotal: number;
  seatsFilled: number;
  requirements?: string[];
  actionUrl?: string;
  actionText?: string;
  status: ContentStatus;
}

export type EnquiryType = 'school' | 'corporate' | 'workshop' | 'sponsorship' | 'partnership' | 'training';
export type EnquiryStatus = 'new' | 'reviewed' | 'contacted' | 'closed';

export interface Enquiry {
  id: string;
  type: EnquiryType;
  orgName: string;
  contactName: string;
  email: string;
  phone?: string;
  message: string;
  status: EnquiryStatus;
  adminNotes?: string;
  createdAt: string;
  expiresAt: string;
}

