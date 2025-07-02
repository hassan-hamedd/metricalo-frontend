import { z } from "zod";

export const WeeklyTrendDataSchema = z.object({
  date: z.string(),
  value: z.number(),
});
export type WeeklyTrendData = z.infer<typeof WeeklyTrendDataSchema>;

export const TransactionSchema = z.object({
  id: z.string(),
  date: z.string(),
  amount: z.number(),
  status: z.enum(["completed", "pending", "failed"]),
  customerName: z.string(),
  paymentMethod: z.string(),
  reference: z.string(),
});
export type Transaction = z.infer<typeof TransactionSchema>;

export const FunnelStepSchema = z.object({
  stage: z.string(),
  value: z.number(),
});
export type FunnelStep = z.infer<typeof FunnelStepSchema>;

export const DashboardSummarySchema = z.object({
  totalPaymentVolume: z.number(),
  weeklyTrend: z.array(WeeklyTrendDataSchema),
  recentTransactions: z.array(TransactionSchema),
  successRate: z.number(),
  pendingTransactions: z.number(),
  failedTransactions: z.number(),
});
export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;

export type TransactionStatus = "completed" | "pending" | "failed";
