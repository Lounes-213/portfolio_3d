import { Check, Compass, Globe, Mail, Sparkle } from "@/components/icons";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { profile } from "@/content/profile";
import { pick } from "@/content/schema";
import type { Locale } from "@/lib/i18n/routing";

type AboutProps = { locale: Locale };

/**
 * Unlocked Academic Achievements, Engineering Bio & Languages section.
 * Preserves 100% of USTHB Bioinformatics Master & CS Bachelor data, bio, and languages.
 */
export async function About({ locale }: AboutProps) {
  const title =
    locale === "ar"
      ? "المسار الأكاديمي والشهادات الجامعية"
      : locale === "fr"
        ? "DIPLÔMES & PARCOURS ACADÉMIQUE"
        : "ACADEMIC DEGREES & CREDENTIALS";

  const intro =
    locale === "ar"
      ? "مسار أكاديمي متخصص في الإعلام الآلي والبيومعلوماتية وعلم البيانات بجامعة هواري بومدين للعلوم والتكنولوجيا (USTHB) بالجزائر العاصمة."
      : locale === "fr"
        ? "Parcours académique en Informatique, Bioinformatique et Data Science à l'Université des Sciences et de la Technologie Houari Boumediene (USTHB) à Alger."
        : "Rigorous computer science, bioinformatics, and data science academic foundation at University of Science and Technology Houari Boumediene (USTHB), Algiers.";

  const bioParagraphs = pick(profile.bio, locale);

  return (
    <Section
      id="about"
      eyebrow={
        locale === "ar"
          ? "التعليم الأكاديمي · USTHB"
          : locale === "fr"
            ? "Formation · USTHB"
            : "Academic Journey · USTHB"
      }
      title={title}
      intro={intro}
      width="content"
    >
      <div className="flex flex-col gap-6">
        {/* Unlocked Academic Achievements Grid */}
        <div className="grid gap-6 md:grid-cols-2 items-stretch">
          {/* Master's Degree in Bioinformatics */}
          <Reveal delay={0.05}>
            <article className="h-full flex flex-col justify-between panel-raised p-6 sm:p-7 transition-transform duration-200 hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between gap-3 border-b border-border-subtle pb-4 mb-5">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-[var(--radius-control)] border-2 border-border-strong bg-accent text-accent-fg shrink-0">
                      <Sparkle size={16} />
                    </span>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent-text">
                      Postgraduate · M2
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold uppercase text-fg-muted tabular-nums">
                    EQF 7
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl sm:text-2xl text-fg tracking-tight">
                  {locale === "ar"
                    ? "ماستر في المعلوماتية الحيوية"
                    : locale === "fr"
                      ? "Master en Bioinformatique"
                      : "Master's Degree in Bioinformatics"}
                </h3>

                <p className="mt-1.5 font-mono text-xs text-fg-muted">
                  {locale === "ar"
                    ? "جامعة هواري بومدين للعلوم والتكنولوجيا (USTHB) · الجزائر"
                    : "University of Science & Technology Houari Boumediene (USTHB) · Algiers"}
                </p>

                <p className="mt-3 font-mono text-[11px] font-bold uppercase tracking-wider text-info-text">
                  Data Science · Artificial Intelligence · Machine Learning · Deep Learning
                </p>

                <p className="mt-3 text-sm text-fg-muted leading-relaxed">
                  {locale === "ar"
                    ? "تخصص متقدم يجمع بين علم البيانات، الذكاء الاصطناعي، خوارزميات التعلم الآلي والتعلم العميق مع المعالجة الحسابية للبيانات المعقدة."
                    : locale === "fr"
                      ? "Spécialisation avancée en Data Science, Intelligence Artificielle (IA), algorithmes de Machine Learning et Deep Learning appliqués aux données complexes."
                      : "Advanced computational curriculum specializing in Data Science, Artificial Intelligence (AI), Machine Learning algorithms, and Deep Learning for large-scale data systems."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between font-mono text-xs">
                <span className="inline-flex items-center gap-1.5 text-success-text font-bold">
                  <Check size={14} />
                  <span>
                    {locale === "ar"
                      ? "مكتمل"
                      : locale === "fr"
                        ? "Statut : Terminé"
                        : "Completed"}
                  </span>
                </span>
                <span className="font-bold text-fg tabular-nums">2024 – 2026</span>
              </div>
            </article>
          </Reveal>

          {/* Bachelor's Degree in Computer Science */}
          <Reveal delay={0.1}>
            <article className="h-full flex flex-col justify-between panel-raised p-6 sm:p-7 transition-transform duration-200 hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between gap-3 border-b border-border-subtle pb-4 mb-5">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-[var(--radius-control)] border-2 border-border-strong bg-[#22D3EE] text-[#051B24] shrink-0">
                      <Compass size={16} />
                    </span>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-info-text">
                      Undergraduate · BSc
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold uppercase text-fg-muted tabular-nums">
                    EQF 6 · Graduated
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl sm:text-2xl text-fg tracking-tight">
                  {locale === "ar"
                    ? "ليسانس في الإعلام الآلي"
                    : locale === "fr"
                      ? "Licence en Informatique"
                      : "Bachelor's in Computer Science"}
                </h3>

                <p className="mt-1.5 font-mono text-xs text-fg-muted">
                  {locale === "ar"
                    ? "جامعة هواري بومدين (كلية الإعلام الآلي) · الجزائر"
                    : "USTHB (Faculty of Computer Science) · Algiers"}
                </p>

                <p className="mt-3 font-mono text-[11px] font-bold uppercase tracking-wider text-accent-text">
                  Computer Architecture · Data Structures · Algorithms · Core Operating Systems
                </p>

                <p className="mt-3 text-sm text-fg-muted leading-relaxed">
                  {locale === "ar"
                    ? "نظرة عامة وشاملة حول علوم الإعلام الآلي، بنية وهندسة الحواسيب، وبناء قاعدة معرفية وبرمجية متينة في الخوارزميات وهياكل البيانات والأنظمة."
                    : locale === "fr"
                      ? "Vue d'ensemble complète de l'informatique et de l'architecture des ordinateurs, avec une base théorique et pratique solide en algorithmique et systèmes."
                      : "Comprehensive overview of computer science and computer architecture, establishing a solid theoretical and practical foundation in algorithms and systems engineering."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between font-mono text-xs">
                <span className="inline-flex items-center gap-1.5 text-success-text font-bold">
                  <Check size={14} />
                  <span>
                    {locale === "ar"
                      ? "متخرج"
                      : locale === "fr"
                        ? "Statut : Diplômé"
                        : "Completed"}
                  </span>
                </span>
                <span className="font-bold text-fg tabular-nums">2020 – 2024</span>
              </div>
            </article>
          </Reveal>
        </div>

        {/* Profile Story + Spoken Languages Strip */}
        <Reveal delay={0.14}>
          <div className="panel p-6 sm:p-7 grid gap-6 lg:grid-cols-[1.6fr_1fr] items-start">
            <div className="flex flex-col gap-3 text-sm sm:text-base text-fg-muted leading-relaxed">
              {bioParagraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t lg:border-t-0 lg:border-s border-border-subtle pt-4 lg:pt-0 lg:ps-6">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-fg">
                <Globe size={14} className="text-accent-text" />
                <span>
                  {locale === "ar"
                    ? "اللغات"
                    : locale === "fr"
                      ? "Langues"
                      : "Languages"}
                </span>
              </div>
              <dl className="flex flex-col gap-2.5">
                {profile.spokenLanguages.map((lang) => (
                  <div
                    key={lang.tag}
                    className="flex items-center justify-between border-b border-border-subtle/70 pb-2 last:border-b-0 last:pb-0 font-mono text-xs"
                  >
                    <dt className="font-bold text-fg">
                      <span className="text-accent-text me-2">{lang.tag}</span>
                      {pick(lang.name, locale)}
                    </dt>
                    <dd className="text-fg-muted">{pick(lang.level, locale)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>

        {/* Direct Verification Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] border-2 border-border-strong bg-surface px-4 py-3.5 font-mono text-xs text-fg shadow-[3px_3px_0px_#05070B]">
          <span className="inline-flex items-center gap-2 font-bold">
            <Compass size={15} className="text-accent-text" />
            <span>USTHB · Faculty of Computer Science · Algiers</span>
          </span>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 font-bold text-accent-text hover:underline"
          >
            <Mail size={15} />
            <span>{profile.email}</span>
          </a>
        </div>
      </div>
    </Section>
  );
}
