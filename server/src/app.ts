import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import publicRoutes from './routes/publicRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import integrationRoutes from './routes/integrationRoutes.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { globalErrorHandler } from './middleware/security.js';

import pwaRoutes from './routes/pwaRoutes.js';
import { initDatabase } from './db/index.js';

export const createApp = () => {
  // Initialize persistent SQLite database
  initDatabase();

  const app = express();

  // 1. Payload Compression (Gzip / Deflate for fast mobile & desktop payload delivery)
  app.use(compression({
    level: 6,
    threshold: 512 // compress responses larger than 512 bytes
  }));

  // 2. Security Headers & CORS
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  }));

  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CRM-Signature']
  }));

  // 2. Request Parsing
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // 3. Global Rate Limiter
  app.use(globalLimiter);

  // 4. Health Check
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });

  // 5. API Routes
  app.use('/api/pwa', pwaRoutes);
  app.use('/api/pwa/crm', integrationRoutes);
  app.use('/api/crm', integrationRoutes);
  app.use('/api/public', publicRoutes);
  app.use('/api/application', applicationRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/integrations', integrationRoutes);

  // 6. Safe Global Error Handler
  app.use(globalErrorHandler);

  return app;
};
