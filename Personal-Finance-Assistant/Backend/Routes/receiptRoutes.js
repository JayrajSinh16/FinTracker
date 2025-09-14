import express from 'express';
import {
    processReceipt,
    previewReceipt,
    createFromPreview,
    getReceiptHistory,
    deleteReceiptLog,
    upload
} from '../Controllers/receiptControllers.js';
import protectRoute from '../middleware/authMiddleware.js';

const router = express.Router();

// All receipt routes require authentication
router.use(protectRoute);

// Process receipt and automatically create transactions
router.post('/process', upload.single('receipt'), processReceipt);

// Preview receipt without creating transactions (for manual review)
router.post('/preview', upload.single('receipt'), previewReceipt);

// Create transactions from preview data after manual review
router.post('/create-from-preview', createFromPreview);

// Get receipt processing history
router.get('/history', getReceiptHistory);

// Delete receipt log
router.delete('/history/:id', deleteReceiptLog);

export default router;