import express from 'express';
import { AnalyticsController } from '../../controllers/analyticsController';
import {authenticateApiKey} from "../../middleware/authMiddleware";

const analyticsRoutes = express.Router();

analyticsRoutes.get('/:appId/trends', authenticateApiKey, AnalyticsController.getUsageTrends);
analyticsRoutes.get('/:appId/response-times', authenticateApiKey, AnalyticsController.getAverageResponseTime);
analyticsRoutes.get('/:appId/recent-requests', authenticateApiKey, AnalyticsController.getRecentRequests);

export default analyticsRoutes;
