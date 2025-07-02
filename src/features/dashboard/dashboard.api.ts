// import apiClient from "../../lib/apiClient";
import {
  generateDashboardSummary,
  generateTransactions,
} from "../../lib/mockData";
import type { DashboardSummary, Transaction } from "./domain/dashboard-schema";
import { DashboardSummarySchema, TransactionSchema, FunnelStepSchema } from "./domain/dashboard-schema";

/**
 * Fetch dashboard summary data
 */
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  // In a real app, this would call the API
  // return apiClient.get<DashboardSummary>('/dashboard/summary').then(res => res.data);

  // For now, we'll use mock data
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve(generateDashboardSummary());
    }, 800);
  });
};

/**
 * Fetch transactions with pagination
 */
export interface GetTransactionsParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface PaginatedTransactions {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getTransactions = async (
  params: GetTransactionsParams = {}
): Promise<PaginatedTransactions> => {
  // In a real app, this would call the API
  // return apiClient.get<PaginatedTransactions>('/transactions', { params }).then(res => res.data);

  // For now, we'll use mock data
  const { page = 1, limit = 10 } = params;

  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Generate 50 transactions for demonstration purposes
      const allTransactions = generateTransactions(50);

      // Filter by status if provided
      const filteredTransactions = params.status
        ? allTransactions.filter((t) => t.status === params.status)
        : allTransactions;

      // Calculate pagination
      const total = filteredTransactions.length;
      const totalPages = Math.ceil(total / limit);

      // Slice the data for the requested page
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const data = filteredTransactions.slice(startIndex, endIndex);

      resolve({
        data,
        total,
        page,
        limit,
        totalPages,
      });
    }, 600);
  });
};
