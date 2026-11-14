"use client";

import { useTranslations } from "next-intl";
import {
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Card3D } from "@/components/motion/Card3D";
import { Section } from "@/components/ui/Section";
import { skills } from "@/content/skills";
import type { SkillItem } from "@/content/schema";
import { pick } from "@/content/schema";
import { isLocale, type Locale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";

const LEVELS = [1, 2, 3, 4, 5] as const;

const LEVEL_KEYS = {
  1: "levels.1",
  2: "levels.2",
  3: "levels.3",
  4: "levels.4",
  5: "levels.5",
} as const;

/** Segmented 5-block Emerald XP Bar meter */
function ProficiencyMeter({ level, label }: { level: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden="true" className="inline-flex items-center gap-1">
        {LEVELS.map((step) => (
          <span
            key={step}
            className={cn(
              "h-2.5 w-3 rounded-[1px] border border-border-strong transition-colors",
              step <= level ? "bg-accent" : "bg-surface-sunken",
            )}
          />
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

function SkillCard({ item, locale }: { item: SkillItem; locale: Locale }) {
  const t = useTranslations("skills");

  return (
    <Card3D
      maxTilt={5}
      scale={1.01}
      glare={true}
      glareMaxOpacity={0.08}
      className="h-full"
    >
      <li className="flex h-full flex-col justify-between gap-3.5 panel-raised p-4 sm:p-5 transition-colors hover:border-[#34D399]">
        <div>
          <div className="flex items-start justify-between gap-2">
            <p className="font-display font-bold text-base sm:text-lg text-fg ltr-island tracking-tight">
              {item.name}
            </p>
            {item.highlight && (
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-accent-text shrink-0">
                ★ {t("highlighted")}
              </span>
            )}
          </div>

          {item.note && (
            <p className="mt-2 text-xs sm:text-sm text-fg-muted leading-relaxed">
              {pick(item.note, locale)}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-2">
          <ProficiencyMeter
            level={item.level}
            label={t("proficiencyScaleLabel", { level: item.level })}
          />
          <span className="text-[11px] font-mono font-bold text-fg-subtle tabular-nums">
            {t(LEVEL_KEYS[item.level as (typeof LEVELS)[number]] ?? "levels.3")}
            {item.years ? ` · ${t("experience", { count: item.years })}` : ""}
          </span>
        </div>
      </li>
    </Card3D>
  );
}

type SkillsProps = { locale: Locale };

export function Skills({ locale }: SkillsProps) {
  const t = useTranslations("skills");
  const resolvedLocale: Locale = isLocale(locale) ? locale : "en";
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());

  const firstCategory = skills[0];
  const [selected, setSelected] = useState<string>(
    firstCategory?.id ?? "frontend",
  );

  const move = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const isRtl = document.documentElement.getAttribute("dir") === "rtl";
    const isForward =
      event.key === "ArrowDown" ||
      (event.key === "ArrowRight" && !isRtl) ||
      (event.key === "ArrowLeft" && isRtl);
    const isBackward =
      event.key === "ArrowUp" ||
      (event.key === "ArrowLeft" && !isRtl) ||
      (event.key === "ArrowRight" && isRtl);
    const isEdge = event.key === "Home" || event.key === "End";

    if (!isForward && !isBackward && !isEdge) return;
    event.preventDefault();

    const nextIndex = isEdge
      ? event.key === "Home"
        ? 0
        : skills.length - 1
      : (index + (isForward ? 1 : -1) + skills.length) % skills.length;

    const nextCategory = skills[nextIndex];
    if (!nextCategory) return;
    setSelected(nextCategory.id);
    tabRefs.current.get(nextCategory.id)?.focus();
  };

  return (
    <Section
      id="skills"
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      blueprint
    >
      <div className="grid gap-stack-md lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] items-start">
        <div
          role="tablist"
          aria-label={t("tablistLabel")}
          aria-orientation="vertical"
          className="flex gap-2 overflow-x-auto no-scrollbar lg:flex-col lg:overflow-visible pb-2"
        >
          {skills.map((category, index) => {
            const isSelected = category.id === selected;
            return (
              <button
                key={category.id}
                ref={(node) => {
                  if (node) tabRefs.current.set(category.id, node);
                  else tabRefs.current.delete(category.id);
                }}
                type="button"
                role="tab"
                id={`skills-tab-${category.id}`}
                aria-selected={isSelected}
                aria-controls={`skills-panel-${category.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelected(category.id)}
                onKeyDown={(event) => move(event, index)}
                className={cn(
                  "flex shrink-0 items-center justify-between gap-3 rounded-[var(--radius-control)] border-2 border-border-strong px-4 py-3 text-start select-none",
                  "shadow-[3px_3px_0px_#05070B] transition-all hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                  isSelected
                    ? "bg-accent text-accent-fg font-bold"
                    : "bg-surface text-fg-muted hover:text-fg hover:bg-surface-raised",
                )}
              >
                <span className="font-mono font-bold text-xs uppercase tracking-wider">
                  {pick(category.label, resolvedLocale)}
                </span>
                <span
                  className={cn(
                    "font-mono text-[11px] font-bold tabular-nums opacity-85",
                    isSelected ? "text-accent-fg" : "text-fg-subtle",
                  )}
                >
                  {category.items.length}
                </span>
              </button>
            );
          })}
        </div>

        <div className="min-w-0">
          {skills.map((category) => {
            const isSelected = category.id === selected;
            return (
              <div
                key={category.id}
                role="tabpanel"
                id={`skills-panel-${category.id}`}
                aria-labelledby={`skills-tab-${category.id}`}
                hidden={!isSelected}
                tabIndex={0}
                className="focus-visible:outline-focus"
              >
                <p className="mb-stack-md max-w-prose text-base text-fg-muted leading-relaxed">
                  {pick(category.summary, resolvedLocale)}
                </p>
                <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {category.items.map((item) => (
                    <SkillCard
                      key={item.name}
                      item={item}
                      locale={resolvedLocale}
                    />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
