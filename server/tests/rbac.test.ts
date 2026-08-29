import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { authService } from '../src/services/authService.js';

const app = createApp();

describe('Audit: RBAC & Authentication Route Protection', () => {
  let superAdminToken: string;
  let mediaManagerToken: string;
  let educationManagerToken: string;

  beforeAll(async () => {
    // Authenticate super admin
    const superAdminAuth = await authService.authenticate('superadmin@brandex.org', 'Admin#Brandex2026');
    superAdminToken = superAdminAuth!.token;

    // Authenticate media manager
    const mediaAuth = await authService.authenticate('media@brandex.org', 'Media#Brandex2026');
    mediaManagerToken = mediaAuth!.token;

    // Authenticate education manager
    const eduAuth = await authService.authenticate('education@brandex.org', 'Education#Brandex2026');
    educationManagerToken = eduAuth!.token;
  });

  it('1. Unauthenticated requests to /api/admin/* should return 401 Unauthorized', async () => {
    const res = await request(app).get('/api/admin/content/events');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
  });

  it('2. Media Manager should NOT be able to view or edit educational training (403 Forbidden)', async () => {
    const res = await request(app)
      .get('/api/admin/content/training')
      .set('Authorization', `Bearer ${mediaManagerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Forbidden');
  });

  it('3. Media Manager SHOULD be able to access media content', async () => {
    const res = await request(app)
      .get('/api/admin/content/media')
      .set('Authorization', `Bearer ${mediaManagerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('4. Education Manager should be able to access training and workshops', async () => {
    const res = await request(app)
      .get('/api/admin/content/training')
      .set('Authorization', `Bearer ${educationManagerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('5. Only Super Admin can access audit logs', async () => {
    const deniedRes = await request(app)
      .get('/api/admin/audit-logs')
      .set('Authorization', `Bearer ${educationManagerToken}`);
    expect(deniedRes.status).toBe(403);

    const allowedRes = await request(app)
      .get('/api/admin/audit-logs')
      .set('Authorization', `Bearer ${superAdminToken}`);
    expect(allowedRes.status).toBe(200);
    expect(allowedRes.body.success).toBe(true);
  });
});
