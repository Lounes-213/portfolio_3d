"use client";

import { motion, useReducedMotion } from "framer-motion";
import React from "react";

interface AnimatedSquiggleProps {
  className?: string;
  width?: number;
  height?: number;
  color?: string;
  delay?: number;
}

/**
 * Animated hand-drawn SVG squiggle that draws progressively like a pen stroke
 * ("tban kima ktabat lqalam machi direct").
 */
export function AnimatedSquiggle({
  className = "",
  width = 170,
  height = 18,
  color = "#2563EB",
  delay = 0.3,
}: AnimatedSquiggleProps) {
  const shouldReduce = useReducedMotion();

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 170 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.path
        d="M3 14C35 4 60 16 95 6C120 1 145 13 167 4"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        initial={shouldReduce ? false : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 1.1,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    </svg>
  );
}
