import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Logo from "./Logo";
import styles from "./Logo.module.scss";

describe("Logo", () => {
  describe("Basic Rendering", () => {
    it("should render SVG with default props", () => {
      render(<Logo />);

      const svg = screen.getByTestId("logo-svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("width", "140");
      expect(svg).toHaveAttribute("height", "20");
      expect(svg).toHaveClass(styles.logo);
    });

    it("should render with custom dimensions", () => {
      render(<Logo width={200} height={30} />);

      const svg = screen.getByTestId("logo-svg");
      expect(svg).toHaveAttribute("width", "200");
      expect(svg).toHaveAttribute("height", "30");
    });

    it("should render with custom color", () => {
      render(<Logo color="#FF0000" />);

      const svg = screen.getByTestId("logo-svg");
      const paths = svg.querySelectorAll("path");
      
      // Check that at least one path has the custom color
      expect(paths.length).toBeGreaterThan(0);
      expect(paths[0]).toHaveAttribute("fill", "#FF0000");
    });

    it("should apply custom className", () => {
      render(<Logo className="custom-logo" />);

      const svg = screen.getByTestId("logo-svg");
      expect(svg).toHaveClass(styles.logo);
      expect(svg).toHaveClass("custom-logo");
    });
  });

  describe("Logo with Text", () => {
    it("should render with text when withText is true", () => {
      render(<Logo withText />);

      expect(screen.getByText("Metricalo")).toBeInTheDocument();
      const container = screen.getByText("Metricalo").closest("div");
      expect(container).toHaveClass(styles.logoWithText);
    });

    it("should render with custom text", () => {
      render(<Logo withText text="Custom Brand" />);

      expect(screen.getByText("Custom Brand")).toBeInTheDocument();
      expect(screen.queryByText("Metricalo")).not.toBeInTheDocument();
    });

    it("should render smaller SVG when withText is true", () => {
      render(<Logo withText />);

      const svg = screen.getByTestId("logo-svg");
      expect(svg).toHaveAttribute("width", "24");
      expect(svg).toHaveAttribute("height", "24");
    });
  });

  describe("Edge Cases", () => {
    it("should handle string dimensions", () => {
      render(<Logo width="100%" height="auto" />);

      const svg = screen.getByTestId("logo-svg");
      expect(svg).toHaveAttribute("width", "100%");
      expect(svg).toHaveAttribute("height", "auto");
    });

    it("should handle empty text", () => {
      render(<Logo withText text="" />);

      // Check that the span exists and is empty
      const container = screen.getByTestId("logo-svg").closest("div");
      const span = container?.querySelector("span");
      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent("");
    });
  });
}); 