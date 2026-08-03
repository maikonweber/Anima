import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { blogPath } from "@/lib/seo/i18n";

export function PsychologistsView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).psychologists;

  return (
    <MarketingChrome locale={locale}>
      <article>
        <h1 className="text-3xl font-bold text-foreground/90 mb-6">{t.title}</h1>
        <p className="text-sm text-foreground/55 leading-relaxed mb-6">
          {t.introBefore}{" "}
          <strong className="text-foreground/75 font-semibold">{t.introMode}</strong>
          {t.introAfter}
        </p>

        <section aria-labelledby="como-funciona-prof" className="mb-10">
          <h2
            id="como-funciona-prof"
            className="text-xl font-semibold text-foreground/82 mb-3"
          >
            {t.howTitle}
          </h2>
          <ol className="list-decimal ps-6 space-y-2 text-sm text-foreground/55">
            {t.howSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="para-quem-prof" className="mb-10">
          <h2
            id="para-quem-prof"
            className="text-xl font-semibold text-foreground/82 mb-3"
          >
            {t.idealTitle}
          </h2>
          <ul className="list-disc ps-6 text-sm text-foreground/55 space-y-2">
            {t.idealItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="limites-eticos" className="mb-10">
          <h2
            id="limites-eticos"
            className="text-xl font-semibold text-foreground/82 mb-3"
          >
            {t.ethicsTitle}
          </h2>
          <p className="text-sm text-foreground/55 leading-relaxed">
            {t.ethicsBefore}{" "}
            <Link
              href={blogPath(locale, t.ethicsArticleSlug)}
              className="text-anima-violet hover:underline"
            >
              {t.ethicsLink}
            </Link>
            {t.ethicsAfter}
          </p>
        </section>

        <nav
          aria-label={t.flowNavAria}
          className="flex flex-wrap gap-4 font-medium text-anima-violet"
        >
          <Link
            href={localizedPath(locale, "/register")}
            className="hover:underline"
          >
            {t.ctaRegister}
          </Link>
          <Link
            href={localizedPath(locale, "/plans")}
            className="hover:underline"
          >
            {t.ctaPlans}
          </Link>
          <Link
            href={localizedPath(locale, "/faq")}
            className="hover:underline"
          >
            {t.ctaFaq}
          </Link>
          <Link
            href={localizedPath(locale, "/clinicas")}
            className="hover:underline"
          >
            {t.ctaClinics}
          </Link>
        </nav>
      </article>
    </MarketingChrome>
  );
}
