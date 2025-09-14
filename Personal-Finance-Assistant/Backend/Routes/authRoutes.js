import express from 'express';
import { register, login, getMe } from '../Controllers/authControllers.js';
import validateUser from '../middleware/userValidation.js';
import sanitizeUser from '../middleware/userSanitization.js';
import protectRoute from '../middleware/authMiddleware.js';

const router = express.Router();

// Register new user
router.post('/register', sanitizeUser, validateUser, register);

// Login user
router.post('/login', sanitizeUser, login);

// Get current user profile
router.get('/me', protectRoute, getMe);

export default router;