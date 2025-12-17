import { ReactNode } from "react";

interface RowProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "ul" | "ol";
  gap?: "4" | "8" | "16" | "24" | "32" | "40";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
}

const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifyClasses = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
};

export function Row({
  children,
  className = "",
  as: Component = "div",
  gap = "16",
  align = "center",
  justify = "start",
  wrap = false,
}: RowProps) {
  const gapVar = `var(--alias-sizes-spacing-sp-${gap})`;
  const wrapClass = wrap ? "flex-wrap" : "";

  return (
    <Component
      className={`flex ${alignClasses[align]} ${justifyClasses[justify]} ${wrapClass} ${className}`}
      style={{ gap: gapVar }}
      suppressHydrationWarning
    >
      {children}
    </Component>
  );
}

