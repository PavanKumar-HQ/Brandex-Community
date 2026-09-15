import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('Audit: CRM Integration & Idempotency Layer', () => {
  it('1. Successfully submit public enquiry and receive safe public confirmation', async () => {
    const payload = {
      type: 'school',
      orgName: 'Silicon Valley Secondary School',
      contactName: 'Anil Kumar',
      email: 'anil.k@svss.edu',
      phone: '+91 98450 99887',
      message: 'Requesting Geniusphere AI curriculum workshop for 80 students.'
    };

    const res = await request(app)
      .post('/api/application/enquiry')
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.refCode).toMatch(/^BX-\d{4}-\d{4}$/);
    expect(res.body.status).toBe('Application Received');
    expect(res.body.isDuplicate).toBe(false);
  });

  it('2. Repeated identical submission within 5 minutes should be deduplicated (Idempotent)', async () => {
    const payload = {
      type: 'corporate',
      orgName: 'CyberShield Systems',
      contactName: 'Meera Nair',
      email: 'meera@cybershield.io',
      phone: '+91 99887 11223',
      message: 'Wargame cybersecurity training track inquiry.'
    };

    // First submission
    const res1 = await request(app)
      .post('/api/application/enquiry')
      .send(payload);
    expect(res1.status).toBe(201);
    const originalRef = res1.body.refCode;

    // Duplicate submission within window
    const res2 = await request(app)
      .post('/api/application/enquiry')
      .send(payload);
    expect(res2.status).toBe(200);
    expect(res2.body.success).toBe(true);
    expect(res2.body.refCode).toBe(originalRef);
    expect(res2.body.isDuplicate).toBe(true);
  });

  it('3. Honeypot spam trap should silently capture bot submissions without CRM pollution', async () => {
    const botPayload = {
      type: 'sponsorship',
      contactName: 'Spam Bot 3000',
      email: 'bot@spamnetwork.com',
      message: 'Cheap crypto token offers',
      honeypot: 'http://malicious-link.com' // Honeypot filled by bot
    };

    const res = await request(app)
      .post('/api/application/enquiry')
      .send(botPayload);

    expect(res.status).toBe(200);
    expect(res.body.refCode).toBe('BX-SPAM-TRAPPED');
  });

  it('4. GET /api/crm/leads returns aggregated leads for external CRM synchronization', async () => {
    const res = await request(app)
      .get('/api/crm/leads')
      .set('x-crm-api-key', 'crm_live_secret_brandex_2026_internal');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('leads');
    expect(res.body).toHaveProperty('sqliteBookings');
    expect(res.body).toHaveProperty('sqliteApplications');
    expect(res.body.count).toBeGreaterThan(0);
  });

  it('5. POST /api/crm/sync receives external CRM status update and triggers real notification', async () => {
    // 1. Create a service booking first
    const bookRes = await request(app)
      .post('/api/pwa/bookings')
      .send({
        userHandle: '@crm_client_99',
        serviceTitle: 'Cloud AI Integration',
        organization: 'Acme Systems',
        scopeDescription: 'Deploy RAG pipeline and fine-tuned model',
        preferredSlot: 'Next Week'
      });

    expect(bookRes.status).toBe(201);
    const bookingId = bookRes.body.id;

    // 2. Push status update from external CRM
    const syncRes = await request(app)
      .post('/api/crm/sync')
      .set('x-crm-api-key', 'crm_live_secret_brandex_2026_internal')
      .send({
        refCode: bookingId,
        newStatus: 'Confirmed',
        notes: 'Engineering lead confirmed time slot and architecture brief.'
      });

    expect(syncRes.status).toBe(200);
    expect(syncRes.body.success).toBe(true);
    expect(syncRes.body.newStatus).toBe('Confirmed');
    expect(syncRes.body.targetHandle).toBe('@crm_client_99');

    // 3. Verify notification arrived for the client
    const notifRes = await request(app).get(`/api/pwa/notifications?handle=@crm_client_99`);
    expect(notifRes.status).toBe(200);
    const notifications = notifRes.body.notifications;
    const found = notifications.find((n: any) => n.title.includes('Confirmed') || n.message.includes('Confirmed'));
    expect(found).toBeDefined();
  });

  it('6. GET /api/crm/health returns pipeline connection health report', async () => {
    const res = await request(app).get('/api/crm/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('connected');
    expect(res.body.pipeline).toHaveProperty('activeLeadsInCRM');
  });

  it('7. POST /api/pwa/crm/sync-status syncs status for cohort/career application', async () => {
    // 1. Create an application
    const appRes = await request(app)
      .post('/api/pwa/applications')
      .send({
        userHandle: '@test_candidate_1',
        name: 'Test Candidate',
        email: 'test.candidate@domain.com',
        domains: ['AI Engineering Cohort'],
        experienceLevel: 'Advanced',
        projectIdea: 'Distributed consensus testing pipeline'
      });

    expect(appRes.status).toBe(201);
    const appId = appRes.body.applicationId;

    // 2. External CRM syncs status to 'Interview Scheduled'
    const syncRes = await request(app)
      .post('/api/pwa/crm/sync-status')
      .send({
        refCode: appId,
        status: 'Interview Scheduled',
        reviewerNotes: 'Candidate screened; interview scheduled with core lead.'
      });

    expect(syncRes.status).toBe(200);
    expect(syncRes.body.success).toBe(true);
    expect(syncRes.body.status).toBe('Interview Scheduled');

    // 3. Query status via public lookup
    const statusRes = await request(app).get(`/api/pwa/status/${appId}`);
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.status).toBe('Interview Scheduled');
    expect(statusRes.body.notes).toContain('Candidate screened');
  });
});
