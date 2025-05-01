export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

// utils/formatting.ts

/**
 * Format a number as currency (USD)
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Capitalize the first letter of a string
 * @param str - The string to capitalize
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Format a date to a locale string
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
// export const formatDate = (dateString: string): string => {
//   return new Date(dateString).toLocaleDateString();
// };