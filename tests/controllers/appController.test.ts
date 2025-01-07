import request from 'supertest';
import app from '../../src/app'; // Import your Express app
import { AppService } from '../../src/services/AppService';

jest.mock('../../src/services/AppService');

describe('AppController', () => {
  describe('registerApp', () => {
    it('should return 201 with appId for valid data', async () => {
      (AppService.registerApp as jest.Mock).mockResolvedValue('mockAppId');
      const response = await request(app)
        .post('/api/apps/register')
        .send({
          name: 'Test App',
          baseUrl: 'http://localhost:3000',
          rateLimit: { strategy: 'FixedWindow', count: 10, timeWindow: 60000 },
          userId: '677bddfa9a704c49d60713f1',
        });

      expect(response.status).toBe(201);
      expect(response.body.user).toEqual('677bddfa9a704c49d60713f1');
    });

    it('should return 400 for missing data', async () => {
      const response = await request(app)
        .post('/api/apps/register')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');
    });
  });

  describe('getAppsByUser', () => {
    it('should return 200 with apps for a valid userId', async () => {
      (AppService.getAppsByUser as jest.Mock).mockResolvedValue([{ name: 'Test App' }]);
      const response = await request(app).get('/api/apps/user/677bddfa9a704c49d60713f1');

      expect(response.status).toBe(200);
      expect(response.body.name).toEqual([{ name: 'Test App' }]);
    });

    it('should return 404 if no apps are found', async () => {
      (AppService.getAppsByUser as jest.Mock).mockResolvedValue([]);
      const response = await request(app).get('/api/apps/user/677bddfa9a704c49d60713f1');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('No apps found for user');
    });
  });
});


describe('updateRateLimit', () => {
  let appId: string;

  beforeAll(async () => {
    const appInstance = await App.create({
      name: 'Test App',
      baseUrl: 'https://api.example.com',
      rateLimit: { strategy: 'FixedWindow', count: 10, timeWindow: 60000 },
      userId: 'test-user-id',
    });
    appId = appInstance._id.toString();
  });

  it('should update the rate limit configuration successfully', async () => {
    const response = await request(app)
      .patch(`/apps/${appId}/update-rate-limit`)
      .send({ strategy: 'SlidingWindow', count: 20, timeWindow: 120000 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Rate limit configuration updated successfully');
  });

  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .patch(`/apps/${appId}/update-rate-limit`)
      .send({ strategy: 'InvalidStrategy', count: -5 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid or missing rate limit strategy');
  });

  it('should return 404 if the app is not found', async () => {
    const response = await request(app)
      .patch('/apps/nonexistent-app-id/update-rate-limit')
      .send({ strategy: 'SlidingWindow', count: 10, timeWindow: 60000 });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('App not found');
  });
});
