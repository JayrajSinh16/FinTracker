function validateTransaction(tx) {
    // Basic validation for required fields
    if (!tx || typeof tx !== 'object') return false;
    if (!tx.date || !tx.description) return false;
    if (isNaN(tx.amount) || tx.amount === 0) return false;
    if (!tx.type || !['Income', 'Expense'].includes(tx.type)) return false;

    return true;
}

function validateTransactions(transactions) {
    if (!Array.isArray(transactions)) return [];
    return transactions.filter(validateTransaction);
}

export { validateTransaction, validateTransactions };