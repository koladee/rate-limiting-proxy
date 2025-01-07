import { Request, Response, NextFunction } from 'express';
import { RequestAnalytics } from '../../models/RequestAnalytics';

export const analyticsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on('finish', async () => {
    const duration = Date.now() - start;

    try {
      const analyticsData = new RequestAnalytics({
        appId: req.params.appId || 'unknown',
        endpoint: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
        responseTime: duration,
        userId: req.params.userId|| 'unknown',
      });

      await analyticsData.save();
    } catch (error) {
      console.error('Error saving request analytics:', error);
    }
  });

  next();
};
