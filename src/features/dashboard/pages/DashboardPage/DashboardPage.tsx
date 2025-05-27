import { useState } from "react";
import RetentionProfitCard from "../../components/RetentionProfitCard/RetentionProfitCard";
import FunnelOverview from "../../components/FunnelOverview/FunnelOverview";
import CustomerSatisfaction from "../../components/CustomerSatisfaction/CustomerSatisfaction";
import GoalAchievement from "../../components/GoalAchievement/GoalAchievement";
import useDashboardStats from "../../../../hooks/useDashboardStats";
import styles from "./DashboardPage.module.scss";
import type { FunnelStep } from "../../components/FunnelOverview/FunnelChart/FunnelChart";

export const DashboardPage = () => {
  const [selectedMonth, setSelectedMonth] = useState("January / 2023");
  const { isLoading: isStatsLoading } = useDashboardStats();

  const monthlyStats = {
    newCustomers: {
      value: "11,950",
      trend: 24.57,
      isPositive: true,
    },
    retention: {
      value: "48%",
      trend: 8.57,
      isPositive: true,
    },
    profit: {
      value: "$37,457",
      trend: 6.44,
      isPositive: true,
    },
    costs: {
      value: "$16,886",
      trend: 6.27,
      isPositive: false,
    },
    roi: {
      value: "48%",
      trend: 2.77,
      isPositive: true,
    },
  };

  const satisfactionData = {
    countries: [
      { name: "France", percentage: 48 },
      { name: "Italy", percentage: 28 },
      { name: "Canada", percentage: 24 },
    ],
  };

  const funnelData: FunnelStep[] = [
    { stage: "Open Page", value: 4535 },
    { stage: "Checkout", value: 3472 },
    { stage: "Checkout Submit", value: 2839 },
    { stage: "Success Payment", value: 1035 },
    { stage: "Rebilling", value: 674 },
  ];

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardGrid}>
        <RetentionProfitCard
          stats={monthlyStats}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          isLoading={isStatsLoading}
        />

        <GoalAchievement value="48.6%" label="customer retention" />

        <FunnelOverview data={funnelData} />

        <CustomerSatisfaction data={satisfactionData} />
      </div>
    </div>
  );
};

export default DashboardPage;
