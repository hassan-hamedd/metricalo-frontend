import { FiStar } from "react-icons/fi";
import Card from "../../../../components/ui/Card/Card";
import styles from "./GoalAchievement.module.scss";

interface GoalAchievementProps {
  value: string;
  // We'll keep label in the interface for future flexibility
  label?: string;
}

// We're hardcoding the label value to match the exact screenshot
const GoalAchievement = ({ value }: GoalAchievementProps) => {
  return (
    <Card className="goal-achievement-card">
      <div className={styles.header}>
        <h2 className={styles.title}>Goal Achieved</h2>
        <button className={styles.starButton} aria-label="Favorite">
          <FiStar size={20} style={{ fill: "#F0F0F0", stroke: "#B0B0B0" }} />
        </button>
      </div>
      
      <div className={styles.content}>
        <div className={styles.valueContainer}>
          <div className={styles.value}>
            <span className={styles.arrow}>↑</span>
            {value}
          </div>
        </div>
        
        <div className={styles.label}>
          improvement in<br />
          customer retention
        </div>
      </div>
    </Card>
  );
};

export default GoalAchievement; 