import { isImage, isPDF, deleteFile } from '../utils/fileUtils.js';
import { extractTextFromImage } from '../services/ocrService.js';
import { extractTextFromPDF, extractTablesFromPDF } from '../services/pdfService.js';
import { parseTableToTransactions } from '../services/tableParserService.js';
import { validateTransactions } from '../services/validationService.js';
import ExtractionLog from '../Models/ExtractionLog.js';
import Transaction from '../Models/Transaction.js';

// POST /api/upload/file
export const uploadFile = async (req, res, next) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const userId = req.user ? req.user._id : null; // adapt to your auth
    const log = new ExtractionLog({
        user: userId,
        fileName: req.file.filename,
        fileType: req.file.mimetype,
        status: 'pending'
    });
    await log.save();
    try {
        let tableRows = [];
        if (isImage(req.file.path)) {
            const text = await extractTextFromImage(req.file.path);
            // Simple table split: split lines, then split by | or whitespace
            tableRows = text.split('\n').map(line => line.split(/\s{2,}|\t|\|/));
        } else if (isPDF(req.file.path)) {
            try {
                const tables = await extractTablesFromPDF(req.file.path);
                if (tables && tables.length > 0 && tables[0].tables && tables[0].tables.length > 0) {
                    tableRows = tables[0].tables;
                } else {
                    // Fallback: For PDFs without extractable tables, return a helpful message
                    deleteFile(req.file.path);
                    log.status = 'failed';
                    log.error = 'No table data found in PDF';
                    await log.save();
                    return res.status(400).json({
                        error: 'Could not extract table data from PDF. Please try uploading an image of the table instead, or ensure your PDF contains clear tabular data.'
                    });
                }
            } catch (e) {
                // Fallback: For PDFs that can't be processed
                deleteFile(req.file.path);
                log.status = 'failed';
                log.error = e.message;
                await log.save();
                return res.status(400).json({
                    error: 'PDF processing failed. Please try uploading an image (JPG/PNG) of your transaction table instead.'
                });
            }
        } else {
            return res.status(400).json({ error: 'Unsupported file type' });
        }
        const transactions = parseTableToTransactions(tableRows);
        const validTransactions = validateTransactions(transactions);
        log.status = 'success';
        log.extractedTransactions = validTransactions.length;
        await log.save();
        deleteFile(req.file.path);
        return res.json({ preview: validTransactions, logId: log._id });
    } catch (err) {
        log.status = 'failed';
        log.error = err.message;
        await log.save();
        deleteFile(req.file.path);
        return res.status(500).json({ error: 'Extraction failed', details: err.message });
    }
};

// POST /api/upload/confirm
export const confirmTransactions = async (req, res, next) => {
    const { transactions, logId } = req.body;
    if (!Array.isArray(transactions) || !logId) {
        return res.status(400).json({ error: 'Invalid request' });
    }
    try {
        // Optionally: validate again
        const validTransactions = validateTransactions(transactions);
        // Save to DB
        await Transaction.insertMany(validTransactions.map(tx => ({ ...tx, user: req.user._id })));
        await ExtractionLog.findByIdAndUpdate(logId, { status: 'completed' });
        return res.json({ success: true, count: validTransactions.length });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to save transactions', details: err.message });
    }
};
