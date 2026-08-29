import { Request, Response, NextFunction } from 'express';

/**
 * Anti-Spam Middleware for Public Forms
 */
export const antiSpamCheck = (req: Request, res: Response, next: NextFunction) => {
  const { honeypot, website_url_check, formRenderTime } = req.body;

  // 1. Honeypot check
  if ((honeypot && honeypot.trim() !== '') || (website_url_check && website_url_check.trim() !== '')) {
    // Silently trap spam bot
    return res.status(200).json({
      success: true,
      refCode: 'BX-SPAM-TRAPPED',
      message: 'Your submission has been queued.'
    });
  }

  // 2. Minimum human submission timing check (if timestamp provided)
  if (formRenderTime) {
    const elapsed = Date.now() - parseInt(formRenderTime, 10);
    if (elapsed < 2000) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Form submitted suspiciously quickly. Please review your entries and try again.'
      });
    }
  }

  next();
};

/**
 * Safe Global Error Handler
 * Never leaks stack traces, environment secrets, or raw CRM errors
 */
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const isDev = process.env.NODE_ENV === 'development';
  const statusCode = err.statusCode || 500;

  console.error(`[API Error] ${req.method} ${req.path}:`, err.message || err);

  res.status(statusCode).json({
    error: err.name || 'InternalServerError',
    message: statusCode === 500
      ? 'An unexpected error occurred processing your request. Please contact support if this persists.'
      : err.message,
    ...(isDev ? { stack: err.stack } : {})
  });
};
