/**
 * Utility functions for formatting values
 */

/**
 * Format a numeric value as currency (USD)
 */
export const format-currency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format a date string to a readable format
 */
export const format-date = (dateString: string): string => {
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
export const format-day-of-week = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "short" }).substring(0, 3);
};

/**
 * Format a percentage trend value with + or - sign
 */
export const format-trend-value = (value: number): string => {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value}%`;
};
