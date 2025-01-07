import express from 'express';
import {UserController} from '../../controllers/userController';
import {authenticateApiKey} from '../../middleware/authMiddleware';

const userRoutes = express.Router();

userRoutes.post('/register', UserController.registerUser);
userRoutes.get('/:id', authenticateApiKey, UserController.getUser);

export default userRoutes;
