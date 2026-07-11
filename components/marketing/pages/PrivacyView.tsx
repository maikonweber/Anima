import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";

export function PrivacyView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).privacy;

  return (
    <MarketingChrome locale={locale}>
      <article className="prose-marketing space-y-5 text-sm text-foreground/55 leading-relaxed">
        <h1 className="text-3xl font-bold text-foreground/90">{t.title}</h1>
        <p>{t.intro}</p>
        <section aria-labelledby="p-dados-minimos">
          <h2
            id="p-dados-minimos"
            className="text-lg font-semibold text-foreground/82 mb-3"
          >
            {t.controlTitle}
          </h2>
          <p>{t.controlBody}</p>
        </section>
        <section aria-labelledby="p-ia">
          <h2
            id="p-ia"
            className="text-lg font-semibold text-foreground/82 mb-3"
          >
            {t.sentioTitle}
          </h2>
          <p>{t.sentioBody}</p>
        </section>
        <address className="not-italic text-xs text-foreground/40 mt-12">
          {t.legalNote}
        </address>
      </article>
    </MarketingChrome>
  );
}
