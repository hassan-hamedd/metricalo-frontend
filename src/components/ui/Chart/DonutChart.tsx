import React from 'react';
import styles from './Chart.module.scss';

export interface DonutChartProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  className?: string;
  showPercentage?: boolean;
  centerIcon?: React.ReactElement;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  value,
  maxValue = 100,
  size = 120,
  strokeWidth = 10,
  color = 'var(--color-accent-dark)',
  backgroundColor = 'var(--color-surface-alt)',
  label,
  className = '',
  showPercentage = true,
  centerIcon,
}) => {
  // Calculate percentage and ensure it's between 0-100
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  
  // Calculate SVG values
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = ((100 - percentage) / 100) * circumference;
  
  return (
    <div className={`${styles.donutChart} ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Foreground circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      
      <div className={styles.donutCenter}>
        {centerIcon ? (
          centerIcon
        ) : (
          <>
            <div className={styles.value}>
              {showPercentage ? `${Math.round(percentage)}%` : value}
            </div>
            {label && <div className={styles.label}>{label}</div>}
          </>
        )}
      </div>
    </div>
  );
};

// Component that displays multiple donut charts with a legend
export interface DonutChartDataItem {
  label: string;
  value: number;
  color: string;
}

export interface MultiDonutChartProps {
  data: DonutChartDataItem[];
  size?: number;
  strokeWidth?: number;
  className?: string;
  backgroundColor?: string;
  showLegend?: boolean;
  centerIcon?: React.ReactElement;
}

export const MultiDonutChart: React.FC<MultiDonutChartProps> = ({
  data,
  size = 120,
  strokeWidth = 10,
  className = '',
  backgroundColor = 'var(--color-surface-alt)',
  showLegend = true,
  centerIcon,
}) => {
  // Calculate total for percentage
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate radius and circumference
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate stroke dash offsets for each segment
  let accumulatedPercentage = 0;
  const segments = data.map(item => {
    const percentage = (item.value / total) * 100;
    const startOffset = (accumulatedPercentage / 100) * circumference;
    const dashLength = (percentage / 100) * circumference;
    accumulatedPercentage += percentage;
    
    return {
      ...item,
      percentage,
      dashOffset: circumference - startOffset,
      dashLength,
    };
  });
  
  return (
    <div className={className}>
      <div className={styles.donutChart} style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
          />
          
          {/* Segments */}
          {segments.map((segment, index) => (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${segment.dashLength} ${circumference - segment.dashLength}`}
              strokeDashoffset={segment.dashOffset}
              style={{ 
                transform: `rotate(${index > 0 ? 0 : -90}deg)`,
                transformOrigin: 'center',
              }}
            />
          ))}
        </svg>
        
        <div className={styles.donutCenter}>
          {centerIcon ? (
            centerIcon
          ) : (
            <>
              <div className={styles.value}>{total}</div>
              <div className={styles.label}>Total</div>
            </>
          )}
        </div>
      </div>
      
      {showLegend && (
        <div className={styles.legend}>
          {segments.map((segment, index) => (
            <div key={index} className={styles.legendItem}>
              <div 
                className={styles.legendColor} 
                style={{ backgroundColor: segment.color }}
              />
              <span>{segment.label}: {Math.round(segment.percentage)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default {
  Donut: DonutChart,
  MultiDonut: MultiDonutChart,
}; 