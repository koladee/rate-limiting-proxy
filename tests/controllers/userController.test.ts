import request from 'supertest';
import app from '../../src/app';
import { UserService } from '../../src/services/UserService';

jest.mock('../../src/services/UserService');

describe('UserController', () => {
  describe('registerUser', () => {
    it('should return 201 for valid user data', async () => {
      (UserService.registerUser as jest.Mock).mockResolvedValue({ _id: '123', firstname: 'Test', lastaname: 'User' });
      const response = await request(app)
        .post('/api/users/register')
        .send({ firstname: 'Test', lastname: 'User', email: 'test@example.com' });

      expect(response.status).toBe(201);
      expect(response.body?.firstname).toEqual('Test');
    });

    it('should return 400 for invalid data', async () => {
      (UserService.registerUser as jest.Mock).mockRejectedValue(new Error('Invalid data'));
      const response = await request(app).post('/api/users/register').send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid data');
    });
  });

  describe('getUser', () => {
    it('should return 200 for a valid userId', async () => {
      (UserService.getUserById as jest.Mock).mockResolvedValue({ id: '123', name: 'Test User' });
      const response = await request(app).get('/api/users/677bddfa9a704c49d60713f1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: '123', name: 'Test User' });
    });

    it('should return 404 if the user is not found', async () => {
      (UserService.getUserById as jest.Mock).mockResolvedValue(null);
      const response = await request(app).get('/api/users/677bddfa9a704c49d60713f1');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });
  });
});
