# Testing Documentation

## Testing Strategy

This project follows Test-Driven Development (TDD) principles. The testing strategy focuses on three levels of testing:

1. **Unit Tests**: Test individual functions, hooks, or components in isolation
2. **Integration Tests**: Test interactions between components
3. **UI Tests**: Test the UI components rendering and user interactions

## Test Tools

- **Vitest**: Main test runner and framework
- **React Testing Library**: For testing React components
- **jsdom**: For simulating a browser environment
- **user-event**: For simulating user interactions

## Test File Organization

Test files should be co-located with the code they test, with the following naming convention:

- `*.test.ts` or `*.test.tsx`

## Writing Tests

### Component Tests

When testing React components, follow these guidelines:

1. Test that the component renders correctly with default props
2. Test that the component renders correctly with different prop values
3. Test user interactions (clicks, form submissions, etc.)
4. Test error states and loading states

Example:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('primary');
  });
  
  it('should handle click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button', { name: /click me/i }));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Tests

When testing custom hooks, use the `renderHook` function from React Testing Library:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should initialize with the default value', () => {
    const { result } = renderHook(() => useCounter());
    
    expect(result.current.count).toBe(0);
  });
  
  it('should increment the counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### Utility Function Tests

When testing utility functions, focus on input-output relationships:

```tsx
import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatters';

describe('formatCurrency', () => {
  it('should format numbers as USD currency', () => {
    expect(formatCurrency(1000)).toBe('$1,000');
    expect(formatCurrency(-1000)).toBe('-$1,000');
  });
});
```

## Mocking

### Mocking Functions

Use `vi.fn()` to create mock functions:

```tsx
const mockFunction = vi.fn();
mockFunction('arg1', 'arg2');
expect(mockFunction).toHaveBeenCalledWith('arg1', 'arg2');
```

### Mocking Modules

Use `vi.mock()` to mock modules:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { login } from './auth';
import apiClient from '../lib/apiClient';

// Mock the apiClient module
vi.mock('../lib/apiClient', () => ({
  post: vi.fn(),
}));

describe('login', () => {
  it('should call the login endpoint', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { token: 'test-token' } });
    
    await login('test@example.com', 'password');
    
    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password',
    });
  });
});
```

## Test Coverage

Run the test coverage report to identify areas that need more testing:

```bash
npm run test:coverage
```

Aim for at least 80% coverage for critical parts of the codebase. 