import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';

interface RequestBucket {
  count: number;
  resetTime: number;
}

const ipBuckets: Map<string, RequestBucket> = new Map();

/**
 * Lightweight in-memory sliding window rate limiter
 */
export const createRateLimiter = (options: {
  windowMs: number;
  maxRequests: number;
  message?: string;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const key = `${ip}:${req.baseUrl || req.path}`;

    let bucket = ipBuckets.get(key);

    if (!bucket || now > bucket.resetTime) {
      bucket = {
        count: 1,
        resetTime: now + options.windowMs
      };
      ipBuckets.set(key, bucket);
      return next();
    }

    bucket.count += 1;

    if (bucket.count > options.maxRequests) {
      const retrySec = Math.ceil((bucket.resetTime - now) / 1000);
      res.setHeader('Retry-After', retrySec);
      return res.status(429).json({
        error: 'Too Many Requests',
        message: options.message || `Rate limit exceeded. Please retry in ${retrySec} seconds.`
      });
    }

    next();
  };
};

export const globalLimiter = createRateLimiter({
  windowMs: config.rateLimit.windowMs,
  maxRequests: config.rateLimit.maxRequestsPerWindow
});

export const enquiryLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: config.rateLimit.enquiryMaxSubmissions,
  message: 'Enquiry submission rate limit reached. Please wait before submitting additional requests.'
});
