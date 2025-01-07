import { enqueueRequest, processQueue } from '../../src/services/RequestQueue';
import { Request, Response, NextFunction } from 'express';

describe('RequestQueue Service', () => {
  let mockQueue: Array<[Request, Response, NextFunction]>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockQueue = [];
    mockReq = { params: { appId: '677cd31eb0f2c4b53bdcec59' } };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('should enqueue a request successfully', () => {
    enqueueRequest(mockReq as Request, mockRes as Response, mockNext);
    expect(mockQueue.length).toBeGreaterThan(0);
  });

  it('should process a queued request', async () => {
    enqueueRequest(mockReq as Request, mockRes as Response, mockNext);

    await processQueue();

    expect(mockNext).toHaveBeenCalled();
    expect(mockQueue.length).toBe(0);
  });

  it('should handle an empty queue gracefully', async () => {
    await expect(processQueue()).resolves.not.toThrow();
  });
});
