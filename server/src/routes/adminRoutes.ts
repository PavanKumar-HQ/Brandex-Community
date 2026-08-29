import { Router, Request, Response } from 'express';
import { authService } from '../services/authService.js';
import { contentService } from '../services/contentService.js';
import { crmService } from '../services/crmService.js';
import { auditService } from '../services/auditService.js';
import { retentionService } from '../services/retentionService.js';
import { requireAuth, requirePermission, requireSuperAdmin, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

/**
 * Admin Login: POST /api/admin/auth/login
 */
router.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'BadRequest', message: 'Email and password are required' });
  }

  const result = await authService.authenticate(
    email,
    password,
    req.ip || req.socket.remoteAddress
  );

  if (!result) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid administrative credentials'
    });
  }

  res.json({
    success: true,
    token: result.token,
    user: result.user
  });
});

/**
 * Current User Info: GET /api/admin/auth/me
 */
router.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    user: req.user
  });
});

/* =========================================================================
   CONTENT CMS MANAGEMENT (Enforcing granular RBAC per entity)
   ========================================================================= */

// Map entity type to required permission
const getEntityPermission = (entity: string) => `content:${entity}`;

/**
 * List all items in entity (including drafts & archives)
 */
router.get(
  '/content/:entity',
  requireAuth,
  (req: AuthenticatedRequest, res: Response, next) => {
    requirePermission(getEntityPermission(req.params.entity))(req, res, next);
  },
  (req: Request, res: Response) => {
    const { entity } = req.params;
    const items = contentService.getAdminItems(entity);
    res.json({ success: true, entity, count: items.length, data: items });
  }
);

/**
 * Create new item (defaults to DRAFT)
 */
router.post(
  '/content/:entity',
  requireAuth,
  (req: AuthenticatedRequest, res: Response, next) => {
    requirePermission(getEntityPermission(req.params.entity))(req, res, next);
  },
  (req: AuthenticatedRequest, res: Response) => {
    const { entity } = req.params;
    const item = contentService.createItem(entity, req.body, {
      id: req.user!.sub,
      email: req.user!.email,
      role: req.user!.role
    });
    res.status(201).json({ success: true, data: item });
  }
);

/**
 * Update item & record revision
 */
router.put(
  '/content/:entity/:id',
  requireAuth,
  (req: AuthenticatedRequest, res: Response, next) => {
    requirePermission(getEntityPermission(req.params.entity))(req, res, next);
  },
  (req: AuthenticatedRequest, res: Response) => {
    const { entity, id } = req.params;
    const item = contentService.updateItem(
      entity,
      id,
      req.body,
      {
        id: req.user!.sub,
        email: req.user!.email,
        role: req.user!.role
      },
      req.body.changesSummary || 'Admin edit'
    );
    res.json({ success: true, data: item });
  }
);

/**
 * Transition Status: PUT /api/admin/content/:entity/:id/status
 * e.g. DRAFT -> IN_REVIEW -> PUBLISHED -> ARCHIVED
 */
router.put(
  '/content/:entity/:id/status',
  requireAuth,
  (req: AuthenticatedRequest, res: Response, next) => {
    requirePermission(getEntityPermission(req.params.entity))(req, res, next);
  },
  (req: AuthenticatedRequest, res: Response) => {
    const { entity, id } = req.params;
    const { status } = req.body;

    const validStatuses = ['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'BadRequest', message: `Invalid status '${status}'` });
    }

    const item = contentService.setStatus(entity, id, status, {
      id: req.user!.sub,
      email: req.user!.email,
      role: req.user!.role
    });
    res.json({ success: true, data: item });
  }
);

/**
 * Restore Revision: POST /api/admin/content/:entity/:id/revisions/:revisionId/restore
 */
router.post(
  '/content/:entity/:id/revisions/:revisionId/restore',
  requireAuth,
  (req: AuthenticatedRequest, res: Response, next) => {
    requirePermission(getEntityPermission(req.params.entity))(req, res, next);
  },
  (req: AuthenticatedRequest, res: Response) => {
    const { entity, id, revisionId } = req.params;
    const item = contentService.restoreRevision(entity, id, revisionId, {
      id: req.user!.sub,
      email: req.user!.email,
      role: req.user!.role
    });
    res.json({ success: true, message: `Restored revision ${revisionId}`, data: item });
  }
);

/* =========================================================================
   ENQUIRIES MANAGEMENT
   ========================================================================= */

router.get(
  '/enquiries',
  requireAuth,
  requirePermission('enquiry:read'),
  (req: Request, res: Response) => {
    const enquiries = crmService.getTemporaryEnquiries();
    res.json({ success: true, count: enquiries.length, data: enquiries });
  }
);

router.put(
  '/enquiries/:refCode/status',
  requireAuth,
  requirePermission('enquiry:update'),
  (req: AuthenticatedRequest, res: Response) => {
    const { refCode } = req.params;
    const { status, notes } = req.body;

    const updated = crmService.updateLeadStatus(refCode, status, notes);
    if (!updated) {
      return res.status(404).json({ error: 'NotFound', message: `Enquiry ${refCode} not found in CRM` });
    }

    auditService.log({
      actorEmail: req.user!.email,
      actorRole: req.user!.role,
      action: 'ENQUIRY_STATUS_UPDATED',
      entity: 'enquiry',
      entityId: refCode,
      summary: `Updated enquiry status to ${status}. Notes: ${notes || 'none'}`
    });

    res.json({ success: true, refCode, status, message: 'CRM status updated successfully' });
  }
);

/* =========================================================================
   AUDIT TRAIL & SYSTEM MAINTENANCE
   ========================================================================= */

router.get(
  '/audit-logs',
  requireAuth,
  requireSuperAdmin,
  (req: Request, res: Response) => {
    const logs = auditService.getLogs(100);
    res.json({ success: true, count: logs.length, data: logs });
  }
);

/**
 * Manual Data Retention Cleanup Trigger
 */
router.post(
  '/system/cleanup',
  requireAuth,
  requireSuperAdmin,
  (req: Request, res: Response) => {
    const result = retentionService.runCleanup();
    res.json({
      success: true,
      message: `Data retention cleanup completed. Purged ${result.purgedCount} expired records older than 30 days.`,
      result
    });
  }
);

export default router;
