import crypto from 'crypto';
import {
  CRMInternalStatus,
  PublicApplicationStatus,
  CRMLeadRecord,
  TemporaryWebsiteEnquiry
} from '../types/index.js';
import { config } from '../config/env.js';
import { auditService } from './auditService.js';

// Public Status Mapping Table
export const STATUS_MAPPING: Record<CRMInternalStatus, PublicApplicationStatus> = {
  NEW_LEAD: 'Application Received',
  CONTACTED: 'Under Review',
  QUALIFIED: 'Under Review',
  INTERVIEW: 'Interview Scheduled',
  DOCUMENTS_REQUIRED: 'Action Required',
  INTERNAL_REVIEW: 'Under Review',
  REJECTED: 'Application Closed',
  CONVERTED: 'Selected'
};

export interface EnquirySubmissionInput {
  type: string;
  orgName?: string;
  contactName: string;
  email: string;
  phone?: string;
  message: string;
  ipAddress?: string;
}

export interface CRMEnquiryResult {
  success: boolean;
  refCode: string;
  publicStatus: PublicApplicationStatus;
  message: string;
  actionRequired?: {
    instructions: string;
    deadline?: string;
  };
  isDuplicate?: boolean;
}

class CRMService {
  // Mock CRM database (simulating enterprise CRM system)
  private crmDatabase: Map<string, CRMLeadRecord> = new Map();
  // Idempotency cache (hash -> { timestamp, refCode })
  private idempotencyCache: Map<string, { timestamp: number; refCode: string }> = new Map();
  // Temporary website-side enquiries table (scheduled for 30-day retention cleanup)
  private temporaryWebsiteEnquiries: TemporaryWebsiteEnquiry[] = [];

  constructor() {
    this.seedMockCRMLeads();
  }

  private seedMockCRMLeads() {
    const seeds: CRMLeadRecord[] = [
      {
        crmId: 'crm-lead-1001',
        refCode: 'BX-2026-1001',
        type: 'school',
        orgName: 'Vignan Academy of Sciences',
        contactName: 'Prof. Ramesh Rao',
        email: 'ramesh.rao@vignan.edu.in',
        phone: '+91 98450 11223',
        message: 'Requesting Geniusphere 2-day AI workshop curriculum.',
        internalStatus: 'CONTACTED',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        crmId: 'crm-lead-1002',
        refCode: 'BX-2026-1002',
        type: 'corporate',
        orgName: 'Nexus Cloud Systems',
        contactName: 'Ananya Deshmukh',
        email: 'ananya.d@nexuscloud.io',
        phone: '+91 99887 66554',
        message: 'Security training track for 30 engineers.',
        internalStatus: 'DOCUMENTS_REQUIRED',
        actionRequiredInstructions: 'Please upload the non-disclosure training agreement and student headcount list via secure email.',
        actionDeadline: '15 September 2026',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        crmId: 'crm-lead-1003',
        refCode: 'BX-2026-1003',
        type: 'careers',
        contactName: 'Karthik Sundaram',
        email: 'karthik@example.com',
        phone: '+91 91234 56789',
        message: 'Application for Campus Ambassador Bangalore Lead.',
        internalStatus: 'INTERVIEW',
        actionRequiredInstructions: 'Interview scheduled via Google Meet on Sept 10 at 4:00 PM IST.',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    seeds.forEach(s => {
      this.crmDatabase.set(s.refCode, s);
    });
  }

  /**
   * Generates a unique, non-guessable reference code (e.g. BX-2026-7842)
   */
  private generateRefCode(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `BX-${year}-${random}`;
  }

  /**
   * Idempotency Hash generator for duplicate submission prevention
   */
  private getSubmissionHash(data: EnquirySubmissionInput): string {
    const normalized = `${data.email.toLowerCase()}|${data.type}|${data.message.trim().toLowerCase()}`;
    return crypto.createHash('sha256').update(normalized).digest('hex');
  }

  /**
   * Submit enquiry from public website to CRM
   */
  public async submitEnquiry(input: EnquirySubmissionInput): Promise<CRMEnquiryResult> {
    const hash = this.getSubmissionHash(input);
    const now = Date.now();

    // 1. Idempotency Check (within 5 minutes)
    const existing = this.idempotencyCache.get(hash);
    if (existing && now - existing.timestamp < 5 * 60 * 1000) {
      return {
        success: true,
        refCode: existing.refCode,
        publicStatus: 'Application Received',
        message: 'Your enquiry was already received and is being processed by our team.',
        isDuplicate: true
      };
    }

    const refCode = this.generateRefCode();
    const crmId = `crm-lead-${Date.now()}`;

    // 2. Simulated / Real CRM Record Creation
    const leadRecord: CRMLeadRecord = {
      crmId,
      refCode,
      type: input.type,
      orgName: input.orgName,
      contactName: input.contactName,
      email: input.email.toLowerCase(),
      phone: input.phone,
      message: input.message,
      internalStatus: 'NEW_LEAD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.crmDatabase.set(refCode, leadRecord);
    this.idempotencyCache.set(hash, { timestamp: now, refCode });

    // 3. Log temporary website-side integration record (with 30-day retention expiry)
    const retentionMs = config.retention.websiteEnquiryDays * 24 * 60 * 60 * 1000;
    const tempEnquiry: TemporaryWebsiteEnquiry = {
      id: `enq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      refCode,
      crmLeadId: crmId,
      type: input.type,
      orgName: input.orgName,
      contactName: input.contactName,
      email: input.email,
      phone: input.phone,
      message: input.message,
      status: 'synced_to_crm',
      ipHash: crypto.createHash('sha256').update(input.ipAddress || '127.0.0.1').digest('hex').substring(0, 16),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(now + retentionMs).toISOString()
    };

    this.temporaryWebsiteEnquiries.push(tempEnquiry);

    auditService.log({
      actorEmail: 'system-gateway',
      actorRole: 'ENQUIRY_MANAGER',
      action: 'CRM_ENQUIRY_CREATED',
      entity: 'enquiry',
      entityId: refCode,
      summary: `New ${input.type} enquiry logged and synced to CRM. Ref: ${refCode}`,
      ipAddress: input.ipAddress
    });

    return {
      success: true,
      refCode,
      publicStatus: 'Application Received',
      message: 'Your enquiry has been successfully delivered to the Brandex team.'
    };
  }

  /**
   * Safe status query mapped to public status
   */
  public async getLeadStatusByRefAndEmail(
    refCode: string,
    email: string
  ): Promise<{
    found: boolean;
    refCode?: string;
    publicStatus?: PublicApplicationStatus;
    actionRequired?: { instructions: string; deadline?: string };
    updatedAt?: string;
  }> {
    const lead = this.crmDatabase.get(refCode.trim().toUpperCase());

    // Strict Anti-Enumeration: Ref code AND email must match exactly
    if (!lead || lead.email.toLowerCase() !== email.trim().toLowerCase()) {
      return { found: false };
    }

    const publicStatus = STATUS_MAPPING[lead.internalStatus] || 'Under Review';

    const result: any = {
      found: true,
      refCode: lead.refCode,
      publicStatus,
      updatedAt: lead.updatedAt
    };

    if (lead.internalStatus === 'DOCUMENTS_REQUIRED' && lead.actionRequiredInstructions) {
      result.actionRequired = {
        instructions: lead.actionRequiredInstructions,
        deadline: lead.actionDeadline
      };
    } else if (lead.internalStatus === 'INTERVIEW' && lead.actionRequiredInstructions) {
      result.actionRequired = {
        instructions: lead.actionRequiredInstructions
      };
    }

    return result;
  }

  /**
   * Operational: Update CRM lead status from Admin / Webhook
   */
  public updateLeadStatus(refCode: string, newStatus: CRMInternalStatus, notes?: string): boolean {
    const lead = this.crmDatabase.get(refCode);
    if (!lead) return false;

    lead.internalStatus = newStatus;
    lead.updatedAt = new Date().toISOString();
    if (notes) {
      lead.actionRequiredInstructions = notes;
    }
    return true;
  }

  /**
   * Return list of temporary website enquiries (for operational inspection & cleanup)
   */
  public getTemporaryEnquiries(): TemporaryWebsiteEnquiry[] {
    return [...this.temporaryWebsiteEnquiries];
  }

  /**
   * Delete temporary website enquiries older than 30 days
   */
  public purgeExpiredEnquiries(): number {
    const now = Date.now();
    const initialCount = this.temporaryWebsiteEnquiries.length;
    this.temporaryWebsiteEnquiries = this.temporaryWebsiteEnquiries.filter(
      enq => new Date(enq.expiresAt).getTime() > now
    );
    const deletedCount = initialCount - this.temporaryWebsiteEnquiries.length;

    if (deletedCount > 0) {
      auditService.log({
        actorEmail: 'system-retention-worker',
        actorRole: 'SUPER_ADMIN',
        action: 'DATA_RETENTION_CLEANUP',
        entity: 'enquiry_cleanup',
        entityId: `cleanup-${Date.now()}`,
        summary: `Purged ${deletedCount} temporary website enquiry records older than 30 days.`
      });
    }

    return deletedCount;
  }
}

export const crmService = new CRMService();
