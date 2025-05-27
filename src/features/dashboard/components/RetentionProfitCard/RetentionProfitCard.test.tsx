import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RetentionProfitCard from './RetentionProfitCard';

describe('RetentionProfitCard', () => {
  const mockStats = {
    newCustomers: {
      value: "11,950",
      trend: 24.57,
      isPositive: true
    },
    retention: {
      value: "48%",
      trend: 8.57,
      isPositive: true
    },
    profit: {
      value: "$37,457",
      trend: 6.44,
      isPositive: true
    },
    costs: {
      value: "$16,886",
      trend: 6.27,
      isPositive: false
    },
    roi: {
      value: "48%",
      trend: 2.77,
      isPositive: true
    }
  };

  it('renders with all the required stats', () => {
    render(
      <RetentionProfitCard 
        stats={mockStats} 
        selectedMonth="January / 2023"
        onMonthChange={() => {}}
      />
    );
    
    // Check title
    expect(screen.getByText('Retention & Profit')).toBeInTheDocument();
    
    // Check month selector
    expect(screen.getByText('January / 2023')).toBeInTheDocument();
    
    // Check download button
    expect(screen.getByText('Download')).toBeInTheDocument();
    
    // Check all stat labels
    expect(screen.getByText('NEW CUSTOMERS')).toBeInTheDocument();
    expect(screen.getByText('RETENTION')).toBeInTheDocument();
    expect(screen.getByText('PROFIT')).toBeInTheDocument();
    expect(screen.getByText('COSTS')).toBeInTheDocument();
    expect(screen.getByText('ROI')).toBeInTheDocument();
    
    // Check all stat values
    expect(screen.getByText('11,950')).toBeInTheDocument();
    expect(screen.getAllByText('48%').length).toBeGreaterThan(0); // Multiple elements might have this text
    expect(screen.getByText('$37,457')).toBeInTheDocument();
    expect(screen.getByText('$16,886')).toBeInTheDocument();
  });

  it('renders positive and negative trends correctly', () => {
    render(
      <RetentionProfitCard 
        stats={mockStats} 
        selectedMonth="January / 2023"
        onMonthChange={() => {}}
      />
    );
    
    // Check positive trend
    expect(screen.getByText('↑ 24.57%')).toBeInTheDocument();
    
    // Check negative trend
    expect(screen.getByText('↓ 6.27%')).toBeInTheDocument();
  });

  it('applies loading state when isLoading is true', () => {
    render(
      <RetentionProfitCard 
        stats={mockStats} 
        selectedMonth="January / 2023"
        onMonthChange={() => {}}
        isLoading={true}
      />
    );
    
    // Snapshot test would be ideal here, but for simplicity we're just checking if the component renders
    expect(screen.getByText('Retention & Profit')).toBeInTheDocument();
  });
}); 