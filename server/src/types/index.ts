export type WorkflowStatus = 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'CONTENT_ADMIN'
  | 'COMMUNITY_MANAGER'
  | 'EDUCATION_MANAGER'
  | 'MEDIA_MANAGER'
  | 'ENQUIRY_MANAGER';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface ContentRevision {
  revisionId: string;
  timestamp: string;
  authorId: string;
  authorEmail: string;
  status: WorkflowStatus;
  changesSummary: string;
  snapshot: any;
}

export interface BaseContentEntity {
  id: string;
  slug: string;
  title: string;
  status: WorkflowStatus;
  scheduledPublishAt?: string;
  scheduledArchiveAt?: string;
  currentRevisionId: string;
  revisions: ContentRevision[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// 1. Events
export interface EventEntity extends BaseContentEntity {
  category: string;
  type: 'In-Person' | 'Online' | 'Hybrid';
  date: string;
  time: string;
  venue: string;
  location: string;
  shortDescription: string;
  description: string;
  coverImage?: string;
  capacity?: number;
  featured: boolean;
  relatedMediaIds?: string[];
  relatedProjectIds?: string[];
  relatedTrainingIds?: string[];
}

// 2. Training Programs
export interface TrainingEntity extends BaseContentEntity {
  category: string;
  level: string;
  duration: string;
  shortDescription: string;
  description: string;
  instructor: string;
  venue: string;
  coverImage?: string;
  outcomes?: string[];
  featured: boolean;
  relatedMediaIds?: string[];
}

// 3. Workshops
export interface WorkshopEntity extends BaseContentEntity {
  category: string;
  duration: string;
  instructor: string;
  seatsRemaining: number;
  description: string;
  date: string;
}

// 4. Challenges & CTFs
export interface ChallengeEntity extends BaseContentEntity {
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  rewardTrack?: string;
  deadline?: string;
  relatedProjectIds?: string[];
}

// 5. Community Projects
export interface ProjectEntity extends BaseContentEntity {
  category: string;
  description: string;
  githubUrl?: string;
  demoUrl?: string;
  tags: string[];
}

// 6. Media Items
export interface MediaEntity extends BaseContentEntity {
  type: 'image' | 'video_url' | 'photo_gallery';
  url: string;
  posterImage?: string;
  caption: string;
  category: string;
  eventId?: string;
  trainingId?: string;
  featured: boolean;
}

// 7. Resources
export interface ResourceEntity extends BaseContentEntity {
  category: string;
  type: string;
  fileSize?: string;
  downloadUrl?: string;
  description: string;
}

// 8. Opportunities
export interface OpportunityEntity extends BaseContentEntity {
  type: 'circle_seat' | 'workshop_slot' | 'ambassador_slot' | 'volunteer';
  category: string;
  description: string;
  deadline?: string;
  seatsTotal: number;
  seatsFilled: number;
  requirements?: string[];
  actionText?: string;
  actionUrl?: string;
}

// 9. Brandex Radar Items
export interface RadarEntity extends BaseContentEntity {
  radarCategory: 'Tech Trend' | 'Security Alert' | 'Research Paper' | 'Ecosystem Update';
  impact: 'High' | 'Medium' | 'Low';
  sourceUrl?: string;
  summary: string;
}

// 10. Community Stories
export interface StoryEntity extends BaseContentEntity {
  category: string;
  author: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  eventId?: string;
  featured: boolean;
}

// 11. Homepage Featured Content Map
export interface HomepageFeaturedConfig {
  featuredEventId?: string;
  featuredTrainingId?: string;
  featuredChallengeId?: string;
  featuredProjectId?: string;
  featuredVideoId?: string;
  featuredStoryId?: string;
  announcementBanner?: {
    active: boolean;
    text: string;
    link?: string;
    variant: 'info' | 'alert' | 'event';
  };
  radarItemIds?: string[];
  updatedAt: string;
  updatedBy: string;
}

// 12. CRM Integration & Enquiries
export type CRMInternalStatus =
  | 'NEW_LEAD'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'INTERVIEW'
  | 'DOCUMENTS_REQUIRED'
  | 'INTERNAL_REVIEW'
  | 'REJECTED'
  | 'CONVERTED';

export type PublicApplicationStatus =
  | 'Application Received'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Action Required'
  | 'Application Closed'
  | 'Selected';

export interface CRMLeadRecord {
  crmId: string;
  refCode: string; // e.g. "BX-2026-9812"
  type: string;
  orgName?: string;
  contactName: string;
  email: string;
  phone?: string;
  message: string;
  internalStatus: CRMInternalStatus;
  actionRequiredInstructions?: string;
  actionDeadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemporaryWebsiteEnquiry {
  id: string;
  refCode: string;
  crmLeadId?: string;
  type: string;
  orgName?: string;
  contactName: string;
  email: string;
  phone?: string;
  message: string;
  status: 'synced_to_crm' | 'pending_sync' | 'sync_failed';
  ipHash: string;
  createdAt: string;
  expiresAt: string; // Auto-deleted after 30 days
}

export interface AuditLogEntry {
  id: string;
  actorEmail: string;
  actorRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  summary: string;
  ipAddress?: string;
}
