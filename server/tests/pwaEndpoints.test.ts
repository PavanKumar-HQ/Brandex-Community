import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { initDatabase } from '../src/db/index.js';

describe('PWA Unified Ecosystem Endpoints', () => {
  const app = createApp();

  beforeAll(() => {
    initDatabase();
  });

  it('GET /api/pwa/projects returns seeded open-source projects', async () => {
    const res = await request(app).get('/api/pwa/projects');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.projects)).toBe(true);
    expect(res.body.projects.length).toBeGreaterThanOrEqual(1);
    expect(res.body.projects[0]).toHaveProperty('title');
    expect(res.body.projects[0]).toHaveProperty('repo_url');
  });

  it('POST /api/pwa/bookings creates service reservation with SRV receipt', async () => {
    const res = await request(app)
      .post('/api/pwa/bookings')
      .send({
        userHandle: '@builder_test_42',
        serviceId: 'srv-genai',
        serviceTitle: 'Enterprise GenAI Deployment',
        tier: 'Sprint',
        organization: 'Stanford AI Guild',
        scopeDescription: 'Multi-agent code audit pipeline testing',
        preferredSlot: 'Next Monday, 10:00 AM IST'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.bookingId).toMatch(/^SRV-2026-\d{4}$/);
    expect(res.body.status).toBe('Scheduled');

    // Retrieve via receipt endpoint
    const lookup = await request(app).get(`/api/pwa/bookings/${res.body.bookingId}`);
    expect(lookup.status).toBe(200);
    expect(lookup.body.booking.user_handle).toBe('@builder_test_42');
  });

  it('POST /api/pwa/applications creates community registration with BX pass', async () => {
    const res = await request(app)
      .post('/api/pwa/applications')
      .send({
        userHandle: '@cryptokernel',
        type: 'community',
        name: 'Alex Rivera',
        email: 'alex@example.org',
        organization: 'MIT Labs',
        domains: ['Distributed Systems', 'Artificial Intelligence'],
        experienceLevel: 'Intermediate',
        contributions: ['Open Source Builder', 'Hackathons & Sprints'],
        focusAreas: ['Autonomous AI Agents & RAG'],
        projectIdea: 'Developing high-throughput consensus engines in Rust and Go.'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.applicationId).toMatch(/^BX-2026-\d{4}$/);
    expect(res.body.status).toBe('Under Review');

    // Verify lookup via status endpoint
    const statusRes = await request(app).get(`/api/pwa/status/${res.body.applicationId}`);
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.success).toBe(true);
    expect(statusRes.body.status).toBe('Under Review');
  });

  it('POST /api/pwa/verify-pr verifies public GitHub PR', async () => {
    const res = await request(app)
      .post('/api/pwa/verify-pr')
      .send({
        userHandle: '@test_contributor',
        projectId: 'proj-1',
        prUrl: 'https://github.com/brandex-hq/geniusphere-curriculum/pull/42'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('pointsAwarded');
  });

  it('GET /api/pwa/notifications returns real notifications and POST mark-read updates status', async () => {
    // 1. Fetch broadcast / user notifications
    const getRes = await request(app).get('/api/pwa/notifications?handle=@test_contributor');
    expect(getRes.status).toBe(200);
    expect(getRes.body.success).toBe(true);
    expect(Array.isArray(getRes.body.notifications)).toBe(true);
    expect(getRes.body.notifications.length).toBeGreaterThan(0);

    const firstNotif = getRes.body.notifications[0];

    // 2. Mark specific notification as read
    const markRes = await request(app)
      .post('/api/pwa/notifications/mark-read')
      .send({ id: firstNotif.id });
    expect(markRes.status).toBe(200);
    expect(markRes.body.success).toBe(true);
  });

  it('GET /api/pwa/stats returns real live metrics from SQLite database', async () => {
    const res = await request(app).get('/api/pwa/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.stats).toHaveProperty('totalBookings');
    expect(res.body.stats).toHaveProperty('totalApplications');
    expect(res.body.stats).toHaveProperty('verifiedContributions');
    expect(res.body.stats).toHaveProperty('activeProjects');
  });

  it('GET /api/pwa/check-handle validates syntax, reserved handles, and uniqueness', async () => {
    // 1. Available handle
    const availRes = await request(app).get('/api/pwa/check-handle?handle=brandex_test_unique_99');
    expect(availRes.status).toBe(200);
    expect(availRes.body.available).toBe(true);
    expect(availRes.body.handle).toBe('@brandex_test_unique_99');

    // 2. Reserved handle
    const reservedRes = await request(app).get('/api/pwa/check-handle?handle=admin');
    expect(reservedRes.status).toBe(200);
    expect(reservedRes.body.available).toBe(false);
    expect(reservedRes.body.suggestions).toBeDefined();

    // 3. Invalid handle
    const invalidRes = await request(app).get('/api/pwa/check-handle?handle=a!');
    expect(invalidRes.status).toBe(200);
    expect(invalidRes.body.available).toBe(false);
    expect(invalidRes.body.error).toBeDefined();
  });

  it('POST /api/pwa/register registers account and prevents duplicate handle collisions', async () => {
    const handle = `@unique_builder_${Date.now()}`;

    // 1. Initial successful registration
    const regRes = await request(app)
      .post('/api/pwa/register')
      .send({
        handle,
        avatarSeed: 'avatar-cyber-sentinel',
        displayName: 'Test Builder',
        domain: 'Artificial Intelligence'
      });

    expect(regRes.status).toBe(201);
    expect(regRes.body.success).toBe(true);
    expect(regRes.body.user.handle).toBe(handle.toLowerCase());
    expect(regRes.body.user.avatarSeed).toBe('avatar-cyber-sentinel');

    // 2. Check handle endpoint now reports taken
    const checkRes = await request(app).get(`/api/pwa/check-handle?handle=${handle}`);
    expect(checkRes.status).toBe(200);
    expect(checkRes.body.available).toBe(false);
    expect(checkRes.body.suggestions.length).toBeGreaterThanOrEqual(1);

    // 3. Attempt duplicate registration fails with 409 Conflict
    const dupRes = await request(app)
      .post('/api/pwa/register')
      .send({
        handle,
        avatarSeed: 'avatar-quantum-core'
      });

    expect(dupRes.status).toBe(409);
    expect(dupRes.body.success).toBe(false);
  });
});
