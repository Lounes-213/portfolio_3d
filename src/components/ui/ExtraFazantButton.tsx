"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

interface ExtraFazantButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?:
    | "blue"
    | "pink"
    | "white"
    | "outline"
    | "yellow"
    | "green"
    | "dark";
  className?: string;
  icon?: React.ReactNode;
  target?: string;
  rel?: string;
  download?: string | boolean;
}

/**
 * Beveled Minecraft-inspired voxel tactile button preserving full API compatibility.
 */
export function ExtraFazantButton({
  href,
  onClick,
  children,
  variant = "blue",
  className = "",
  icon,
  target,
  rel,
  download,
}: ExtraFazantButtonProps) {
  const variants = {
    blue: {
      wrap: "bg-accent text-accent-fg border-2 border-border-strong shadow-[3px_3px_0px_#05070B] hover:bg-accent-hover",
      iconBox: "bg-black/15 text-accent-fg border-e-2 border-border-strong",
    },
    green: {
      wrap: "bg-accent text-accent-fg border-2 border-border-strong shadow-[3px_3px_0px_#05070B] hover:bg-accent-hover",
      iconBox: "bg-black/15 text-accent-fg border-e-2 border-border-strong",
    },
    pink: {
      wrap: "bg-[#22D3EE] text-[#051B24] border-2 border-[#05070B] shadow-[3px_3px_0px_#05070B] hover:bg-[#06B6D4]",
      iconBox: "bg-[#0891B2]/25 text-[#051B24] border-e-2 border-[#05070B]",
    },
    yellow: {
      wrap: "bg-[#FBBF24] text-[#1A1102] border-2 border-[#05070B] shadow-[3px_3px_0px_#05070B] hover:bg-[#F59E0B]",
      iconBox: "bg-[#B45309]/25 text-[#1A1102] border-e-2 border-[#05070B]",
    },
    white: {
      wrap: "bg-surface text-fg border-2 border-border-strong shadow-[3px_3px_0px_#05070B] hover:bg-surface-raised",
      iconBox: "bg-bg-subtle text-fg border-e-2 border-border-strong",
    },
    outline: {
      wrap: "bg-surface text-fg border-2 border-border-strong shadow-[3px_3px_0px_#05070B] hover:bg-surface-raised",
      iconBox: "bg-bg-subtle text-fg border-e-2 border-border-strong",
    },
    dark: {
      wrap: "bg-surface-raised text-fg border-2 border-border-strong shadow-[3px_3px_0px_#05070B] hover:bg-surface",
      iconBox: "bg-bg-subtle text-accent-text border-e-2 border-border-strong",
    },
  };

  const current = variants[variant] || variants.blue;

  const content = (
    <span
      className={cn(
        "group relative inline-flex items-center overflow-hidden rounded-[var(--radius-control)] text-xs sm:text-sm font-mono font-bold uppercase tracking-wider select-none transition-transform duration-150",
        "hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        current.wrap,
        className,
      )}
    >
      {icon && (
        <span
          className={cn(
            "flex size-9 sm:size-10 items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105",
            current.iconBox,
          )}
        >
          {icon}
        </span>
      )}
      <span className="px-4 sm:px-5 py-2.5 whitespace-nowrap">{children}</span>
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        download={
          download
            ? typeof download === "string"
              ? download
              : true
            : undefined
        }
        className="inline-block"
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block">
      {content}
    </button>
  );
}
