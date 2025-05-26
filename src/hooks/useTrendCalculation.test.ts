import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTrendCalculation } from './useTrendCalculation';
import type { WeeklyTrendData } from '../types/dashboard';

describe('useTrendCalculation', () => {
  it('should return zero trend for empty data', () => {
    const { result } = renderHook(() => useTrendCalculation([]));
    
    expect(result.current.trendPercentage.value).toBe(0);
    expect(result.current.trendPercentage.isPositive).toBe(true);
  });
  
  it('should return zero trend for single data point', () => {
    const trendData: WeeklyTrendData[] = [
      { date: '2023-01-01', value: 100 }
    ];
    
    const { result } = renderHook(() => useTrendCalculation(trendData));
    
    expect(result.current.trendPercentage.value).toBe(0);
    expect(result.current.trendPercentage.isPositive).toBe(true);
  });
  
  it('should calculate positive trend correctly', () => {
    const trendData: WeeklyTrendData[] = [
      { date: '2023-01-01', value: 100 },
      { date: '2023-01-02', value: 150 }
    ];
    
    const { result } = renderHook(() => useTrendCalculation(trendData));
    
    // (150 - 100) / 100 * 100 = 50%
    expect(result.current.trendPercentage.value).toBe(50);
    expect(result.current.trendPercentage.isPositive).toBe(true);
  });
  
  it('should calculate negative trend correctly', () => {
    const trendData: WeeklyTrendData[] = [
      { date: '2023-01-01', value: 200 },
      { date: '2023-01-02', value: 100 }
    ];
    
    const { result } = renderHook(() => useTrendCalculation(trendData));
    
    // (100 - 200) / 200 * 100 = -50%, but value is absolute
    expect(result.current.trendPercentage.value).toBe(50);
    expect(result.current.trendPercentage.isPositive).toBe(false);
  });
  
  it('should handle multiple data points and calculate trend from last two', () => {
    const trendData: WeeklyTrendData[] = [
      { date: '2023-01-01', value: 100 },
      { date: '2023-01-02', value: 120 },
      { date: '2023-01-03', value: 110 },
      { date: '2023-01-04', value: 132 }
    ];
    
    const { result } = renderHook(() => useTrendCalculation(trendData));
    
    // (132 - 110) / 110 * 100 = 20%
    expect(result.current.trendPercentage.value).toBe(20);
    expect(result.current.trendPercentage.isPositive).toBe(true);
  });
  
  it('should round percentage to nearest integer', () => {
    const trendData: WeeklyTrendData[] = [
      { date: '2023-01-01', value: 100 },
      { date: '2023-01-02', value: 123.45 }
    ];
    
    const { result } = renderHook(() => useTrendCalculation(trendData));
    
    // (123.45 - 100) / 100 * 100 = 23.45%, rounded to 23%
    expect(result.current.trendPercentage.value).toBe(23);
    expect(result.current.trendPercentage.isPositive).toBe(true);
  });
}); 