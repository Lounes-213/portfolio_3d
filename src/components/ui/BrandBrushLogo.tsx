"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

interface BrandBrushLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

/**
 * Minecraft-inspired 3D Voxel Emerald crest + crisp Pixelify Sans wordmark.
 */
export function BrandBrushLogo({
  className = "",
  size = "md",
}: BrandBrushLogoProps) {
  const badgeSize =
    size === "sm"
      ? "size-7 text-[11px]"
      : size === "lg"
        ? "size-11 text-base"
        : "size-8 text-xs";

  const titleSize =
    size === "sm"
      ? "text-base sm:text-lg"
      : size === "lg"
        ? "text-2xl sm:text-3xl"
        : "text-lg sm:text-xl";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 select-none whitespace-nowrap shrink-0",
        className,
      )}
    >
      {/* 3-Tone Beveled Emerald Voxel Crest */}
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex items-center justify-center font-mono font-bold tracking-tight text-[#04291E] bg-[#34D399] border-2 border-[#05070B] rounded-[2px] shadow-[2px_2px_0px_#05070B] shrink-0",
          "after:pointer-events-none after:absolute after:inset-0 after:border-t-2 after:border-s-2 after:border-[#A7F3D0]/70",
          badgeSize,
        )}
      >
        LB
      </span>

      <span className="flex items-baseline gap-1.5 whitespace-nowrap">
        <span
          className={cn(
            "font-display font-bold tracking-tight text-fg",
            titleSize,
          )}
        >
          LOUNÈS
        </span>
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-accent-text hidden sm:inline">
          BENSEBA
        </span>
      </span>
    </div>
  );
}
