import { getTranslations } from "next-intl/server";
import { ArrowUp, GitHub, Instagram, LinkedIn } from "@/components/icons";
import { IconTikTok } from "@/components/icons/TechIcons";
import { InteractiveSticker } from "@/components/motion/InteractiveSticker";
import { BrandBrushLogo } from "@/components/ui/BrandBrushLogo";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import type { Locale } from "@/lib/i18n/routing";

type FooterProps = { locale: Locale };

export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#080B10] text-white pt-16 pb-12 border-t-2 border-[#263144] overflow-hidden">
      <div className="absolute top-6 end-8 pointer-events-auto z-10 hidden lg:block">
        <InteractiveSticker
          src="/stickers/lb-seal.svg"
          alt="LB Monogram Seal"
          initialRotate={-8}
          width={120}
          height={74}
        />
      </div>

      <div className="container-page relative z-10 flex flex-col gap-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1.2fr_1fr] items-start">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <BrandBrushLogo size="lg" className="[&_span]:text-white" />
            <p className="text-sm text-[#A5B1C2] max-w-sm leading-relaxed mt-1">
              {locale === "ar"
                ? "مهندس برمجيات ومطور تطبيقات فلاتر وحلول الويب المتكاملة بالجزائر. كود نظيف وتجربة فائقة الأداء."
                : locale === "fr"
                  ? "Ingénieur logiciel en Flutter, Android et web full-stack en Algérie. Architecture propre, précision et fluidité."
                  : "Software engineer in Flutter, Android, and full-stack web platforms. Clean architecture, crisp UI, and 60 FPS craft."}
            </p>
          </div>

          {/* Navigation Column */}
          <div className="flex flex-col gap-3">
            <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-[#8E9BB0]">
              {locale === "ar"
                ? "التنقل"
                : locale === "fr"
                  ? "Navigation"
                  : "Navigation"}
            </h4>
            <ul className="flex flex-col gap-2 font-sans font-semibold text-sm text-[#D1D9E6]">
              {site.navigation.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="hover:text-[#34D399] transition-colors inline-block"
                  >
                    {tNav(item.id)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col gap-3">
            <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-[#8E9BB0]">
              Contact
            </h4>
            <div className="flex flex-col gap-1.5 font-mono text-xs text-[#D1D9E6]">
              <span className="text-[#8E9BB0]">Location:</span>
              <span className="font-bold text-white">Tizi Ouzou &amp; Algiers</span>
              <span className="text-[#8E9BB0]">Algeria (USTHB)</span>

              <span className="text-[#8E9BB0] mt-2">Email:</span>
              <a
                href={`mailto:${profile.email}`}
                className="font-bold text-[#34D399] hover:text-[#6EE7B7] hover:underline"
              >
                {profile.email}
              </a>
            </div>
          </div>

          {/* Socials Column & Back to Top */}
          <div className="flex flex-col justify-between h-full gap-6">
            <div className="flex flex-col gap-3">
              <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-[#8E9BB0]">
                Socials
              </h4>
              <ul className="flex flex-col gap-2 font-sans font-semibold text-sm text-[#D1D9E6]">
                <li>
                  <a
                    href="https://www.linkedin.com/in/lounes-benseba-a07549393/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-[#22D3EE] transition-colors"
                  >
                    <LinkedIn size={14} className="text-[#22D3EE]" />
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Lounes-213"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-[#34D399] transition-colors"
                  >
                    <GitHub size={14} />
                    <span>GitHub</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/lounes.7i"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-[#FBBF24] transition-colors"
                  >
                    <Instagram size={14} className="text-[#FBBF24]" />
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://tiktok.com/@lounes.7i"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-[#22D3EE] transition-colors"
                  >
                    <IconTikTok size={14} />
                    <span>TikTok</span>
                  </a>
                </li>
              </ul>
            </div>

            <a
              href="#top"
              className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border-2 border-[#34D399] bg-[#121722] px-4 py-2 font-mono text-xs font-bold uppercase text-[#34D399] shadow-[3px_3px_0px_#05070B] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all w-fit"
            >
              <ArrowUp size={14} />
              <span>{t("backToTop")}</span>
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-[#263144] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#8E9BB0]">
          <p>© {year} Lounès Benseba. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Algiers &amp; Tizi Ouzou</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#D1D9E6] font-bold">
              USTHB Bioinformatique &amp; Informatique
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
