import { type FC } from "react";
import Card from "../../../../components/ui/Card/Card";
import styles from "./FunnelOverview.module.scss";
import { FunnelChart, type FunnelStep } from "./FunnelChart/FunnelChart";

interface FunnelOverviewProps {
  data: FunnelStep[];
}

const FunnelOverview: FC<FunnelOverviewProps> = ({
  data,
}: FunnelOverviewProps) => {
  return (
    <Card className="funnel-overview-card">
      <header className={styles.header}>
        <h2>Funnel Overview</h2>
      </header>

      {/* numeric row */}
      <ul className={styles.metrics}>
        {data.map(({ stage, value }) => (
          <li key={stage}>
            <span className={styles.metricLabel}>{stage}</span>
            <span className={styles.metricValue}>{value.toLocaleString()}</span>
          </li>
        ))}
      </ul>

      {/* gradient chart */}
      <div className={styles.chartWrapper}>
        <FunnelChart data={data} />
      </div>
    </Card>
  );
};

export default FunnelOverview;
