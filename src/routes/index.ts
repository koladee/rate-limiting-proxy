import express from 'express';
import userRoutes from './userRoutes';
import appRoutes from './appRoutes';
import proxyRoutes from './proxyRoutes';
import analyticsRoutes from './analyticsRoutes'

const router = express.Router();

router.use('/users', userRoutes);
router.use('/apps', appRoutes);
router.use('/apis', proxyRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
