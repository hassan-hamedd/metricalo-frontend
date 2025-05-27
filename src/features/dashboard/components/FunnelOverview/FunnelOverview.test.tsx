import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FunnelOverview from "./FunnelOverview";
import { type FunnelStep } from "./FunnelChart/FunnelChart";

describe("FunnelOverview", () => {
  const mockData: FunnelStep[] = [
    { stage: "Open Page", value: 4535 },
    { stage: "Checkout", value: 3472 },
    { stage: "Checkout Submit", value: 2839 },
    { stage: "Success Payment", value: 1035 },
    { stage: "Rebilling", value: 674 },
  ];

  it("renders the component title", () => {
    render(<FunnelOverview data={mockData} />);

    expect(screen.getByText("Funnel Overview")).toBeInTheDocument();
  });

  it("displays all stage names", () => {
    render(<FunnelOverview data={mockData} />);

    mockData.forEach((step) => {
      expect(screen.getByText(step.stage)).toBeInTheDocument();
    });
  });

  it("displays all stage values correctly formatted", () => {
    render(<FunnelOverview data={mockData} />);

    // Values should be formatted with commas
    expect(screen.getByText("4,535")).toBeInTheDocument();
    expect(screen.getByText("3,472")).toBeInTheDocument();
    expect(screen.getByText("2,839")).toBeInTheDocument();
    expect(screen.getByText("1,035")).toBeInTheDocument();
    expect(screen.getByText("674")).toBeInTheDocument();
  });

  it("renders the correct number of metric items", () => {
    const { container } = render(<FunnelOverview data={mockData} />);

    // Look for list items within the metrics container
    const metricsList = container.querySelector('[class*="metrics"]');
    const metricItems = metricsList?.querySelectorAll("li");
    expect(metricItems).toHaveLength(mockData.length);
  });

  it("applies the correct CSS classes", () => {
    const { container } = render(<FunnelOverview data={mockData} />);

    // Check for CSS module classes using partial matching
    expect(container.querySelector('[class*="header"]')).toBeInTheDocument();
    expect(container.querySelector('[class*="metrics"]')).toBeInTheDocument();
    expect(
      container.querySelector('[class*="chartWrapper"]')
    ).toBeInTheDocument();
  });

  it("renders within a Card component", () => {
    const { container } = render(<FunnelOverview data={mockData} />);

    // Check that the component is wrapped in a card
    const cardElement = container.querySelector(".funnel-overview-card");
    expect(cardElement).toBeInTheDocument();
  });
});
