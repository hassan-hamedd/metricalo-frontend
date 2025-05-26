import { useQuery } from "@tanstack/react-query";
import * as dashboardApi from "../features/dashboard/dashboard.api";
import type { DashboardSummary } from "../types/dashboard";

/**
 * Custom hook for fetching dashboard statistics
 */
export const useDashboardStats = () => {
  const { data, isLoading, error, refetch } = useQuery<DashboardSummary>({
    queryKey: ["dashboardSummary"],
    queryFn: dashboardApi.getDashboardSummary,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    dashboardData: data,
    isLoading,
    error,
    refetch,
    // Derived data for convenience
    totalPaymentVolume: data?.totalPaymentVolume || 0,
    weeklyTrend: data?.weeklyTrend || [],
    recentTransactions: data?.recentTransactions || [],
    successRate: data?.successRate || 0,
    pendingTransactions: data?.pendingTransactions || 0,
    failedTransactions: data?.failedTransactions || 0,
  };
};

export default useDashboardStats;
