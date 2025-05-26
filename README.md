# Metricalo Frontend

This is the frontend application for Metricalo, built with React, TypeScript, and Vite.

## Table of Contents

- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Architecture](#architecture)
- [Clean Code Standards](#clean-code-standards)
- [Contributing](#contributing)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-organization/metricalo-frontend.git
cd metricalo-frontend

# Install dependencies
npm install
```

## Development

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

## Testing

This project follows Test-Driven Development (TDD) principles. We use Vitest, React Testing Library, and Cypress for comprehensive testing.

```bash
# Run unit and integration tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run end-to-end tests with Cypress
npm run test:e2e

# Open Cypress Test Runner
npm run cypress:open
```

### Testing Structure

- Tests are co-located with the code they test
- Naming convention: `*.test.ts` or `*.test.tsx` for unit/integration tests
- End-to-end tests are in `cypress/e2e` directory
- Common test utilities are in `src/tests/test-utils.tsx`

### Test Types

1. **Unit Tests**: Test individual functions, hooks, or components in isolation
2. **Integration Tests**: Test interactions between components
3. **UI Tests**: Test the UI components rendering and user interactions
4. **End-to-End Tests**: Test complete user flows from a user's perspective

### Testing Documentation

For more detailed information about our testing approach:

- [Unit and Integration Testing](docs/testing.md)
- [End-to-End Testing](docs/end-to-end-testing.md)

## Architecture

The project follows a feature-based architecture combined with clean separation of concerns:

```
src/
├── assets/         # Static assets (images, fonts, etc.)
├── components/     # Shared UI components
│   └── ui/         # Base UI components (Button, Input, etc.)
├── features/       # Feature modules
│   ├── auth/       # Authentication feature
│   └── dashboard/  # Dashboard feature
├── hooks/          # Custom React hooks
├── lib/            # External library configurations
├── state/          # Global state management
├── styles/         # Global styles
├── tests/          # Test utilities and setup
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Clean Code Standards

We follow these clean code principles:

1. **Single Responsibility**: Each component/function should do one thing well
2. **DRY (Don't Repeat Yourself)**: Avoid duplication
3. **KISS (Keep It Simple, Stupid)**: Favor simplicity over complexity
4. **Meaningful Names**: Use clear, descriptive names
5. **Comments**: Use comments to explain why, not what
6. **Error Handling**: Handle errors gracefully
7. **Testing**: Write tests for all functionality
8. **Consistency**: Follow the established code style

### Code Style

- Use functional components with hooks
- Prefer TypeScript interfaces over types for public APIs
- Use named exports for components
- Follow the ESLint rules configured in the project

## Contributing

1. Create a feature branch from `main`
2. Implement your changes following the clean code standards
3. Write tests for your code
4. Submit a pull request

### Pull Request Checklist

- [ ] Code follows the project's coding standards
- [ ] Tests have been added or updated
- [ ] Documentation has been updated
- [ ] All tests pass
