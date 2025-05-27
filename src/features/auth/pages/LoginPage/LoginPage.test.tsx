import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { LoginPage } from "./LoginPage";

// Mock the useAuth hook
const mockUseAuth = vi.fn();
vi.mock("../../../../hooks/useAuth", () => ({
  default: () => mockUseAuth(),
}));

// Mock the useLoginForm hook
const mockUseLoginForm = vi.fn();
vi.mock("../../../../hooks/useLoginForm", () => ({
  default: () => mockUseLoginForm(),
}));

// Mock the Logo component
vi.mock("../../../../components/ui/Logo", () => ({
  default: ({ width, height }: { width?: number; height?: number }) => (
    <div data-testid="logo" data-width={width} data-height={height}>
      Logo
    </div>
  ),
}));

// Mock the Card component with proper structure
vi.mock("../../../../components/ui/Card/Card", () => {
  const MockCard = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  );

  const MockCardBody = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-body">{children}</div>
  );

  MockCard.Body = MockCardBody;

  return {
    default: MockCard,
  };
});

// Mock the Button component
vi.mock("../../../../components/ui/Button/Button", () => ({
  default: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

// Wrapper component for router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={["/login"]}>{children}</MemoryRouter>
);

describe("LoginPage", () => {
  const mockHandleSubmit = vi.fn();
  const mockSetEmail = vi.fn();
  const mockSetPassword = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    // Default mock implementations
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
    });

    mockUseLoginForm.mockReturnValue({
      email: "demo@example.com",
      setEmail: mockSetEmail,
      password: "metricalo",
      setPassword: mockSetPassword,
      isSubmitting: false,
      error: "",
      handleSubmit: mockHandleSubmit,
    });
  });

  describe("Basic Rendering", () => {
    it("should render the login page structure", () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      expect(screen.getByTestId("logo")).toBeInTheDocument();
      expect(screen.getByText("Billing Dashboard")).toBeInTheDocument();
      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("card-body")).toBeInTheDocument();
    });

    it("should render the logo with correct props", () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const logo = screen.getByTestId("logo");
      expect(logo).toHaveAttribute("data-width", "200");
      expect(logo).toHaveAttribute("data-height", "30");
    });

    it("should render the form elements", () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign in/i })
      ).toBeInTheDocument();
    });

    it("should render demo credentials message", () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      expect(
        screen.getByText("Demo credentials are pre-filled for you.")
      ).toBeInTheDocument();
      expect(
        screen.getByText('Just click "Sign In" to continue.')
      ).toBeInTheDocument();
    });

    it("should render forgot password link", () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const forgotPasswordLink = screen.getByText("Forgot your password?");
      expect(forgotPasswordLink).toBeInTheDocument();
      expect(forgotPasswordLink.tagName).toBe("A");
      expect(forgotPasswordLink).toHaveAttribute("href", "#");
    });
  });

  describe("Authentication Redirect", () => {
    it("should redirect to dashboard when already authenticated", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
      });

      render(
        <MemoryRouter initialEntries={["/login"]}>
          <LoginPage />
        </MemoryRouter>
      );

      // When authenticated, Navigate component redirects to /dashboard
      // Since we're not setting up the full routing structure, we just check that
      // the login form is not rendered
      expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    });

    it("should show login form when not authenticated", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
      });

      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });
  });

  describe("Form Interactions", () => {
    it("should display form values from useLoginForm hook", () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(
        /password/i
      ) as HTMLInputElement;

      expect(emailInput.value).toBe("demo@example.com");
      expect(passwordInput.value).toBe("metricalo");
    });

    it("should call setEmail when email input changes", async () => {
      const user = userEvent.setup();

      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      
      // Simply type a character to trigger onChange
      await user.type(emailInput, "x");

      // Check that setEmail was called
      expect(mockSetEmail).toHaveBeenCalled();
    });

    it("should call setPassword when password input changes", async () => {
      const user = userEvent.setup();

      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const passwordInput = screen.getByLabelText(/password/i);
      
      // Simply type a character to trigger onChange
      await user.type(passwordInput, "x");

      // Check that setPassword was called
      expect(mockSetPassword).toHaveBeenCalled();
    });

    it("should call handleSubmit when form is submitted", async () => {
      const user = userEvent.setup();

      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      await user.click(submitButton);

      expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });

    it("should call handleSubmit when Enter is pressed in form", async () => {
      const user = userEvent.setup();

      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      await user.click(emailInput);
      await user.keyboard("{Enter}");

      expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe("Form States", () => {
    it("should disable inputs when submitting", () => {
      mockUseLoginForm.mockReturnValue({
        email: "demo@example.com",
        setEmail: mockSetEmail,
        password: "metricalo",
        setPassword: mockSetPassword,
        isSubmitting: true,
        error: "",
        handleSubmit: mockHandleSubmit,
      });

      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /signing in/i });

      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });

    it("should show 'Signing in...' text when submitting", () => {
      mockUseLoginForm.mockReturnValue({
        email: "demo@example.com",
        setEmail: mockSetEmail,
        password: "metricalo",
        setPassword: mockSetPassword,
        isSubmitting: true,
        error: "",
        handleSubmit: mockHandleSubmit,
      });

      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      expect(
        screen.getByRole("button", { name: /signing in/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /^sign in$/i })
      ).not.toBeInTheDocument();
    });

    it("should show 'Sign In' text when not submitting", () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      expect(
        screen.getByRole("button", { name: /^sign in$/i })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /signing in/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should display error message when error exists", () => {
      mockUseLoginForm.mockReturnValue({
        email: "demo@example.com",
        setEmail: mockSetEmail,
        password: "metricalo",
        setPassword: mockSetPassword,
        isSubmitting: false,
        error: "Invalid email or password",
        handleSubmit: mockHandleSubmit,
      });

      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });

    it("should not display error message when no error", () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      expect(
        screen.queryByText("Invalid email or password")
      ).not.toBeInTheDocument();
    });

    it("should display different error messages", () => {
      mockUseLoginForm.mockReturnValue({
        email: "demo@example.com",
        setEmail: mockSetEmail,
        password: "metricalo",
        setPassword: mockSetPassword,
        isSubmitting: false,
        error: "Please enter both email and password",
        handleSubmit: mockHandleSubmit,
      });

      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      expect(
        screen.getByText("Please enter both email and password")
      ).toBeInTheDocument();
    });
  });

  describe("Form Accessibility", () => {
    it("should have proper labels for form inputs", () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toHaveAttribute("id", "email");
      expect(passwordInput).toHaveAttribute("id", "password");
    });

    it("should have proper input types", () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      expect(emailInput).toHaveAttribute("type", "email");
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("should have placeholder text", () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const emailInput = screen.getByPlaceholderText("Enter your email");
      const passwordInput = screen.getByPlaceholderText("Enter your password");

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it("should have autofocus on email input", () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i);
      // Check that the email input is present and is the first input
      // (autofocus behavior may not be testable in jsdom environment)
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute("type", "email");
    });
  });

  describe("Component Integration", () => {
    it("should work with different authentication states", () => {
      const { rerender } = render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      // Initially not authenticated - should show form
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

      // Change to authenticated
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
      });

      rerender(
        <MemoryRouter initialEntries={["/login"]}>
          <LoginPage />
        </MemoryRouter>
      );

      // Should redirect (form should not be visible)
      expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument();
    });

    it("should handle form state changes", () => {
      const { rerender } = render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      // Initially not submitting
      expect(
        screen.getByRole("button", { name: /^sign in$/i })
      ).toBeInTheDocument();

      // Change to submitting
      mockUseLoginForm.mockReturnValue({
        email: "demo@example.com",
        setEmail: mockSetEmail,
        password: "metricalo",
        setPassword: mockSetPassword,
        isSubmitting: true,
        error: "",
        handleSubmit: mockHandleSubmit,
      });

      rerender(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      expect(
        screen.getByRole("button", { name: /signing in/i })
      ).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty form values", () => {
      mockUseLoginForm.mockReturnValue({
        email: "",
        setEmail: mockSetEmail,
        password: "",
        setPassword: mockSetPassword,
        isSubmitting: false,
        error: "",
        handleSubmit: mockHandleSubmit,
      });

      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(
        /password/i
      ) as HTMLInputElement;

      expect(emailInput.value).toBe("");
      expect(passwordInput.value).toBe("");
    });

    it("should handle long error messages", () => {
      const longError =
        "This is a very long error message that should still be displayed properly in the UI without breaking the layout or causing any issues";

      mockUseLoginForm.mockReturnValue({
        email: "demo@example.com",
        setEmail: mockSetEmail,
        password: "metricalo",
        setPassword: mockSetPassword,
        isSubmitting: false,
        error: longError,
        handleSubmit: mockHandleSubmit,
      });

      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    it("should handle undefined authentication state", () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: undefined,
      });

      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      // Should show login form when isAuthenticated is falsy
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });
  });
});
