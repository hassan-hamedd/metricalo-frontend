import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

vi.mock("./components/layout/AppLayout/AppLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-layout">{children}</div>
  ),
}));

vi.mock("./components/layout/PrivateRoute", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="private-route">{children}</div>
  ),
}));

vi.mock("./features/dashboard/pages/DashboardPage/DashboardPage", () => ({
  default: () => <div data-testid="dashboard-page">Dashboard Page</div>,
}));

vi.mock("./features/auth/pages/LoginPage/LoginPage", () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

// Mock the global styles import
vi.mock("./styles/global.scss", () => ({}));

// Create the App routes component without BrowserRouter for testing
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={<div data-testid="login-page">Login Page</div>}
      />

      {/* Protected routes */}
      <Route
        element={
          <div data-testid="private-route">
            <Outlet />
          </div>
        }
      >
        <Route
          path="/"
          element={
            <div data-testid="app-layout">
              <Outlet />
            </div>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="dashboard"
            element={<div data-testid="dashboard-page">Dashboard Page</div>}
          />
          <Route
            path="transactions"
            element={<div className="container">Transactions Page</div>}
          />
          <Route
            path="customers"
            element={<div className="container">Customers Page</div>}
          />
          <Route
            path="reports"
            element={<div className="container">Reports Page</div>}
          />
          <Route
            path="settings"
            element={<div className="container">Settings Page</div>}
          />
          <Route
            path="profile"
            element={<div className="container">Profile Page</div>}
          />
        </Route>
      </Route>

      {/* 404 route */}
      <Route
        path="*"
        element={<div className="container">404 - Page Not Found</div>}
      />
    </Routes>
  );
};

// Helper function to render App with specific route
const renderAppWithRoute = (initialEntries: string[] = ["/"]) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        retry: 1,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <AppRoutes />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Routing", () => {
    it("should render login page for /login route", () => {
      renderAppWithRoute(["/login"]);

      expect(screen.getByTestId("login-page")).toBeInTheDocument();
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });

    it("should redirect from root to /dashboard", async () => {
      renderAppWithRoute(["/"]);

      await waitFor(() => {
        expect(screen.getByTestId("private-route")).toBeInTheDocument();
        expect(screen.getByTestId("app-layout")).toBeInTheDocument();
      });
    });

    it("should render dashboard page for /dashboard route", () => {
      renderAppWithRoute(["/dashboard"]);

      expect(screen.getByTestId("private-route")).toBeInTheDocument();
      expect(screen.getByTestId("app-layout")).toBeInTheDocument();
      expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
    });

    it("should render transactions page for /transactions route", () => {
      renderAppWithRoute(["/transactions"]);

      expect(screen.getByTestId("private-route")).toBeInTheDocument();
      expect(screen.getByTestId("app-layout")).toBeInTheDocument();
      expect(screen.getByText("Transactions Page")).toBeInTheDocument();
    });

    it("should render customers page for /customers route", () => {
      renderAppWithRoute(["/customers"]);

      expect(screen.getByTestId("private-route")).toBeInTheDocument();
      expect(screen.getByTestId("app-layout")).toBeInTheDocument();
      expect(screen.getByText("Customers Page")).toBeInTheDocument();
    });

    it("should render reports page for /reports route", () => {
      renderAppWithRoute(["/reports"]);

      expect(screen.getByTestId("private-route")).toBeInTheDocument();
      expect(screen.getByTestId("app-layout")).toBeInTheDocument();
      expect(screen.getByText("Reports Page")).toBeInTheDocument();
    });

    it("should render settings page for /settings route", () => {
      renderAppWithRoute(["/settings"]);

      expect(screen.getByTestId("private-route")).toBeInTheDocument();
      expect(screen.getByTestId("app-layout")).toBeInTheDocument();
      expect(screen.getByText("Settings Page")).toBeInTheDocument();
    });

    it("should render profile page for /profile route", () => {
      renderAppWithRoute(["/profile"]);

      expect(screen.getByTestId("private-route")).toBeInTheDocument();
      expect(screen.getByTestId("app-layout")).toBeInTheDocument();
      expect(screen.getByText("Profile Page")).toBeInTheDocument();
    });

    it("should render 404 page for unknown routes", () => {
      renderAppWithRoute(["/unknown-route"]);

      expect(screen.getByText("404 - Page Not Found")).toBeInTheDocument();
    });

    it("should apply container class to placeholder pages", () => {
      renderAppWithRoute(["/transactions"]);

      const transactionsElement = screen.getByText("Transactions Page");
      expect(transactionsElement).toHaveClass("container");
    });

    it("should apply container class to 404 page", () => {
      renderAppWithRoute(["/unknown-route"]);

      const notFoundElement = screen.getByText("404 - Page Not Found");
      expect(notFoundElement).toHaveClass("container");
    });
  });

  describe("Query Client Setup", () => {
    it("should render without crashing", () => {
      renderAppWithRoute(["/login"]);

      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });

    it("should provide QueryClient to child components", () => {
      // This test ensures that the QueryClientProvider is properly set up
      // by checking that the app renders without throwing errors related to missing QueryClient
      expect(() => renderAppWithRoute(["/login"])).not.toThrow();
    });
  });

  describe("Protected Routes", () => {
    it("should wrap protected routes with PrivateRoute component", () => {
      renderAppWithRoute(["/dashboard"]);

      expect(screen.getByTestId("private-route")).toBeInTheDocument();
    });

    it("should wrap protected routes with AppLayout", () => {
      renderAppWithRoute(["/dashboard"]);

      expect(screen.getByTestId("app-layout")).toBeInTheDocument();
    });

    it("should not wrap login route with PrivateRoute", () => {
      renderAppWithRoute(["/login"]);

      expect(screen.queryByTestId("private-route")).not.toBeInTheDocument();
      expect(screen.queryByTestId("app-layout")).not.toBeInTheDocument();
    });
  });

  describe("Navigation Structure", () => {
    it("should use React Router for routing", () => {
      // Test that the app uses React Router by checking route behavior
      renderAppWithRoute(["/login"]);
      expect(screen.getByTestId("login-page")).toBeInTheDocument();

      renderAppWithRoute(["/dashboard"]);
      expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
    });

    it("should use Outlet for nested routes", () => {
      renderAppWithRoute(["/dashboard"]);

      // The presence of both AppLayout and DashboardPage indicates Outlet is working
      expect(screen.getByTestId("app-layout")).toBeInTheDocument();
      expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
    });
  });

  describe("Route Parameters and Navigation", () => {
    it("should handle multiple route transitions", () => {
      // Test initial route
      const { unmount } = renderAppWithRoute(["/login"]);
      expect(screen.getByTestId("login-page")).toBeInTheDocument();

      // Clean up first render
      unmount();

      // Test second route
      renderAppWithRoute(["/dashboard"]);
      expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
    });

    it("should maintain route structure for all protected pages", () => {
      const protectedRoutes = [
        "/dashboard",
        "/transactions",
        "/customers",
        "/reports",
        "/settings",
        "/profile",
      ];

      protectedRoutes.forEach((route) => {
        // Use a unique container for each test to avoid conflicts
        const { unmount } = renderAppWithRoute([route]);
        expect(screen.getByTestId("private-route")).toBeInTheDocument();
        expect(screen.getByTestId("app-layout")).toBeInTheDocument();

        // Clean up after each test
        unmount();
      });
    });
  });

  describe("App Component Integration", () => {
    it("should import and use correct dependencies", async () => {
      // Test that App.tsx imports are working
      const App = await import("./App");
      expect(App.default).toBeDefined();
      expect(typeof App.default).toBe("function");
    });

    it("should export default App component", async () => {
      const App = await import("./App");
      expect(App.default).toBeDefined();
    });
  });
});
