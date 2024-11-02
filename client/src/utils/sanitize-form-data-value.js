export default function sanitizeFormDataValue(value) {
    if(value === null || value === undefined) return '';
    if(typeof value === 'string') return value.trim();
    return value;
};