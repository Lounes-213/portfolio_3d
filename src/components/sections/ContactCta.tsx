import { GitHub, Instagram, LinkedIn } from "@/components/icons";
import { IconTikTok } from "@/components/icons/TechIcons";
import { ImageTrail } from "@/components/motion/ImageTrail";
import { InteractiveSticker } from "@/components/motion/InteractiveSticker";
import { TextMaskReveal } from "@/components/motion/TextMaskReveal";
import { CopyEmailButton } from "@/components/sections/CopyEmailButton";
import { ExtraFazantButton } from "@/components/ui/ExtraFazantButton";
import { profile } from "@/content/profile";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/routing";

type ContactCtaProps = { locale: Locale };

export async function ContactCta({ locale }: ContactCtaProps) {
  const headline =
    locale === "ar"
      ? "جاهز لإطلاق مشروعك القادم؟"
      : locale === "fr"
        ? "PRÊT À CONSTRUIRE VOTRE PROJET ?"
        : "READY TO BUILD YOUR NEXT WORLD?";

  const subcopy =
    locale === "ar"
      ? "أخبرني برؤيتك وما تحتاجه في تطبيقك أو منصتك، وسأصممها لك بأعلى المعايير الهندسية والاعتمادية في بيئات الإنتاج."
      : locale === "fr"
        ? "Dites-moi où vous en êtes avec votre application ou projet web. Je conçois des plateformes robustes prêtes pour la production."
        : "Tell me what you are building. I engineer dependable mobile applications and full-stack web platforms ready for production.";

  const buttonLabel =
    locale === "ar"
      ? "ابدأ مشروعك الآن"
      : locale === "fr"
        ? "LANCER LE PROJET"
        : "START A PROJECT";

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden bg-[#0B0E14] text-white py-20 sm:py-28 border-t-2 border-[#263144]"
    >
      <ImageTrail className="size-full">
        <div className="container-page relative z-10 flex flex-col items-center text-center">
          <div className="pointer-events-auto absolute -top-6 start-4 hidden lg:block">
            <InteractiveSticker
              src="/stickers/open-to-work-badge.svg"
              alt="Open To Work"
              initialRotate={-10}
              width={125}
              height={125}
            />
          </div>

          <div className="pointer-events-auto absolute -top-4 end-6 hidden lg:block">
            <InteractiveSticker
              src="/stickers/lb-seal.svg"
              alt="LB Seal"
              initialRotate={10}
              width={135}
              height={85}
            />
          </div>

          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#34D399] mb-2">
            {locale === "ar"
              ? "ابدأ المحادثة الآن"
              : locale === "fr"
                ? "Contact & Collaboration"
                : "Let's Collaborate"}
          </p>

          <div className="max-w-4xl mx-auto my-2">
            <TextMaskReveal
              as="h2"
              className="font-display font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight uppercase text-white leading-[1.02] justify-center"
            >
              {headline}
            </TextMaskReveal>
          </div>

          <p className="text-base sm:text-lg text-[#A5B1C2] max-w-2xl mx-auto mt-3 mb-8 leading-relaxed">
            {subcopy}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 z-20">
            <ExtraFazantButton
              href={`mailto:${profile.email}`}
              variant="green"
            >
              {buttonLabel}
            </ExtraFazantButton>

            <CopyEmailButton
              email={profile.email}
              className="bg-[#181F2D] text-white border-[#2E3C54]"
            />

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border-2 border-[#2E3C54] bg-[#121722] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#22D3EE] shadow-[3px_3px_0px_#05070B] hover:border-[#22D3EE] transition-colors"
            >
              {locale === "ar"
                ? "نموذج التواصل"
                : locale === "fr"
                  ? "Formulaire"
                  : "Contact Form"}
            </Link>
          </div>

          <div className="mt-6 flex flex-col items-center gap-1">
            <a
              href={`mailto:${profile.email}`}
              className="font-mono text-sm sm:text-base font-bold text-[#34D399] hover:text-[#6EE7B7] hover:underline transition-colors"
            >
              {profile.email}
            </a>
            <span className="font-mono text-xs text-[#8E9BB0]">
              {locale === "ar"
                ? "أرد في غضون 24 ساعة · متاح لعقود العمل والمشاريع"
                : locale === "fr"
                  ? "Réponse sous 24h · Disponible pour contrats & projets clés"
                  : "Replies within 24h · Available for contracts & high-impact products"}
            </span>
          </div>

          <div className="mt-12 pt-8 border-t border-[#263144] w-full max-w-xl flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href="https://www.linkedin.com/in/lounes-benseba-a07549393/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border-2 border-[#263144] bg-[#121722] px-3.5 py-1.5 font-mono text-xs font-bold text-[#D1D9E6] shadow-[2px_2px_0px_#05070B] hover:text-white hover:border-[#22D3EE] transition-colors"
            >
              <LinkedIn size={14} className="text-[#22D3EE]" />
              <span>LinkedIn</span>
            </a>

            <a
              href="https://github.com/Lounes-213"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border-2 border-[#263144] bg-[#121722] px-3.5 py-1.5 font-mono text-xs font-bold text-[#D1D9E6] shadow-[2px_2px_0px_#05070B] hover:text-white hover:border-[#34D399] transition-colors"
            >
              <GitHub size={14} className="text-[#34D399]" />
              <span>GitHub</span>
            </a>

            <a
              href="https://instagram.com/lounes.7i"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border-2 border-[#263144] bg-[#121722] px-3.5 py-1.5 font-mono text-xs font-bold text-[#D1D9E6] shadow-[2px_2px_0px_#05070B] hover:text-white hover:border-[#FBBF24] transition-colors"
            >
              <Instagram size={14} className="text-[#FBBF24]" />
              <span>Instagram</span>
            </a>

            <a
              href="https://tiktok.com/@lounes.7i"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border-2 border-[#263144] bg-[#121722] px-3.5 py-1.5 font-mono text-xs font-bold text-[#D1D9E6] shadow-[2px_2px_0px_#05070B] hover:text-white hover:border-[#22D3EE] transition-colors"
            >
              <IconTikTok size={14} />
              <span>TikTok</span>
            </a>
          </div>
        </div>
      </ImageTrail>
    </section>
  );
}
