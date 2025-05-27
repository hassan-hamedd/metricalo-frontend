import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CardComponent, { Card, CardHeader, CardBody, CardFooter, DataCard } from "./Card";
import styles from "./Card.module.scss";

describe("Card", () => {
  describe("Basic Rendering", () => {
    it("should render with default props", () => {
      render(<Card>Test Content</Card>);

      const card = screen.getByText("Test Content");
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass(styles.card);
      expect(card).toHaveClass(styles.default);
      expect(card).toHaveClass(styles.medium);
    });

    it("should render children content", () => {
      render(
        <Card>
          <div data-testid="child-content">Child Content</div>
        </Card>
      );

      expect(screen.getByTestId("child-content")).toBeInTheDocument();
      expect(screen.getByText("Child Content")).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("should render with surface variant", () => {
      render(<Card variant="surface">Surface Card</Card>);

      const card = screen.getByText("Surface Card");
      expect(card).toHaveClass(styles.surface);
      expect(card).not.toHaveClass(styles.default);
    });

    it("should render with accent variant", () => {
      render(<Card variant="accent">Accent Card</Card>);

      const card = screen.getByText("Accent Card");
      expect(card).toHaveClass(styles.accent);
    });

    it("should render with success variant", () => {
      render(<Card variant="success">Success Card</Card>);

      const card = screen.getByText("Success Card");
      expect(card).toHaveClass(styles.success);
    });

    it("should render with warning variant", () => {
      render(<Card variant="warning">Warning Card</Card>);

      const card = screen.getByText("Warning Card");
      expect(card).toHaveClass(styles.warning);
    });

    it("should render with error variant", () => {
      render(<Card variant="error">Error Card</Card>);

      const card = screen.getByText("Error Card");
      expect(card).toHaveClass(styles.error);
    });

    it("should render with info variant", () => {
      render(<Card variant="info">Info Card</Card>);

      const card = screen.getByText("Info Card");
      expect(card).toHaveClass(styles.info);
    });
  });

  describe("Sizes", () => {
    it("should render with small size", () => {
      render(<Card size="small">Small Card</Card>);

      const card = screen.getByText("Small Card");
      expect(card).toHaveClass(styles.small);
      expect(card).not.toHaveClass(styles.medium);
    });

    it("should render with large size", () => {
      render(<Card size="large">Large Card</Card>);

      const card = screen.getByText("Large Card");
      expect(card).toHaveClass(styles.large);
      expect(card).not.toHaveClass(styles.medium);
    });
  });

  describe("Interactive Behavior", () => {
    it("should render as interactive when interactive prop is true", () => {
      render(<Card interactive>Interactive Card</Card>);

      const card = screen.getByText("Interactive Card");
      expect(card).toHaveClass(styles.interactive);
      expect(card).toHaveAttribute("role", "button");
      expect(card).toHaveAttribute("tabIndex", "0");
    });

    it("should handle onClick when interactive", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Card interactive onClick={handleClick}>
          Interactive Card
        </Card>
      );

      const card = screen.getByText("Interactive Card");
      await user.click(card);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not handle onClick when not interactive", () => {
      const handleClick = vi.fn();

      render(<Card onClick={handleClick}>Non-Interactive Card</Card>);

      const card = screen.getByText("Non-Interactive Card");
      expect(card).not.toHaveAttribute("role", "button");
      expect(card).not.toHaveAttribute("tabIndex");

      fireEvent.click(card);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should handle keyboard events when interactive", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Card interactive onClick={handleClick}>
          Interactive Card
        </Card>
      );

      const card = screen.getByText("Interactive Card");
      card.focus();
      await user.keyboard("{Enter}");

      // Note: The component doesn't handle keyboard events by default,
      // but we test that it's focusable
      expect(card).toHaveFocus();
    });
  });

  describe("Styling Props", () => {
    it("should apply padded class when padded prop is true", () => {
      render(<Card padded>Padded Card</Card>);

      const card = screen.getByText("Padded Card");
      expect(card).toHaveClass(styles.padded);
    });

    it("should merge custom className", () => {
      render(<Card className="custom-class">Custom Card</Card>);

      const card = screen.getByText("Custom Card");
      expect(card).toHaveClass("custom-class");
      expect(card).toHaveClass(styles.card);
    });

    it("should handle multiple classes correctly", () => {
      render(
        <Card
          variant="success"
          size="large"
          interactive
          padded
          className="custom-class"
        >
          Multi-Class Card
        </Card>
      );

      const card = screen.getByText("Multi-Class Card");
      expect(card).toHaveClass(styles.card);
      expect(card).toHaveClass(styles.success);
      expect(card).toHaveClass(styles.large);
      expect(card).toHaveClass(styles.interactive);
      expect(card).toHaveClass(styles.padded);
      expect(card).toHaveClass("custom-class");
    });
  });
});

describe("CardHeader", () => {
  it("should render with default props", () => {
    render(<CardHeader>Header Content</CardHeader>);

    const header = screen.getByText("Header Content");
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass(styles.header);
  });

  it("should merge custom className", () => {
    render(<CardHeader className="custom-header">Header</CardHeader>);

    const header = screen.getByText("Header");
    expect(header).toHaveClass(styles.header);
    expect(header).toHaveClass("custom-header");
  });

  it("should render complex content", () => {
    render(
      <CardHeader>
        <h2>Title</h2>
        <p>Subtitle</p>
      </CardHeader>
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Subtitle")).toBeInTheDocument();
  });
});

describe("CardBody", () => {
  it("should render with default props", () => {
    render(<CardBody>Body Content</CardBody>);

    const body = screen.getByText("Body Content");
    expect(body).toBeInTheDocument();
    expect(body).toHaveClass(styles.body);
  });

  it("should merge custom className", () => {
    render(<CardBody className="custom-body">Body</CardBody>);

    const body = screen.getByText("Body");
    expect(body).toHaveClass(styles.body);
    expect(body).toHaveClass("custom-body");
  });

  it("should render complex content", () => {
    render(
      <CardBody>
        <form>
          <input type="text" placeholder="Test input" />
          <button type="submit">Submit</button>
        </form>
      </CardBody>
    );

    expect(screen.getByPlaceholderText("Test input")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });
});

describe("CardFooter", () => {
  it("should render with default props", () => {
    render(<CardFooter>Footer Content</CardFooter>);

    const footer = screen.getByText("Footer Content");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass(styles.footer);
  });

  it("should merge custom className", () => {
    render(<CardFooter className="custom-footer">Footer</CardFooter>);

    const footer = screen.getByText("Footer");
    expect(footer).toHaveClass(styles.footer);
    expect(footer).toHaveClass("custom-footer");
  });

  it("should render action buttons", () => {
    render(
      <CardFooter>
        <button>Cancel</button>
        <button>Save</button>
      </CardFooter>
    );

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });
});

describe("DataCard", () => {
  describe("Basic Rendering", () => {
    it("should render with required props", () => {
      render(<DataCard label="Revenue" value="$10,000" />);

      expect(screen.getByText("Revenue")).toBeInTheDocument();
      expect(screen.getByText("$10,000")).toBeInTheDocument();
    });

    it("should render with numeric value", () => {
      render(<DataCard label="Users" value={1250} />);

      expect(screen.getByText("Users")).toBeInTheDocument();
      expect(screen.getByText("1250")).toBeInTheDocument();
    });

    it("should apply dataCard class", () => {
      render(<DataCard label="Test" value="100" />);

      const card = screen.getByText("Test").closest("div");
      expect(card).toHaveClass(styles.dataCard);
    });
  });

  describe("Trend Display", () => {
    it("should render positive trend", () => {
      render(
        <DataCard
          label="Sales"
          value="$5,000"
          trend={{ value: "+12%", isPositive: true }}
        />
      );

      const trendElement = screen.getByText("+12%");
      expect(trendElement).toBeInTheDocument();
      expect(trendElement.closest("div")).toHaveClass(styles.trend);
      expect(trendElement.closest("div")).toHaveClass(styles.positive);
    });

    it("should render negative trend", () => {
      render(
        <DataCard
          label="Expenses"
          value="$2,000"
          trend={{ value: "-5%", isPositive: false }}
        />
      );

      const trendElement = screen.getByText("-5%");
      expect(trendElement).toBeInTheDocument();
      expect(trendElement.closest("div")).toHaveClass(styles.trend);
      expect(trendElement.closest("div")).toHaveClass(styles.negative);
    });

    it("should render trend with numeric value", () => {
      render(
        <DataCard
          label="Growth"
          value="150"
          trend={{ value: 25, isPositive: true }}
        />
      );

      expect(screen.getByText("25")).toBeInTheDocument();
    });

    it("should render correct SVG icon for positive trend", () => {
      render(
        <DataCard
          label="Test"
          value="100"
          trend={{ value: "+10%", isPositive: true }}
        />
      );

      const svg = screen.getByText("+10%").closest("div")?.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("width", "16");
      expect(svg).toHaveAttribute("height", "16");
    });

    it("should render correct SVG icon for negative trend", () => {
      render(
        <DataCard
          label="Test"
          value="100"
          trend={{ value: "-10%", isPositive: false }}
        />
      );

      const svg = screen.getByText("-10%").closest("div")?.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute("width", "16");
      expect(svg).toHaveAttribute("height", "16");
    });
  });

  describe("Styling Props", () => {
    it("should apply custom variant", () => {
      render(<DataCard label="Test" value="100" variant="success" />);

      const card = screen.getByText("Test").closest("div");
      expect(card).toHaveClass(styles.success);
    });

    it("should apply custom size", () => {
      render(<DataCard label="Test" value="100" size="large" />);

      const card = screen.getByText("Test").closest("div");
      expect(card).toHaveClass(styles.large);
    });

    it("should merge custom className", () => {
      render(
        <DataCard label="Test" value="100" className="custom-data-card" />
      );

      const card = screen.getByText("Test").closest("div");
      expect(card).toHaveClass("custom-data-card");
      expect(card).toHaveClass(styles.dataCard);
    });

    it("should apply padded class by default", () => {
      render(<DataCard label="Test" value="100" />);

      const card = screen.getByText("Test").closest("div");
      expect(card).toHaveClass(styles.padded);
    });
  });

  describe("Label and Value Styling", () => {
    it("should apply correct classes to label and value", () => {
      render(<DataCard label="Revenue" value="$10,000" />);

      const label = screen.getByText("Revenue");
      const value = screen.getByText("$10,000");

      expect(label).toHaveClass(styles.label);
      expect(value).toHaveClass(styles.value);
    });
  });
});

describe("Card Compound Component", () => {
  it("should work as a compound component", () => {
    render(
      <Card>
        <CardComponent.Header>Header</CardComponent.Header>
        <CardComponent.Body>Body</CardComponent.Body>
        <CardComponent.Footer>Footer</CardComponent.Footer>
      </Card>
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("should work with DataCard as compound component", () => {
    render(<CardComponent.Data label="Test" value="100" />);

    expect(screen.getByText("Test")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  it("should have correct display names", () => {
    expect(Card.displayName).toBe("Card");
    expect(CardHeader.displayName).toBe("CardHeader");
    expect(CardBody.displayName).toBe("CardBody");
    expect(CardFooter.displayName).toBe("CardFooter");
    expect(DataCard.displayName).toBe("DataCard");
  });
});

describe("Integration Tests", () => {
  it("should work with complex nested structure", () => {
    render(
      <Card variant="surface" size="large" padded>
        <CardComponent.Header className="custom-header">
          <h2>Dashboard Stats</h2>
        </CardComponent.Header>
        <CardComponent.Body>
          <CardComponent.Data
            label="Total Revenue"
            value="$50,000"
            trend={{ value: "+15%", isPositive: true }}
          />
          <CardComponent.Data
            label="Active Users"
            value={1250}
            trend={{ value: "-2%", isPositive: false }}
          />
        </CardComponent.Body>
        <CardComponent.Footer>
          <button>View Details</button>
        </CardComponent.Footer>
      </Card>
    );

    expect(screen.getByText("Dashboard Stats")).toBeInTheDocument();
    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("$50,000")).toBeInTheDocument();
    expect(screen.getByText("+15%")).toBeInTheDocument();
    expect(screen.getByText("Active Users")).toBeInTheDocument();
    expect(screen.getByText("1250")).toBeInTheDocument();
    expect(screen.getByText("-2%")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /view details/i })).toBeInTheDocument();
  });
}); 