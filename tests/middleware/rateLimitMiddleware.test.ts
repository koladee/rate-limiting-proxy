import { rateLimitMiddleware } from '../../src/middleware/rateLimitMiddleware';
import { Request, Response } from 'express';
import { App } from '../../src/models/App';
import { RateLimit } from '../../src/models/RateLimit';

jest.mock('../../src/models/App');
jest.mock('../../src/models/RateLimit');

describe('RateLimitMiddleware', () => {
  it('should allow request if within rate limits', async () => {
    const mockReq = { params: { appId: '1677cd31eb0f2c4b53bdcec59' } } as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
    const mockNext = jest.fn();

    (App.findById as jest.Mock).mockResolvedValue({ rateLimit: { count: 100, timeWindow: 60000 } });
    (RateLimit.findOne as jest.Mock).mockResolvedValue({ requestCount: 50, timeWindowStart: new Date() });

    await rateLimitMiddleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should queue requests if rate limit is exceeded', async () => {
    const mockReq = { params: { appId: '677cd31eb0f2c4b53bdcec59' } } as Request;
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
    const mockNext = jest.fn();

    (App.findById as jest.Mock).mockResolvedValue({ rateLimit: { count: 100, timeWindow: 60000 } });
    (RateLimit.findOne as jest.Mock).mockResolvedValue({ requestCount: 100, timeWindowStart: new Date() });

    await rateLimitMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(202);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Request queued. Will be processed shortly.' });
  });
});

describe('RateLimitMiddleware with Priority', () => {
  it('should prioritize high-priority requests', async () => {
    const lowPriorityResponse = await request(app)
      .post('/apps/123/request')
      .set('x-priority', '2')
      .send({ data: 'low priority' });

    const highPriorityResponse = await request(app)
      .post('/apps/123/request')
      .set('x-priority', '0')
      .send({ data: 'high priority' });

    expect(lowPriorityResponse.status).toBe(202);
    expect(highPriorityResponse.status).toBe(202);
    // Add checks to ensure the high-priority request is processed first
  });
});
