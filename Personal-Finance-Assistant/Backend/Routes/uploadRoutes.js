import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { uploadFile, confirmTransactions } from '../Controllers/uploadController.js';
import authMiddleware from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Upload file for extraction
router.post('/file', authMiddleware, upload.single('file'), uploadFile);

// Confirm and save transactions
router.post('/confirm', authMiddleware, confirmTransactions);

export default router;
