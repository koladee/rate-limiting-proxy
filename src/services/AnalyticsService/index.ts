import { RequestAnalytics } from '../../models/RequestAnalytics';

export class AnalyticsService {
  static async getUsageTrends(appId: string) {
    return RequestAnalytics.aggregate([
      { $match: { appId } },
      { $group: { _id: '$endpoint', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
  }

  static async getAverageResponseTime(appId: string) {
    return RequestAnalytics.aggregate([
      { $match: { appId } },
      { $group: { _id: '$endpoint', avgResponseTime: { $avg: '$responseTime' } } },
      { $sort: { avgResponseTime: -1 } },
    ]);
  }

  static async getRecentRequests(appId: string, limit: number = 10) {
    return RequestAnalytics.find({ appId })
      .sort({ timestamp: -1 })
      .limit(limit);
  }
}
