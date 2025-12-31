import { ReactNode, CSSProperties } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "main";
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  style?: CSSProperties;
}

const maxWidthClasses = {
  sm: "max-w-3xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

export function Container({
  children,
  className = "",
  as: Component = "div",
  maxWidth = "lg",
  style,
}: ContainerProps) {
  return (
    <Component
      className={`mx-auto w-full ${maxWidthClasses[maxWidth]} ${className}`}
      style={{
        paddingLeft: "var(--alias-sizes-spacing-sp-40)",
        paddingRight: "var(--alias-sizes-spacing-sp-40)",
        ...style,
      }}
      suppressHydrationWarning
    >
      {children}
    </Component>
  );
}

