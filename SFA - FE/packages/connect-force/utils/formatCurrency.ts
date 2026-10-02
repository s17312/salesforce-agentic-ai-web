export const formatCurrency = (amount: number | undefined | null): string => {
  if (amount === null || amount === undefined) return "0.00";
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatVolume3Decimals = (amount: number | undefined | null): string => {
  if (amount === null || amount === undefined) return "0.000";
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
};

/**
 * Converts a value to number, stripping commas if present.
 * @param value - A string or number to format.
 * @returns The numeric value.
 */
export function parseCurruncyToNumber(value: string | number): number {
  return Number(String(value).replace(/,/g, ''));
}

export const formatRate = (amount: number | undefined | null): string => {
  if (amount === null || amount === undefined) return "0";
  return amount.toLocaleString("en-US");
};
