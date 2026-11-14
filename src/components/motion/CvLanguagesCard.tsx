"use client";

import { motion } from "framer-motion";
import type { ComponentType } from "react";
import {
  IconDart,
  IconFastAPI,
  IconFlutter,
  IconJava,
  IconNextjs,
  IconOpenCV,
  IconPandas,
  IconPython,
  IconR,
  IconStreamlit,
  IconTensorFlow,
  IconWeb,
  type TechIconProps,
} from "@/components/icons/TechIcons";

export interface CvLanguageItem {
  name: string;
  category: string;
  icon: ComponentType<TechIconProps>;
  levelBadge?: string;
}

const CV_LANGUAGES: CvLanguageItem[] = [
  {
    name: "Flutter",
    category: "Mobile Architecture",
    icon: IconFlutter,
    levelBadge: "Expert",
  },
  {
    name: "Dart",
    category: "Client Engineering",
    icon: IconDart,
    levelBadge: "Core",
  },
  {
    name: "Next.js",
    category: "Web Platform",
    icon: IconNextjs,
    levelBadge: "Core",
  },
  {
    name: "Python",
    category: "Backend & Computing",
    icon: IconPython,
    levelBadge: "Core",
  },
  {
    name: "FastAPI",
    category: "High-Perf APIs",
    icon: IconFastAPI,
    levelBadge: "Primary",
  },
  {
    name: "Java",
    category: "Android & Systems",
    icon: IconJava,
  },
  {
    name: "TypeScript",
    category: "Typed Web Core",
    icon: IconWeb,
    levelBadge: "Core",
  },
  {
    name: "R",
    category: "Bioinformatics Stats",
    icon: IconR,
  },
  {
    name: "OpenCV",
    category: "Computer Vision",
    icon: IconOpenCV,
  },
  {
    name: "Pandas & Data",
    category: "Data Pipelines",
    icon: IconPandas,
  },
  {
    name: "Streamlit",
    category: "Data Dashboards",
    icon: IconStreamlit,
  },
  {
    name: "Machine Learning",
    category: "Applied Modeling",
    icon: IconTensorFlow,
  },
];

/**
 * Anthropic-grade Technical Stack Matrix:
 * Meticulous 1px hairlines, monospace metadata, and responsive layout.
 */
export function CvLanguagesCard() {
  return (
    <div className="w-full rounded-2xl border border-border/80 bg-surface/90 p-4 sm:p-6 shadow-1 backdrop-blur-md">
      {/* Card Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-border/60 pb-3.5 text-center sm:text-start">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold text-fg tracking-tight">
            Core Languages &amp; Engineering Stack
          </h3>
          <p className="mt-0.5 text-xs text-fg-muted">
            Mobile, full-stack, and scientific bioinformatics toolchain
          </p>
        </div>

        <span className="self-center sm:self-auto rounded-full border border-border bg-surface-sunken/80 px-2.5 py-0.5 font-mono text-[10.5px] font-medium text-fg-muted">
          12 Core Technologies
        </span>
      </div>

      {/* Grid of Minimalist Technical Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {CV_LANGUAGES.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.04 + idx * 0.02,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative flex flex-col justify-between rounded-xl border border-border/70 bg-surface-sunken/50 p-3 transition-all duration-200 hover:border-accent/50 hover:bg-surface"
            >
              <div className="flex items-start justify-between gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-surface border border-border/60 text-fg transition-colors group-hover:text-accent group-hover:border-accent/40 shadow-xs">
                    <IconComponent size={15} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-fg tracking-tight group-hover:text-accent transition-colors">
                    {item.name}
                  </span>
                </div>

                {item.levelBadge && (
                  <span className="rounded bg-accent/10 px-1.5 py-0.2 font-mono text-[9px] font-medium text-accent shrink-0">
                    {item.levelBadge}
                  </span>
                )}
              </div>

              <span className="mt-2.5 font-mono text-[10px] text-fg-subtle truncate">
                {item.category}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
