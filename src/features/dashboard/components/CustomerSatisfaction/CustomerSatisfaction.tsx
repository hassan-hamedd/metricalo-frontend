import Card from "../../../../components/ui/Card/Card";
import styles from "./CustomerSatisfaction.module.scss";

interface CountryData {
  name: string;
  percentage: number;
}

interface CustomerSatisfactionProps {
  data: {
    countries: CountryData[];
  };
}

const PieChart = ({ countries }: { countries: CountryData[] }) => {
  // Map to keep track of the color for each country - using design system colors
  const countryColors: Record<string, string> = {
    France: '#41cf7c',  // $color-pie-france
    Italy: '#5534d2',   // $color-pie-italy  
    Canada: '#DADADA'   // $color-pie-canada
  };
  
  // Calculate the total to make sure segments add up to 100%
  const total = countries.reduce((sum, country) => sum + country.percentage, 0);
  
  // Create SVG pie chart
  const radius = 100;
  const centerX = radius;
  const centerY = radius;
  
  let currentAngle = 0;
  const segments = countries.map((country) => {
    const angle = (country.percentage / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;
    
    // Convert angles to radians
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    
    // Calculate coordinates
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    // Determine if the arc should be drawn the long way around
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    // Create SVG path
    const d = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    
    // Calculate text position (middle of the segment)
    const midAngle = startAngle + (angle / 2);
    const midRad = (midAngle - 90) * (Math.PI / 180);
    // Place text 60% of the way from center to edge
    const textRadius = radius * 0.6;
    const textX = centerX + textRadius * Math.cos(midRad);
    const textY = centerY + textRadius * Math.sin(midRad);
    
    // Determine text color based on background
    const textColor = country.name === 'Canada' ? '#333333' : '#ffffff';
    
    return {
      path: d,
      color: countryColors[country.name],
      textX,
      textY,
      percentage: country.percentage,
      name: country.name,
      textColor
    };
  });
  
  return (
    <div className={styles.pieChartContainer} data-testid="pie-chart-container">
      <svg width="200" height="200" viewBox="0 0 200 200" className={styles.pieChart}>
        {segments.map((segment, index) => (
          <g key={index} data-testid="pie-segment">
            <path
              d={segment.path}
              fill={segment.color}
              stroke="#fff"
              strokeWidth="3"
              className={styles.pieSegment}
            />
            <text
              x={segment.textX}
              y={segment.textY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={segment.textColor}
              fontSize="13px"
              fontWeight="500"
              className={styles.pieLabel}
            >
              {segment.percentage}%
            </text>
          </g>
        ))}
      </svg>
      
      <div className={styles.legend}>
        {countries.map((country, index) => (
          <div key={index} className={styles.legendItem} data-testid="legend-item">
            <div 
              className={styles.legendColor} 
              style={{ backgroundColor: countryColors[country.name] }}
            />
            <span className={styles.legendCountry}>{country.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomerSatisfaction = ({ data }: CustomerSatisfactionProps) => {
  return (
    <Card className="customer-satisfaction-card">
      <div className={styles.header}>
        <h2 className={styles.title}>Customers Satisfaction</h2>
      </div>
      
      <div className={styles.content}>
        <PieChart countries={data.countries} />
      </div>
    </Card>
  );
};

export default CustomerSatisfaction; 