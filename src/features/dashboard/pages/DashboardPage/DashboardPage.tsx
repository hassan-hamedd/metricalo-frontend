import { useState } from "react";
import Card from "../../../../components/ui/Card/Card";
import StatCard from "../../components/StatCard/StatCard";
import TransactionList from "../../components/TransactionList/TransactionList";
import TrendChart from "../../components/TrendChart/TrendChart";
import useDashboardStats from "../../../../hooks/useDashboardStats";
import useTransactions from "../../../../hooks/useTransactions";
import useTrendCalculation from "../../../../hooks/useTrendCalculation";
import { formatCurrency } from "../../../../utils/formatters";
import styles from "./DashboardPage.module.scss";
import { FiDollarSign, FiCheckCircle, FiAlertCircle, FiXCircle } from "react-icons/fi";

export const DashboardPage = () => {
  const {
    totalPaymentVolume,
    weeklyTrend,
    successRate,
    pendingTransactions,
    failedTransactions,
    isLoading: isStatsLoading,
  } = useDashboardStats();

  const { trendPercentage } = useTrendCalculation(weeklyTrend);

  const [page, setPage] = useState(1);
  const {
    transactions,
    pagination,
    isLoading: isTransactionsLoading,
    changePage,
  } = useTransactions({ page, limit: 5 });

  return (
    <div className={styles.dashboardPage}>
      <div className="container">
        <div className={styles.header}>
          <h1>Billing Dashboard</h1>
          <p>Overview of your payment activity</p>
        </div>

        <div className={styles.statsGrid}>
          <StatCard
            label="Total Payment Volume"
            value={formatCurrency(totalPaymentVolume)}
            iconVariant="primary"
            icon={<FiDollarSign />}
            trend={trendPercentage}
          />

          <StatCard
            label="Success Rate"
            value={`${successRate}%`}
            iconVariant="success"
            icon={<FiCheckCircle />}
          />

          <StatCard
            label="Pending Transactions"
            value={pendingTransactions}
            iconVariant="warning"
            icon={<FiAlertCircle />}
          />

          <StatCard
            label="Failed Transactions"
            value={failedTransactions}
            iconVariant="danger"
            icon={<FiXCircle />}
          />
        </div>

        <div className={styles.chartSection}>
          <h2 className={styles.sectionTitle}>Weekly Payment Trend</h2>
          <Card>
            <Card.Body>
              <TrendChart data={weeklyTrend} isLoading={isStatsLoading} />
            </Card.Body>
          </Card>
        </div>

        <div className={styles.transactionsSection}>
          <h2 className={styles.sectionTitle}>Recent Transactions</h2>
          <Card>
            <Card.Body>
              <TransactionList
                transactions={transactions}
                isLoading={isTransactionsLoading}
                pagination={pagination}
                onPageChange={(newPage) => {
                  setPage(newPage);
                  changePage(newPage);
                }}
              />
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
