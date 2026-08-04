import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";

export function ClinicsView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).clinics;

  return (
    <MarketingChrome locale={locale}>
      <article>
        <p className="mkt-eyebrow mkt-eyebrow-clinic mb-3">{t.eyebrow}</p>
        <h1 className="text-3xl sm:text-4xl mb-4">{t.title}</h1>
        <p className="text-sm sm:text-base leading-relaxed mb-8 max-w-3xl">
          {t.intro}
        </p>

        <section className="mb-10 mkt-card border-t-[3px] border-t-[var(--home-clinic)]">
          <h2 className="text-xl mb-2">{t.splitTitle}</h2>
          <p className="text-sm leading-relaxed">{t.splitBody}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl mb-4">{t.modulesTitle}</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {t.modules.map((mod) => (
              <li key={mod.title} className="mkt-card">
                <p className="text-sm font-semibold text-[var(--home-ink)] mb-1">
                  {mod.title}
                </p>
                <p className="text-sm leading-relaxed">{mod.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl mb-3">{t.forWhomTitle}</h2>
          <ul className="space-y-2 text-sm">
            {t.forWhom.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="text-[var(--home-clinic)]">
                  ·
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 mkt-card">
          <h2 className="text-xl mb-3">{t.ethicsTitle}</h2>
          <p className="text-sm leading-relaxed">{t.ethicsBody}</p>
        </section>

        <nav aria-label={t.title} className="mkt-cta-row">
          <Link href="/clinic" className="mkt-btn mkt-btn-clinic">
            {t.ctaOpen}
          </Link>
          <Link
            href={localizedPath(locale, "/clinicas")}
            className="mkt-btn mkt-btn-ghost-clinic"
          >
            {locale === "en" ? "Clinics overview" : "Visão geral"}
          </Link>
          <Link
            href={localizedPath(locale, "/plans")}
            className="mkt-btn mkt-btn-ghost"
          >
            {t.ctaPlans}
          </Link>
          <Link
            href={localizedPath(locale, "/psychologists")}
            className="mkt-btn mkt-btn-ghost"
          >
            {t.ctaPsych}
          </Link>
        </nav>
      </article>
    </MarketingChrome>
  );
}
