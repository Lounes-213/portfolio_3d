"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Box, Layers } from "lucide-react";
import { MinecraftOpenWorld } from "@/components/three/MinecraftOpenWorld";
import type { Locale } from "@/lib/i18n/routing";

type PortfolioExperienceShellProps = {
  locale: Locale;
  classicView: ReactNode;
};

/**
 * Provides the full-screen 3D Minecraft Open-World Portfolio by default,
 * with a top-right 2D / 3D switcher button ("btn 2d w 3d dirha lfuq a droit ga3").
 */
export function PortfolioExperienceShell({
  locale,
  classicView,
}: PortfolioExperienceShellProps) {
  const [mode, setMode] = useState<"openworld" | "classic">("openworld");

  if (mode === "openworld") {
    return (
      <MinecraftOpenWorld
        locale={locale}
        onSwitchToClassic={() => setMode("classic")}
      />
    );
  }

  return (
    <div className="relative">
      {/* Top-Right 2D / 3D Switch Button */}
      <div className="fixed top-3 right-3 z-[70] flex items-center gap-1 border-2 border-[#05070B] bg-[#090D16]/95 p-1 font-mono shadow-[4px_4px_0px_#05070B]">
        <button
          type="button"
          onClick={() => setMode("openworld")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black tracking-wider text-slate-300 uppercase transition-colors hover:bg-emerald-500 hover:text-slate-950"
        >
          <Box className="h-3.5 w-3.5" />
          <span>3D WORLD</span>
        </button>
        <button
          type="button"
          onClick={() => setMode("classic")}
          className="inline-flex items-center gap-1.5 bg-emerald-400 px-3 py-1.5 text-xs font-black tracking-wider text-slate-950 uppercase"
        >
          <Layers className="h-3.5 w-3.5" />
          <span>2D VIEW</span>
        </button>
      </div>
      {classicView}
    </div>
  );
}
