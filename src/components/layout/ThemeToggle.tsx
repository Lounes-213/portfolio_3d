"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import { Monitor, Moon, Sun } from "@/components/icons";
import { useMounted, useTheme } from "@/lib/theme/provider";
import { THEME_MODES, type ThemeMode } from "@/lib/theme/script";
import { originFromElement } from "@/lib/theme/transitions";
import { cn } from "@/lib/utils/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("theme");
  const { toggle } = useTheme();
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => toggle(originFromElement(ref.current))}
      title={t("toggle")}
      aria-label={t("toggle")}
      className={cn(
        "inline-flex size-8 sm:size-9 items-center justify-center text-fg select-none",
        "transition-colors hover:text-accent-text",
        className,
      )}
    >
      <span className="theme-light">
        <Moon size={16} />
      </span>
      <span className="theme-dark">
        <Sun size={16} />
      </span>
    </button>
  );
}

const MODE_ICONS: Record<ThemeMode, typeof Sun> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

export function ThemeModeControl() {
  const t = useTranslations("theme");
  const { mode, setMode } = useTheme();
  const mounted = useMounted();
  const groupRef = useRef<HTMLDivElement>(null);

  const activeClassName: Record<ThemeMode, string> = {
    system: "mode-active-system",
    light: "mode-active-light",
    dark: "mode-active-dark",
  };

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={t("label")}
      className="inline-flex items-center gap-1 rounded-[var(--radius-control)] border border-border-subtle bg-surface-sunken p-1"
    >
      {THEME_MODES.map((value) => {
        const Icon = MODE_ICONS[value];
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={mounted ? mode === value : undefined}
            onClick={(event) =>
              setMode(value, originFromElement(event.currentTarget))
            }
            className={cn(
              "inline-flex min-h-9 items-center gap-1.5 rounded-[var(--radius-control)] px-2.5 font-mono text-caption text-fg-muted",
              "transition-colors dur-2 hover:text-fg",
              activeClassName[value],
            )}
          >
            <Icon size={14} />
            <span>{t(value)}</span>
          </button>
        );
      })}
    </div>
  );
}
