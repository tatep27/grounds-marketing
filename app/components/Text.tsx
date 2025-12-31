import { ReactNode, CSSProperties } from "react";

interface TextProps {
  children: ReactNode;
  className?: string;
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "em" | "strong";
  variant?:
    | "hero"
    | "title"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body-large"
    | "body-medium"
    | "body-small";
  color?: "heading" | "body" | "white" | "disabled" | "error" | "information";
  weight?: 300 | 400 | 600 | 700;
  style?: CSSProperties;
}

const variantStyles = {
  hero: {
    fontFamily: "var(--base-type-font-family-headings)",
    fontSize: "var(--typography-fontsize-headings-hero)",
    lineHeight: "var(--typography-line-height-headings-hero)",
  },
  title: {
    fontFamily: "var(--base-type-font-family-headings)",
    fontSize: "var(--typography-fontsize-headings-title)",
    lineHeight: "var(--typography-line-height-headings-title)",
  },
  h1: {
    fontFamily: "var(--base-type-font-family-headings)",
    fontSize: "var(--typography-fontsize-headings-h1)",
    lineHeight: "var(--typography-line-height-headings-h1)",
  },
  h2: {
    fontFamily: "var(--base-type-font-family-headings)",
    fontSize: "var(--typography-fontsize-headings-h2)",
    lineHeight: "var(--typography-line-height-headings-h2)",
  },
  h3: {
    fontFamily: "var(--base-type-font-family-headings)",
    fontSize: "var(--typography-fontsize-headings-h3)",
    lineHeight: "var(--typography-line-height-headings-h3)",
  },
  h4: {
    fontFamily: "var(--base-type-font-family-headings)",
    fontSize: "var(--typography-fontsize-headings-h4)",
    lineHeight: "var(--typography-line-height-headings-h4)",
  },
  h5: {
    fontFamily: "var(--base-type-font-family-headings)",
    fontSize: "var(--typography-fontsize-headings-h5)",
    lineHeight: "var(--typography-line-height-headings-h5)",
  },
  h6: {
    fontFamily: "var(--base-type-font-family-headings)",
    fontSize: "var(--typography-fontsize-headings-h6)",
    lineHeight: "var(--typography-line-height-headings-h6)",
  },
  "body-large": {
    fontFamily: "var(--base-type-font-family-body)",
    fontSize: "var(--typography-fontsize-body-large)",
    lineHeight: "var(--typography-line-height-body-large)",
  },
  "body-medium": {
    fontFamily: "var(--base-type-font-family-body)",
    fontSize: "var(--typography-fontsize-body-medium)",
    lineHeight: "var(--typography-line-height-body-medium)",
  },
  "body-small": {
    fontFamily: "var(--base-type-font-family-body)",
    fontSize: "var(--typography-fontsize-body-small)",
    lineHeight: "var(--typography-line-height-body-small)",
  },
};

const colorTokens = {
  heading: "var(--alias-color-text-heading-default)",
  body: "var(--alias-color-text-body-default)",
  white: "var(--alias-color-text-body-white)",
  disabled: "var(--alias-color-text-disabled-default)",
  error: "var(--alias-color-text-error-default)",
  information: "var(--alias-color-text-information-default)",
};

export function Text({
  children,
  className = "",
  as: Component = "p",
  variant = "body-medium",
  color = "body",
  weight,
  style,
}: TextProps) {
  const typographyStyle = variantStyles[variant];
  const colorValue = colorTokens[color];

  return (
    <Component
      className={className}
      style={{
        ...typographyStyle,
        color: colorValue,
        fontWeight: weight,
        ...style,
      }}
      suppressHydrationWarning
    >
      {children}
    </Component>
  );
}

