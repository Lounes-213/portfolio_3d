"use client";

import React, { useState } from "react";
import {
  IconAndroid,
  IconCloudflare,
  IconFastAPI,
  IconFirebase,
  IconFlutter,
  IconKotlin,
  IconNextjs,
  IconPostgreSQL,
  IconPython,
  IconReact,
  IconSQLite,
  IconSupabase,
  IconTailwind,
  IconTypeScript,
} from "@/components/icons/TechIcons";
import type { Locale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";

interface TechItem {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const TECH_ITEMS: TechItem[] = [
  { id: "flutter", name: "Flutter", category: "Mobile Core", icon: IconFlutter },
  { id: "android", name: "Android", category: "Native SDK", icon: IconAndroid },
  { id: "kotlin", name: "Kotlin", category: "Modern Android", icon: IconKotlin },
  { id: "dart", name: "Dart", category: "Language", icon: IconFlutter },
  { id: "nextjs", name: "Next.js", category: "Full-Stack Web", icon: IconNextjs },
  { id: "react", name: "React", category: "Frontend UI", icon: IconReact },
  { id: "typescript", name: "TypeScript", category: "Type Safety", icon: IconTypeScript },
  { id: "python", name: "Python", category: "Data & Backend", icon: IconPython },
  { id: "fastapi", name: "FastAPI", category: "RESTful APIs", icon: IconFastAPI },
  { id: "cloudflare", name: "Cloudflare", category: "Edge & Workers", icon: IconCloudflare },
  { id: "supabase", name: "Supabase", category: "Postgres & Auth", icon: IconSupabase },
  { id: "tailwind", name: "Tailwind CSS", category: "Design Tokens", icon: IconTailwind },
  { id: "postgres", name: "PostgreSQL", category: "Relational DB", icon: IconPostgreSQL },
  { id: "firebase", name: "Firebase", category: "Auth & Realtime", icon: IconFirebase },
  { id: "sqlite", name: "SQLite", category: "Offline Storage", icon: IconSQLite },
];

type FloatingTechStackProps = {
  locale: Locale;
};

/**
 * Interactive Minecraft Hotbar & Crafting Inventory Arsenal displaying all 15 technologies.
 */
export function FloatingTechStack({ locale }: FloatingTechStackProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedItem = TECH_ITEMS[selectedIndex] ?? TECH_ITEMS[0];

  const headline =
    locale === "ar"
      ? "الترسانة التقنية واللغات"
      : locale === "fr"
        ? "INVENTAIRE TECHNIQUE"
        : "CRAFTING ARSENAL & STACK";

  const subcopy =
    locale === "ar"
      ? "أدوات هندسية مثبتة في بيئات الإنتاج الفعلية: تطبيقات موبايل سريعة ومنصات ويب متكاملة."
      : locale === "fr"
        ? "Outils éprouvés en production : mobile fluide, architectures temps réel et déploiement edge."
        : "Production-tested engineering loadout: high-framerate mobile apps, full-stack web platforms, and edge infrastructure.";

  return (
    <section className="relative isolate overflow-hidden border-b-2 border-border-strong bg-bg-subtle py-16 sm:py-24">
      <div className="container-page relative z-10 flex flex-col items-center text-center">
        <span className="eyebrow mb-2">
          {locale === "ar"
            ? "العتاد البرمجي"
            : locale === "fr"
              ? "Boîte à outils"
              : "Engineering Loadout"}
        </span>

        <h2 className="font-display font-bold text-h2 uppercase tracking-tight text-fg max-w-3xl text-balance">
          {headline}
        </h2>

        <p className="text-lead text-fg-muted max-w-xl mx-auto mt-3 mb-8">
          {subcopy}
        </p>

        {/* Continuous Tech Marquee Ribbon */}
        <div className="w-full overflow-hidden py-3.5 border-y-2 border-border-strong bg-surface mb-10">
          <div className="flex w-max animate-marquee items-center gap-10 sm:gap-14 select-none">
            {Array.from({ length: 4 }).map((_, repeatIndex) => (
              <React.Fragment key={repeatIndex}>
                {TECH_ITEMS.map((tech) => {
                  const Icon = tech.icon;
                  return (
                    <div
                      key={tech.name + repeatIndex}
                      className="inline-flex items-center gap-2 text-accent-text"
                    >
                      <Icon size={22} className="text-accent-text" />
                      <span className="font-mono font-bold text-xs uppercase tracking-wider text-fg">
                        {tech.name}
                      </span>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Minecraft Crafting Chest Inventory Container */}
        <div className="w-full max-w-4xl panel-raised p-4 sm:p-6">
          {/* Active Slot Readout Bar */}
          {selectedItem && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-control)] border border-border-subtle bg-surface-sunken px-3.5 py-2 font-mono text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-accent-text font-bold tabular-nums">
                  [{String(selectedIndex + 1).padStart(2, "0")}/15]
                </span>
                <span className="font-bold text-fg uppercase">{selectedItem.name}</span>
                <span aria-hidden="true" className="text-fg-subtle">
                  ·
                </span>
                <span className="text-fg-muted">{selectedItem.category}</span>
              </div>
              <span className="text-[11px] text-fg-subtle hidden sm:inline">
                {locale === "fr"
                  ? "Cliquez un bloc pour l'inspecter"
                  : locale === "ar"
                    ? "اختر أداة لعرض تفاصيلها"
                    : "Select slot to inspect"}
              </span>
            </div>
          )}

          {/* 15 Inventory Voxel Slots */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
            {TECH_ITEMS.map((tech, idx) => {
              const Icon = tech.icon;
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    "voxel-slot flex items-center gap-2.5 p-2.5 text-start transition-transform duration-150 hover:-translate-y-0.5 cursor-pointer",
                    isSelected
                      ? "border-[#34D399] ring-2 ring-[#34D399]/35 bg-surface-raised"
                      : "hover:border-border-interactive",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-8 place-items-center rounded-[2px] border border-border-strong shrink-0",
                      isSelected
                        ? "bg-accent text-accent-fg"
                        : "bg-surface text-accent-text",
                    )}
                  >
                    <Icon size={17} />
                  </span>
                  <span className="flex flex-col min-w-0">
                    <span className="font-display font-bold text-sm text-fg truncate">
                      {tech.name}
                    </span>
                    <span className="font-mono text-[10px] text-fg-subtle truncate">
                      {tech.category}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
