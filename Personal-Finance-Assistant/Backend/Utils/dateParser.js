import { parse, isValid } from 'date-fns';

function parseDate(dateString) {
    if (!dateString || typeof dateString !== 'string') return null;
    
    const cleanDate = dateString.trim();
    if (!cleanDate) return null;
    
    // Try parsing with common formats
    const formats = [
        'yyyy-MM-dd',
        'MM/dd/yyyy', 
        'dd/MM/yyyy',
        'dd-MM-yyyy',
        'MM-dd-yyyy',
        'yyyy/MM/dd',
        'dd.MM.yyyy',
        'MM.dd.yyyy'
    ];
    
    for (const format of formats) {
        try {
            const parsed = parse(cleanDate, format, new Date());
            if (isValid(parsed)) return parsed;
        } catch (e) {
            // Continue to next format
        }
    }
    
    // Try native Date parsing as fallback
    try {
        const nativeDate = new Date(cleanDate);
        if (isValid(nativeDate) && !isNaN(nativeDate.getTime())) {
            return nativeDate;
        }
    } catch (e) {
        // Ignore
    }
    
    return null;
}

export { parseDate };