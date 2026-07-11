import Link from "next/link";
import { AnimaLogo } from "@/components/brand/AnimaLogo";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, medicalHomePageSchema } from "@/components/seo/schema";
import {
  alternateLocale,
  localizedPath,
  type Locale,
} from "@/lib/i18n/config";
import { homeEn } from "@/lib/i18n/dictionaries/home-en";
import { homePt, type HomeDictionary } from "@/lib/i18n/dictionaries/home-pt";

function getHomeDictionary(locale: Locale): HomeDictionary {
  return (locale === "en" ? homeEn : homePt) as HomeDictionary;
}

export function HomePage({ locale }: { locale: Locale }) {
  const t = getHomeDictionary(locale);
  const homeHref = localizedPath(locale, "/");
  const loginHref = localizedPath(locale, "/login");
  const registerHref = localizedPath(locale, "/register");
  const other = alternateLocale(locale);
  const otherHome = localizedPath(other, "/");
  const schemaPath = locale === "en" ? "/en" : "/";

  return (
    <>
      <JsonLd
        data={[
          medicalHomePageSchema(schemaPath),
          faqSchema([...t.faq.entries]),
        ]}
      />
      <div className="flex flex-col min-h-full" lang={locale === "en" ? "en" : "pt-BR"}>
        <header>
          <nav
            aria-label={t.nav.ariaLabel}
            className="relative z-10 flex items-center justify-between gap-3 px-4 sm:px-8 py-4 sm:py-6 max-w-6xl mx-auto w-full min-h-[4rem] sm:min-h-[5rem]"
          >
            <div className="sm:hidden shrink-0">
              <AnimaLogo href={homeHref} size="sm" />
            </div>
            <div className="hidden sm:block shrink-0">
              <AnimaLogo href={homeHref} size="header" showWordmark />
            </div>
            <div className="flex items-center gap-2 sm:gap-4 justify-end">
              <nav
                aria-label={t.nav.languageLabel}
                className="flex items-center gap-1.5 text-xs font-medium text-foreground/45"
              >
                <Link
                  href={homeHref}
                  hrefLang={locale === "en" ? "en" : "pt-BR"}
                  className="text-foreground/75"
                  aria-current="page"
                >
                  {locale === "en" ? "EN" : "PT"}
                </Link>
                <span aria-hidden>|</span>
                <Link
                  href={otherHome}
                  hrefLang={other === "en" ? "en" : "pt-BR"}
                  className="text-anima-violet hover:underline"
                >
                  {other === "en" ? "EN" : "PT"}
                </Link>
              </nav>
              <a
                href="#como-funciona"
                className="hidden md:inline text-sm font-medium text-foreground/50 hover:text-foreground/80 transition-colors"
              >
                {t.nav.howItWorks}
              </a>
              <a
                href="#segundo-cerebro"
                className="hidden md:inline text-sm font-medium text-foreground/50 hover:text-foreground/80 transition-colors"
              >
                {t.nav.secondBrain}
              </a>
              <a
                href="#planos"
                className="hidden md:inline text-sm font-medium text-foreground/50 hover:text-foreground/80 transition-colors"
              >
                {t.nav.plans}
              </a>
              <Link
                href={localizedPath(locale, "/blog")}
                className="hidden md:inline text-sm font-medium text-foreground/50 hover:text-foreground/80 transition-colors"
              >
                {t.nav.blog}
              </Link>
              <Link
                href={loginHref}
                className="text-sm font-medium text-foreground/50 hover:text-foreground/80 transition-colors"
              >
                {t.nav.login}
              </Link>
              <Link
                href={registerHref}
                className="shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-2 rounded-full text-sm font-medium text-white transition-all duration-200 hover:shadow-lg hover:shadow-[var(--anima-glow)]"
                style={{
                  background:
                    "linear-gradient(135deg, var(--anima-violet), var(--anima-indigo))",
                }}
              >
                {t.nav.cta}
              </Link>
            </div>
          </nav>
        </header>

        <main id="main-content" role="main" className="flex flex-col flex-1">
          <section
            aria-labelledby="hero-heading"
            className="relative flex flex-col items-center justify-center pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 text-center overflow-hidden"
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl pointer-events-none"
              style={{ backgroundColor: "var(--anima-violet)" }}
              aria-hidden="true"
            />
            <div
              className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none animate-gentle-float"
              style={{ backgroundColor: "var(--anima-lilac)" }}
              aria-hidden="true"
            />

            <p className="relative text-xs sm:text-sm font-medium uppercase tracking-widest text-anima-violet/80 mb-4">
              {t.hero.eyebrow}
            </p>
            <h1
              id="hero-heading"
              className="relative text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground/90 mb-4 max-w-4xl"
            >
              {t.hero.title}
            </h1>
            <div className="relative w-12 h-0.5 rounded-full bg-gradient-to-r from-anima-violet to-anima-lilac mb-6" />
            <p className="relative text-base sm:text-lg text-foreground/50 max-w-2xl leading-relaxed mb-4">
              {t.hero.body}
            </p>
            <p className="relative text-sm text-foreground/35 max-w-xl leading-relaxed mb-8 italic">
              &ldquo;{t.hero.quote}&rdquo;
            </p>
            <div className="relative flex flex-col sm:flex-row gap-3">
              <Link
                href={registerHref}
                className="px-8 py-3 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:shadow-[var(--anima-glow)] hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, var(--anima-violet), var(--anima-indigo))",
                }}
              >
                {t.hero.ctaPrimary}
              </Link>
              <a
                href="#como-funciona"
                className="px-8 py-3 rounded-full text-sm font-semibold text-foreground/70 border border-foreground/10 hover:border-anima-violet/30 hover:text-anima-violet transition-colors"
              >
                {t.hero.ctaSecondary}
              </a>
            </div>
            <p className="relative text-xs text-foreground/30 mt-6">
              {t.hero.trustLine}
            </p>
          </section>

          <section
            id="como-funciona"
            className="py-14 px-4 bg-foreground/[0.02] border-t border-foreground/[0.04] scroll-mt-20"
          >
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85 text-center mb-3">
                {t.howItWorks.title}
              </h2>
              <p className="text-sm text-foreground/40 text-center max-w-lg mx-auto mb-10">
                {t.howItWorks.subtitle}
              </p>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {t.howItWorks.steps.map((item) => (
                  <li key={item.step} className="glass-panel p-6">
                    <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-anima-violet/15 text-sm font-bold text-anima-violet mb-4">
                      {item.step}
                    </span>
                    <h3 className="text-base font-semibold text-foreground/80 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-foreground/40 leading-relaxed">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section
            id="segundo-cerebro"
            className="relative py-16 sm:py-20 px-4 border-t border-foreground/[0.04] overflow-hidden scroll-mt-20"
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
              style={{ backgroundColor: "var(--anima-indigo)" }}
              aria-hidden="true"
            />
            <div className="relative max-w-4xl mx-auto text-center">
              <p className="text-xs font-medium uppercase tracking-widest text-anima-violet mb-3">
                {t.secondBrain.eyebrow}
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold text-foreground/90 mb-5">
                {t.secondBrain.title}
              </h2>
              <p className="text-sm sm:text-base text-foreground/50 leading-relaxed max-w-2xl mx-auto mb-12">
                {t.secondBrain.bodyBefore}{" "}
                <strong className="text-foreground/70 font-semibold">
                  {t.secondBrain.bodyEmphasis}
                </strong>
                {t.secondBrain.bodyAfter}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                <div className="glass-panel p-6 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40 mb-3">
                    {t.secondBrain.ordinaryLabel}
                  </p>
                  <p className="text-sm text-foreground/55 leading-relaxed">
                    {t.secondBrain.ordinaryText}
                  </p>
                </div>
                <div
                  className="glass-panel p-6 sm:p-7 emotion-glow"
                  style={{ borderColor: "var(--anima-violet)" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-anima-violet mb-3">
                    {t.secondBrain.withLabel}
                  </p>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {t.secondBrain.withText}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section
            id="funcionalidades"
            className="py-16 px-4 bg-foreground/[0.02] border-t border-foreground/[0.04] scroll-mt-20"
          >
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85 text-center mb-3">
                {t.features.title}
              </h2>
              <p className="text-sm text-foreground/40 text-center max-w-2xl mx-auto mb-10">
                {t.features.subtitle}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {t.features.items.map((feature) => (
                  <div key={feature.title} className="glass-panel p-6">
                    <h3 className="text-base font-semibold text-foreground/80 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-foreground/40 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="para-quem-e"
            className="py-16 px-4 border-t border-foreground/[0.04] scroll-mt-20"
          >
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85 text-center mb-10">
                {t.audiences.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {t.audiences.items.map((audience) => (
                  <div key={audience.title} className="glass-panel p-8">
                    <p className="text-xs font-medium uppercase tracking-widest text-anima-violet mb-3">
                      {audience.eyebrow}
                    </p>
                    <h3 className="text-xl font-bold text-foreground/90 mb-3">
                      {audience.title}
                    </h3>
                    <p className="text-sm text-foreground/45 leading-relaxed mb-6">
                      {audience.text}
                    </p>
                    <div className="flex flex-col gap-2.5">
                      {audience.bullets.map((bullet) => (
                        <div
                          key={bullet}
                          className="flex gap-3 text-sm text-foreground/60 items-start"
                        >
                          <span className="text-anima-violet mt-0.5">✓</span>
                          {bullet}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="seguranca"
            className="py-16 px-4 bg-foreground/[0.02] border-t border-foreground/[0.04] scroll-mt-20"
          >
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85 text-center mb-3">
                {t.security.title}
              </h2>
              <p className="text-sm text-foreground/40 text-center max-w-2xl mx-auto mb-10">
                {t.security.subtitle}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {t.security.items.map((item) => (
                  <div key={item.title} className="glass-panel p-6">
                    <h3 className="text-base font-semibold text-foreground/80 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-foreground/40 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="planos"
            className="py-16 px-4 border-t border-foreground/[0.04] scroll-mt-20"
          >
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85 text-center mb-3">
                {t.plans.title}
              </h2>
              <p className="text-sm text-foreground/40 text-center max-w-lg mx-auto mb-10">
                {t.plans.subtitle}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
                {t.plans.items.map((plan) => (
                  <div
                    key={plan.name}
                    className={`glass-panel p-7 flex flex-col ${
                      plan.highlighted ? "emotion-glow" : ""
                    }`}
                    style={
                      plan.highlighted
                        ? { borderColor: "var(--anima-violet)" }
                        : undefined
                    }
                  >
                    {plan.highlighted && (
                      <span className="self-start mb-3 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-anima-violet to-anima-indigo">
                        {t.plans.highlightedBadge}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-foreground/90">
                      {plan.name}
                    </h3>
                    <p className="text-2xl font-bold text-anima-violet mt-1 mb-1">
                      {plan.price}
                    </p>
                    <p className="text-xs text-foreground/40 mb-5">
                      {plan.tagline}
                    </p>
                    <div className="flex flex-col gap-2.5 mb-6 flex-1">
                      {plan.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex gap-2.5 text-sm text-foreground/55 items-start"
                        >
                          <span className="text-anima-violet mt-0.5">✓</span>
                          {feature}
                        </div>
                      ))}
                    </div>
                    <Link
                      href={registerHref}
                      className={`text-center px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                        plan.highlighted
                          ? "text-white hover:shadow-lg hover:shadow-[var(--anima-glow)]"
                          : "text-foreground/70 border border-foreground/10 hover:border-anima-violet/30 hover:text-anima-violet"
                      }`}
                      style={
                        plan.highlighted
                          ? {
                              background:
                                "linear-gradient(135deg, var(--anima-violet), var(--anima-indigo))",
                            }
                          : undefined
                      }
                    >
                      {plan.cta}
                    </Link>
                  </div>
                ))}
              </div>
              <p className="text-xs text-foreground/30 text-center mt-8 max-w-xl mx-auto">
                {t.plans.detailsBefore}{" "}
                <Link
                  href={localizedPath(locale, "/plans")}
                  prefetch={false}
                  className="text-anima-violet hover:text-anima-lilac transition-colors"
                >
                  {t.plans.detailsLink}
                </Link>
                {t.plans.detailsAfter}
              </p>
            </div>
          </section>

          <section
            id="faq"
            className="py-16 px-4 bg-foreground/[0.02] border-t border-foreground/[0.04] scroll-mt-20"
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground/85 text-center mb-10">
                {t.faq.title}
              </h2>
              <div className="flex flex-col gap-4">
                {t.faq.entries.map((entry) => (
                  <details
                    key={entry.question}
                    className="glass-panel p-6 group"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none text-base font-semibold text-foreground/80">
                      {entry.question}
                      <span className="text-anima-violet transition-transform duration-200 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="text-sm text-foreground/45 leading-relaxed mt-4">
                      {entry.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 px-4 text-center border-t border-foreground/[0.04]">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-foreground/85 mb-3">
                {t.finalCta.title}
              </h2>
              <p className="text-sm text-foreground/40 mb-6 leading-relaxed">
                {t.finalCta.bodyPrefix} {t.hero.tagline}
              </p>
              <Link
                href={registerHref}
                className="inline-block px-8 py-3 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:shadow-xl hover:shadow-[var(--anima-glow)] hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, var(--anima-violet), var(--anima-indigo))",
                }}
              >
                {t.finalCta.cta}
              </Link>
              <p className="mt-6">
                <Link
                  href={loginHref}
                  className="text-sm text-anima-violet hover:text-anima-lilac transition-colors"
                >
                  {t.finalCta.loginLink}
                </Link>
              </p>
            </div>
          </section>
        </main>

        <footer
          className="py-8 text-center border-t border-foreground/[0.04]"
          role="contentinfo"
        >
          <p className="text-xs text-foreground/30 max-w-lg mx-auto leading-relaxed px-4 mb-3">
            <strong className="text-foreground/40 font-semibold">EmotiveCare</strong>{" "}
            · {t.footer.brandBlurb}{" "}
            <strong className="text-foreground/40 font-semibold">
              MutterCorp
            </strong>
            .
          </p>
          <p className="text-[10px] text-foreground/25 px-4">
            {t.footer.tagline}
          </p>
          <nav
            aria-label={t.footer.quickLinksAria}
            className="mt-6 flex flex-wrap justify-center gap-4 text-[11px] font-medium text-foreground/35"
          >
            <Link
              href={localizedPath(locale, "/about")}
              prefetch={false}
              className="hover:text-anima-violet transition-colors"
            >
              {t.footer.about}
            </Link>
            <Link
              href={localizedPath(locale, "/plans")}
              prefetch={false}
              className="hover:text-anima-violet transition-colors"
            >
              {t.footer.plans}
            </Link>
            <Link
              href={localizedPath(locale, "/faq")}
              prefetch={false}
              className="hover:text-anima-violet transition-colors"
            >
              {t.footer.faq}
            </Link>
            <Link
              href={localizedPath(locale, "/blog")}
              prefetch={false}
              className="hover:text-anima-violet transition-colors"
            >
              {t.footer.blog}
            </Link>
            <Link
              href={localizedPath(locale, "/privacy")}
              prefetch={false}
              className="hover:text-anima-violet transition-colors"
            >
              {t.footer.privacy}
            </Link>
            <Link
              href={localizedPath(locale, "/terms")}
              prefetch={false}
              className="hover:text-anima-violet transition-colors"
            >
              {t.footer.terms}
            </Link>
          </nav>
        </footer>
      </div>
    </>
  );
}
