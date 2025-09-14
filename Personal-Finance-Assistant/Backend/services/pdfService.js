import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

async function extractTextFromPDF(filePath) {
    try {
        const pdfBytes = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        // For now, we'll return a simple message indicating PDF processing is limited
        // In a production environment, you might want to use a more robust PDF text extraction library
        return "PDF content detected. Please ensure your PDF contains clear tabular data with columns: Date, Description, Category, Type, Amount";
    } catch (error) {
        throw new Error('Failed to process PDF file: ' + error.message);
    }
}

async function extractTablesFromPDF(filePath) {
    try {
        // Use pdf-table-extractor only when actually called
        const pdfTableExtractor = await import('pdf-table-extractor');
        
        return new Promise((resolve, reject) => {
            pdfTableExtractor.default(filePath, (result) => {
                if (result && result.pageTables && result.pageTables.length > 0) {
                    resolve(result.pageTables);
                } else {
                    resolve([]);
                }
            }, (err) => {
                console.warn('PDF table extraction failed:', err.message);
                resolve([]); // Return empty array instead of rejecting
            });
        });
    } catch (error) {
        console.warn('PDF table extraction not available:', error.message);
        return [];
    }
}

export { extractTextFromPDF, extractTablesFromPDF };
