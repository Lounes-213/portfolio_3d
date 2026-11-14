"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import type { ReelProject } from "@/content/reels";
import type { Locale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";
import { ReelCard } from "./ReelCard";

type WorkListProps = {
  projects: ReelProject[];
  locale: Locale;
  tWatch: string;
  tMute: string;
  tUnmute: string;
  tPlay: string;
  tPause: string;
  tAll: string;
  tMobile: string;
  tWeb: string;
  tViewLinkedIn?: string;
};

type FilterCategory = "all" | "featured" | "mobile" | "web";

export function WorkList({
  projects,
  locale,
  tWatch,
  tMute,
  tUnmute,
  tPlay,
  tPause,
  tAll,
  tMobile,
  tWeb,
  tViewLinkedIn = "LinkedIn",
}: WorkListProps) {
  const [filter, setFilter] = useState<FilterCategory>("all");

  const filteredProjects = useMemo(() => {
    if (filter === "featured") {
      return projects.filter((p) => p.featured);
    }
    if (filter === "mobile") {
      return projects.filter(
        (p) =>
          p.languages.includes("Flutter") ||
          p.tags.includes("Mobile") ||
          p.category.en.toLowerCase().includes("mobile") ||
          p.category.en.toLowerCase().includes("transit"),
      );
    }
    if (filter === "web") {
      return projects.filter(
        (p) =>
          p.languages.includes("Next.js") ||
          p.languages.includes("React") ||
          p.tags.includes("Web") ||
          p.tags.includes("Marketplace") ||
          p.category.en.toLowerCase().includes("web"),
      );
    }
    return projects;
  }, [filter, projects]);

  const filterTabs: Array<{
    id: FilterCategory;
    label: string;
    count?: number;
  }> = [
    { id: "all", label: tAll, count: projects.length },
    {
      id: "featured",
      label: "Featured",
      count: projects.filter((p) => p.featured).length,
    },
    { id: "mobile", label: tMobile },
    { id: "web", label: tWeb },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Voxel Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 border-b border-border-subtle pb-5">
        {filterTabs.map((tab) => {
          const isActive = filter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-[var(--radius-control)] border-2 border-border-strong px-4 py-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-150 select-none",
                "shadow-[3px_3px_0px_#05070B] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                isActive
                  ? "bg-accent text-accent-fg"
                  : "bg-surface text-fg-muted hover:text-fg hover:bg-surface-raised",
              )}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    "font-mono text-[11px] tabular-nums opacity-85",
                    isActive ? "text-accent-fg" : "text-fg-subtle",
                  )}
                >
                  ({tab.count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Staggered 2-Column Gaming Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start">
        {filteredProjects.map((project, index) => {
          const isStaggered = index % 2 === 1;
          const staggerClass = isStaggered ? "md:mt-14 lg:mt-16" : "";

          return (
            <Reveal key={project.id} delay={index * 0.04} className="h-full">
              <ReelCard
                project={project}
                locale={locale}
                tWatch={tWatch}
                tMute={tMute}
                tUnmute={tUnmute}
                tPlay={tPlay}
                tPause={tPause}
                tViewLinkedIn={tViewLinkedIn}
                staggerClass={staggerClass}
              />
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
