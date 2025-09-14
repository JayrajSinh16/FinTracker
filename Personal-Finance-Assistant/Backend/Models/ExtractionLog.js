import mongoose from 'mongoose';

const ExtractionLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    extractedTransactions: { type: Number, default: 0 },
    error: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ExtractionLog', ExtractionLogSchema);