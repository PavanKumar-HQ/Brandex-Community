import { Router } from 'express';
import crypto from 'crypto';
import { crmService } from '../services/crmService.js';
import { auditService } from '../services/auditService.js';
import { config } from '../config/env.js';
const router = Router();
/**
 * POST /api/integrations/crm/webhook
 * Receives status updates from CRM
 */
router.post('/crm/webhook', (req, res) => {
    const signature = req.headers['x-crm-signature'];
    const payload = JSON.stringify(req.body);
    // Validate CRM Webhook signature if secret configured
    if (config.crm.webhookSecret && signature) {
        const expected = crypto.createHmac('sha256', config.crm.webhookSecret).update(payload).digest('hex');
        if (signature !== expected) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Invalid webhook signature' });
        }
    }
    const { refCode, newStatus, actionInstructions, actionDeadline } = req.body;
    if (!refCode || !newStatus) {
        return res.status(400).json({ error: 'BadRequest', message: 'refCode and newStatus required' });
    }
    const success = crmService.updateLeadStatus(refCode, newStatus, actionInstructions);
    auditService.log({
        actorEmail: 'crm-webhook',
        actorRole: 'SUPER_ADMIN',
        action: 'CRM_WEBHOOK_STATUS_SYNC',
        entity: 'crm_sync',
        entityId: refCode,
        summary: `CRM pushed status update '${newStatus}' for ref ${refCode}`
    });
    res.json({
        success,
        refCode,
        newStatus,
        receivedAt: new Date().toISOString()
    });
});
export default router;
