import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import GoalAchievement from './GoalAchievement';

describe('GoalAchievement', () => {
  it('renders with the correct title', () => {
    render(<GoalAchievement value="48.6%" label="customer retention" />);
    
    expect(screen.getByText('Goal Achieved')).toBeInTheDocument();
  });
  
  it('displays the correct value and label', () => {
    render(<GoalAchievement value="48.6%" label="customer retention" />);
    
    expect(screen.getByText('48.6%')).toBeInTheDocument();
  });
}); 