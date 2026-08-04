import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";

function planTone(name: string): "person" | "care" | "default" {
  if (name === "Pleno") return "person";
  if (name === "Cuidado") return "care";
  return "default";
}

export function PlansView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.plans;

  return (
    <MarketingChrome locale={locale}>
      <article>
        <p className="mkt-eyebrow mb-3">EmotiveCare</p>
        <h1 className="text-3xl sm:text-4xl mb-4">{t.title}</h1>
        <p className="text-sm sm:text-base leading-relaxed mb-10 max-w-2xl">
          {t.intro}
        </p>

        <div className="grid gap-4 mb-12">
          {t.plans.map((plan) => {
            const tone = planTone(plan.name);
            const border =
              tone === "person"
                ? "border-t-[3px] border-t-[var(--home-accent)]"
                : tone === "care"
                  ? "border-t-[3px] border-t-[var(--home-care)]"
                  : "border-t-[3px] border-t-[var(--home-line)]";
            return (
              <section
                key={plan.name}
                aria-labelledby={`plan-${plan.name}`}
                className={`mkt-card ${border}`}
              >
                <h2 id={`plan-${plan.name}`} className="text-2xl mb-1">
                  {plan.name}
                </h2>
                <p className="text-sm mb-4 opacity-80">{plan.tagline}</p>
                <ul className="space-y-2 text-sm">
                  {plan.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span aria-hidden className="text-[var(--home-accent)]">
                        ·
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <section aria-labelledby="planos-controle" className="mb-10 mkt-card">
          <h2 id="planos-controle" className="text-xl mb-3">
            {t.controlTitle}
          </h2>
          <p className="text-sm leading-relaxed mb-3">{t.controlBody}</p>
          <p className="text-sm leading-relaxed">
            {t.controlFaqBefore}{" "}
            <Link
              href={localizedPath(locale, "/faq")}
              className="text-[var(--home-accent)] hover:underline"
            >
              {t.controlFaqLink}
            </Link>
            {t.controlFaqMid}{" "}
            <Link
              href={localizedPath(locale, "/psychologists")}
              className="text-[var(--home-care)] hover:underline"
            >
              {t.controlPsychLink}
            </Link>
            {t.controlAfter}
          </p>
        </section>

        <nav aria-label={t.accountNavAria} className="mkt-cta-row">
          <Link
            href={localizedPath(locale, "/register")}
            className="mkt-btn mkt-btn-primary"
          >
            {t.ctaRegister}
          </Link>
          <Link
            href={localizedPath(locale, "/clinicas")}
            className="mkt-btn mkt-btn-ghost-clinic"
          >
            Clínicas
          </Link>
          <Link href="/clinic" className="mkt-btn mkt-btn-clinic">
            {dict.nav.clinicApp}
          </Link>
          <Link
            href={localizedPath(locale, "/login")}
            className="mkt-btn mkt-btn-ghost"
          >
            {t.ctaLogin}
          </Link>
        </nav>
      </article>
    </MarketingChrome>
  );
}
