import React from 'react';
import styles from './Chart.module.scss';

export type BarVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

export interface BarChartDataItem {
  label: string;
  value: number;
  variant?: BarVariant;
  percentage?: boolean; // If true, display as percentage
}

export interface BarChartProps {
  data: BarChartDataItem[];
  showValues?: boolean;
  maxValue?: number; // Custom max value, otherwise determined from data
  className?: string;
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  showValues = true,
  maxValue: customMaxValue,
  className = '',
  height = 8,
}) => {
  // Calculate max value from data if not provided
  const maxValue = customMaxValue || Math.max(...data.map(item => item.value), 0);

  return (
    <div className={`${styles.barChart} ${className}`}>
      {data.map((item, index) => {
        const percentage = (item.value / maxValue) * 100;
        const variant = item.variant || 'primary';
        const barStyle = {
          width: `${percentage}%`,
        };
        
        return (
          <div key={index} className={styles.barGroup}>
            <div className={styles.barLabel}>{item.label}</div>
            <div 
              className={styles.barContainer} 
              style={{ height: `${height}px` }}
            >
              <div 
                className={`${styles.bar} ${styles[`bar${variant.charAt(0).toUpperCase() + variant.slice(1)}`]}`} 
                style={barStyle}
              >
                {showValues && (
                  <span className={styles.barValue}>
                    {item.percentage ? `${item.value}%` : item.value}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BarChart; 