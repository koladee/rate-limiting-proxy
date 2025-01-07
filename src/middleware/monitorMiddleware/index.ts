import { requestCounter, responseTimeHistogram } from '../../services/MonitoringService';
import { Request, Response, NextFunction } from 'express';

export const monitorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000; // Response time in seconds
    const appId = req.params.appId || 'unknown';
    responseTimeHistogram.labels(appId).observe(duration);
    requestCounter.labels(appId, res.statusCode.toString()).inc();
  });
  next();
};
