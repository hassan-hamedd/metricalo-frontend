import React from "react";
import type { ReactNode } from "react";
import styles from "./Card.module.scss";

export type CardVariant =
  | "default"
  | "surface"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "info";
export type CardSize = "small" | "medium" | "large";

export interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
  size?: CardSize;
  interactive?: boolean;
  padded?: boolean;
  onClick?: () => void;
}

export interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  variant = "default",
  size = "medium",
  interactive = false,
  padded = false,
  onClick,
}) => {
  const cardClasses = [
    styles.card,
    styles[variant],
    styles[size],
    padded ? styles.padded : "",
    interactive ? styles.interactive : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cardClasses}
      onClick={interactive ? onClick : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
}) => {
  return <div className={`${styles.header} ${className}`}>{children}</div>;
};

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = "",
}) => {
  return <div className={`${styles.body} ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = "",
}) => {
  return <div className={`${styles.footer} ${className}`}>{children}</div>;
};

// Additional component for data cards with value, label, and trend
export interface DataCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  className?: string;
  variant?: CardVariant;
  size?: CardSize;
}

export const DataCard: React.FC<DataCardProps> = ({
  label,
  value,
  trend,
  className = "",
  variant = "default",
  size = "medium",
}) => {
  return (
    <Card
      variant={variant}
      size={size}
      className={`${styles.dataCard} ${className}`}
      padded
    >
      <p className={styles.label}>{label}</p>
      <div className={styles.value}>{value}</div>
      {trend && (
        <div
          className={`${styles.trend} ${
            trend.isPositive ? styles.positive : styles.negative
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {trend.isPositive ? (
              <path
                d="M8 4L14 10L12.6 11.4L8 6.8L3.4 11.4L2 10L8 4Z"
                fill="currentColor"
              />
            ) : (
              <path
                d="M8 12L2 6L3.4 4.6L8 9.2L12.6 4.6L14 6L8 12Z"
                fill="currentColor"
              />
            )}
          </svg>
          {trend.value}
        </div>
      )}
    </Card>
  );
};

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardBody.displayName = "CardBody";
CardFooter.displayName = "CardFooter";
DataCard.displayName = "DataCard";

const CardComponent = Card as typeof Card & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
  Data: typeof DataCard;
};

CardComponent.Header = CardHeader;
CardComponent.Body = CardBody;
CardComponent.Footer = CardFooter;
CardComponent.Data = DataCard;

export default CardComponent;
