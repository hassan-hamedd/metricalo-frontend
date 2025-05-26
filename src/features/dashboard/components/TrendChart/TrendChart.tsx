import type { WeeklyTrendData } from "../../../../types/dashboard";
import { formatCurrency, formatDayOfWeek } from "../../../../utils/formatters";
import styles from "./TrendChart.module.scss";

export interface TrendChartProps {
  data: WeeklyTrendData[];
  isLoading?: boolean;
}

export const TrendChart = ({ data, isLoading = false }: TrendChartProps) => {
  if (isLoading) {
    return <div className={styles.noData}>Loading chart data...</div>;
  }

  if (!data.length) {
    return <div className={styles.noData}>No trend data available</div>;
  }

  // Find the maximum value to scale the chart
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className={styles.container}>
      <div className={styles.chart}>
        {data.map((item, index) => {
          // Calculate height percentage
          const heightPercent = (item.value / maxValue) * 100;

          return (
            <div
              key={index}
              className={styles.bar}
              style={{ height: `${heightPercent}%` }}
            >
              <div className={styles.barInner} style={{ height: "100%" }} />
              <div className={styles.tooltip}>{formatCurrency(item.value)}</div>
              <div className={styles.label}>{formatDayOfWeek(item.date)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendChart;
