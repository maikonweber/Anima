import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";

export function PlansView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.plans;

  return (
    <MarketingChrome locale={locale}>
      <article>
        <h1 className="text-3xl font-bold text-foreground/90 mb-4">{t.title}</h1>
        <p className="text-sm text-foreground/55 leading-relaxed mb-10 max-w-2xl">
          {t.intro}
        </p>

        <div className="space-y-8 mb-12">
          {t.plans.map((plan) => (
            <section key={plan.name} aria-labelledby={`plan-${plan.name}`}>
              <h2
                id={`plan-${plan.name}`}
                className="text-xl font-semibold text-foreground/82 mb-1"
              >
                {plan.name}
              </h2>
              <p className="text-sm text-foreground/45 mb-3">{plan.tagline}</p>
              <ul className="list-disc ps-6 space-y-2 text-sm text-foreground/55">
                {plan.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section aria-labelledby="planos-controle" className="mb-10">
          <h2
            id="planos-controle"
            className="text-xl font-semibold text-foreground/82 mb-3"
          >
            {t.controlTitle}
          </h2>
          <p className="text-sm text-foreground/55 leading-relaxed mb-3">
            {t.controlBody}
          </p>
          <p className="text-sm text-foreground/55 leading-relaxed">
            {t.controlFaqBefore}{" "}
            <Link
              href={localizedPath(locale, "/faq")}
              className="text-anima-violet hover:underline"
            >
              {t.controlFaqLink}
            </Link>
            {t.controlFaqMid}{" "}
            <Link
              href={localizedPath(locale, "/psychologists")}
              className="text-anima-violet hover:underline"
            >
              {t.controlPsychLink}
            </Link>
            {t.controlAfter}
          </p>
        </section>

        <nav
          aria-label={t.accountNavAria}
          className="flex flex-wrap gap-4 font-medium text-anima-violet"
        >
          <Link
            href={localizedPath(locale, "/register")}
            className="hover:underline"
          >
            {t.ctaRegister}
          </Link>
          <Link
            href={localizedPath(locale, "/login")}
            className="hover:underline"
          >
            {t.ctaLogin}
          </Link>
          <Link
            href={localizedPath(locale, "/blog")}
            className="hover:underline"
          >
            {t.ctaBlog}
          </Link>
        </nav>
      </article>
    </MarketingChrome>
  );
}
