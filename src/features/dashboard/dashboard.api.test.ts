import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getDashboardSummary, getTransactions } from "./dashboard.api";
import type { GetTransactionsParams } from "./dashboard.api";
import type {
  DashboardSummary,
  Transaction,
  TransactionStatus,
} from "../../types/dashboard";
import * as mockData from "../../lib/mockData";

// Mock the mockData module
vi.mock("../../lib/mockData", () => ({
  generateDashboardSummary: vi.fn(),
  generateTransactions: vi.fn(),
}));

describe("dashboard.api", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getDashboardSummary", () => {
    it("should return dashboard summary data after delay", async () => {
      const mockSummary: DashboardSummary = {
        totalPaymentVolume: 12500,
        weeklyTrend: [
          { date: "2023-01-01", value: 1000 },
          { date: "2023-01-02", value: 1200 },
        ],
        recentTransactions: [
          {
            id: "1",
            date: "2023-01-01",
            amount: 100,
            status: "completed" as TransactionStatus,
            customerName: "John Doe",
            paymentMethod: "Credit Card",
            reference: "REF123",
          },
        ],
        successRate: 95,
        pendingTransactions: 3,
        failedTransactions: 2,
      };

      vi.mocked(mockData.generateDashboardSummary).mockReturnValue(mockSummary);

      const summaryPromise = getDashboardSummary();

      // Fast-forward timer to complete the setTimeout
      vi.advanceTimersByTime(800);

      const result = await summaryPromise;

      expect(result).toEqual(mockSummary);
      expect(mockData.generateDashboardSummary).toHaveBeenCalledTimes(1);
    });

    it("should simulate API delay of 800ms", async () => {
      const mockSummary = {
        totalPaymentVolume: 0,
        weeklyTrend: [],
        recentTransactions: [],
        successRate: 0,
        pendingTransactions: 0,
        failedTransactions: 0,
      };

      vi.mocked(mockData.generateDashboardSummary).mockReturnValue(mockSummary);

      const summaryPromise = getDashboardSummary();

      // Should not resolve before 800ms
      vi.advanceTimersByTime(799);
      let resolved = false;
      summaryPromise.then(() => {
        resolved = true;
      });
      await Promise.resolve(); // Allow microtasks to run
      expect(resolved).toBe(false);

      // Should resolve after 800ms
      vi.advanceTimersByTime(1);
      await summaryPromise;
      expect(resolved).toBe(true);
    });
  });

  describe("getTransactions", () => {
    const mockTransactions: Transaction[] = [
      {
        id: "1",
        date: "2023-01-01",
        amount: 100,
        status: "completed" as TransactionStatus,
        customerName: "John Doe",
        paymentMethod: "Credit Card",
        reference: "REF123",
      },
      {
        id: "2",
        date: "2023-01-02",
        amount: 200,
        status: "pending" as TransactionStatus,
        customerName: "Jane Smith",
        paymentMethod: "Bank Transfer",
        reference: "REF124",
      },
      {
        id: "3",
        date: "2023-01-03",
        amount: 150,
        status: "completed" as TransactionStatus,
        customerName: "Bob Johnson",
        paymentMethod: "Credit Card",
        reference: "REF125",
      },
    ];

    beforeEach(() => {
      vi.mocked(mockData.generateTransactions).mockReturnValue(
        mockTransactions
      );
    });

    it("should return paginated transactions with default parameters", async () => {
      const transactionsPromise = getTransactions();

      vi.advanceTimersByTime(600);

      const result = await transactionsPromise;

      expect(result).toEqual({
        data: mockTransactions,
        total: 3,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      expect(mockData.generateTransactions).toHaveBeenCalledWith(50);
    });

    it("should handle custom page and limit parameters", async () => {
      const params: GetTransactionsParams = {
        page: 2,
        limit: 2,
      };

      const transactionsPromise = getTransactions(params);

      vi.advanceTimersByTime(600);

      const result = await transactionsPromise;

      expect(result).toEqual({
        data: [mockTransactions[2]], // Third transaction (page 2, limit 2)
        total: 3,
        page: 2,
        limit: 2,
        totalPages: 2,
      });
    });

    it("should filter transactions by status", async () => {
      const params: GetTransactionsParams = {
        status: "completed",
      };

      const transactionsPromise = getTransactions(params);

      vi.advanceTimersByTime(600);

      const result = await transactionsPromise;

      const completedTransactions = mockTransactions.filter(
        (t) => t.status === "completed"
      );
      expect(result).toEqual({
        data: completedTransactions,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it("should handle status filter with pagination", async () => {
      const params: GetTransactionsParams = {
        status: "completed",
        page: 1,
        limit: 1,
      };

      const transactionsPromise = getTransactions(params);

      vi.advanceTimersByTime(600);

      const result = await transactionsPromise;

      expect(result).toEqual({
        data: [mockTransactions[0]], // First completed transaction
        total: 2, // Total completed transactions
        page: 1,
        limit: 1,
        totalPages: 2,
      });
    });

    it("should return empty data for non-existent status", async () => {
      const params: GetTransactionsParams = {
        status: "non-existent",
      };

      const transactionsPromise = getTransactions(params);

      vi.advanceTimersByTime(600);

      const result = await transactionsPromise;

      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });
    });

    it("should handle empty page (beyond available data)", async () => {
      const params: GetTransactionsParams = {
        page: 10,
        limit: 10,
      };

      const transactionsPromise = getTransactions(params);

      vi.advanceTimersByTime(600);

      const result = await transactionsPromise;

      expect(result).toEqual({
        data: [],
        total: 3,
        page: 10,
        limit: 10,
        totalPages: 1,
      });
    });

    it("should calculate totalPages correctly", async () => {
      // Mock more transactions to test pagination calculation
      const manyTransactions: Transaction[] = Array.from(
        { length: 25 },
        (_, i) => ({
          id: `${i + 1}`,
          date: "2023-01-01",
          amount: 100,
          status: "completed" as TransactionStatus,
          customerName: `User ${i + 1}`,
          paymentMethod: "Credit Card",
          reference: `REF${i + 1}`,
        })
      );

      vi.mocked(mockData.generateTransactions).mockReturnValue(
        manyTransactions
      );

      const params: GetTransactionsParams = {
        limit: 10,
      };

      const transactionsPromise = getTransactions(params);

      vi.advanceTimersByTime(600);

      const result = await transactionsPromise;

      expect(result.totalPages).toBe(3); // 25 transactions / 10 per page = 3 pages
      expect(result.total).toBe(25);
      expect(result.data).toHaveLength(10);
    });

    it("should simulate API delay of 600ms", async () => {
      const transactionsPromise = getTransactions();

      // Should not resolve before 600ms
      vi.advanceTimersByTime(599);
      let resolved = false;
      transactionsPromise.then(() => {
        resolved = true;
      });
      await Promise.resolve(); // Allow microtasks to run
      expect(resolved).toBe(false);

      // Should resolve after 600ms
      vi.advanceTimersByTime(1);
      await transactionsPromise;
      expect(resolved).toBe(true);
    });

    it("should handle edge case with zero limit", async () => {
      const params: GetTransactionsParams = {
        limit: 0,
      };

      const transactionsPromise = getTransactions(params);

      vi.advanceTimersByTime(600);

      const result = await transactionsPromise;

      expect(result.totalPages).toBe(Infinity);
      expect(result.data).toEqual([]);
    });
  });
});
