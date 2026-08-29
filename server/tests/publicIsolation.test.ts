import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { authService } from '../src/services/authService.js';
import { contentService } from '../src/services/contentService.js';

const app = createApp();

describe('Audit: Public Content Isolation (Zero Leakage of Drafts / Archives)', () => {
  let contentAdminToken: string;

  beforeAll(async () => {
    const auth = await authService.authenticate('content@brandex.org', 'Content#Brandex2026');
    contentAdminToken = auth!.token;

    // Create a DRAFT event
    contentService.createItem(
      'events',
      {
        id: 'evt-secret-draft',
        slug: 'secret-unreleased-event',
        title: 'Confidential Internal Event',
        status: 'DRAFT',
        category: 'Confidential',
        type: 'Online',
        date: '2026-12-01',
        time: '10:00 AM',
        venue: 'Internal Room',
        location: 'Bangalore',
        shortDescription: 'Do not leak publicly',
        description: 'Classified event draft',
        featured: false
      },
      { id: 'usr-2', email: 'content@brandex.org', role: 'CONTENT_ADMIN' }
    );

    // Create an ARCHIVED event
    contentService.createItem(
      'events',
      {
        id: 'evt-old-archived',
        slug: 'old-archived-summit',
        title: 'Past Archived Summit',
        status: 'ARCHIVED',
        category: 'Summits',
        type: 'In-Person',
        date: '2024-01-01',
        time: '10:00 AM',
        venue: 'Old Hall',
        location: 'Bangalore',
        shortDescription: 'Old archived item',
        description: 'Archived description',
        featured: false
      },
      { id: 'usr-2', email: 'content@brandex.org', role: 'CONTENT_ADMIN' }
    );
  });

  it('1. Public /api/public/events should NOT return DRAFT or ARCHIVED events', async () => {
    const res = await request(app).get('/api/public/events');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const ids = res.body.data.map((e: any) => e.id);
    expect(ids).not.toContain('evt-secret-draft');
    expect(ids).not.toContain('evt-old-archived');

    // All returned items MUST have status PUBLISHED
    res.body.data.forEach((item: any) => {
      expect(item.status).toBe('PUBLISHED');
    });
  });

  it('2. Public slug query for a DRAFT item should return 404 NotFound', async () => {
    const res = await request(app).get('/api/public/events/secret-unreleased-event');
    expect(res.status).toBe(404);
  });

  it('3. Admin API /api/admin/content/events SHOULD return drafts for authenticated Content Admins', async () => {
    const res = await request(app)
      .get('/api/admin/content/events')
      .set('Authorization', `Bearer ${contentAdminToken}`);

    expect(res.status).toBe(200);
    const ids = res.body.data.map((e: any) => e.id);
    expect(ids).toContain('evt-secret-draft');
    expect(ids).toContain('evt-old-archived');
  });
});
