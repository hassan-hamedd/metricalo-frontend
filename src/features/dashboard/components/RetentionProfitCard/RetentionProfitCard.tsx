import { FiChevronDown } from "react-icons/fi";
import Card from "../../../../components/ui/Card/Card";
import styles from "./RetentionProfitCard.module.scss";
import { BiCircle } from "react-icons/bi";

interface StatItemProps {
  label: string;
  value: string;
  trend: number;
  isPositive: boolean;
}

const StatItem = ({ label, value, trend, isPositive }: StatItemProps) => {
  const formattedTrend = `${isPositive ? "↑" : "↓"} ${Math.abs(trend).toFixed(
    2
  )}%`;
  const trendClass = isPositive ? styles.positive : styles.negative;

  return (
    <div className={styles.statItem}>
      <div className={styles.statInner}>
        <div className={styles.statLabel}>{label}</div>
        <div className={styles.statValue}>{value}</div>
        <div className={`${styles.statTrend} ${trendClass}`}>
          {formattedTrend}
        </div>
      </div>
    </div>
  );
};

interface RetentionProfitCardProps {
  stats: {
    newCustomers: { value: string; trend: number; isPositive: boolean };
    retention: { value: string; trend: number; isPositive: boolean };
    profit: { value: string; trend: number; isPositive: boolean };
    costs: { value: string; trend: number; isPositive: boolean };
    roi: { value: string; trend: number; isPositive: boolean };
  };
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  isLoading?: boolean;
}

const RetentionProfitCard = ({
  stats,
  selectedMonth,
}: // Removed unused variables but kept the props for future use
// onMonthChange,
// isLoading = false
RetentionProfitCardProps) => {
  return (
    <Card className="retention-profit-card">
      <div className={styles.header}>
        <h2 className={styles.title}>Retention & Profit</h2>

        <div className={styles.actions}>
          <div className={styles.monthSelector}>
            <button className={styles.monthButton}>
              <BiCircle className={styles.circle} />
              {selectedMonth} <FiChevronDown />
            </button>
          </div>

          <button className={styles.downloadButton}>Download</button>
        </div>
      </div>

      <div className={styles.statsContainer}>
        <StatItem
          label="NEW CUSTOMERS"
          value={stats.newCustomers.value}
          trend={stats.newCustomers.trend}
          isPositive={stats.newCustomers.isPositive}
        />

        <StatItem
          label="RETENTION"
          value={stats.retention.value}
          trend={stats.retention.trend}
          isPositive={stats.retention.isPositive}
        />

        <StatItem
          label="PROFIT"
          value={stats.profit.value}
          trend={stats.profit.trend}
          isPositive={stats.profit.isPositive}
        />

        <StatItem
          label="COSTS"
          value={stats.costs.value}
          trend={stats.costs.trend}
          isPositive={stats.costs.isPositive}
        />

        <StatItem
          label="ROI"
          value={stats.roi.value}
          trend={stats.roi.trend}
          isPositive={stats.roi.isPositive}
        />
      </div>
    </Card>
  );
};

export default RetentionProfitCard;
