# Clean Code Standards

## Overview

This document outlines the clean code standards for the project. Following these standards ensures that our code is maintainable, readable, and testable.

## General Principles

1. **Single Responsibility Principle (SRP)**: Each component, function, or module should have one and only one reason to change.
2. **DRY (Don't Repeat Yourself)**: Avoid duplication by abstracting common functionality.
3. **KISS (Keep It Simple, Stupid)**: Simplicity should be a key goal, and unnecessary complexity should be avoided.
4. **YAGNI (You Aren't Gonna Need It)**: Don't add functionality until it's necessary.
5. **Separation of Concerns**: Different aspects of the code (UI, business logic, data access) should be separated.

## Naming Conventions

### Files and Directories

- Use **PascalCase** for component files: `Button.tsx`
- Use **camelCase** for utility files: `formatDate.ts`
- Use **kebab-case** for style files: `button-styles.scss`
- Group related files in directories: `Button/Button.tsx`, `Button/Button.module.scss`, `Button/Button.test.tsx`

### Variables and Functions

- Use **camelCase** for variables and functions: `const userName = 'John'`
- Use descriptive, meaningful names: `getUserData()` instead of `getData()`
- Avoid abbreviations unless they're well-known: `error` instead of `err`
- Boolean variables should be prefixed with `is`, `has`, `should`: `isLoading`, `hasError`
- Functions should use verbs: `getUser()`, `validateForm()`

### Components

- Use **PascalCase** for component names: `LoginForm`
- Props should be descriptive and use **camelCase**: `onClick`, `userData`
- Use descriptive prop names: `onSubmit` instead of `submit`

## Code Style

### Component Structure

- Import statements at the top, organized by:
  1. External libraries
  2. Internal modules
  3. Styles
- Props definition using TypeScript interface or type
- Component implementation
- Export statement

Example:

```tsx
// External libraries
import React, { useState } from 'react';

// Internal modules
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatters';

// Styles
import styles from './UserProfile.module.scss';

// Props definition
interface UserProfileProps {
  user: User;
  onUpdate?: (user: User) => void;
}

// Component implementation
export const UserProfile = ({ user, onUpdate }: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Component logic...
  
  return (
    <div className={styles.container}>
      {/* JSX */}
    </div>
  );
};
```

### Function Structure

- Keep functions small and focused on a single task
- Use early returns to avoid deep nesting
- Limit the number of parameters (use objects for many parameters)

Example:

```ts
// Good: Early returns
function validateUser(user: User): ValidationResult {
  if (!user.email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!user.password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  return { isValid: true };
}

// Bad: Deeply nested conditionals
function validateUserBad(user: User): ValidationResult {
  if (user.email) {
    if (user.password) {
      return { isValid: true };
    } else {
      return { isValid: false, error: 'Password is required' };
    }
  } else {
    return { isValid: false, error: 'Email is required' };
  }
}
```

## Comments

- Use comments to explain **why**, not **what**
- Keep comments up-to-date with code changes
- Use JSDoc comments for functions and components

Example:

```ts
/**
 * Formats a date string to a user-friendly format
 * 
 * @param dateString - The ISO date string to format
 * @returns A formatted date string (e.g., "Jan 1, 2023")
 */
export function formatDate(dateString: string): string {
  // Implementation...
}
```

## Error Handling

- Handle errors gracefully and provide meaningful error messages
- Use try/catch blocks for error handling
- Avoid swallowing errors (don't use empty catch blocks)

Example:

```ts
async function fetchUserData(userId: string): Promise<User | null> {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    // Log the error for debugging
    console.error('Failed to fetch user data:', error);
    
    // Rethrow or return null depending on the context
    return null;
  }
}
```

## Testing

- Write tests for all components and functions
- Follow the AAA pattern (Arrange, Act, Assert)
- Test both success and failure cases
- Keep tests independent of each other

Example:

```tsx
describe('Button', () => {
  it('should render with default props', () => {
    // Arrange
    render(<Button>Click me</Button>);
    
    // Act (none needed for this test)
    const button = screen.getByRole('button', { name: /click me/i });
    
    // Assert
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('primary');
  });
});
```

## TypeScript Best Practices

- Use TypeScript for type safety
- Define interfaces for props, state, and API responses
- Use type inference where appropriate
- Avoid using `any` unless absolutely necessary
- Use union types for props with multiple options

Example:

```tsx
// Define prop types
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  children: React.ReactNode;
}

// Use typed props in component
export const Button = ({ 
  variant = 'primary',
  size = 'medium',
  onClick,
  children
}: ButtonProps) => {
  // Implementation...
};
```

## Performance Considerations

- Use React.memo for expensive components
- Use useMemo and useCallback for expensive calculations and callbacks
- Avoid creating new objects or functions in render
- Use proper key props for lists
- Keep component state as local as possible

Example:

```tsx
// Use useCallback for event handlers
const handleSubmit = useCallback((data: FormData) => {
  // Implementation...
}, [/* dependencies */]);

// Use useMemo for expensive calculations
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);
```

## Conclusion

Following these clean code standards ensures that our codebase remains maintainable, readable, and testable as it grows. These standards should be followed by all team members and enforced through code reviews. 