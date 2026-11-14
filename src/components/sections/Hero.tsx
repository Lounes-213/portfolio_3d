import { ArrowRight, Download } from "@/components/icons";
import { HeroPortrait } from "@/components/sections/HeroPortrait";
import { VoxelWorldHero } from "@/components/three/VoxelWorldHero";
import { ExtraFazantButton } from "@/components/ui/ExtraFazantButton";
import { profile } from "@/content/profile";
import { pick } from "@/content/schema";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/routing";

type HeroProps = { locale: Locale };

/**
 * Interactive 3D Minecraft Voxel Island Hero + Obsidian Stats Bar:
 * - Full-bleed WebGL floating voxel landmass & enchanted altar canvas
 * - High-contrast semantic foreground panel on the reading start edge
 * - Preserves all real profile identity, tagline, CV links, and 4 verified metrics
 */
export async function Hero({ locale }: HeroProps) {
  const isRtl = locale === "ar";
  const isFr = locale === "fr";

  const headline = isRtl
    ? "لوناس بن سبع · هندسة البرمجيات وتطبيقات المستقبل"
    : isFr
      ? "LOUNÈS BENSEBA — INGÉNIEUR MOBILE & FULL-STACK"
      : "LOUNÈS BENSEBA — MOBILE & FULL-STACK ENGINEER";

  const subcopy = pick(profile.valueProp, locale);
  const cvHref = isFr ? "/cv-lounes-benseba-fr.pdf" : "/cv-lounes-benseba-en.pdf";
  const cvFilename = isFr ? "CV_Lounes_Benseba_FR.pdf" : "CV_Lounes_Benseba_EN.pdf";

  return (
    <section
      id="top"
      className="relative isolate border-b-2 border-border-strong bg-[#0B0E14] text-white"
    >
      {/* Interactive 3D Voxel Island Viewport Stage */}
      <div className="relative min-h-[82vh] lg:min-h-[88vh] flex items-center pt-[calc(var(--header-h)+1.5rem)] pb-20 sm:pb-24 overflow-hidden">
        {/* Three.js Canvas Layer */}
        <div className="absolute inset-0 z-0">
          <VoxelWorldHero locale={locale} />
        </div>

        {/* Directional contrast scrim over reading side so text stays crisp over 3D geometry */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-r from-[#0B0E14]/92 via-[#0B0E14]/70 to-[#0B0E14]/20 rtl:bg-gradient-to-l"
        />

        {/* Foreground Identity & Action Overlay */}
        <div className="container-page relative z-10 pointer-events-none">
          <div className="max-w-2xl flex flex-col items-start pointer-events-auto">
            {/* Avatar + Crisp Unboxed Location / Education Metadata */}
            <div className="flex items-center gap-4 mb-5">
              <HeroPortrait
                src={profile.portrait.image}
                alt={pick(profile.portrait.alt, locale)}
                initials={profile.initials}
              />
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#34D399]">
                  {pick(profile.role, locale)}
                </span>
                <span className="font-mono text-xs text-[#A5B1C2]">
                  {pick(profile.location, locale)} · USTHB Bioinformatics MSc
                </span>
              </div>
            </div>

            {/* Primary Display Headline */}
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.02] text-white [text-wrap:balance] drop-shadow-[0_3px_0_rgba(5,7,11,0.9)]">
              {headline}
            </h1>

            {/* Real Portfolio Subcopy */}
            <p className="mt-5 text-base sm:text-lg text-[#D1D9E6] leading-relaxed max-w-xl">
              {subcopy}
            </p>

            {/* Primary Action Row */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <ExtraFazantButton href="#work" variant="green">
                {isRtl
                  ? "استكشف المشاريع"
                  : isFr
                    ? "Explorer les Projets"
                    : "Explore Work"}
              </ExtraFazantButton>

              <ExtraFazantButton
                href={cvHref}
                download={cvFilename}
                variant="pink"
                icon={<Download size={15} />}
              >
                {isRtl
                  ? "تحميل السيرة"
                  : isFr
                    ? "Télécharger CV"
                    : "Download CV"}
              </ExtraFazantButton>

              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#D1D9E6] hover:text-[#34D399] transition-colors"
              >
                <span>
                  {isRtl
                    ? "تواصل معي"
                    : isFr
                      ? "Me contacter"
                      : "Contact Me"}
                </span>
                <ArrowRight size={14} className="rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Anchored 4-Column Verified Metrics Bar */}
      <div className="relative z-10 bg-surface border-t-2 border-border-strong">
        <div className="container-page py-5 sm:py-6">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {profile.stats.map((stat) => (
              <div
                key={stat.id}
                className="flex flex-col gap-1 border-s-2 border-accent/60 ps-3.5"
              >
                <dt className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
                  {pick(stat.label, locale)}
                </dt>
                <dd className="font-display text-2xl sm:text-3xl font-bold text-fg tabular-nums tracking-tight">
                  {stat.value}
                  {stat.suffix ? (
                    <span className="text-accent-text">{stat.suffix}</span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
