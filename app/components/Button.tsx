import { ReactNode, ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "default" | "ochre";
  size?: "small" | "medium" | "large";
}

export function Button({
  children,
  className = "",
  variant = "default",
  size = "medium",
  disabled,
  style: customStyle,
  ...props
}: ButtonProps) {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      className={buttonClasses}
      style={customStyle}
      disabled={disabled}
      suppressHydrationWarning
      {...props}
    >
      {children}
    </button>
  );
}

