import type { ReactNode } from "react";
import { formatTrendValue } from "../../../../utils/formatters";
import styles from "./StatCard.module.scss";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

export type IconVariant = "primary" | "success" | "warning" | "danger";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  iconVariant?: IconVariant;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard = ({
  label,
  value,
  icon,
  iconVariant = "primary",
  trend,
}: StatCardProps) => {
  return (
    <div className={styles.statCard}>
      {icon && (
        <div className={`${styles.icon} ${styles[iconVariant]}`}>{icon}</div>
      )}
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>{value}</div>
      {trend && (
        <div
          className={`${styles.trend} ${
            trend.isPositive ? styles.positive : styles.negative
          }`}
        >
          {trend.isPositive ? <FiArrowUp /> : <FiArrowDown />}
          <span>{formatTrendValue(trend.value)} from last week</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
