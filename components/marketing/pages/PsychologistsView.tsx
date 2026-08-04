import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { blogPath } from "@/lib/seo/i18n";

export function PsychologistsView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.psychologists;

  return (
    <MarketingChrome locale={locale}>
      <article>
        <p className="mkt-eyebrow mkt-eyebrow-care mb-3">App · Cuidado</p>
        <h1 className="text-3xl sm:text-4xl mb-5">{t.title}</h1>
        <p className="text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
          {t.introBefore}{" "}
          <strong className="font-semibold">{t.introMode}</strong>
          {t.introAfter}
        </p>

        <section aria-labelledby="como-funciona-prof" className="mb-10 mkt-card">
          <h2 id="como-funciona-prof" className="text-xl mb-4">
            {t.howTitle}
          </h2>
          <ol className="space-y-3 text-sm">
            {t.howSteps.map((step, index) => (
              <li key={step} className="flex gap-3">
                <span className="home-display text-[var(--home-care)] text-lg leading-none pt-0.5">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="para-quem-prof" className="mb-10">
          <h2 id="para-quem-prof" className="text-xl mb-3">
            {t.idealTitle}
          </h2>
          <ul className="space-y-2 text-sm">
            {t.idealItems.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="text-[var(--home-care)]">
                  ·
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="limites-eticos" className="mb-10 mkt-card">
          <h2 id="limites-eticos" className="text-xl mb-3">
            {t.ethicsTitle}
          </h2>
          <p className="text-sm leading-relaxed">
            {t.ethicsBefore}{" "}
            <Link
              href={blogPath(locale, t.ethicsArticleSlug)}
              className="text-[var(--home-accent)] hover:underline"
            >
              {t.ethicsLink}
            </Link>
            {t.ethicsAfter}
          </p>
        </section>

        <nav aria-label={t.flowNavAria} className="mkt-cta-row">
          <Link
            href={localizedPath(locale, "/register")}
            className="mkt-btn mkt-btn-primary"
          >
            {t.ctaRegister}
          </Link>
          <Link
            href={localizedPath(locale, "/plans")}
            className="mkt-btn mkt-btn-ghost"
          >
            {t.ctaPlans}
          </Link>
          <Link
            href={localizedPath(locale, "/clinicas")}
            className="mkt-btn mkt-btn-ghost-clinic"
          >
            {t.ctaClinics}
          </Link>
          <Link href="/clinic" className="mkt-btn mkt-btn-clinic">
            {dict.nav.clinicApp}
          </Link>
        </nav>
      </article>
    </MarketingChrome>
  );
}
