import { Router, Request, Response } from 'express';
import { crmService } from '../services/crmService.js';
import { statusService } from '../services/statusService.js';
import { antiSpamCheck } from '../middleware/security.js';
import { enquiryLimiter } from '../middleware/rateLimiter.js';

const router = Router();

/**
 * POST /api/application/enquiry
 * Submit visitor enquiry to CRM via Backend Layer
 */
router.post(
  '/enquiry',
  enquiryLimiter,
  antiSpamCheck,
  async (req: Request, res: Response) => {
    const { type, orgName, contactName, email, phone, message } = req.body;

    if (!type || !contactName || !email || !message) {
      return res.status(400).json({
        error: 'BadRequest',
        message: 'Missing required fields: type, contactName, email, and message are mandatory.'
      });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'BadRequest',
        message: 'Please provide a valid email address.'
      });
    }

    try {
      const result = await crmService.submitEnquiry({
        type,
        orgName,
        contactName,
        email,
        phone,
        message,
        ipAddress: req.ip || req.socket.remoteAddress
      });

      res.status(result.isDuplicate ? 200 : 201).json({
        success: true,
        refCode: result.refCode,
        status: result.publicStatus,
        message: result.message,
        isDuplicate: result.isDuplicate || false
      });
    } catch (err: any) {
      res.status(500).json({
        error: 'CRMIntegrationError',
        message: 'Unable to deliver enquiry to CRM at this moment. Please reach us directly at brandexhq@gmail.com.'
      });
    }
  }
);

/**
 * POST /api/application/status
 * Anti-Enumeration Protected Status Checker
 */
router.post('/status', async (req: Request, res: Response) => {
  const { refCode, email } = req.body;

  if (!refCode || !email) {
    return res.status(400).json({
      success: false,
      message: 'Both application reference code and registered email are required.'
    });
  }

  const result = await statusService.checkApplicationStatus({
    refCode,
    email
  });

  if (!result.success) {
    return res.status(404).json(result);
  }

  res.json(result);
});

export default router;
