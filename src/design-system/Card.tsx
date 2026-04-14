import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  variant?: "default" | "inset";
};

export function Card({
  children,
  className = "",
  onClick,
  hoverable = false,
  variant = "default",
}: CardProps) {
  const base =
    "rounded-lg border border-border shadow-card";

  const variantClass =
    variant === "inset"
      ? "bg-surface-2"
      : "bg-surface";

  const interactiveClass =
    hoverable || onClick
      ? "cursor-pointer hover:border-muted hover:bg-surface-2 transition-all duration-150 active:scale-[0.98]"
      : "";

  return (
    <div
      onClick={onClick}
      className={[base, variantClass, interactiveClass, className].join(" ")}
    >
      {children}
    </div>
  );
}
