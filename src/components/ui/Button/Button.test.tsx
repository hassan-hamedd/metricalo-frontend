import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';
import styles from './Button.module.scss';

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(styles.button);
    expect(button).toHaveClass(styles.primary);
    expect(button).toHaveClass(styles.medium);
  });
  
  it('should render with custom variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    
    const button = screen.getByRole('button', { name: /secondary button/i });
    
    expect(button).toHaveClass(styles.secondary);
    expect(button).not.toHaveClass(styles.primary);
  });
  
  it('should render with custom size', () => {
    render(<Button size="large">Large Button</Button>);
    
    const button = screen.getByRole('button', { name: /large button/i });
    
    expect(button).toHaveClass(styles.large);
    expect(button).not.toHaveClass(styles.medium);
  });
  
  it('should render with outline style', () => {
    render(<Button outline>Outline Button</Button>);
    
    const button = screen.getByRole('button', { name: /outline button/i });
    
    expect(button).toHaveClass(styles.outline);
  });
  
  it('should render with full width', () => {
    render(<Button fullWidth>Full Width Button</Button>);
    
    const button = screen.getByRole('button', { name: /full width button/i });
    
    expect(button).toHaveClass(styles.fullWidth);
  });
  
  it('should handle onClick event', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByRole('button', { name: /disabled button/i });
    
    expect(button).toBeDisabled();
  });
  
  it('should merge additional className', () => {
    render(<Button className="custom-class">Custom Class Button</Button>);
    
    const button = screen.getByRole('button', { name: /custom class button/i });
    
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass(styles.button);
  });
}); 