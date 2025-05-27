import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CustomerSatisfaction from './CustomerSatisfaction';

describe('CustomerSatisfaction', () => {
  const mockData = {
    countries: [
      { name: "France", percentage: 48 },
      { name: "Italy", percentage: 28 },
      { name: "Canada", percentage: 24 }
    ]
  };

  it('renders the component title', () => {
    render(<CustomerSatisfaction data={mockData} />);
    
    expect(screen.getByText('Customers Satisfaction')).toBeInTheDocument();
  });
  
  it('displays all country names in the legend', () => {
    render(<CustomerSatisfaction data={mockData} />);
    
    mockData.countries.forEach(country => {
      expect(screen.getByText(country.name)).toBeInTheDocument();
    });
  });
  
  it('renders the pie chart container', () => {
    render(<CustomerSatisfaction data={mockData} />);
    
    // Check if the pie chart container is rendered
    const pieChart = screen.getByTestId('pie-chart-container');
    expect(pieChart).toBeTruthy();
  });
  
  it('renders the correct number of pie segments', () => {
    render(<CustomerSatisfaction data={mockData} />);
    
    // Check if there's a segment for each country
    const pieSegments = screen.getAllByTestId('pie-segment');
    expect(pieSegments.length).toBe(mockData.countries.length);
  });
  
  it('renders the correct number of legend items', () => {
    render(<CustomerSatisfaction data={mockData} />);
    
    // Check if there's a legend item for each country
    const legendItems = screen.getAllByTestId('legend-item');
    expect(legendItems.length).toBe(mockData.countries.length);
  });
}); 