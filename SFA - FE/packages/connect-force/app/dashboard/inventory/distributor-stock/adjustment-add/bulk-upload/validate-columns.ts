import * as XLSX from 'xlsx';

interface ValidationResult {
    isValid: boolean;
    missingColumns: string[];
}

export const validateColumns = (file: File, expectedColumns: string[]): Promise<ValidationResult> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0] as string[];
            const missingColumns = expectedColumns.filter(col => !headers.includes(col));
            const isValid = missingColumns.length === 0;
            resolve({ isValid, missingColumns });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};