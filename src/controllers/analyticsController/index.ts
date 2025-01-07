import { Request, Response } from 'express';
import { AnalyticsService } from '../../services/AnalyticsService';

export class AnalyticsController {
  static async getUsageTrends(req: Request, res: Response) {
    try {
      const { appId } = req.params;
      const trends = await AnalyticsService.getUsageTrends(appId);
      res.status(200).json(trends);
    } catch (error) {
      console.error('Error fetching usage trends:', error);
      res.status(500).json({ error: 'Failed to fetch usage trends' });
    }
  }

  static async getAverageResponseTime(req: Request, res: Response) {
    try {
      const { appId } = req.params;
      const responseTimes = await AnalyticsService.getAverageResponseTime(appId);
      res.status(200).json(responseTimes);
    } catch (error) {
      console.error('Error fetching response times:', error);
      res.status(500).json({ error: 'Failed to fetch response times' });
    }
  }

  static async getRecentRequests(req: Request, res: Response) {
    try {
      const { appId } = req.params;
      const recentRequests = await AnalyticsService.getRecentRequests(appId);
      res.status(200).json(recentRequests);
    } catch (error) {
      console.error('Error fetching recent requests:', error);
      res.status(500).json({ error: 'Failed to fetch recent requests' });
    }
  }
}
