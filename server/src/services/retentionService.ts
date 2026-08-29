import { crmService } from './crmService.js';
import { auditService } from './auditService.js';

class RetentionService {
  private intervalId: NodeJS.Timeout | null = null;

  /**
   * Run one-time idempotent cleanup of temporary enquiry records > 30 days old
   */
  public runCleanup(): { purgedCount: number; timestamp: string } {
    const purgedCount = crmService.purgeExpiredEnquiries();
    const timestamp = new Date().toISOString();

    return {
      purgedCount,
      timestamp
    };
  }

  /**
   * Start background scheduled retention worker (runs every 24 hours)
   */
  public startScheduledWorker(intervalMs = 24 * 60 * 60 * 1000): void {
    if (this.intervalId) return;

    // Run once on startup
    this.runCleanup();

    this.intervalId = setInterval(() => {
      this.runCleanup();
    }, intervalMs);

    auditService.log({
      actorEmail: 'system',
      actorRole: 'SUPER_ADMIN',
      action: 'RETENTION_WORKER_STARTED',
      entity: 'retention_service',
      entityId: 'worker',
      summary: `Automated 30-day data retention cleanup worker active. Interval: ${intervalMs / (1000 * 60 * 60)} hours.`
    });
  }

  public stopScheduledWorker(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const retentionService = new RetentionService();
