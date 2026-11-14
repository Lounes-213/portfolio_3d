import { setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { About } from "@/components/sections/About";
import { ContactCta } from "@/components/sections/ContactCta";
import { FloatingTechStack } from "@/components/sections/FloatingTechStack";
import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { Work } from "@/components/sections/Work";
import { PortfolioExperienceShell } from "@/components/three/PortfolioExperienceShell";
import { isLocale, type Locale } from "@/lib/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const resolved: Locale = isLocale(locale) ? locale : "en";

  return (
    <PortfolioExperienceShell
      locale={resolved}
      classicView={
        <>
          <Header />
          <Hero locale={resolved} />
          <FloatingTechStack locale={resolved} />
          <Work locale={resolved} />
          <About locale={resolved} />
          <Skills locale={resolved} />
          <ContactCta locale={resolved} />
          <Footer locale={resolved} />
        </>
      }
    />
  );
}
