import {
  WorkflowStatus,
  BaseContentEntity,
  EventEntity,
  TrainingEntity,
  WorkshopEntity,
  ChallengeEntity,
  ProjectEntity,
  MediaEntity,
  ResourceEntity,
  OpportunityEntity,
  RadarEntity,
  StoryEntity,
  HomepageFeaturedConfig,
  ContentRevision
} from '../types/index.js';
import { auditService } from './auditService.js';

class ContentService {
  private events: Map<string, EventEntity> = new Map();
  private training: Map<string, TrainingEntity> = new Map();
  private workshops: Map<string, WorkshopEntity> = new Map();
  private challenges: Map<string, ChallengeEntity> = new Map();
  private projects: Map<string, ProjectEntity> = new Map();
  private media: Map<string, MediaEntity> = new Map();
  private resources: Map<string, ResourceEntity> = new Map();
  private opportunities: Map<string, OpportunityEntity> = new Map();
  private radar: Map<string, RadarEntity> = new Map();
  private stories: Map<string, StoryEntity> = new Map();
  private homepageConfig: HomepageFeaturedConfig = {
    updatedAt: new Date().toISOString(),
    updatedBy: 'system'
  };

  constructor() {
    this.seedInitialContent();
  }

  private seedInitialContent() {
    // Seed sample published event
    const event1: EventEntity = {
      id: 'evt-autumn-2026',
      slug: 'brandex-autumn-technology-summit-2026',
      title: 'Brandex Autumn Technology Summit 2026',
      status: 'PUBLISHED',
      category: 'Summits & Keynotes',
      type: 'Hybrid',
      date: '14 October 2026',
      time: '09:00 AM - 05:30 PM IST',
      venue: 'Main Campus Auditorium & Virtual Stream',
      location: 'Bangalore, India',
      shortDescription: 'The premier annual gathering of engineers, students, researchers, and creators.',
      description: 'Annual multi-track technology symposium exploring agentic LLMs, zero-trust cloud architectures, and open hardware.',
      featured: true,
      currentRevisionId: 'rev-evt-1',
      revisions: [
        {
          revisionId: 'rev-evt-1',
          timestamp: new Date().toISOString(),
          authorId: 'usr-1',
          authorEmail: 'superadmin@brandex.org',
          status: 'PUBLISHED',
          changesSummary: 'Initial publication',
          snapshot: {}
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    };
    this.events.set(event1.id, event1);

    // Seed sample training program
    const train1: TrainingEntity = {
      id: 'tr-pml-01',
      slug: 'practical-machine-learning',
      title: 'Practical Machine Learning & Agent Architecture',
      status: 'PUBLISHED',
      category: 'Artificial Intelligence',
      level: 'Intermediate',
      duration: '8 Weeks (Self-paced & Labs)',
      shortDescription: 'Build multi-agent state machines with tool execution and telemetry.',
      description: 'Hands-on architectural breakdown of agent frameworks, prompt optimizations, and local inference deployment.',
      instructor: 'Dr. Aris Thorne',
      venue: 'Virtual Developer Lab',
      outcomes: ['Deploy autonomous workflows', 'Implement tool routing'],
      featured: true,
      currentRevisionId: 'rev-tr-1',
      revisions: [
        {
          revisionId: 'rev-tr-1',
          timestamp: new Date().toISOString(),
          authorId: 'usr-4',
          authorEmail: 'education@brandex.org',
          status: 'PUBLISHED',
          changesSummary: 'Curriculum published',
          snapshot: {}
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    };
    this.training.set(train1.id, train1);

    // Seed sample community story
    const story1: StoryEntity = {
      id: 'st-agent-framework',
      slug: 'autonomous-agent-framework-breakthrough',
      title: 'Building Real-Time Agentic Workflows for Secondary Schools',
      status: 'PUBLISHED',
      category: 'AI & Education',
      author: 'Elena Rostova',
      excerpt: 'How secondary students in Bangalore constructed autonomous multi-agent systems using open tooling.',
      content: 'Detailed breakdown of the open curriculum deployed at geniusphere.tech.',
      featured: true,
      currentRevisionId: 'rev-st-1',
      revisions: [
        {
          revisionId: 'rev-st-1',
          timestamp: new Date().toISOString(),
          authorId: 'usr-2',
          authorEmail: 'content@brandex.org',
          status: 'PUBLISHED',
          changesSummary: 'Story published',
          snapshot: {}
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    };
    this.stories.set(story1.id, story1);

    // Seed sample opportunity
    const opp1: OpportunityEntity = {
      id: 'opp-circle-01',
      slug: 'ai-agent-circle-lead',
      title: 'Geniusphere AI Agent Circle — Cohort Lead',
      status: 'PUBLISHED',
      type: 'circle_seat',
      category: 'Artificial Intelligence',
      description: 'Open seats for student researchers to co-lead weekly autonomous multi-agent sprint sessions.',
      deadline: '15 September 2026',
      seatsTotal: 12,
      seatsFilled: 8,
      requirements: ['Python / TypeScript basics', 'Interest in LLM workflows'],
      currentRevisionId: 'rev-opp-1',
      revisions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    };
    this.opportunities.set(opp1.id, opp1);

    // Seed Radar item
    const radar1: RadarEntity = {
      id: 'radar-01',
      slug: 'agentic-ai-state-machines',
      title: 'Graph-based Multi-Agent Orchestration Telemetry',
      status: 'PUBLISHED',
      radarCategory: 'Tech Trend',
      impact: 'High',
      summary: 'State graph abstractions replacing linear chain execution in high-concurrency production systems.',
      currentRevisionId: 'rev-rad-1',
      revisions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    };
    this.radar.set(radar1.id, radar1);

    // Set homepage config
    this.homepageConfig = {
      featuredEventId: event1.id,
      featuredTrainingId: train1.id,
      featuredStoryId: story1.id,
      announcementBanner: {
        active: true,
        text: 'Registrations now open for the Autumn 2026 Technology Summit.',
        link: '/events',
        variant: 'event'
      },
      radarItemIds: [radar1.id],
      updatedAt: new Date().toISOString(),
      updatedBy: 'system'
    };
  }

  private getStore(entityType: string): Map<string, any> | null {
    switch (entityType) {
      case 'events': return this.events;
      case 'training': return this.training;
      case 'workshops': return this.workshops;
      case 'challenges': return this.challenges;
      case 'projects': return this.projects;
      case 'media': return this.media;
      case 'resources': return this.resources;
      case 'opportunities': return this.opportunities;
      case 'radar': return this.radar;
      case 'stories': return this.stories;
      default: return null;
    }
  }

  /**
   * Public query: Returns ONLY PUBLISHED items with active scheduled dates
   */
  public getPublicItems(entityType: string, category?: string): any[] {
    const store = this.getStore(entityType);
    if (!store) return [];

    const now = Date.now();
    const items = Array.from(store.values()).filter((item: BaseContentEntity) => {
      if (item.status !== 'PUBLISHED') return false;
      if (item.scheduledPublishAt && new Date(item.scheduledPublishAt).getTime() > now) return false;
      if (item.scheduledArchiveAt && new Date(item.scheduledArchiveAt).getTime() <= now) return false;
      if (category && category !== 'All' && (item as any).category !== category) return false;
      return true;
    });

    return items;
  }

  /**
   * Public query by slug
   */
  public getPublicItemBySlug(entityType: string, slug: string): any | null {
    const store = this.getStore(entityType);
    if (!store) return null;

    const item = Array.from(store.values()).find(
      (i: any) => i.slug === slug && i.status === 'PUBLISHED'
    );
    return item || null;
  }

  /**
   * Admin query: Returns all items including DRAFT, IN_REVIEW, ARCHIVED
   */
  public getAdminItems(entityType: string): any[] {
    const store = this.getStore(entityType);
    if (!store) return [];
    return Array.from(store.values());
  }

  /**
   * Create content entity (defaults to DRAFT)
   */
  public createItem(
    entityType: string,
    data: any,
    author: { id: string; email: string; role: any }
  ): any {
    const store = this.getStore(entityType);
    if (!store) throw new Error(`Invalid entity type: ${entityType}`);

    const id = data.id || `${entityType.slice(0, 3)}-${Date.now()}`;
    const now = new Date().toISOString();
    const revisionId = `rev-${Date.now()}`;

    const initialRevision: ContentRevision = {
      revisionId,
      timestamp: now,
      authorId: author.id,
      authorEmail: author.email,
      status: data.status || 'DRAFT',
      changesSummary: 'Initial creation',
      snapshot: { ...data }
    };

    const entity: BaseContentEntity = {
      ...data,
      id,
      slug: data.slug || id,
      status: data.status || 'DRAFT',
      currentRevisionId: revisionId,
      revisions: [initialRevision],
      createdAt: now,
      updatedAt: now
    };

    store.set(id, entity);

    auditService.log({
      actorEmail: author.email,
      actorRole: author.role,
      action: 'CONTENT_CREATED',
      entity: entityType,
      entityId: id,
      summary: `Created ${entityType} "${data.title || id}" with status ${entity.status}`
    });

    return entity;
  }

  /**
   * Update content entity & create new revision
   */
  public updateItem(
    entityType: string,
    id: string,
    updates: any,
    author: { id: string; email: string; role: any },
    changesSummary = 'Content update'
  ): any {
    const store = this.getStore(entityType);
    if (!store) throw new Error(`Invalid entity type: ${entityType}`);

    const existing = store.get(id);
    if (!existing) throw new Error(`Item ${id} not found`);

    const now = new Date().toISOString();
    const revisionId = `rev-${Date.now()}`;

    const updatedEntity = {
      ...existing,
      ...updates,
      id,
      updatedAt: now
    };

    const newRevision: ContentRevision = {
      revisionId,
      timestamp: now,
      authorId: author.id,
      authorEmail: author.email,
      status: updatedEntity.status,
      changesSummary,
      snapshot: { ...updatedEntity }
    };

    updatedEntity.currentRevisionId = revisionId;
    updatedEntity.revisions = [newRevision, ...(existing.revisions || [])].slice(0, 20); // Keep last 20 revisions

    if (updatedEntity.status === 'PUBLISHED' && !updatedEntity.publishedAt) {
      updatedEntity.publishedAt = now;
    }

    store.set(id, updatedEntity);

    auditService.log({
      actorEmail: author.email,
      actorRole: author.role,
      action: 'CONTENT_UPDATED',
      entity: entityType,
      entityId: id,
      summary: `Updated ${entityType} "${updatedEntity.title || id}". ${changesSummary}`
    });

    return updatedEntity;
  }

  /**
   * Transition workflow status (DRAFT -> IN_REVIEW -> PUBLISHED -> ARCHIVED)
   */
  public setStatus(
    entityType: string,
    id: string,
    status: WorkflowStatus,
    author: { id: string; email: string; role: any }
  ): any {
    return this.updateItem(
      entityType,
      id,
      { status },
      author,
      `Status transitioned to ${status}`
    );
  }

  /**
   * Restore previous revision
   */
  public restoreRevision(
    entityType: string,
    id: string,
    revisionId: string,
    author: { id: string; email: string; role: any }
  ): any {
    const store = this.getStore(entityType);
    if (!store) throw new Error(`Invalid entity type: ${entityType}`);

    const existing = store.get(id);
    if (!existing) throw new Error(`Item ${id} not found`);

    const targetRev = existing.revisions.find((r: ContentRevision) => r.revisionId === revisionId);
    if (!targetRev) throw new Error(`Revision ${revisionId} not found`);

    return this.updateItem(
      entityType,
      id,
      { ...targetRev.snapshot },
      author,
      `Restored revision ${revisionId}`
    );
  }

  /**
   * Soft-delete / Archive content entity
   */
  public archiveItem(
    entityType: string,
    id: string,
    author: { id: string; email: string; role: any }
  ): any {
    return this.setStatus(entityType, id, 'ARCHIVED', author);
  }

  /**
   * Homepage Featured Configuration
   */
  public getHomepageConfig(): HomepageFeaturedConfig {
    return { ...this.homepageConfig };
  }

  public updateHomepageConfig(updates: Partial<HomepageFeaturedConfig>, authorEmail: string): HomepageFeaturedConfig {
    this.homepageConfig = {
      ...this.homepageConfig,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: authorEmail
    };

    auditService.log({
      actorEmail: authorEmail,
      actorRole: 'SUPER_ADMIN',
      action: 'HOMEPAGE_CONFIG_UPDATED',
      entity: 'homepage',
      entityId: 'config',
      summary: 'Updated homepage featured layout configuration'
    });

    return this.homepageConfig;
  }

  /**
   * Global Search across all published content
   */
  public globalSearch(query: string, filterType?: string): any[] {
    const q = query.trim().toLowerCase();
    const results: any[] = [];

    const types = filterType && filterType !== 'all'
      ? [filterType]
      : ['events', 'training', 'stories', 'challenges', 'projects', 'opportunities', 'radar', 'resources'];

    types.forEach(t => {
      const items = this.getPublicItems(t);
      items.forEach(item => {
        const title = (item.title || '').toLowerCase();
        const desc = (item.description || item.shortDescription || item.excerpt || item.summary || '').toLowerCase();
        const cat = (item.category || '').toLowerCase();

        if (!q || title.includes(q) || desc.includes(q) || cat.includes(q)) {
          results.push({
            id: item.id,
            slug: item.slug,
            type: t,
            title: item.title,
            category: item.category || item.radarCategory,
            description: item.shortDescription || item.excerpt || item.summary || item.description,
            publishedAt: item.publishedAt || item.createdAt
          });
        }
      });
    });

    return results;
  }
}

export const contentService = new ContentService();
