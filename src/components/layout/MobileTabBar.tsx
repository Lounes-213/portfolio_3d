"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Compass, Layers, Mail, Smartphone } from "@/components/icons";
import { useActiveSection } from "@/components/layout/useActiveSection";
import type { SectionId } from "@/content/schema";
import { site } from "@/content/site";
import { cn } from "@/lib/utils/cn";

const TAB_IDS = ["work", "about", "skills", "contact"] as const satisfies readonly SectionId[];

const TAB_ICONS = {
  work: Smartphone,
  about: Compass,
  skills: Layers,
  contact: Mail,
} as const;

export function MobileTabBar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const active = useActiveSection(TAB_IDS);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => setIsOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  return (
    <div ref={menuRef} className="fixed bottom-4 end-4 z-overlay md:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="mb-3 flex flex-col gap-1 rounded-[var(--radius-card)] border-2 border-border-strong bg-surface p-2 shadow-[4px_4px_0px_#05070B] min-w-[168px]"
          >
            {TAB_IDS.map((id, index) => {
              const Icon = TAB_ICONS[id];
              const item = site.navigation.find((entry) => entry.id === id);
              if (!item) return null;
              const isActive = active === id;
              const destinationHref = id === "contact" ? `/${locale}/contact` : item.href;

              return (
                <motion.a
                  key={id}
                  href={destinationHref}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--radius-control)] px-3 py-2.5 font-mono text-xs font-bold uppercase transition-colors duration-150",
                    isActive
                      ? "bg-accent text-accent-fg"
                      : "text-fg-muted hover:bg-bg-subtle hover:text-fg",
                  )}
                >
                  <Icon
                    size={15}
                    className={cn("shrink-0", isActive ? "text-accent-fg" : "text-fg-subtle")}
                  />
                  <span className="flex-1 tracking-wider">{t(id)}</span>
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.92 }}
        aria-label={isOpen ? t("close") : t("menu")}
        className={cn(
          "flex size-11 items-center justify-center rounded-[var(--radius-control)] border-2 border-border-strong shadow-[3px_3px_0px_#05070B] transition-colors duration-150",
          isOpen
            ? "bg-accent text-accent-fg"
            : "bg-surface text-fg hover:border-accent",
        )}
      >
        <div className="relative size-5">
          <span
            className={cn(
              "absolute left-0 top-1.5 h-0.5 w-5 bg-current transition-all duration-200",
              isOpen && "top-2.5 rotate-45",
            )}
          />
          <span
            className={cn(
              "absolute left-0 top-3.5 h-0.5 w-5 bg-current transition-all duration-200",
              isOpen && "top-2.5 -rotate-45",
            )}
          />
        </div>
      </motion.button>
    </div>
  );
}
