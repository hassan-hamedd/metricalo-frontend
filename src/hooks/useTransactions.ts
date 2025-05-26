import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import * as dashboardApi from "../features/dashboard/dashboard.api";
import usePagination from "./usePagination";
import type {
  GetTransactionsParams,
  PaginatedTransactions,
} from "../features/dashboard/dashboard.api";

/**
 * Custom hook for fetching transactions with pagination
 */
export const useTransactions = (initialParams: GetTransactionsParams = {}) => {
  // Status filter state
  const [status, setStatus] = useState<string | undefined>(
    initialParams.status
  );

  // Initialize pagination hook
  const pagination = usePagination({
    page: initialParams.page || 1,
    limit: initialParams.limit || 10,
  });

  // Build params for API call
  const params = {
    page: pagination.page,
    limit: pagination.limit,
    status,
  };

  // Query transactions
  const { data, isLoading, error, refetch, isFetching } =
    useQuery<PaginatedTransactions>({
      queryKey: ["transactions", params],
      queryFn: () => dashboardApi.getTransactions(params),
      staleTime: 1000 * 60 * 2, // 2 minutes
      placeholderData: (prevData) => prevData, // This replaces keepPreviousData in v5+
    });

  // Update pagination when total changes
  useEffect(() => {
    if (data?.total) {
      pagination.updateConfig({ total: data.total });
    }
  }, [data?.total, pagination]);

  // Filter by status
  const filterByStatus = (newStatus: string | undefined) => {
    setStatus(newStatus);
    pagination.goToPage(1); // Reset to first page when filtering
  };

  return {
    transactions: data?.data ?? [],
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: pagination.totalPages,
    },
    isLoading,
    isFetching,
    error,
    refetch,
    params,
    changePage: pagination.goToPage,
    changePageSize: (limit: number) => {
      pagination.updateConfig({ limit });
      pagination.goToPage(1);
    },
    filterByStatus,
  };
};

export default useTransactions;
