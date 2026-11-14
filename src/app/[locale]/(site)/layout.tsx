import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { SkipLink } from "@/components/layout/SkipLink";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { isLocale, type Locale } from "@/lib/i18n/routing";

type SiteLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function SiteLayout({ children, params }: SiteLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const resolved: Locale = isLocale(locale) ? locale : "en";

  return (
    <>
      <SplashScreen locale={resolved} />
      <SkipLink />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
    </>
  );
}
