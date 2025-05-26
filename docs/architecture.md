# Architecture Documentation

## Project Architecture

This project follows a feature-based architecture combined with clean separation of concerns. The architecture is designed to be scalable, maintainable, and testable.

## Folder Structure

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

## Architecture Layers

The architecture is separated into the following layers:

1. **UI Layer** (`components/`): Presentational components that render the UI
2. **Feature Layer** (`features/`): Domain-specific components and logic
3. **Data Access Layer** (`lib/`, `state/`): API clients and state management
4. **Utility Layer** (`utils/`, `hooks/`): Reusable utilities and hooks

## Features

Features are self-contained modules that represent a specific business domain or user flow:

```
features/
└── auth/                # Authentication feature
    ├── components/      # Feature-specific components
    │   ├── LoginForm.tsx
    │   └── SignupForm.tsx
    ├── hooks/           # Feature-specific hooks
    │   └── useAuthForm.ts
    ├── auth.api.ts      # API functions for the feature
    └── auth.types.ts    # TypeScript types for the feature
```

## Components

Components are organized by their scope and responsibility:

1. **UI Components** (`components/ui/`): Base UI components that are used across the application
2. **Feature Components** (`features/*/components/`): Components specific to a feature
3. **Layout Components** (`components/layout/`): Components that define the overall layout

Each component should follow these principles:
- Single responsibility
- Isolation (minimal dependencies on other components)
- Clear API (well-defined props)
- Testability

## State Management

State is managed at different levels:

1. **Component State**: Using React's `useState` hook for component-specific state
2. **Feature State**: Using React's `useContext` or feature-specific hooks
3. **Global State**: Using React Query for server state and a global context for application state

## Data Flow

The data flow follows a unidirectional pattern:

1. User interacts with the UI
2. UI components call hooks or event handlers
3. Hooks/handlers update state or call API functions
4. State changes trigger re-renders in the UI

## API Communication

API communication is handled by the `apiClient` module in `src/lib/apiClient.ts`, which is built on top of Axios:

- Centralized configuration
- Authentication handling
- Error handling
- Request/response interceptors

## Error Handling

Errors are handled at multiple levels:

1. **API Level**: In the API client for network errors
2. **Feature Level**: In feature-specific hooks for domain errors
3. **UI Level**: In components for display errors

## Routing

Routing is implemented using React Router:

1. **Public Routes**: Accessible to all users
2. **Private Routes**: Accessible only to authenticated users
3. **Feature Routes**: Grouped by feature

## Authentication

Authentication is implemented with a token-based approach:

1. User logs in and receives an access token and refresh token
2. Access token is stored in memory and attached to API requests
3. Refresh token is used to get a new access token when needed

## Styling

Styling is implemented using CSS Modules with SCSS:

1. **Global Styles**: In `src/styles/`
2. **Component Styles**: Co-located with components in `.module.scss` files
3. **Theme Variables**: In `src/styles/variables.scss`

## Conclusion

This architecture follows clean code principles, separation of concerns, and industry best practices. It provides a solid foundation for building a maintainable and scalable application. 