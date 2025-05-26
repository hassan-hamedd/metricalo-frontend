export interface DashboardSummary {
  totalPaymentVolume: number;
  weeklyTrend: WeeklyTrendData[];
  recentTransactions: Transaction[];
  successRate: number;
  pendingTransactions: number;
  failedTransactions: number;
}

export interface WeeklyTrendData {
  date: string;
  value: number;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: TransactionStatus;
  customerName: string;
  paymentMethod: string;
  reference: string;
}

export type TransactionStatus = "completed" | "pending" | "failed";
