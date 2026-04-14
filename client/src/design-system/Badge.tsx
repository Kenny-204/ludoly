import React from "react";

type BadgeVariant = "default" | "coming-soon" | "success" | "warning" | "info";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantClasses: Record<BadgeVariant, string> = {
  default:      "bg-surface-2 text-muted border border-border",
  "coming-soon": "bg-muted/10 text-muted border border-muted/20",
  success:      "bg-ludo-green/10 text-ludo-green border border-ludo-green/20",
  warning:      "bg-accent/10 text-accent border border-accent/20",
  info:         "bg-ludo-blue/10 text-ludo-blue border border-ludo-blue/20",
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium font-body tracking-wide",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
