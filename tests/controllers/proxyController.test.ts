import request from 'supertest';
import app from '../../src/app';
import { AppService } from '../../src/services/AppService';
import axios from 'axios';

jest.mock('../../src/services/AppService');
jest.mock('axios');

describe('ProxyController', () => {
  it('should proxy a request successfully', async () => {
    (AppService.getApp as jest.Mock).mockResolvedValue({
      baseUrl: 'http://localhost:3000',
    });
    (axios as jest.Mocked<typeof axios>).mockResolvedValue({
      status: 200,
      data: { message: 'Success' },
    });

    const response = await request(app).get('/api/apis/677cd31eb0f2c4b53bdcec59/api/users/677bddfa9a704c49d60713f1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Success' });
  });

  it('should return 404 if the app is not found', async () => {
    (AppService.getApp as jest.Mock).mockResolvedValue(null);

    const response = await request(app).get('/api/api/677cd31eb0f2c4b53bdcec59/api/users/677bddfa9a704c49d60713f1');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('App not found');
  });

  it('should handle axios errors gracefully', async () => {
    (AppService.getApp as jest.Mock).mockResolvedValue({
      baseUrl: 'http://example.com',
    });
    (axios as jest.Mocked<typeof axios>).mockRejectedValue(new Error('Request failed'));

    const response = await request(app).get('/api/api/677cd31eb0f2c4b53bdcec59/api/users/677bddfa9a704c49d60713f1');

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to proxy request');
  });
});
