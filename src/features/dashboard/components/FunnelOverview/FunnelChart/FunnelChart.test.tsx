import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { FunnelChart, type FunnelStep } from "./FunnelChart";

describe("FunnelChart", () => {
  const mockData: FunnelStep[] = [
    { stage: "Open Page", value: 4535 },
    { stage: "Checkout", value: 3472 },
    { stage: "Checkout Submit", value: 2839 },
    { stage: "Success Payment", value: 1035 },
    { stage: "Rebilling", value: 674 },
  ];

  it("renders without crashing", () => {
    render(<FunnelChart data={mockData} />);
  });

  it("renders with empty data", () => {
    render(<FunnelChart data={[]} />);
    // Should not crash with empty data
  });

  it("renders with single data point", () => {
    const singleData: FunnelStep[] = [{ stage: "Single Stage", value: 100 }];

    render(<FunnelChart data={singleData} />);
    // Should not crash with single data point
  });

  it("applies correct dimensions to ResponsiveContainer", () => {
    const { container } = render(<FunnelChart data={mockData} />);

    const responsiveContainer = container.querySelector(
      ".recharts-responsive-container"
    );
    expect(responsiveContainer).toHaveStyle({ width: "100%", height: "180px" });
  });

  it("accepts FunnelStep data format correctly", () => {
    // Test that the component accepts the correct data structure
    const testData: FunnelStep[] = [{ stage: "Test Stage", value: 123 }];

    expect(() => render(<FunnelChart data={testData} />)).not.toThrow();
  });

  it("handles data with different value types", () => {
    const mixedData: FunnelStep[] = [
      { stage: "Zero", value: 0 },
      { stage: "Small", value: 1 },
      { stage: "Large", value: 999999 },
    ];

    expect(() => render(<FunnelChart data={mixedData} />)).not.toThrow();
  });
});
