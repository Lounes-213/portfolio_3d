"use client";

import { motion, useReducedMotion } from "framer-motion";
import React from "react";

interface TextMaskRevealProps {
  children: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
}

export function TextMaskReveal({
  children,
  className = "",
  delay = 0,
  as: Component = "div",
}: TextMaskRevealProps) {
  const shouldReduce = useReducedMotion();
  const words = children.split(" ");

  if (shouldReduce) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component className={`flex flex-wrap gap-x-[0.25em] gap-y-1 ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1">
          <motion.span
            initial={{ y: "130%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.85,
              delay: delay + i * 0.05,
              ease: [0.16, 1, 0.3, 1], // Expo.out
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
