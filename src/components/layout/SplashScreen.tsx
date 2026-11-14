"use client";

import { useEffect, useState } from "react";
import { BrandBrushLogo } from "@/components/ui/BrandBrushLogo";
import { cn } from "@/lib/utils/cn";

type SplashScreenProps = {
  locale?: string;
};

/**
 * Crisp Minecraft-inspired Voxel Loader Splash Screen (750ms entrance):
 * - Emerald LB voxel crest
 * - Pixelify Sans "LOUNÈS BENSEBA" title
 * - 3 animated emerald/diamond/gold voxel cubes
 */
export function SplashScreen({ locale: _locale }: SplashScreenProps = {}) {
  const [mounted, setMounted] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 700);

    const removeTimer = setTimeout(() => {
      setMounted(false);
    }, 1050);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg select-none transition-opacity duration-300 ease-out",
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100",
      )}
    >
      <div className="flex flex-col items-center justify-center text-center px-4">
        <div className="mb-5">
          <BrandBrushLogo size="lg" />
        </div>

        <p className="font-mono text-xs sm:text-sm font-bold text-accent-text uppercase tracking-[0.2em]">
          Software Engineer · Full-Stack &amp; Mobile
        </p>

        {/* 3 Animated Minecraft Voxel Blocks (Emerald, Diamond, Gold) */}
        <div className="mt-8 flex items-center justify-center gap-3.5">
          <span className="voxel-cube voxel-cube-1" />
          <span className="voxel-cube voxel-cube-2" />
          <span className="voxel-cube voxel-cube-3" />
        </div>
      </div>

      <style jsx>{`
        .voxel-cube {
          width: 14px;
          height: 14px;
          border-radius: 2px;
          border: 2px solid #05070b;
          box-shadow: 2px 2px 0px #05070b;
          animation: voxelBounce 0.85s infinite ease-in-out;
        }

        .voxel-cube-1 {
          background-color: #34d399;
          animation-delay: 0s;
        }

        .voxel-cube-2 {
          background-color: #22d3ee;
          animation-delay: 0.14s;
        }

        .voxel-cube-3 {
          background-color: #fbbf24;
          animation-delay: 0.28s;
        }

        @keyframes voxelBounce {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
