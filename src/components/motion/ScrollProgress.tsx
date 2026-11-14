"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { springs } from "@/lib/motion/tokens";

/**
 * Top-edge Minecraft XP bar reading progress indicator.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, springs.progress);

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 h-[var(--scroll-progress-h)] origin-left bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#22D3EE] rtl:origin-right z-progress"
    />
  );
}
