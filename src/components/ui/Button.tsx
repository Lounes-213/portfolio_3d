import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-fg border-2 border-border-strong shadow-[3px_3px_0px_#05070B] hover:bg-accent-hover hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  secondary:
    "bg-surface text-fg border-2 border-border-strong shadow-[3px_3px_0px_#05070B] hover:bg-surface-raised hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  ghost:
    "bg-transparent text-fg-muted border border-transparent hover:bg-bg-subtle hover:text-fg active:translate-y-px",
  danger:
    "bg-danger text-on-danger border-2 border-border-strong shadow-[3px_3px_0px_#05070B] hover:brightness-110 active:translate-y-px",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-caption gap-1.5",
  md: "min-h-11 px-4 text-body gap-2",
  lg: "min-h-13 px-6 text-lead gap-2.5",
};

const BASE =
  "inline-flex items-center justify-center rounded-[var(--radius-control)] font-mono font-bold uppercase tracking-wider " +
  "transition-[background-color,border-color,color,box-shadow,transform] dur-2 ease-standard " +
  "focus-visible:outline-focus select-none whitespace-nowrap";

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  iconStart,
  iconEnd,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    >
      {iconStart}
      {children}
      {iconEnd}
    </button>
  );
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  iconStart,
  iconEnd,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonStyles({ variant, size, className })} {...props}>
      {iconStart}
      {children}
      {iconEnd}
    </Link>
  );
}
