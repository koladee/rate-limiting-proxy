import express from 'express';
import {ProxyController} from '../../controllers/proxyController';
import {rateLimitMiddleware} from '../../middleware/rateLimitMiddleware';
import {authenticateApiKey} from '../../middleware/authMiddleware';

const proxyRoutes = express.Router();

// Apply rate limit middleware to all proxy requests
proxyRoutes.use('/:appId/*', authenticateApiKey, rateLimitMiddleware);

// Forward requests to the proxy handler
proxyRoutes.all('/:appId/*', ProxyController.proxyRequest);

export default proxyRoutes;

