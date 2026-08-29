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
});
