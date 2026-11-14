import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeVariant =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "outline";

const VARIANTS: Record<BadgeVariant, string> = {
  neutral: "bg-bg-subtle text-fg-muted border-border-subtle",
  accent: "bg-accent-soft text-accent-soft-text border-accent-soft-border",
  success: "bg-success-soft text-success-soft-text border-transparent",
  warning: "bg-warning-soft text-warning-soft-text border-transparent",
  outline: "bg-transparent text-fg-muted border-border-interactive",
};

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  icon?: ReactNode;
  className?: string;
};

export function Badge({
  children,
  variant = "neutral",
  dot = false,
  icon,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-[var(--radius-control)] border px-2.5 py-1 font-mono text-caption font-medium",
        VARIANTS[variant],
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="inline-block size-2 rounded-[1px] bg-current"
        />
      )}
      {icon}
      {children}
    </span>
  );
}
