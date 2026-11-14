import { getTranslations } from "next-intl/server";
import { External, Instagram, LinkedIn } from "@/components/icons";
import { Section } from "@/components/ui/Section";
import { reels } from "@/content/reels";
import type { Locale } from "@/lib/i18n/routing";
import { WorkList } from "./WorkList";

type WorkProps = { locale: Locale };

export async function Work({ locale }: WorkProps) {
  const t = await getTranslations("work");

  return (
    <Section
      id="work"
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
      width="wide"
      blueprint
      aside={
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="https://www.linkedin.com/in/lounes-benseba-a07549393/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border-2 border-border-strong bg-surface px-3 py-1.5 font-mono text-xs font-bold text-fg shadow-[3px_3px_0px_#05070B] hover:-translate-y-0.5 transition-transform"
          >
            <LinkedIn size={13} className="text-[#22D3EE]" />
            <span>LinkedIn</span>
            <External size={11} className="opacity-65" />
          </a>
          <a
            href="https://instagram.com/lounes.7i"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border-2 border-border-strong bg-surface px-3 py-1.5 font-mono text-xs font-bold text-fg shadow-[3px_3px_0px_#05070B] hover:-translate-y-0.5 transition-transform"
          >
            <Instagram size={13} className="text-[#FBBF24]" />
            <span>@lounes.7i</span>
            <External size={11} className="opacity-65" />
          </a>
        </div>
      }
    >
      <WorkList
        projects={reels}
        locale={locale}
        tWatch={t("watchOnInstagram")}
        tMute={t("mute")}
        tUnmute={t("unmute")}
        tPlay={t("play")}
        tPause={t("pause")}
        tAll={t("all")}
        tMobile={t("mobile")}
        tWeb={t("web")}
        tViewLinkedIn={t("viewOnLinkedIn")}
      />
    </Section>
  );
}
