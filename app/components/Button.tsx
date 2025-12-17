import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "default" | "disabled";
  size?: "small" | "medium" | "large";
}

const variantStyles = {
  primary: {
    backgroundColor: "var(--alias-color-surface-buttons-button-on)",
    color: "var(--alias-color-text-body-white)",
    borderColor: "var(--alias-color-borders-primary-active)",
  },
  default: {
    backgroundColor: "var(--alias-color-surface-background-primary)",
    color: "var(--alias-color-text-body-default)",
    borderColor: "var(--alias-color-borders-primary-default)",
  },
  disabled: {
    backgroundColor: "var(--alias-color-surface-buttons-button-disabled)",
    color: "var(--alias-color-text-disabled-default)",
    borderColor: "var(--alias-color-borders-disabled-default)",
  },
};

const sizeStyles = {
  small: {
    padding: "var(--alias-sizes-spacing-sp-8) var(--alias-sizes-spacing-sp-16)",
    fontSize: "var(--typography-fontsize-body-small)",
  },
  medium: {
    padding: "var(--alias-sizes-spacing-sp-16) var(--alias-sizes-spacing-sp-32)",
    fontSize: "var(--typography-fontsize-body-medium)",
  },
  large: {
    padding: "var(--alias-sizes-spacing-sp-24) var(--alias-sizes-spacing-sp-40)",
    fontSize: "var(--typography-fontsize-body-large)",
  },
};

export function Button({
  children,
  className = "",
  variant = "default",
  size = "medium",
  disabled,
  ...props
}: ButtonProps) {
  const effectiveVariant = disabled ? "disabled" : variant;
  const variantStyle = variantStyles[effectiveVariant];
  const sizeStyle = sizeStyles[size];

  return (
    <button
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        ...variantStyle,
        ...sizeStyle,
        borderRadius: "var(--alias-sizes-radius-rd-8)",
        borderWidth: "var(--alias-sizes-border-br-1)",
        borderStyle: "solid",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      disabled={disabled}
      suppressHydrationWarning
      {...props}
    >
      {children}
    </button>
  );
}

