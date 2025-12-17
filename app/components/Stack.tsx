import { ReactNode } from "react";

interface StackProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "ul" | "ol";
  gap?: "4" | "8" | "16" | "24" | "32" | "40";
  align?: "start" | "center" | "end" | "stretch";
}

const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

export function Stack({
  children,
  className = "",
  as: Component = "div",
  gap = "16",
  align = "stretch",
}: StackProps) {
  const gapVar = `var(--alias-sizes-spacing-sp-${gap})`;

  return (
    <Component
      className={`flex flex-col ${alignClasses[align]} ${className}`}
      style={{ gap: gapVar }}
      suppressHydrationWarning
    >
      {children}
    </Component>
  );
}

