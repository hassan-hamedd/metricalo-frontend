import type {
  DashboardSummary,
  Transaction,
  TransactionStatus,
  WeeklyTrendData,
} from "../types/dashboard";
import type { LoginResponse, User } from "../types/auth";

/**
 * Generate mock weekly trend data for the last 7 days
 */
export const generateWeeklyTrendData = (): WeeklyTrendData[] => {
  const data: WeeklyTrendData[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
      value: Math.floor(Math.random() * 10000) + 5000, // Random value between 5000 and 15000
    });
  }

  return data;
};

/**
 * Generate a mock transaction with random data
 */
const generateTransaction = (id: string): Transaction => {
  const statuses: TransactionStatus[] = ["completed", "pending", "failed"];
  const paymentMethods = [
    "Credit Card",
    "Debit Card",
    "PayPal",
    "Bank Transfer",
  ];
  const names = [
    "John Smith",
    "Sarah Johnson",
    "Michael Brown",
    "Emily Davis",
    "David Wilson",
    "Jessica Lee",
    "Alex Martinez",
    "Rachel Taylor",
  ];

  // Generate a date within the last 7 days
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 7));

  return {
    id,
    date: date.toISOString(),
    amount: Math.floor(Math.random() * 1000) + 100, // Between 100 and 1100
    status: statuses[Math.floor(Math.random() * statuses.length)],
    customerName: names[Math.floor(Math.random() * names.length)],
    paymentMethod:
      paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    reference: `REF-${Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase()}`,
  };
};

/**
 * Generate mock transactions data
 */
export const generateTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];

  for (let i = 0; i < count; i++) {
    transactions.push(generateTransaction(`t-${i + 1}`));
  }

  return transactions;
};

/**
 * Generate a mock dashboard summary
 */
export const generateDashboardSummary = (): DashboardSummary => {
  const transactions = generateTransactions(10);
  const weeklyTrend = generateWeeklyTrendData();

  // Calculate the total from the weekly trend
  const totalPaymentVolume = weeklyTrend.reduce(
    (sum, day) => sum + day.value,
    0
  );

  const completedCount = transactions.filter(
    (t) => t.status === "completed"
  ).length;
  const pendingCount = transactions.filter(
    (t) => t.status === "pending"
  ).length;
  const failedCount = transactions.filter((t) => t.status === "failed").length;

  return {
    totalPaymentVolume,
    weeklyTrend,
    recentTransactions: transactions,
    successRate: Math.round((completedCount / transactions.length) * 100),
    pendingTransactions: pendingCount,
    failedTransactions: failedCount,
  };
};

/**
 * Mock user data
 */
export const mockUser: User = {
  id: "user-1",
  email: "demo@example.com",
  firstName: "Demo",
  lastName: "User",
  role: "admin",
};

/**
 * Generate a mock login response
 */
export const generateLoginResponse = (): LoginResponse => {
  return {
    accessToken: "mock-access-token-" + Math.random().toString(36).substring(2),
    refreshToken:
      "mock-refresh-token-" + Math.random().toString(36).substring(2),
    user: mockUser,
  };
};
