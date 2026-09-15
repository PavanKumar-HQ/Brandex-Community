import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { crmService } from '../services/crmService.js';
import { auditService } from '../services/auditService.js';
import { config } from '../config/env.js';
import { db } from '../db/index.js';

const router = Router();

/**
 * Middleware: Authenticate CRM requests via API Key or Webhook Signature
 */
function authenticateCRM(req: Request, res: Response, next: () => void) {
  const apiKey = (req.headers['x-crm-api-key'] as string) || (req.query.api_key as string);
  const signature = req.headers['x-crm-signature'] as string;

  // In test or dev without strict keys configured, permit
  if (!config.crm.apiKey && !config.crm.webhookSecret) {
    return next();
  }

  // 1. Check API Key
  if (apiKey && apiKey === config.crm.apiKey) {
    return next();
  }

  // 2. Check Webhook HMAC Signature
  if (config.crm.webhookSecret && signature) {
    const payload = JSON.stringify(req.body);
    const expected = crypto.createHmac('sha256', config.crm.webhookSecret).update(payload).digest('hex');
    if (signature === expected) {
      return next();
    }
  }

  // Allow test runs or admin tokens
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return next();
  }

  // If in production and unauthorized, deny
  if (process.env.NODE_ENV === 'production') {
    return res.status(401).json({ error: 'Unauthorized', message: 'Valid X-CRM-API-Key or X-CRM-Signature required' });
  }

  next();
}

/**
 * Handler: Pull all aggregated leads (service bookings, applications, visitor enquiries)
 */
const getLeadsHandler = (req: Request, res: Response) => {
  const typeFilter = req.query.type as string;

  try {
    const crmLeads = crmService.getAllLeads(typeFilter);
    const bookings = db.prepare('SELECT * FROM service_bookings ORDER BY created_at DESC').all();
    const applications = db.prepare('SELECT * FROM applications ORDER BY created_at DESC').all();

    res.json({
      success: true,
      count: crmLeads.length + bookings.length + applications.length,
      leads: crmLeads,
      sqliteBookings: bookings,
      sqliteApplications: applications,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Handler: Receives status and lead updates from external CRM
 */
const handleCrmSync = (req: Request, res: Response) => {
  const { refCode, newStatus, actionInstructions, notes, actionDeadline } = req.body;

  if (!refCode || !newStatus) {
    return res.status(400).json({ error: 'BadRequest', message: 'refCode and newStatus required' });
  }

  const cleanRef = refCode.trim().toUpperCase();
  const statusNote = actionInstructions || notes || 'Status synchronized with enterprise CRM.';

  // 1. Update in memory CRM Service
  crmService.updateLeadStatus(cleanRef, newStatus, statusNote);

  let updatedEntity: 'booking' | 'application' | 'crm_lead' = 'crm_lead';
  let targetHandle = '@builder';

  // 2. Update SQLite Database if it's an Application or Booking
  if (cleanRef.startsWith('BX')) {
    const app: any = db.prepare('SELECT * FROM applications WHERE id = ?').get(cleanRef);
    if (app) {
      db.prepare('UPDATE applications SET status = ?, reviewer_notes = ? WHERE id = ?').run(newStatus, statusNote, cleanRef);
      updatedEntity = 'application';
      targetHandle = app.user_handle;
    }
  } else if (cleanRef.startsWith('SRV')) {
    const srv: any = db.prepare('SELECT * FROM service_bookings WHERE id = ?').get(cleanRef);
    if (srv) {
      db.prepare('UPDATE service_bookings SET status = ? WHERE id = ?').run(newStatus, cleanRef);
      updatedEntity = 'booking';
      targetHandle = srv.user_handle;
    }
  }

  // 3. Dispatch a real persistent notification to the applicant/client in SQLite!
  const notifId = `notif-crm-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  db.prepare(`
    INSERT INTO notifications (id, user_handle, title, message, category, read, action_url, action_label, created_at)
    VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)
  `).run(
    notifId,
    targetHandle,
    `Status Update: ${cleanRef} is ${newStatus}`,
    `${statusNote} (Synchronized via CRM)`,
    updatedEntity === 'booking' ? 'booking' : 'application',
    `/status?id=${cleanRef}`,
    'View Status',
    new Date().toISOString()
  );

  // 4. Log Audit Event
  auditService.log({
    actorEmail: 'crm-pipeline-sync',
    actorRole: 'SUPER_ADMIN',
    action: 'CRM_STATUS_SYNC',
    entity: updatedEntity,
    entityId: cleanRef,
    summary: `CRM pushed status update '${newStatus}' for ${cleanRef}`
  });

  res.json({
    success: true,
    refCode: cleanRef,
    newStatus,
    updatedEntity,
    targetHandle,
    receivedAt: new Date().toISOString(),
    message: `CRM status synced and notification dispatched to ${targetHandle}`
  });
};

/**
 * Handler: Pipeline status and connectivity report
 */
const getHealthHandler = (req: Request, res: Response) => {
  const totalLeads = crmService.getAllLeads().length;
  const bookingsCount = (db.prepare('SELECT COUNT(*) as c FROM service_bookings').get() as { c: number }).c;
  const appsCount = (db.prepare('SELECT COUNT(*) as c FROM applications').get() as { c: number }).c;

  res.json({
    success: true,
    status: 'connected',
    pipeline: {
      crmApiConfigured: Boolean(config.crm.apiUrl),
      crmEndpoint: config.crm.apiUrl,
      activeLeadsInCRM: totalLeads,
      sqliteBookings: bookingsCount,
      sqliteApplications: appsCount,
      webhookConfigured: Boolean(config.crm.webhookSecret)
    },
    timestamp: new Date().toISOString()
  });
};

/**
 * Handler: Outbound lead dispatch test to CRM webhook endpoint
 */
const dispatchHandler = async (req: Request, res: Response) => {
  const { leadData } = req.body;
  const targetUrl = req.body.targetUrl || config.crm.apiUrl;

  try {
    let outboundResponse = null;
    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Brandex-Secret': config.crm.apiKey
        },
        body: JSON.stringify(leadData || { test: true, timestamp: new Date().toISOString() })
      });
      outboundResponse = { status: response.status, statusText: response.statusText };
    } catch (e: any) {
      outboundResponse = { error: e.message, note: 'Outbound target unreachable or simulated local mock' };
    }

    res.json({
      success: true,
      message: 'Outbound CRM dispatch executed',
      targetUrl,
      outboundResponse
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Mount multi-alias routes to support both /api/crm/... and /api/integrations/crm/...
router.get('/leads', authenticateCRM, getLeadsHandler);
router.get('/crm/leads', authenticateCRM, getLeadsHandler);

router.post('/webhook', handleCrmSync);
router.post('/crm/webhook', handleCrmSync);

router.post('/sync', authenticateCRM, handleCrmSync);
router.post('/crm/sync', authenticateCRM, handleCrmSync);
router.post('/update-status', authenticateCRM, handleCrmSync);
router.post('/crm/update-status', authenticateCRM, handleCrmSync);

router.get('/health', getHealthHandler);
router.get('/crm/health', getHealthHandler);

router.post('/dispatch', authenticateCRM, dispatchHandler);
router.post('/crm/dispatch', authenticateCRM, dispatchHandler);

export default router;
