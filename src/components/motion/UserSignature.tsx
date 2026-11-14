"use client";

import { motion, useReducedMotion } from "framer-motion";
import React from "react";

interface UserSignatureProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * 10000/100 Exact Replica of the user's handwritten blue signature:
 * - Starts with the capital 'A' (diagonal up to apex, then straight down the vertical leg)
 * - Continues with the grand sweeping teardrop loop, horizontal crossbar, and double wave flourish
 * - Progressive live handwriting animation starting immediately upon entering the page ("tbda men lewel men harf A")
 */
export function UserSignature({
  className = "",
  width = 240,
  height = 150,
  color = "#2563EB",
  strokeWidth = 12,
}: UserSignatureProps) {
  const shouldReduce = useReducedMotion();

  // Animation variants: Stroke 1 (Letter A) draws first on page entrance, followed immediately by Stroke 2 (Loop & Waves)
  const drawStrokeA = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.6, delay: 0.15, ease: "easeOut" as const },
        opacity: { duration: 0.05, delay: 0.15 },
      },
    },
  };

  const drawStrokeB = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 1.1, delay: 0.7, ease: "easeOut" as const },
        opacity: { duration: 0.05, delay: 0.7 },
      },
    },
  };

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
    >
      <svg
        width={width}
        height={height}
        viewBox="0 0 1000 650"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        aria-label="Signature Lounès Benseba"
      >
        {/* Stroke 1: The 'A' (Starts from diagonal, rises to apex, drops down right leg) */}
        <motion.path
          d="M 510 272 L 605 125 L 572 382 C 570 392, 565 394, 574 374"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={shouldReduce ? false : "hidden"}
          animate="visible"
          variants={drawStrokeA}
        />

        {/* Stroke 2: Diagonal down to loop, arched curve, crossbar, double wave flourish */}
        <motion.path
          d="M 510 272 L 32 595 C 16 612, 22 636, 50 630 C 130 610, 280 440, 510 272 C 535 274, 560 277, 575 278 C 630 282, 665 285, 685 265 C 700 240, 712 205, 725 205 C 740 205, 750 230, 765 235 C 780 240, 795 175, 810 175 C 825 175, 835 185, 855 172"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={shouldReduce ? false : "hidden"}
          animate="visible"
          variants={drawStrokeB}
        />
      </svg>
    </div>
  );
}
