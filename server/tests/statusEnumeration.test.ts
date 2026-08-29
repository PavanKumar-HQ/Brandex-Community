import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('Audit: Application Status System & Anti-Enumeration Protection', () => {
  it('1. Correct refCode + matched email returns safe mapped public status', async () => {
    // BX-2026-1001 was seeded with internalStatus: 'CONTACTED'
    const res = await request(app)
      .post('/api/application/status')
      .send({
        refCode: 'BX-2026-1001',
        email: 'ramesh.rao@vignan.edu.in'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('Under Review'); // Mapped from CONTACTED
    expect(res.body.refCode).toBe('BX-2026-1001');
    expect(res.body.internalStatus).toBeUndefined(); // Never leaks internal CRM status
    expect(res.body.crmId).toBeUndefined(); // Never leaks internal CRM IDs
  });

  it('2. Status with DOCUMENTS_REQUIRED exposes safe public Action Required details without CRM internals', async () => {
    // BX-2026-1002 was seeded with internalStatus: 'DOCUMENTS_REQUIRED'
    const res = await request(app)
      .post('/api/application/status')
      .send({
        refCode: 'BX-2026-1002',
        email: 'ananya.d@nexuscloud.io'
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Action Required');
    expect(res.body.actionRequired).toBeDefined();
    expect(res.body.actionRequired.instructions).toContain('non-disclosure training agreement');
    expect(res.body.actionRequired.deadline).toBe('15 September 2026');
  });

  it('3. Anti-Enumeration: Invalid refCode with valid email returns generic 404 without leaking info', async () => {
    const res = await request(app)
      .post('/api/application/status')
      .send({
        refCode: 'BX-FAKE-9999',
        email: 'ananya.d@nexuscloud.io'
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('No matching application or enquiry found');
  });

  it('4. Anti-Enumeration: Valid refCode with WRONG email returns identical generic 404 to prevent scraping', async () => {
    const res = await request(app)
      .post('/api/application/status')
      .send({
        refCode: 'BX-2026-1001',
        email: 'attacker@evil.com'
      });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('No matching application or enquiry found');
  });
});
