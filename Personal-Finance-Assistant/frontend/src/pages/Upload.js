import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadAPI } from '../services/api';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedData, setExtractedData] = useState(null);
    const [editableTransactions, setEditableTransactions] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [logId, setLogId] = useState(null);

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileSelect = (selectedFile) => {
        setError('');
        setSuccess('');

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(selectedFile.type)) {
            setError('Please upload only JPEG, PNG images, or PDF files');
            return;
        }

        // Validate file size (5MB limit)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('File size should be less than 5MB');
            return;
        }

        setFile(selectedFile);
        setExtractedData(null);
        setEditableTransactions([]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileSelect(droppedFile);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleFileInputChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            handleFileSelect(selectedFile);
        }
    };

    const processFile = async () => {
        if (!file) return;

        setIsProcessing(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await uploadAPI.uploadFile(formData);
            const data = response.data;

            setExtractedData(data);
            setEditableTransactions(data.preview || []);
            setLogId(data.logId);

        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to process file. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTransactionChange = (index, field, value) => {
        const updatedTransactions = [...editableTransactions];
        updatedTransactions[index] = {
            ...updatedTransactions[index],
            [field]: value
        };
        setEditableTransactions(updatedTransactions);
    };

    const removeTransaction = (index) => {
        const updatedTransactions = editableTransactions.filter((_, i) => i !== index);
        setEditableTransactions(updatedTransactions);
    };

    const saveTransactions = async () => {
        if (!editableTransactions.length) {
            setError('No transactions to save');
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            const response = await uploadAPI.confirmTransactions({
                transactions: editableTransactions,
                logId: logId
            });

            const data = response.data;
            setSuccess(`Successfully saved ${data.count} transactions!`);

            // Reset form after short delay
            setTimeout(() => {
                resetForm();
                navigate('/transactions');
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to save transactions');
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setExtractedData(null);
        setEditableTransactions([]);
        setError('');
        setSuccess('');
        setLogId(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    return (
        <div className="receipt-upload-container">
            {/* Instructions Section */}
            <div className="instructions-card">
                <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>How to Upload Your Transactions</h2>
                <div className="instructions-grid">
                    <div className="instruction-step">
                        <span className="instruction-icon">📋</span>
                        <h3>Prepare Your Data</h3>
                        <p>Ensure your file contains a clear table with columns: Date, Description, Category, Type, Amount</p>
                    </div>
                    <div className="instruction-step">
                        <span className="instruction-icon">📄</span>
                        <h3>Upload File</h3>
                        <p>Best results with clear JPG/PNG images. PDF support available but may be limited.</p>
                    </div>
                    <div className="instruction-step">
                        <span className="instruction-icon">✏️</span>
                        <h3>Review & Edit</h3>
                        <p>Check extracted data and make any necessary corrections</p>
                    </div>
                    <div className="instruction-step">
                        <span className="instruction-icon">💾</span>
                        <h3>Save to Database</h3>
                        <p>Confirm to add all transactions to your account</p>
                    </div>
                </div>

                <div className="tips-section">
                    <h3>💡 Tips for Better Results</h3>
                    <ul className="tips-list">
                        <li><strong>Images work best:</strong> JPG/PNG screenshots of tables give the most accurate results</li>
                        <li>Ensure table headers are clearly visible (Date, Description, Category, Type, Amount)</li>
                        <li>Use high-quality, clear images without blur or distortion</li>
                        <li>Make sure the table has consistent formatting and alignment</li>
                        <li><strong>PDF limitation:</strong> Complex PDFs may not extract properly - try image format instead</li>
                    </ul>
                </div>
            </div>

            <div className="receipt-upload-card">
                <div className="receipt-upload-header">
                    📄 Upload Transaction File
                </div>
                <p className="receipt-upload-description">
                    Upload an image or PDF containing a table of your transactions.
                    Our system will extract and parse the data for you to review and save.
                </p>

                {/* Error Message */}
                {error && (
                    <div className="receipt-error">
                        ⚠️ {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="receipt-success">
                        ✅ {success}
                    </div>
                )}

                {/* File Upload Area */}
                {!file && (
                    <div
                        className={`receipt-upload-area ${isDragOver ? 'dragover' : ''}`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="receipt-upload-icon">📎</div>
                        <div className="receipt-upload-text">
                            Drop your file here or click to browse
                        </div>
                        <div className="receipt-upload-subtext">
                            Supports: JPEG, PNG, PDF (Max 5MB)
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="receipt-upload-input"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleFileInputChange}
                        />
                    </div>
                )}

                {/* Selected File Display */}
                {file && !extractedData && (
                    <div className="receipt-selected-file">
                        <div className="receipt-file-info">
                            <span className="receipt-file-name">📄 {file.name}</span>
                            <span className="receipt-file-size">({formatFileSize(file.size)})</span>
                        </div>
                        <button
                            className="receipt-remove-button"
                            onClick={resetForm}
                            title="Remove file"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Action Buttons */}
                {file && !extractedData && (
                    <div className="receipt-button-group">
                        <button
                            className="receipt-process-button"
                            onClick={processFile}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="receipt-spinner"></div>
                                    Processing...
                                </>
                            ) : (
                                <>🔍 Extract Transactions</>
                            )}
                        </button>
                        <button
                            className="receipt-upload-another-button"
                            onClick={resetForm}
                            disabled={isProcessing}
                        >
                            📁 Choose Different File
                        </button>
                    </div>
                )}

                {/* Processing State */}
                {isProcessing && (
                    <div className="receipt-loading">
                        <div className="receipt-spinner"></div>
                        Extracting transaction data...
                    </div>
                )}
            </div>

            {/* Extracted Data Preview */}
            {extractedData && editableTransactions.length > 0 && (
                <div className="receipt-extracted-data">
                    <div className="receipt-extracted-header">
                        ✅ Extracted {editableTransactions.length} Transaction(s)
                    </div>
                    <p className="receipt-extracted-description">
                        Review and edit the extracted transactions below. You can modify any field or remove unwanted entries.
                    </p>

                    {/* Editable Transactions Table */}
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {editableTransactions.map((transaction, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="date"
                                                className="form-input"
                                                value={formatDate(transaction.date)}
                                                onChange={(e) => handleTransactionChange(index, 'date', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={transaction.description || ''}
                                                onChange={(e) => handleTransactionChange(index, 'description', e.target.value)}
                                                placeholder="Description"
                                            />
                                        </td>
                                        <td>
                                            <select
                                                className="form-select"
                                                value={transaction.category || ''}
                                                onChange={(e) => handleTransactionChange(index, 'category', e.target.value)}
                                            >
                                                <option value="">Select Category</option>
                                                <option value="Food">Food</option>
                                                <option value="Transport">Transport</option>
                                                <option value="Shopping">Shopping</option>
                                                <option value="Bills">Bills</option>
                                                <option value="Entertainment">Entertainment</option>
                                                <option value="Health">Health</option>
                                                <option value="Salary">Salary</option>
                                                <option value="Freelance">Freelance</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                className="form-select"
                                                value={transaction.type || ''}
                                                onChange={(e) => handleTransactionChange(index, 'type', e.target.value)}
                                            >
                                                <option value="">Select Type</option>
                                                <option value="Income">Income</option>
                                                <option value="Expense">Expense</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-input"
                                                value={transaction.amount || ''}
                                                onChange={(e) => handleTransactionChange(index, 'amount', parseFloat(e.target.value) || 0)}
                                                placeholder="0.00"
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className="delete-btn action-btn"
                                                onClick={() => removeTransaction(index)}
                                                title="Remove transaction"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Save Actions */}
                    <div className="receipt-form-actions">
                        <button
                            className="receipt-discard-button"
                            onClick={resetForm}
                            disabled={isUploading}
                        >
                            🗑️ Discard All
                        </button>
                        <button
                            className="receipt-save-button"
                            onClick={saveTransactions}
                            disabled={isUploading || editableTransactions.length === 0}
                        >
                            {isUploading ? (
                                <>
                                    <div className="receipt-spinner"></div>
                                    Saving...
                                </>
                            ) : (
                                <>💾 Save {editableTransactions.length} Transaction(s)</>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* No Data Extracted */}
            {extractedData && editableTransactions.length === 0 && (
                <div className="receipt-extracted-data">
                    <div className="receipt-error">
                        ⚠️ No valid transactions could be extracted from this file.
                        Please ensure your file contains a clear table with Date, Description, Category, Type, and Amount columns.
                    </div>
                    <button
                        className="receipt-upload-another-button"
                        onClick={resetForm}
                    >
                        📁 Try Another File
                    </button>
                </div>
            )}
        </div>
    );
};

export default Upload;