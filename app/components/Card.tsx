import { ReactNode, CSSProperties } from "react";

interface CardProps {
  children?: ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
  padding?: "none" | "4" | "8" | "16" | "24" | "32" | "40" | "large";
  radius?: "none" | "4" | "8" | "16" | "24";
  style?: CSSProperties;
}

export function Card({
  children,
  className = "",
  as: Component = "div",
  padding = "24",
  radius = "8",
  style,
}: CardProps) {
  const paddingVar =
    padding === "none" ? "0" : padding === "large" ? "var(--alias-sizes-spacing-sp-40)" : `var(--alias-sizes-spacing-sp-${padding})`;
  const radiusVar =
    radius === "none" ? "0" : `var(--alias-sizes-radius-rd-${radius})`;

  return (
    <Component
      className={className}
      style={{
        backgroundColor: "var(--alias-color-surface-background-primary)",
        borderColor: "var(--alias-color-borders-primary-default)",
        borderWidth: "var(--alias-sizes-border-br-1)",
        borderStyle: "solid",
        borderRadius: radiusVar,
        padding: paddingVar,
        ...style,
      }}
      suppressHydrationWarning
    >
      {children}
    </Component>
  );
}

