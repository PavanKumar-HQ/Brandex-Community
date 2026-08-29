import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { authService } from '../src/services/authService.js';

const app = createApp();

describe('Audit: Content Publishing Workflow & Revision History', () => {
  let contentAdminToken: string;
  let testItemId: string;

  beforeAll(async () => {
    const auth = await authService.authenticate('content@brandex.org', 'Content#Brandex2026');
    contentAdminToken = auth!.token;
  });

  it('1. Create new content item in DRAFT state', async () => {
    const res = await request(app)
      .post('/api/admin/content/challenges')
      .set('Authorization', `Bearer ${contentAdminToken}`)
      .send({
        title: 'Zero-Trust CTF Challenge Alpha',
        slug: 'zero-trust-ctf-alpha',
        category: 'Cybersecurity',
        difficulty: 'Intermediate',
        description: 'Simulated microservice exploit defense sprint.'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('DRAFT');
    expect(res.body.data.revisions.length).toBe(1);

    testItemId = res.body.data.id;
  });

  it('2. Transition status from DRAFT -> IN_REVIEW -> PUBLISHED', async () => {
    // 1. Submit for review
    const reviewRes = await request(app)
      .put(`/api/admin/content/challenges/${testItemId}/status`)
      .set('Authorization', `Bearer ${contentAdminToken}`)
      .send({ status: 'IN_REVIEW' });

    expect(reviewRes.status).toBe(200);
    expect(reviewRes.body.data.status).toBe('IN_REVIEW');

    // 2. Publish
    const publishRes = await request(app)
      .put(`/api/admin/content/challenges/${testItemId}/status`)
      .set('Authorization', `Bearer ${contentAdminToken}`)
      .send({ status: 'PUBLISHED' });

    expect(publishRes.status).toBe(200);
    expect(publishRes.body.data.status).toBe('PUBLISHED');
  });

  it('3. Update published content, check revision creation, and rollback to initial revision', async () => {
    // Update content
    const updateRes = await request(app)
      .put(`/api/admin/content/challenges/${testItemId}`)
      .set('Authorization', `Bearer ${contentAdminToken}`)
      .send({
        title: 'Zero-Trust CTF Challenge Alpha (Updated v2)',
        rewardTrack: 'Top 3 teams receive infrastructure grants'
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.title).toContain('Updated v2');
    expect(updateRes.body.data.revisions.length).toBeGreaterThanOrEqual(2);

    // Initial revision ID is the oldest revision
    const initialRevId = updateRes.body.data.revisions[updateRes.body.data.revisions.length - 1].revisionId;

    // Rollback / Restore initial revision
    const rollbackRes = await request(app)
      .post(`/api/admin/content/challenges/${testItemId}/revisions/${initialRevId}/restore`)
      .set('Authorization', `Bearer ${contentAdminToken}`);

    expect(rollbackRes.status).toBe(200);
    expect(rollbackRes.body.success).toBe(true);
    expect(rollbackRes.body.data.title).toBe('Zero-Trust CTF Challenge Alpha');
  });

  it('4. Soft-delete / Archive content item', async () => {
    const archiveRes = await request(app)
      .put(`/api/admin/content/challenges/${testItemId}/status`)
      .set('Authorization', `Bearer ${contentAdminToken}`)
      .send({ status: 'ARCHIVED' });

    expect(archiveRes.status).toBe(200);
    expect(archiveRes.body.data.status).toBe('ARCHIVED');
  });
});
