import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'brandex-enterprise-cms-jwt-secret-2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',

  // CRM Integration Settings
  crm: {
    apiUrl: process.env.CRM_API_URL || 'https://crm.brandex.internal/api/v1',
    apiKey: process.env.CRM_API_KEY || 'crm_live_secret_brandex_2026_internal',
    webhookSecret: process.env.CRM_WEBHOOK_SECRET || 'crm_wh_sec_9986880072',
    timeoutMs: parseInt(process.env.CRM_TIMEOUT_MS || '5000', 10),
    maxRetries: parseInt(process.env.CRM_MAX_RETRIES || '2', 10),
  },

  // Security & Data Retention
  retention: {
    websiteEnquiryDays: parseInt(process.env.ENQUIRY_RETENTION_DAYS || '30', 10),
    cleanupScheduleCron: process.env.CLEANUP_CRON || '0 0 * * *', // Daily midnight
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequestsPerWindow: 100, // Max 100 requests per IP per window
    enquiryMaxSubmissions: 5, // Max 5 enquiries per 15 min per IP
  }
};
