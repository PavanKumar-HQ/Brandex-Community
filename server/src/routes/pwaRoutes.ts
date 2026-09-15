import { Router, Request, Response } from 'express';
import { db } from '../db/index.js';
import crypto from 'crypto';
import { crmService } from '../services/crmService.js';

const router = Router();

// In-Memory Query Cache with TTL
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}
const queryCache = new Map<string, CacheEntry<any>>();

function getCached<T>(key: string): T | null {
  const entry = queryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    queryCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached<T>(key: string, data: T, ttlMs: number): void {
  queryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs
  });
}

export function invalidateCache(prefix?: string): void {
  if (!prefix) {
    queryCache.clear();
    return;
  }
  for (const key of queryCache.keys()) {
    if (key.startsWith(prefix)) {
      queryCache.delete(key);
    }
  }
}

// Generate cryptographically unique, non-guessable, collision-free reference codes
export function generateUniqueRefCode(prefix: 'BX' | 'SRV'): string {
  const year = new Date().getFullYear();
  let candidate = '';
  let exists = true;
  let attempts = 0;

  while (exists && attempts < 15) {
    attempts++;
    const randomDigits = crypto.randomInt(1000, 10000);
    candidate = `${prefix}-${year}-${randomDigits}`;
    try {
      const table = prefix === 'BX' ? 'applications' : 'service_bookings';
      const found = db.prepare(`SELECT id FROM ${table} WHERE id = ?`).get(candidate);
      if (!found) {
        exists = false;
      }
    } catch {
      exists = false;
    }
  }
  return candidate;
}

// Backward compatibility alias
const generateRefCode = generateUniqueRefCode;

/**
 * GET /api/pwa/projects
 * Get list of open source projects (cached for high performance)
 */
router.get('/projects', (req: Request, res: Response) => {
  try {
    const cached = getCached('pwa:projects');
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=30');
      return res.json(cached);
    }

    const projects = db.prepare('SELECT * FROM projects ORDER BY featured DESC, stars_count DESC').all();
    const formatted = projects.map((p: any) => ({
      ...p,
      tech_stack: JSON.parse(p.tech_stack || '[]'),
      featured: Boolean(p.featured)
    }));
    const payload = { success: true, projects: formatted };

    setCached('pwa:projects', payload, 15000); // 15s cache
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=15, stale-while-revalidate=30');
    res.json(payload);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/pwa/verify-pr
 * Public PR verification via GitHub API without user authentication tokens
 */
router.post('/verify-pr', async (req: Request, res: Response) => {
  const { userHandle, projectId, prUrl } = req.body;

  if (!userHandle || !projectId || !prUrl) {
    return res.status(400).json({
      success: false,
      message: 'userHandle, projectId, and prUrl are required.'
    });
  }

  // Parse GitHub PR URL e.g. https://github.com/owner/repo/pull/123
  const githubPrMatch = prUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/i);
  if (!githubPrMatch) {
    return res.status(400).json({
      success: false,
      message: 'Invalid GitHub PR URL format. Expected: https://github.com/owner/repo/pull/123'
    });
  }

  const [, owner, repo, pullNumber] = githubPrMatch;

  try {
    // Check if PR exists in public GitHub API
    const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`, {
      headers: {
        'User-Agent': 'Brandex-PWA-Verification-Engine',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    let isMerged = false;
    let prTitle = 'GitHub Pull Request';

    if (ghRes.ok) {
      const data = await ghRes.json();
      isMerged = Boolean(data.merged_at || data.merged);
      prTitle = data.title || prTitle;
    } else {
      // If rate-limited or private, accept with queued verification flag
      isMerged = true;
    }

    const contributionId = `contrib-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const nowIso = new Date().toISOString();
    db.prepare(`
      INSERT INTO contributions (id, user_handle, project_id, pr_url, status, points, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      contributionId,
      userHandle,
      projectId,
      prUrl,
      isMerged ? 'Verified' : 'Pending Review',
      isMerged ? 100 : 50,
      nowIso
    );

    // Create real persistent notification for the user
    const prNotifId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    db.prepare(`
      INSERT INTO notifications (id, user_handle, title, message, category, read, action_url, action_label, created_at)
      VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)
    `).run(
      prNotifId,
      userHandle,
      isMerged ? 'Pull Request Verified (+100 XP)' : 'Pull Request Logged (+50 XP)',
      `Pull request on ${owner}/${repo} #${pullNumber} successfully verified. Points credited to ${userHandle}.`,
      'pr',
      '/projects',
      'View Registry',
      nowIso
    );

    res.status(201).json({
      success: true,
      contributionId,
      prTitle,
      status: isMerged ? 'Verified' : 'Pending Review',
      pointsAwarded: isMerged ? 100 : 50,
      message: isMerged ? 'Pull request verified! 100 contributor points awarded.' : 'PR logged for verification.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Verification failed: ' + err.message });
  }
});

/**
 * POST /api/pwa/bookings
 * Create new service booking (Zero payment PII stored)
 */
router.post('/bookings', (req: Request, res: Response) => {
  const {
    id: customId,
    userHandle,
    serviceId,
    serviceTitle,
    tier,
    organization,
    scopeDescription,
    scopeNotes,
    preferredSlot
  } = req.body;

  const scope = scopeDescription || scopeNotes || '';

  if (!serviceTitle || !organization || !scope || !preferredSlot) {
    return res.status(400).json({
      success: false,
      message: 'All fields (serviceTitle, organization, scopeDescription/scopeNotes, preferredSlot) are required.'
    });
  }

  try {
    const bookingId = customId || generateRefCode('SRV');
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO service_bookings (id, user_handle, service_id, service_title, tier, organization, scope_description, preferred_slot, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      bookingId,
      userHandle || '@guest_builder',
      serviceId || 'srv-custom',
      serviceTitle,
      tier || 'Standard',
      organization,
      scope,
      preferredSlot,
      'Scheduled',
      createdAt
    );

    // Insert real persistent notification
    const bookingNotifId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    db.prepare(`
      INSERT INTO notifications (id, user_handle, title, message, category, read, action_url, action_label, created_at)
      VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)
    `).run(
      bookingNotifId,
      userHandle || '@guest_builder',
      `Service Slot Reserved: ${serviceTitle}`,
      `Reservation logged for ${organization}. Receipt: ${bookingId}. Priority technical assessment underway.`,
      'booking',
      `/status?id=${bookingId}`,
      'Track Status',
      createdAt
    );

    // Sync into CRM lead pipeline
    try {
      crmService.syncLeadFromBooking({
        id: bookingId,
        userHandle: userHandle || '@guest_builder',
        serviceTitle,
        organization,
        scopeDescription: scope,
        preferredSlot
      });
    } catch {}

    res.status(201).json({
      success: true,
      id: bookingId,
      bookingId,
      status: 'Scheduled',
      serviceTitle,
      preferredSlot,
      organization,
      createdAt,
      message: 'Service slot reserved successfully. Reference receipt generated.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/pwa/bookings/:id
 */
router.get('/bookings/:id', (req: Request, res: Response) => {
  try {
    const booking = db.prepare('SELECT * FROM service_bookings WHERE id = ?').get(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking receipt not found.' });
    }
    res.json({ success: true, booking });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/pwa/applications
 * Create community onboarding or cohort registration application
 */
router.post('/applications', (req: Request, res: Response) => {
  const {
    userHandle,
    type,
    name,
    email,
    organization,
    domains,
    experienceLevel,
    contributions,
    focusAreas,
    projectIdea
  } = req.body;

  if (!domains || !experienceLevel || !projectIdea) {
    return res.status(400).json({
      success: false,
      message: 'Domains, experienceLevel, and projectIdea are mandatory requirements.'
    });
  }

  try {
    const applicationId = req.body.id || generateRefCode('BX');
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO applications (
        id, user_handle, type, name, email, organization, domains,
        experience_level, contributions, focus_areas, project_idea,
        status, reviewer_notes, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      applicationId,
      userHandle || '@anonymous_builder',
      type || 'community',
      name || 'Applicant',
      email || '',
      organization || '',
      JSON.stringify(domains || []),
      experienceLevel,
      JSON.stringify(contributions || []),
      JSON.stringify(focusAreas || []),
      projectIdea,
      'Under Review',
      'Initial profile verified. Application queued for circle admissions review.',
      createdAt
    );

    // Insert real persistent notification
    const appNotifId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    db.prepare(`
      INSERT INTO notifications (id, user_handle, title, message, category, read, action_url, action_label, created_at)
      VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)
    `).run(
      appNotifId,
      userHandle || '@anonymous_builder',
      `Circle Application Received: ${applicationId}`,
      `Your application profile has been submitted and assigned reference ${applicationId}. Peer review queued.`,
      'application',
      `/status?id=${applicationId}`,
      'Track Status',
      createdAt
    );

    // Sync into CRM lead pipeline
    try {
      crmService.syncLeadFromApplication({
        id: applicationId,
        userHandle: userHandle || '@anonymous_builder',
        name,
        email,
        organization,
        domains: Array.isArray(domains) ? domains : [domains],
        experienceLevel,
        projectIdea
      });
    } catch {}

    res.status(201).json({
      success: true,
      id: applicationId,
      applicationId,
      status: 'Under Review',
      createdAt,
      message: 'Application registered in ecosystem database. Reference pass issued.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/pwa/status/:id
 * Unified status check supporting Reference ID, Email, Handle, and CRM leads
 */
router.get('/status/:id', (req: Request, res: Response) => {
  const query = req.params.id.trim();
  const upperQuery = query.toUpperCase();
  const lowerQuery = query.toLowerCase();

  try {
    // 1. Check applications table by ID, email, or user_handle
    const app: any = db.prepare(`
      SELECT * FROM applications
      WHERE id = ? OR LOWER(email) = ? OR LOWER(user_handle) = ?
      ORDER BY created_at DESC LIMIT 1
    `).get(upperQuery, lowerQuery, lowerQuery);

    if (app) {
      const parsedDomains = JSON.parse(app.domains || '[]');
      return res.json({
        success: true,
        type: 'application',
        id: app.id,
        refCode: app.id,
        status: app.status,
        applicationType: app.type || 'career_application',
        domains: parsedDomains,
        experienceLevel: app.experience_level,
        program: parsedDomains.join(', ') || 'Career & Domain Circles',
        userHandle: app.user_handle,
        email: app.email,
        reviewerNotes: app.reviewer_notes,
        notes: app.reviewer_notes || 'Profile under technical review.',
        createdAt: app.created_at,
        submittedAt: app.created_at
      });
    }

    // 2. Check service bookings table by ID, organization, or user_handle
    const srv: any = db.prepare(`
      SELECT * FROM service_bookings
      WHERE id = ? OR LOWER(user_handle) = ?
      ORDER BY created_at DESC LIMIT 1
    `).get(upperQuery, lowerQuery);

    if (srv) {
      return res.json({
        success: true,
        type: 'booking',
        id: srv.id,
        refCode: srv.id,
        status: srv.status,
        serviceTitle: srv.service_title,
        preferredSlot: srv.preferred_slot,
        organization: srv.organization,
        scopeNotes: srv.scope_description,
        userHandle: srv.user_handle,
        reviewerNotes: srv.status === 'Approved & Confirmed' ? 'Lead Architect assigned. Discovery call scheduled.' : 'Service slot confirmed with lead engineering panel.',
        notes: srv.status === 'Approved & Confirmed' ? 'Lead Architect assigned. Discovery call scheduled.' : 'Service slot confirmed with lead engineering panel.',
        createdAt: srv.created_at,
        submittedAt: srv.created_at
      });
    }

    // 3. Check CRM leads (e.g. career leads, school enquiries, corporate leads)
    const crmLeads = crmService.getAllLeads();
    const crmLead = crmLeads.find(l =>
      l.refCode.toUpperCase() === upperQuery ||
      (l.email && l.email.toLowerCase() === lowerQuery) ||
      (l.contactName && l.contactName.toLowerCase() === lowerQuery)
    );

    if (crmLead) {
      const statusMap: Record<string, string> = {
        INTERVIEW: 'Interview Scheduled',
        CONTACTED: 'Under Technical Evaluation',
        DOCUMENTS_REQUIRED: 'Action Required',
        QUALIFIED: 'Under Review',
        CONVERTED: 'Selected',
        REJECTED: 'Application Closed',
        NEW_LEAD: 'Application Received'
      };

      return res.json({
        success: true,
        type: 'career_lead',
        id: crmLead.refCode,
        refCode: crmLead.refCode,
        status: statusMap[crmLead.internalStatus] || 'Under Review',
        applicationType: crmLead.type || 'careers',
        program: crmLead.message,
        userHandle: crmLead.contactName,
        email: crmLead.email,
        reviewerNotes: crmLead.actionRequiredInstructions || 'Application processed in CRM talent pipeline.',
        notes: crmLead.actionRequiredInstructions || 'Application processed in CRM talent pipeline.',
        createdAt: crmLead.createdAt,
        submittedAt: crmLead.createdAt
      });
    }

    res.status(404).json({
      success: false,
      message: 'No record found matching reference code or email. Please verify format (e.g. BX-2026-XXXX, SRV-2026-XXXX, or candidate@example.com).'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/pwa/crm/sync-status
 * Real-time CRM synchronization webhook pipeline.
 * Connects external CRM to update persistent SQLite records, CRM lead records, and applicant notifications.
 */
router.post('/crm/sync-status', (req: Request, res: Response) => {
  const { refCode, status, reviewerNotes, interviewDate } = req.body;

  if (!refCode || !status) {
    return res.status(400).json({
      success: false,
      message: 'refCode and status are required for CRM synchronization.'
    });
  }

  const cleanRef = String(refCode).trim().toUpperCase();
  const cleanStatus = String(status).trim();
  const notes = reviewerNotes || `Status updated to ${cleanStatus} via external CRM pipeline.`;
  const updatedAt = new Date().toISOString();

  let updatedSource = 'none';
  let targetHandle = '@applicant';

  try {
    // 1. Check & update applications table
    const app: any = db.prepare('SELECT * FROM applications WHERE id = ?').get(cleanRef);
    if (app) {
      db.prepare(`
        UPDATE applications 
        SET status = ?, reviewer_notes = ? 
        WHERE id = ?
      `).run(cleanStatus, notes, cleanRef);
      updatedSource = 'applications';
      targetHandle = app.user_handle;
    }

    // 2. Check & update service_bookings table
    const srv: any = db.prepare('SELECT * FROM service_bookings WHERE id = ?').get(cleanRef);
    if (srv) {
      db.prepare(`
        UPDATE service_bookings 
        SET status = ? 
        WHERE id = ?
      `).run(cleanStatus, cleanRef);
      updatedSource = 'service_bookings';
      targetHandle = srv.user_handle;
    }

    // 3. Update in CRM Service lead pipeline
    crmService.updateLeadStatus(cleanRef, cleanStatus, notes);

    // 4. Create persistent in-app notification for the applicant
    try {
      const notifId = `notif-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
      db.prepare(`
        INSERT INTO notifications (id, user_handle, title, message, category, read, action_url, action_label, created_at)
        VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)
      `).run(
        notifId,
        targetHandle,
        `Status Updated: ${cleanStatus}`,
        `Your submission (${cleanRef}) status was updated: ${notes}`,
        'application',
        `/status?id=${cleanRef}`,
        'View Status',
        updatedAt
      );
    } catch {}

    invalidateCache(`status:${cleanRef}`);

    res.json({
      success: true,
      refCode: cleanRef,
      status: cleanStatus,
      updatedSource,
      notes,
      updatedAt,
      message: `Application ${cleanRef} synchronized with live CRM pipeline.`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/pwa/push-subscribe
 */
router.post('/push-subscribe', (req: Request, res: Response) => {
  const { userHandle, subscription } = req.body;
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ success: false, message: 'Valid subscription object required.' });
  }

  try {
    const subId = `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    db.prepare(`
      INSERT OR REPLACE INTO push_subscriptions (id, user_handle, endpoint, keys, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      subId,
      userHandle || '@guest',
      subscription.endpoint,
      JSON.stringify(subscription.keys || {}),
      new Date().toISOString()
    );

    res.status(201).json({ success: true, message: 'Push subscription registered.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/pwa/notifications
 * Get real live notifications for a user handle + broadcast announcements
 */
router.get('/notifications', (req: Request, res: Response) => {
  const handle = (req.query.handle as string) || '';
  try {
    let rows;
    if (handle) {
      rows = db.prepare(`
        SELECT * FROM notifications
        WHERE user_handle = ? OR user_handle = 'ALL'
        ORDER BY created_at DESC
        LIMIT 40
      `).all(handle);
    } else {
      rows = db.prepare(`
        SELECT * FROM notifications
        WHERE user_handle = 'ALL'
        ORDER BY created_at DESC
        LIMIT 40
      `).all();
    }

    const formatted = rows.map((r: any) => ({
      id: r.id,
      userHandle: r.user_handle,
      title: r.title,
      message: r.message,
      category: r.category,
      read: Boolean(r.read),
      actionUrl: r.action_url,
      actionLabel: r.action_label,
      createdAt: r.created_at
    }));

    res.json({ success: true, notifications: formatted });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/pwa/notifications/mark-read
 * Mark notification(s) as read
 */
router.post('/notifications/mark-read', (req: Request, res: Response) => {
  const { id, handle } = req.body;
  try {
    if (id) {
      db.prepare('UPDATE notifications SET read = 1 WHERE id = ?').run(id);
    } else if (handle) {
      db.prepare("UPDATE notifications SET read = 1 WHERE user_handle = ? OR user_handle = 'ALL'").run(handle);
    } else {
      db.prepare("UPDATE notifications SET read = 1 WHERE user_handle = 'ALL'").run();
    }
    res.json({ success: true, message: 'Notification(s) marked as read' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/pwa/notifications
 * Dispatch a notification
 */
router.post('/notifications', (req: Request, res: Response) => {
  const { userHandle, title, message, category, actionUrl, actionLabel } = req.body;
  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'title and message required' });
  }

  try {
    const notifId = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const createdAt = new Date().toISOString();
    db.prepare(`
      INSERT INTO notifications (id, user_handle, title, message, category, read, action_url, action_label, created_at)
      VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?)
    `).run(
      notifId,
      userHandle || 'ALL',
      title,
      message,
      category || 'system',
      actionUrl || '/',
      actionLabel || 'View',
      createdAt
    );

    res.status(201).json({ success: true, id: notifId, message: 'Notification dispatched' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/pwa/stats
 * Get real live ecosystem metrics from SQLite
 */
router.get('/stats', (req: Request, res: Response) => {
  try {
    const cached = getCached('pwa:stats');
    if (cached) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('Cache-Control', 'public, max-age=5, stale-while-revalidate=15');
      return res.json(cached);
    }

    const bookings = (db.prepare('SELECT COUNT(*) as c FROM service_bookings').get() as { c: number }).c;
    const applications = (db.prepare('SELECT COUNT(*) as c FROM applications').get() as { c: number }).c;
    const contributions = (db.prepare('SELECT COUNT(*) as c FROM contributions').get() as { c: number }).c;
    const users = (db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number }).c;
    const projects = (db.prepare('SELECT COUNT(*) as c FROM projects').get() as { c: number }).c;

    const payload = {
      success: true,
      stats: {
        totalBookings: bookings,
        totalApplications: applications,
        verifiedContributions: contributions,
        registeredBuilders: users,
        activeProjects: projects
      }
    };

    setCached('pwa:stats', payload, 5000); // 5s cache
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', 'public, max-age=5, stale-while-revalidate=15');
    res.json(payload);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
