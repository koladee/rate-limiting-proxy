import { AnalyticsController } from '../../src/controllers/analyticsController';
import { AnalyticsService } from '../../src/services/AnalyticsService';

jest.mock('../../services/AnalyticsService');

describe('AnalyticsController', () => {
  it('should return usage trends', async () => {
    const mockTrends = [{ _id: '/api/test', count: 5 }];
    AnalyticsService.getUsageTrends = jest.fn().mockResolvedValue(mockTrends);

    const req = { params: { appId: 'testApp' } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    await AnalyticsController.getUsageTrends(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTrends);
  });

  // Add tests for other endpoints...
});
