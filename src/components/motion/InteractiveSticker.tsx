"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import React, { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface InteractiveStickerProps {
  src: string;
  alt: string;
  initialRotate?: number;
  width?: number;
  height?: number;
  className?: string;
  draggable?: boolean;
}

export function InteractiveSticker({
  src,
  alt,
  initialRotate = 0,
  width = 160,
  height = 120,
  className = "",
  draggable = true,
}: InteractiveStickerProps) {
  const shouldReduce = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      drag={draggable && !shouldReduce}
      dragSnapToOrigin
      dragElastic={0.2}
      whileHover={{
        scale: 1.08,
        rotate: initialRotate + (initialRotate > 0 ? 4 : -4),
        transition: { type: "spring", stiffness: 400, damping: 15 },
      }}
      whileTap={{
        scale: 0.94,
        rotate: initialRotate,
      }}
      initial={{
        rotate: initialRotate,
        scale: 1,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "relative select-none touch-none cursor-grab active:cursor-grabbing will-change-transform drop-shadow-[0_8px_16px_rgba(0,0,0,0.18)] transition-shadow duration-200",
        isHovered && "drop-shadow-[0_16px_28px_rgba(0,0,0,0.28)] z-30",
        className,
      )}
      style={{
        width,
        height,
      }}
    >
      <div className="relative size-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${width}px`}
          className="object-contain pointer-events-none"
          priority
        />
      </div>
    </motion.div>
  );
}
