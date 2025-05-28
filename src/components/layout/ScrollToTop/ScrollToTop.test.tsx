import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import { act } from "react";
import ScrollToTop from "./ScrollToTop";

// Mock window.scrollTo
const mockScrollTo = vi.fn();
Object.defineProperty(window, "scrollTo", {
  value: mockScrollTo,
  writable: true,
});

// Test component that allows navigation
const TestNavigationComponent = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <button 
        data-testid="navigate-to-page1" 
        onClick={() => navigate("/page1")}
      >
        Go to Page 1
      </button>
      <button 
        data-testid="navigate-to-page2" 
        onClick={() => navigate("/page2")}
      >
        Go to Page 2
      </button>
    </div>
  );
};

// Test wrapper component with MemoryRouter for better control
const TestWrapper = ({ initialEntries = ["/"] }: { initialEntries?: string[] }) => (
  <MemoryRouter initialEntries={initialEntries}>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<TestNavigationComponent />} />
      <Route path="/page1" element={<div>Page 1</div>} />
      <Route path="/page2" element={<div>Page 2</div>} />
    </Routes>
  </MemoryRouter>
);

describe("ScrollToTop", () => {
  beforeEach(() => {
    mockScrollTo.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render without crashing", () => {
    const { container } = render(<TestWrapper />);
    expect(container).toBeInTheDocument();
  });

  it("should not render any visible content", () => {
    const { container } = render(<TestWrapper />);
    // ScrollToTop should not add any visible elements
    expect(container.firstChild).not.toBeNull();
    // But the ScrollToTop component itself renders null
    const scrollToTopElement = container.querySelector('[data-testid="scroll-to-top"]');
    expect(scrollToTopElement).toBeNull();
  });

  it("should call window.scrollTo on initial render", () => {
    render(<TestWrapper />);
    
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });

  it("should call window.scrollTo when route changes", async () => {
    const { getByTestId } = render(<TestWrapper />);
    
    // Clear the initial call
    mockScrollTo.mockClear();
    
    // Navigate to a different route
    await act(async () => {
      getByTestId("navigate-to-page1").click();
    });
    
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });

  it("should call window.scrollTo when navigating between different routes", () => {
    // Test initial render
    const { rerender } = render(<TestWrapper initialEntries={["/"]} />);
    expect(mockScrollTo).toHaveBeenCalledTimes(1);
    
    // Test navigation to page1 - create new component instance
    rerender(<TestWrapper key="page1" initialEntries={["/page1"]} />);
    expect(mockScrollTo).toHaveBeenCalledTimes(2);
    
    // Test navigation to page2 - create new component instance
    rerender(<TestWrapper key="page2" initialEntries={["/page2"]} />);
    expect(mockScrollTo).toHaveBeenCalledTimes(3);
  });

  it("should work with different initial routes", () => {
    render(<TestWrapper initialEntries={["/page1"]} />);
    
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });
});

describe("ScrollToTop - Error Handling", () => {
  beforeEach(() => {
    mockScrollTo.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should handle window.scrollTo throwing an error gracefully", () => {
    // Mock scrollTo to throw an error
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockScrollTo.mockImplementation(() => {
      throw new Error("Scroll failed");
    });

    // Component should still render without crashing
    expect(() => {
      render(<TestWrapper />);
    }).not.toThrow();

    consoleSpy.mockRestore();
  });

  it("should handle missing window.scrollTo method", () => {
    // Temporarily remove scrollTo
    const originalScrollTo = window.scrollTo;
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    // @ts-expect-error - Intentionally deleting for testing
    delete window.scrollTo;

    expect(() => {
      render(<TestWrapper />);
    }).not.toThrow();

    // Restore scrollTo
    window.scrollTo = originalScrollTo;
    consoleSpy.mockRestore();
  });
});
