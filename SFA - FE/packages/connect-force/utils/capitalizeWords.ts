// Utility function to capitalize the first letter of every word
export const capitalizeWords = (str: string) => {
    if (typeof str !== 'string') {
        throw new TypeError('Expected a string');
    }
    return str.replace(/\b\w/g, char => char.toUpperCase());
};