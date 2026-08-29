import { describe, it, expect } from 'vitest';
import { crmService } from '../src/services/crmService.js';
import { retentionService } from '../src/services/retentionService.js';
import { auditService } from '../src/services/auditService.js';

describe('Audit: 30-Day Data Retention & Automatic Cleanup Worker', () => {
  it('1. Retention cleanup should automatically purge records older than 30 days while preserving active ones', async () => {
    // 1. Submit a fresh enquiry (< 30 days)
    await crmService.submitEnquiry({
      type: 'school',
      contactName: 'Fresh Contact',
      email: 'fresh@school.edu',
      message: 'Active enquiry from today'
    });

    const activeListBefore = crmService.getTemporaryEnquiries();
    expect(activeListBefore.length).toBeGreaterThan(0);

    // 2. Artificially insert an expired enquiry (> 35 days old)
    const expiredRecord: any = {
      id: 'enq-expired-test-01',
      refCode: 'BX-2026-OLD1',
      type: 'corporate',
      contactName: 'Old Lead',
      email: 'old@company.com',
      message: 'Ancient enquiry',
      status: 'synced_to_crm',
      ipHash: 'abc12345',
      createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // Expired 10 days ago
    };

    // Inject into temporary store for testing
    (crmService as any).temporaryWebsiteEnquiries.push(expiredRecord);

    const countBeforeCleanup = crmService.getTemporaryEnquiries().length;

    // 3. Execute retention cleanup job
    const cleanupResult = retentionService.runCleanup();

    expect(cleanupResult.purgedCount).toBeGreaterThanOrEqual(1);

    const enquiriesAfter = crmService.getTemporaryEnquiries();
    expect(enquiriesAfter.length).toBe(countBeforeCleanup - cleanupResult.purgedCount);

    const remainingIds = enquiriesAfter.map(e => e.id);
    expect(remainingIds).not.toContain('enq-expired-test-01');

    // 4. Verify audit trail recorded the purge event
    const auditLogs = auditService.getLogs(10, 'enquiry_cleanup');
    expect(auditLogs.length).toBeGreaterThan(0);
    expect(auditLogs[0].action).toBe('DATA_RETENTION_CLEANUP');
  });
});
