import express from 'express';
import {AppController} from '../../controllers/appController';
import {authenticateApiKey} from '../../middleware/authMiddleware';

const appRoutes = express.Router();

appRoutes.post('/register', authenticateApiKey, AppController.registerApp);
appRoutes.get('/user/:userId', authenticateApiKey, AppController.getAppsByUser);
appRoutes.patch('/:appId/update-rate-limit', authenticateApiKey, AppController.updateRateLimit);

export default appRoutes;


