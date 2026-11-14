import { getTranslations } from "next-intl/server";
import { ArrowRight } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <section className="container-page flex min-h-[65vh] flex-col items-center justify-center py-section text-center">
      <div className="panel-raised px-8 py-10 sm:px-12 sm:py-12 max-w-lg flex flex-col items-center">
        <p className="eyebrow">404 · Biome Not Found</p>
        <h1 className="mt-stack-sm font-display text-h1 font-bold text-balance text-fg">
          {t("title")}
        </h1>
        <p className="mt-stack-md max-w-prose text-lead text-fg-muted">
          {t("body")}
        </p>
        <ButtonLink
          href="/"
          size="lg"
          className="mt-stack-lg"
          iconEnd={<ArrowRight className="rtl:rotate-180" />}
        >
          {t("cta")}
        </ButtonLink>
      </div>
    </section>
  );
}
