import { parseDate } from '../utils/dateParser.js';

function parseTableToTransactions(table) {
    if (!table || table.length < 2) {
        return []; // Need at least header + 1 data row
    }
    
    // table: array of rows, each row is array of cell strings
    const transactions = [];
    
    // Skip header row and process data rows
    for (let i = 1; i < table.length; i++) {
        const row = table[i];
        if (!row || row.length < 5) continue; // skip incomplete rows
        
        // Clean and extract data
        const [dateStr, description, category, type, amountStr] = row.map(cell => 
            typeof cell === 'string' ? cell.trim() : String(cell || '').trim()
        );
        
        // Skip empty rows
        if (!dateStr && !description && !category && !type && !amountStr) continue;
        
        // Parse amount - handle various formats
        let amount = 0;
        if (amountStr) {
            // Remove currency symbols, commas, and extract numeric value
            const cleanAmount = amountStr.replace(/[^\d.-]/g, '');
            const numericAmount = parseFloat(cleanAmount);
            if (!isNaN(numericAmount)) {
                // Check if original string indicates negative (-, parentheses, etc.)
                amount = amountStr.includes('-') || amountStr.includes('(') ? 
                    -Math.abs(numericAmount) : numericAmount;
            }
        }
        
        // Parse date
        const parsedDate = parseDate(dateStr);
        
        // Only add transaction if we have essential data
        if (parsedDate && description && amount !== 0) {
            transactions.push({
                date: parsedDate,
                description: description,
                category: category || 'Other',
                type: type || (amount > 0 ? 'Income' : 'Expense'),
                amount: amount
            });
        }
    }
    
    return transactions;
}

export { parseTableToTransactions };