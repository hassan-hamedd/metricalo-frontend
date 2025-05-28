import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";

// Mock the useAuth hook
const mockUseAuth = vi.fn();
vi.mock("../../../hooks/useAuth", () => ({
  default: () => mockUseAuth(),
}));

// Test components for routing
const TestProtectedComponent = () => <div>Protected Content</div>;
const TestLoginComponent = () => <div>Login Page</div>;

describe("PrivateRoute", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("Authentication States", () => {
    it("should render protected content when user is authenticated", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });

      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/login" element={<TestLoginComponent />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="dashboard" element={<TestProtectedComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText("Protected Content")).toBeInTheDocument();
      expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
    });

    it("should redirect to login when user is not authenticated", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });

      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/login" element={<TestLoginComponent />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="dashboard" element={<TestProtectedComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText("Login Page")).toBeInTheDocument();
      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("should show loading when auth state is loading", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
      });

      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/login" element={<TestLoginComponent />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="dashboard" element={<TestProtectedComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
      expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
    });

    it("should show loading with correct CSS class", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
      });

      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/login" element={<TestLoginComponent />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="dashboard" element={<TestProtectedComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      const loadingElement = screen.getByText("Loading...");
      expect(loadingElement).toHaveClass("loading");
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined auth state gracefully", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: undefined,
        isLoading: false,
      });

      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/login" element={<TestLoginComponent />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="dashboard" element={<TestProtectedComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      // Should redirect to login when isAuthenticated is falsy
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });

    it("should handle null auth state gracefully", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: null,
        isLoading: false,
      });

      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/login" element={<TestLoginComponent />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="dashboard" element={<TestProtectedComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      // Should redirect to login when isAuthenticated is falsy
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });

    it("should prioritize loading state over authentication state", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: true,
      });

      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/login" element={<TestLoginComponent />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="dashboard" element={<TestProtectedComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      // Should show loading even if authenticated is true
      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });
  });

  describe("Navigation Behavior", () => {
    it("should use replace navigation when redirecting to login", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });

      // We can't easily test the replace prop directly, but we can ensure
      // the redirect happens and the login page is rendered
      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/login" element={<TestLoginComponent />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="dashboard" element={<TestProtectedComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });

  describe("Component Integration", () => {
    it("should work with nested routes", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });

      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/login" element={<TestLoginComponent />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="dashboard" element={<div>Dashboard</div>} />
              <Route path="profile" element={<div>Profile</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      // Should render the nested route content
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
    });

    it("should handle multiple authentication state changes", () => {
      // Test loading state
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
      });

      const { unmount } = render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/login" element={<TestLoginComponent />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="dashboard" element={<TestProtectedComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByText("Loading...")).toBeInTheDocument();
      unmount();

      // Test not authenticated state
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });
      const { unmount: unmount2 } = render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/login" element={<TestLoginComponent />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="dashboard" element={<TestProtectedComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByText("Login Page")).toBeInTheDocument();
      unmount2();

      // Test authenticated state
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });
      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/login" element={<TestLoginComponent />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="dashboard" element={<TestProtectedComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );
      expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper semantic structure when loading", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
      });

      render(
        <MemoryRouter initialEntries={["/dashboard"]}>
          <Routes>
            <Route path="/login" element={<TestLoginComponent />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="dashboard" element={<TestProtectedComponent />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      const loadingElement = screen.getByText("Loading...");
      expect(loadingElement.tagName).toBe("DIV");
      expect(loadingElement).toHaveClass("loading");
    });
  });

  describe("Direct Component Testing", () => {
    it("should render loading state directly", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
      });

      render(<PrivateRoute />);

      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toHaveClass("loading");
    });

    it("should render Navigate component when not authenticated", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });

      // When testing the component directly without router context,
      // Navigate will throw an error, so we need to wrap it
      expect(() => render(<PrivateRoute />)).toThrow();
    });

    it("should render Outlet when authenticated", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });

      // When testing the component directly without router context,
      // Outlet will render nothing but won't throw
      const { container } = render(<PrivateRoute />);
      expect(container.firstChild).toBeNull();
    });
  });
}); 