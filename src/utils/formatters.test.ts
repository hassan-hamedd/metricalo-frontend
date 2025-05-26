import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatDayOfWeek, formatTrendValue } from './formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers as USD currency', () => {
      expect(formatCurrency(1000)).toBe('$1,000');
      expect(formatCurrency(1234567)).toBe('$1,234,567');
    });

    it('should format negative numbers as USD currency', () => {
      expect(formatCurrency(-1000)).toBe('-$1,000');
      expect(formatCurrency(-1234567)).toBe('-$1,234,567');
    });

    it('should format decimal numbers as USD currency without decimals', () => {
      expect(formatCurrency(1000.99)).toBe('$1,001');
      expect(formatCurrency(1000.01)).toBe('$1,000');
    });

    it('should format zero as USD currency', () => {
      expect(formatCurrency(0)).toBe('$0');
    });
  });

  describe('formatDate', () => {
    it('should format ISO date strings to readable format', () => {
      expect(formatDate('2023-01-15T00:00:00.000Z')).toMatch(/Jan 1[45], 2023/);
    });

    it('should handle different date formats', () => {
      expect(formatDate('2023/12/25')).toMatch(/Dec 2[45], 2023/);
    });
  });

  describe('formatDayOfWeek', () => {
    it('should return abbreviated day of week', () => {
      // Note: specific days may vary based on timezone, so we just check format
      const result = formatDayOfWeek('2023-01-15T00:00:00.000Z');
      expect(result.length).toBeLessThanOrEqual(3);
      expect(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).toContain(result);
    });
  });

  describe('formatTrendValue', () => {
    it('should add plus sign to positive values', () => {
      expect(formatTrendValue(10)).toBe('+10%');
      expect(formatTrendValue(5.5)).toBe('+5.5%');
    });

    it('should not add plus sign to negative values', () => {
      expect(formatTrendValue(-10)).toBe('-10%');
      expect(formatTrendValue(-5.5)).toBe('-5.5%');
    });

    it('should format zero correctly', () => {
      expect(formatTrendValue(0)).toBe('0%');
    });
  });
}); 