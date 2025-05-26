/**
 * Utility functions for formatting values
 */

/**
 * Format a numeric value as currency (USD)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

/**
 * Format a date string to show only the day of week
 */
export const formatDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "short" }).substring(0, 3);
};

/**
 * Format a percentage trend value with + or - sign
 */
export const formatTrendValue = (value: number): string => {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value}%`;
};
