import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";

export function ContactView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).contact;

  return (
    <MarketingChrome locale={locale}>
      <article>
        <h1 className="text-3xl font-bold text-foreground/90 mb-6">{t.title}</h1>
        <p className="text-sm text-foreground/55 mb-10 leading-relaxed">
          {t.intro}
        </p>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="font-semibold text-foreground/78">{t.companyLabel}</dt>
            <dd className="text-foreground/55">{t.companyValue}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground/78">{t.securityLabel}</dt>
            <dd className="text-foreground/55">
              {t.securityBefore}{" "}
              <code className="text-[11px] text-anima-violet">{t.securityPath}</code>
            </dd>
          </div>
        </dl>
        <address className="mt-12 not-italic text-xs text-foreground/40">
          {t.addressNote}
        </address>
      </article>
    </MarketingChrome>
  );
}
