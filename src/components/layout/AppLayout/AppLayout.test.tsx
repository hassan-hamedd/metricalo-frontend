import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AppLayout } from "./AppLayout";

// Mock the useAuth hook
const mockLogout = vi.fn();
const mockUser = {
  id: "1",
  email: "test@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "user" as const,
};

const mockUseAuth = vi.fn();
vi.mock("../../../hooks/useAuth", () => ({
  default: () => mockUseAuth(),
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the Logo component
vi.mock("../../ui/Logo", () => ({
  default: () => <div data-testid="logo">Logo</div>,
}));

// Wrapper component for router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("AppLayout", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
    mockLogout.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderAppLayout = (children = <div>Test Content</div>) => {
    return render(
      <RouterWrapper>
        <AppLayout>{children}</AppLayout>
      </RouterWrapper>
    );
  };

  describe("Basic Rendering", () => {
    it("should render the layout structure", () => {
      renderAppLayout();

      expect(screen.getByRole("banner")).toBeInTheDocument(); // header
      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getAllByRole("navigation")).toHaveLength(2); // desktop and mobile nav
    });

    it("should render children content", () => {
      renderAppLayout(<div data-testid="test-content">Custom Content</div>);

      expect(screen.getByTestId("test-content")).toBeInTheDocument();
      expect(screen.getByText("Custom Content")).toBeInTheDocument();
    });

    it("should render the logo", () => {
      renderAppLayout();

      expect(screen.getByTestId("logo")).toBeInTheDocument();
    });
  });

  describe("User Information Display", () => {
    it("should display user name and email", () => {
      renderAppLayout();

      // User name appears in button and dropdown header
      expect(screen.getAllByText("John Doe")).toHaveLength(2);
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("should display user avatar with correct src", () => {
      renderAppLayout();

      const avatar = screen.getByAltText("John Doe");
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute(
        "src",
        "https://ui-avatars.com/api/?name=John+Doe&background=random"
      );
    });

    it("should handle user with different name", () => {
      mockUseAuth.mockReturnValue({
        user: { ...mockUser, firstName: "Jane", lastName: "Smith" },
        logout: mockLogout,
      });

      renderAppLayout();

      expect(screen.getAllByText("Jane Smith")).toHaveLength(2);
      const avatar = screen.getByAltText("Jane Smith");
      expect(avatar).toHaveAttribute(
        "src",
        "https://ui-avatars.com/api/?name=Jane+Smith&background=random"
      );
    });
  });

  describe("Navigation Links", () => {
    it("should render all navigation links", () => {
      renderAppLayout();

      // General section
      expect(screen.getAllByRole("link", { name: /dashboard/i })).toHaveLength(
        2 // desktop nav + mobile nav (logo link doesn't have "dashboard" text)
      );
      expect(
        screen.getAllByRole("link", { name: /transactions/i })
      ).toHaveLength(2);
      expect(screen.getAllByRole("link", { name: /customers/i })).toHaveLength(
        2
      );
      expect(screen.getAllByRole("link", { name: /reports/i })).toHaveLength(2);

      // Payment Processing section
      expect(
        screen.getAllByRole("link", { name: /payment methods/i })
      ).toHaveLength(2);
      expect(
        screen.getAllByRole("link", { name: /notifications/i })
      ).toHaveLength(2);
      expect(screen.getAllByRole("link", { name: /settings/i })).toHaveLength(
        3 // desktop nav + mobile nav + user menu
      );
    });

    it("should have correct href attributes for navigation links", () => {
      renderAppLayout();

      const dashboardLinks = screen.getAllByRole("link", {
        name: /dashboard/i,
      });
      dashboardLinks.forEach((link) => {
        expect(link).toHaveAttribute("href", "/dashboard");
      });

      const transactionLinks = screen.getAllByRole("link", {
        name: /transactions/i,
      });
      transactionLinks.forEach((link) => {
        expect(link).toHaveAttribute("href", "/transactions");
      });
    });
  });

  describe("User Menu Functionality", () => {
    it("should show user menu items by default (CSS controls visibility)", () => {
      renderAppLayout();

      // The user menu items are always in the DOM, CSS controls visibility
      expect(screen.getByRole("link", { name: /profile/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
    });

    it("should toggle user menu classes when user button is clicked", async () => {
      renderAppLayout();

      const userButton = screen.getByRole("button", { name: /john doe/i });
      const userDropdown = screen.getByRole("link", { name: /profile/i }).closest('div');
      
      // Initially should not have open class (CSS modules use hashed names)
      expect(userDropdown?.className).not.toMatch(/open/);

      // Click to open menu
      await act(async () => {
        fireEvent.click(userButton);
      });
      
      // Should have open class
      expect(userDropdown?.className).toMatch(/open/);

      // Click again to close menu
      await act(async () => {
        fireEvent.click(userButton);
      });
      
      // Should not have open class
      expect(userDropdown?.className).not.toMatch(/open/);
    });

    it("should close user menu when clicking outside", async () => {
      renderAppLayout();

      const userButton = screen.getByRole("button", { name: /john doe/i });
      const userDropdown = screen.getByRole("link", { name: /profile/i }).closest('div');
      
      // Open menu first
      await act(async () => {
        fireEvent.click(userButton);
      });
      
      expect(userDropdown?.className).toMatch(/open/);

      // Click outside (on document)
      await act(async () => {
        fireEvent.click(document.body);
      });
      
      await waitFor(() => {
        expect(userDropdown?.className).not.toMatch(/open/);
      });
    });
  });

  describe("Mobile Menu Functionality", () => {
    it("should toggle mobile menu when menu button is clicked", async () => {
      renderAppLayout();

      const menuButton = screen.getByRole("button", { name: /toggle menu/i });
      
      // Mobile menu should be closed initially
      expect(
        screen.queryByRole("button", { name: /close menu/i })
      ).toBeInTheDocument(); // Always in DOM, CSS controls visibility

      // Click to open menu
      await act(async () => {
        fireEvent.click(menuButton);
      });
      
      // Mobile sidebar should have open class
      const mobileSidebar = screen.getByRole("button", { name: /close menu/i }).closest('aside');
      expect(mobileSidebar?.className).toMatch(/open/);
    });

    it("should close mobile menu when close button is clicked", async () => {
      renderAppLayout();

      const menuButton = screen.getByRole("button", { name: /toggle menu/i });
      const closeButton = screen.getByRole("button", { name: /close menu/i });
      const mobileSidebar = closeButton.closest('aside');
      
      // Open menu first
      await act(async () => {
        fireEvent.click(menuButton);
      });
      
      expect(mobileSidebar?.className).toMatch(/open/);

      // Click close button
      await act(async () => {
        fireEvent.click(closeButton);
      });
      
      expect(mobileSidebar?.className).not.toMatch(/open/);
    });

    it("should close mobile menu when overlay is clicked", async () => {
      renderAppLayout();

      const menuButton = screen.getByRole("button", { name: /toggle menu/i });
      
      // Open menu first
      await act(async () => {
        fireEvent.click(menuButton);
      });
      
      const mobileSidebar = screen.getByRole("button", { name: /close menu/i }).closest('aside');
      expect(mobileSidebar?.className).toMatch(/open/);

      // Find and click overlay using CSS class pattern
      const overlay = document.querySelector('[class*="overlay"][class*="open"]') as HTMLElement;
      expect(overlay).toBeInTheDocument();
      
      await act(async () => {
        fireEvent.click(overlay);
      });
      
      expect(mobileSidebar?.className).not.toMatch(/open/);
    });

    it("should close mobile menu when navigation link is clicked", async () => {
      renderAppLayout();

      const menuButton = screen.getByRole("button", { name: /toggle menu/i });
      
      // Open menu first
      await act(async () => {
        fireEvent.click(menuButton);
      });
      
      const mobileSidebar = screen.getByRole("button", { name: /close menu/i }).closest('aside');
      expect(mobileSidebar?.className).toMatch(/open/);

      // Click a navigation link in mobile menu
      const mobileNavLinks = screen.getAllByRole("link", { name: /customers/i });
      const mobileCustomersLink = mobileNavLinks.find(link => 
        link.closest('aside')?.className.includes('sidebarMobile')
      );
      
      await act(async () => {
        fireEvent.click(mobileCustomersLink!);
      });
      
      expect(mobileSidebar?.className).not.toMatch(/open/);
    });
  });

  describe("Logout Functionality", () => {
    it("should call logout and navigate when logout button is clicked", async () => {
      renderAppLayout();

      const logoutButton = screen.getByRole("button", { name: /logout/i });
      
      await act(async () => {
        fireEvent.click(logoutButton);
      });

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      });
    });

    it("should handle logout errors gracefully", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      
      // Mock logout to reject
      const logoutError = new Error("Logout failed");
      mockLogout.mockRejectedValue(logoutError);

      renderAppLayout();

      const logoutButton = screen.getByRole("button", { name: /logout/i });
      
      await act(async () => {
        fireEvent.click(logoutButton);
      });

      // Wait for logout to be called
      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalledTimes(1);
      });

      // Navigation should NOT be called if logout fails
      expect(mockNavigate).not.toHaveBeenCalled();
      
      // Error should be logged to console
      expect(consoleErrorSpy).toHaveBeenCalledWith("Logout failed:", logoutError);

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      renderAppLayout();

      expect(
        screen.getByRole("button", { name: /toggle menu/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /close menu/i })
      ).toBeInTheDocument();
    });

    it("should have proper semantic structure", () => {
      renderAppLayout();

      expect(screen.getByRole("banner")).toBeInTheDocument(); // header
      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getAllByRole("navigation")).toHaveLength(2);
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing user data gracefully", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        logout: mockLogout,
      });

      renderAppLayout();

      // Should not crash and should render basic structure
      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("should handle user with missing name fields", () => {
      mockUseAuth.mockReturnValue({
        user: { ...mockUser, firstName: "", lastName: "" },
        logout: mockLogout,
      });

      renderAppLayout();

      // Should not crash
      expect(screen.getByRole("banner")).toBeInTheDocument();
    });
  });
});
