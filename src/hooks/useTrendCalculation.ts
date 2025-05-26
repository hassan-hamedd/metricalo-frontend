import type { WeeklyTrendData } from "../types/dashboard";

/**
 * Interface for trend percentage result
 */
export interface TrendPercentage {
  value: number;
  isPositive: boolean;
}

/**
 * Custom hook for calculating trends from data
 */
export const useTrendCalculation = (trendData: WeeklyTrendData[]) => {
  /**
   * Calculate percentage change between last two data points
   */
  const calculateTrendPercentage = (): TrendPercentage => {
    if (trendData.length < 2) {
      return { value: 0, isPositive: true };
    }

    const currentValue = trendData[trendData.length - 1].value;
    const previousValue = trendData[trendData.length - 2].value;

    const percentageChange =
      ((currentValue - previousValue) / previousValue) * 100;

    return {
      value: Math.abs(Math.round(percentageChange)),
      isPositive: percentageChange >= 0,
    };
  };

  return {
    trendPercentage: calculateTrendPercentage(),
  };
};

export default useTrendCalculation;
