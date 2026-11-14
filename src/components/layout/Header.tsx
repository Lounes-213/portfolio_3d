"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Download } from "@/components/icons";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useActiveSection } from "@/components/layout/useActiveSection";
import { BrandBrushLogo } from "@/components/ui/BrandBrushLogo";
import { site } from "@/content/site";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";

const NAV_IDS = site.navigation.map((item) => item.id);

/**
 * 3-Zone Top Bar:
 * 1. Left: Single-line Voxel Emerald LB + LOUNÈS brand mark
 * 2. Center: 4 single-line navigation links (Work, About, Skills, Contact)
 * 3. Right: Compact Download CV button + LanguageSwitcher + ThemeToggle
 */
export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [lifted, setLifted] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const active = useActiveSection(NAV_IDS);

  const cvPath =
    locale === "fr" ? "/cv-lounes-benseba-fr.pdf" : "/cv-lounes-benseba-en.pdf";
  const cvFileName =
    locale === "fr" ? "CV_Lounes_Benseba_FR.pdf" : "CV_Lounes_Benseba_EN.pdf";

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-header pointer-events-none transition-all duration-200",
        lifted ? "pt-2" : "pt-3 sm:pt-4",
      )}
    >
      <div className="container-page flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Mark */}
        <Link
          href="/"
          className="pointer-events-auto inline-flex items-center rounded-[var(--radius-control)] border-2 border-border-strong bg-surface/95 px-3 py-1.5 shadow-[3px_3px_0px_#05070B] transition-transform hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] whitespace-nowrap shrink-0"
          aria-label="Lounès Benseba"
        >
          <BrandBrushLogo size="sm" />
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav
          aria-label={t("main")}
          className="pointer-events-auto hidden md:flex items-center gap-1 rounded-[var(--radius-control)] border-2 border-border-strong bg-surface/95 px-3 py-1.5 shadow-[3px_3px_0px_#05070B]"
        >
          {site.navigation.map((item) => {
            const isActive = active === item.id;
            const isHovered = hoveredNav === item.id;
            const showMarker = isHovered || (isActive && !hoveredNav);

            return (
              <a
                key={item.id}
                href={item.href}
                onMouseEnter={() => setHoveredNav(item.id)}
                onMouseLeave={() => setHoveredNav(null)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-wider transition-colors duration-150 select-none whitespace-nowrap shrink-0",
                  isActive
                    ? "text-accent-text"
                    : "text-fg-muted hover:text-fg",
                )}
              >
                <span>{t(item.id)}</span>
                {showMarker && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-accent rounded-[1px] pointer-events-none"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary CV Action + Language & Theme Controls */}
        <div className="pointer-events-auto flex items-center gap-2 shrink-0">
          <a
            href={cvPath}
            download={cvFileName}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border-2 border-border-strong bg-accent text-accent-fg px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_#05070B] hover:bg-accent-hover hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] transition-all whitespace-nowrap shrink-0"
            title="Download CV"
          >
            <Download size={13} />
            <span>CV</span>
          </a>

          <div className="rounded-[var(--radius-control)] border-2 border-border-strong bg-surface/95 shadow-[3px_3px_0px_#05070B] hover:-translate-y-0.5 transition-transform">
            <LanguageSwitcher />
          </div>

          <div className="rounded-[var(--radius-control)] border-2 border-border-strong bg-surface/95 shadow-[3px_3px_0px_#05070B] hover:-translate-y-0.5 transition-transform">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
