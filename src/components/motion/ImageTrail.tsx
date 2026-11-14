"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { STICKER_LIST } from "@/content/stickers";

export { STICKER_LIST };

interface ImageTrailProps {
  children?: React.ReactNode;
  className?: string;
  spacing?: number;
  stickers?: readonly string[] | string[];
  disabled?: boolean;
}

/**
 * High-performance Extra Fazant cursor sticker trail:
 * Spaced out cleanly and scales drift distance dynamically with mouse velocity.
 * Fast mouse movements fling stickers further away across the screen.
 */
export function ImageTrail({
  children,
  className = "",
  spacing = 14,
  stickers = STICKER_LIST,
  disabled = false,
}: ImageTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const isReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (isReduced) return;

    let stickerIndex = 0;
    let lastX = 0;
    let lastY = 0;
    let dist = 0;
    let hasMoved = false;
    let threshold = Math.max(110, window.innerWidth / spacing);

    const activeTweens = new Set<gsap.core.Timeline>();

    const spawnSticker = (
      x: number,
      y: number,
      deltaX: number,
      deltaY: number,
    ) => {
      const src =
        stickers[stickerIndex % stickers.length] ?? "/stickers/anti-slop.svg";
      stickerIndex = (stickerIndex + 1) % stickers.length;

      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      img.className =
        "pointer-events-none absolute z-40 select-none will-change-transform drop-shadow-[0_12px_24px_rgba(0,0,0,0.28)]";
      img.style.left = "0px";
      img.style.top = "0px";
      img.style.width = "clamp(7.5rem, 13vw, 11rem)";
      img.style.maxHeight = "9.5rem";
      img.style.objectFit = "contain";

      container.appendChild(img);

      const rotStart = (Math.random() - 0.5) * 24;
      const rotEnd = rotStart + (Math.random() - 0.5) * 26;

      // Dynamic velocity fling: the faster the mouse moves, the further stickers fling
      const speed = Math.hypot(deltaX, deltaY);
      const velocityFactor = Math.min(9.5, Math.max(3.5, speed * 0.18));
      const targetX = x + deltaX * velocityFactor;
      const targetY = y + deltaY * velocityFactor;

      const tl = gsap.timeline({
        onComplete: () => {
          activeTweens.delete(tl);
          img.remove();
          tl.kill();
        },
      });

      activeTweens.add(tl);

      // Elastic pop-in
      tl.fromTo(
        img,
        {
          xPercent: -50,
          yPercent: -50,
          scaleX: 1.35,
          scaleY: 1.35,
        },
        {
          scaleX: 1,
          scaleY: 1,
          duration: 0.55,
          ease: "elastic.out(2.2, 0.55)",
        },
      );

      // Velocity drift fling
      tl.fromTo(
        img,
        {
          x,
          y,
          rotation: rotStart,
        },
        {
          x: targetX,
          y: targetY,
          rotation: rotEnd,
          duration: 1.35,
          ease: "power3.out",
        },
        "<",
      );

      // Back.in exit
      tl.to(
        img,
        {
          scale: 0.35,
          opacity: 0,
          duration: 0.35,
          delay: 0.18,
          ease: "back.in(1.5)",
        },
        "-=0.45",
      );
    };

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const currentX = e.clientX;
      const currentY = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        lastX = currentX;
        lastY = currentY;
        return;
      }

      const dx = currentX - lastX;
      const dy = currentY - lastY;
      const delta = Math.abs(dx) + Math.abs(dy);

      dist += delta;

      if (dist > threshold) {
        dist = 0;
        const relativeX = currentX - rect.left;
        const relativeY = currentY - rect.top;
        spawnSticker(relativeX, relativeY, dx, dy);
      }

      lastX = currentX;
      lastY = currentY;
    };

    const onPointerLeave = () => {
      hasMoved = false;
      dist = 0;
    };

    const onResize = () => {
      threshold = Math.max(110, window.innerWidth / spacing);
    };

    container.addEventListener("mousemove", onPointerMove, { passive: true });
    container.addEventListener("mouseleave", onPointerLeave, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      container.removeEventListener("mousemove", onPointerMove);
      container.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      activeTweens.forEach((t) => t.kill());
      activeTweens.clear();
      const existing = container.querySelectorAll("img[src*='/stickers/']");
      existing.forEach((node) => node.remove());
    };
  }, [disabled, spacing, stickers]);

  return (
    <div
      ref={containerRef}
      data-image-trail=""
      className={`relative overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
