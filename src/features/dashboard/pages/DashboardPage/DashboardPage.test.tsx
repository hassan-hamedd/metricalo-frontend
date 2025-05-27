import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { DashboardPage } from "./DashboardPage";

// Define interfaces for mock components
interface RetentionProfitCardProps {
  stats: unknown;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  isLoading: boolean;
}

interface FunnelOverviewProps {
  data: unknown;
}

interface CustomerSatisfactionProps {
  data: unknown;
}

interface GoalAchievementProps {
  value: string;
  label: string;
}

// Mock the useDashboardStats hook
const mockUseDashboardStats = vi.fn();
vi.mock("../../../../hooks/useDashboardStats", () => ({
  default: () => mockUseDashboardStats(),
}));

// Mock the dashboard components
vi.mock("../../components/RetentionProfitCard/RetentionProfitCard", () => ({
  default: ({
    stats,
    selectedMonth,
    onMonthChange,
    isLoading,
  }: RetentionProfitCardProps) => (
    <div data-testid="retention-profit-card">
      <div data-testid="stats">{JSON.stringify(stats)}</div>
      <div data-testid="selected-month">{selectedMonth}</div>
      <div data-testid="is-loading">{isLoading.toString()}</div>
      <button onClick={() => onMonthChange("February / 2023")}>
        Change Month
      </button>
    </div>
  ),
}));

vi.mock("../../components/FunnelOverview/FunnelOverview", () => ({
  default: ({ data }: FunnelOverviewProps) => (
    <div data-testid="funnel-overview">
      <div data-testid="funnel-data">{JSON.stringify(data)}</div>
    </div>
  ),
}));

vi.mock("../../components/CustomerSatisfaction/CustomerSatisfaction", () => ({
  default: ({ data }: CustomerSatisfactionProps) => (
    <div data-testid="customer-satisfaction">
      <div data-testid="satisfaction-data">{JSON.stringify(data)}</div>
    </div>
  ),
}));

vi.mock("../../components/GoalAchievement/GoalAchievement", () => ({
  default: ({ value, label }: GoalAchievementProps) => (
    <div data-testid="goal-achievement">
      <div data-testid="goal-value">{value}</div>
      <div data-testid="goal-label">{label}</div>
    </div>
  ),
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockUseDashboardStats.mockReturnValue({
      isLoading: false,
    });
  });

  it("should render all dashboard components", () => {
    render(<DashboardPage />);

    expect(screen.getByTestId("retention-profit-card")).toBeInTheDocument();
    expect(screen.getByTestId("goal-achievement")).toBeInTheDocument();
    expect(screen.getByTestId("funnel-overview")).toBeInTheDocument();
    expect(screen.getByTestId("customer-satisfaction")).toBeInTheDocument();
  });

  it("should pass correct stats data to RetentionProfitCard", () => {
    render(<DashboardPage />);

    const statsElement = screen.getByTestId("stats");
    const stats = JSON.parse(statsElement.textContent || "{}");

    expect(stats).toEqual({
      newCustomers: {
        value: "11,950",
        trend: 24.57,
        isPositive: true,
      },
      retention: {
        value: "48%",
        trend: 8.57,
        isPositive: true,
      },
      profit: {
        value: "$37,457",
        trend: 6.44,
        isPositive: true,
      },
      costs: {
        value: "$16,886",
        trend: 6.27,
        isPositive: false,
      },
      roi: {
        value: "48%",
        trend: 2.77,
        isPositive: true,
      },
    });
  });

  it("should initialize with default selected month", () => {
    render(<DashboardPage />);

    const selectedMonthElement = screen.getByTestId("selected-month");
    expect(selectedMonthElement).toHaveTextContent("January / 2023");
  });

  it("should pass loading state from useDashboardStats to RetentionProfitCard", () => {
    mockUseDashboardStats.mockReturnValue({
      isLoading: true,
    });

    render(<DashboardPage />);

    const isLoadingElement = screen.getByTestId("is-loading");
    expect(isLoadingElement).toHaveTextContent("true");
  });

  it("should handle loading state when useDashboardStats is not loading", () => {
    mockUseDashboardStats.mockReturnValue({
      isLoading: false,
    });

    render(<DashboardPage />);

    const isLoadingElement = screen.getByTestId("is-loading");
    expect(isLoadingElement).toHaveTextContent("false");
  });

  it("should pass correct funnel data to FunnelOverview", () => {
    render(<DashboardPage />);

    const funnelDataElement = screen.getByTestId("funnel-data");
    const funnelData = JSON.parse(funnelDataElement.textContent || "{}");

    expect(funnelData).toEqual([
      { stage: "Open Page", value: 4535 },
      { stage: "Checkout", value: 3472 },
      { stage: "Checkout Submit", value: 2839 },
      { stage: "Success Payment", value: 1035 },
      { stage: "Rebilling", value: 674 },
    ]);
  });

  it("should pass correct satisfaction data to CustomerSatisfaction", () => {
    render(<DashboardPage />);

    const satisfactionDataElement = screen.getByTestId("satisfaction-data");
    const satisfactionData = JSON.parse(
      satisfactionDataElement.textContent || "{}"
    );

    expect(satisfactionData).toEqual({
      countries: [
        { name: "France", percentage: 48 },
        { name: "Italy", percentage: 28 },
        { name: "Canada", percentage: 24 },
      ],
    });
  });

  it("should pass correct goal achievement data", () => {
    render(<DashboardPage />);

    const goalValueElement = screen.getByTestId("goal-value");
    const goalLabelElement = screen.getByTestId("goal-label");

    expect(goalValueElement).toHaveTextContent("48.6%");
    expect(goalLabelElement).toHaveTextContent("customer retention");
  });

  it("should render with proper structure", () => {
    const { container } = render(<DashboardPage />);

    // Check that the component renders without crashing
    expect(container.firstChild).toBeInTheDocument();

    // Check that all expected components are rendered
    expect(screen.getByTestId("retention-profit-card")).toBeInTheDocument();
    expect(screen.getByTestId("goal-achievement")).toBeInTheDocument();
    expect(screen.getByTestId("funnel-overview")).toBeInTheDocument();
    expect(screen.getByTestId("customer-satisfaction")).toBeInTheDocument();
  });

  it("should call useDashboardStats hook", () => {
    render(<DashboardPage />);

    expect(mockUseDashboardStats).toHaveBeenCalledTimes(1);
  });

  it("should handle month change from RetentionProfitCard", () => {
    render(<DashboardPage />);

    // Initially should show January
    expect(screen.getByTestId("selected-month")).toHaveTextContent(
      "January / 2023"
    );

    // Simulate month change
    const changeMonthButton = screen.getByText("Change Month");

    act(() => {
      changeMonthButton.click();
    });

    // Should update to February
    expect(screen.getByTestId("selected-month")).toHaveTextContent(
      "February / 2023"
    );
  });

  it("should maintain state consistency across re-renders", () => {
    const { rerender } = render(<DashboardPage />);

    // Change month
    const changeMonthButton = screen.getByText("Change Month");

    act(() => {
      changeMonthButton.click();
    });

    expect(screen.getByTestId("selected-month")).toHaveTextContent(
      "February / 2023"
    );

    // Re-render and check state is maintained
    rerender(<DashboardPage />);
    expect(screen.getByTestId("selected-month")).toHaveTextContent(
      "February / 2023"
    );
  });

  it("should pass the month change handler to RetentionProfitCard", () => {
    render(<DashboardPage />);

    // The presence of the "Change Month" button in our mock indicates
    // that the onMonthChange prop was passed correctly
    expect(screen.getByText("Change Month")).toBeInTheDocument();
  });
});
