import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-bg font-semibold hover:bg-accent-hover active:scale-95 shadow-accent",
  secondary:
    "bg-transparent border border-border text-text hover:bg-surface-2 active:scale-95",
  ghost:
    "bg-transparent text-muted hover:text-text hover:bg-surface-2 active:scale-95",
  danger:
    "bg-ludo-red/10 border border-ludo-red/40 text-ludo-red hover:bg-ludo-red/20 active:scale-95",
};

const sizeClasses = {
  sm: "px-4 py-2 text-sm rounded-md",
  md: "px-6 py-3 text-base rounded-lg",
  lg: "px-8 py-4 text-lg rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  children,
  onClick,
  className = "",
  type = "button",
  fullWidth = false,
}: ButtonProps) {
  if (disabled) {
    return (
      <button
        type={type}
        disabled
        className={[
          "cursor-not-allowed opacity-40 bg-surface-2 border border-border text-muted",
          sizeClasses[size],
          fullWidth ? "w-full" : "",
          className,
        ].join(" ")}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={[
        "transition-all duration-150 cursor-pointer font-body",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
