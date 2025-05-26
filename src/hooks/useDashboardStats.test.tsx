import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDashboardStats } from './useDashboardStats';
import * as dashboardApi from '../features/dashboard/dashboard.api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import type { DashboardSummary } from '../types/dashboard';

// Mock the dashboard API
vi.mock('../features/dashboard/dashboard.api', () => ({
  getDashboardSummary: vi.fn(),
}));

// Setup QueryClient wrapper for tests
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useDashboardStats', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', async () => {
    // Mock the API to not resolve immediately
    vi.mocked(dashboardApi.getDashboardSummary).mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.dashboardData).toBeUndefined();
  });

  it('should fetch and return dashboard data', async () => {
    const mockData: DashboardSummary = {
      totalPaymentVolume: 12500,
      weeklyTrend: [
        { date: '2023-01-01', value: 1000 },
        { date: '2023-01-02', value: 1200 },
      ],
      recentTransactions: [
        {
          id: '1',
          date: '2023-01-01',
          amount: 100,
          status: 'completed',
          customerName: 'John Doe',
          paymentMethod: 'Credit Card',
          reference: 'REF123',
        },
      ],
      successRate: 95,
      pendingTransactions: 3,
      failedTransactions: 2,
    };

    vi.mocked(dashboardApi.getDashboardSummary).mockResolvedValue(mockData);

    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the data to be loaded
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check that data is properly returned
    expect(result.current.dashboardData).toEqual(mockData);
    expect(result.current.totalPaymentVolume).toBe(mockData.totalPaymentVolume);
    expect(result.current.weeklyTrend).toEqual(mockData.weeklyTrend);
    expect(result.current.recentTransactions).toEqual(mockData.recentTransactions);
    expect(result.current.successRate).toBe(mockData.successRate);
    expect(result.current.pendingTransactions).toBe(mockData.pendingTransactions);
    expect(result.current.failedTransactions).toBe(mockData.failedTransactions);
  });

  it('should return default values when data is undefined', async () => {
    // Mock returning undefined from the API call
    vi.mocked(dashboardApi.getDashboardSummary).mockResolvedValue(null as unknown as DashboardSummary);

    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: createWrapper(),
    });

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check default values
    expect(result.current.totalPaymentVolume).toBe(0);
    expect(result.current.weeklyTrend).toEqual([]);
    expect(result.current.recentTransactions).toEqual([]);
    expect(result.current.successRate).toBe(0);
    expect(result.current.pendingTransactions).toBe(0);
    expect(result.current.failedTransactions).toBe(0);
  });

  it('should handle error state', async () => {
    const error = new Error('Failed to fetch dashboard data');
    vi.mocked(dashboardApi.getDashboardSummary).mockRejectedValue(error);

    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: createWrapper(),
    });

    // Wait for the query to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check error state
    expect(result.current.error).toBeDefined();
  });
}); 