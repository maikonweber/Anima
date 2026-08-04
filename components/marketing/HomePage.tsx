import Link from "next/link";
import { AnimaLogo } from "@/components/brand/AnimaLogo";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { marketingFontVariables } from "@/components/marketing/marketing-fonts";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, medicalHomePageSchema } from "@/components/seo/schema";
import {
  htmlLang,
  localizedPath,
  type Locale,
} from "@/lib/i18n/config";
import { homeEn } from "@/lib/i18n/dictionaries/home-en";
import { homeEs } from "@/lib/i18n/dictionaries/home-es";
import { homePt, type HomeDictionary } from "@/lib/i18n/dictionaries/home-pt";
import { getFaqEntries } from "@/lib/seo/faq";
import { localizedAuthCheckoutHref } from "@/lib/subscription/acquisition";

function getHomeDictionary(locale: Locale): HomeDictionary {
  if (locale === "en") return homeEn as HomeDictionary;
  if (locale === "es") return homeEs as HomeDictionary;
  return homePt as HomeDictionary;
}

function productHref(
  locale: Locale,
  key: HomeDictionary["products"]["items"][number]["href"],
) {
  if (key === "register") return localizedPath(locale, "/register");
  if (key === "cuidado-checkout") {
    return localizedAuthCheckoutHref(locale, "/register", "cuidado");
  }
  return localizedPath(locale, "/clinicas");
}

export function HomePage({ locale }: { locale: Locale }) {
  const t = getHomeDictionary(locale);
  const faqEntries = getFaqEntries(locale);
  const homeHref = localizedPath(locale, "/");
  const loginHref = localizedPath(locale, "/login");
  const registerHref = localizedPath(locale, "/register");
  const clinicsHref = localizedPath(locale, "/clinicas");
  const clinicAppHref = localizedPath(locale, "/clinic");
  const schemaPath =
    locale === "en" ? "/en" : locale === "es" ? "/es" : "/";

  return (
    <>
      <JsonLd
        data={[
          medicalHomePageSchema(schemaPath),
          faqSchema(faqEntries),
        ]}
      />
      <div
        className={`home-shell ${marketingFontVariables} flex flex-col min-h-full`}
        lang={htmlLang(locale)}
      >
        <header>
          <nav
            aria-label={t.nav.ariaLabel}
            className="relative z-10 flex items-center justify-between gap-3 px-4 sm:px-8 py-4 sm:py-5 max-w-6xl mx-auto w-full"
          >
            <div className="sm:hidden shrink-0">
              <AnimaLogo href={homeHref} size="sm" />
            </div>
            <div className="hidden sm:block shrink-0">
              <AnimaLogo href={homeHref} size="header" showWordmark />
            </div>
            <div className="flex items-center gap-2 sm:gap-3.5 justify-end flex-wrap">
              <LanguageSwitcher
                locale={locale}
                barePath="/"
                variant="compact"
              />
              <a
                href="#produtos"
                className="hidden lg:inline text-sm font-medium text-[var(--home-muted)] hover:text-[var(--home-ink)] transition-colors"
              >
                {t.nav.products}
              </a>
              <a
                href="#planos"
                className="hidden md:inline text-sm font-medium text-[var(--home-muted)] hover:text-[var(--home-ink)] transition-colors"
              >
                {t.nav.plans}
              </a>
              <Link
                href={clinicsHref}
                className="hidden md:inline text-sm font-medium text-[var(--home-clinic)] hover:underline"
              >
                {t.nav.clinics}
              </Link>
              <Link
                href={clinicAppHref}
                className="hidden sm:inline text-sm font-medium text-[var(--home-muted)] hover:text-[var(--home-clinic)] transition-colors"
              >
                {t.nav.clinicApp}
              </Link>
              <Link
                href={loginHref}
                className="text-sm font-medium text-[var(--home-muted)] hover:text-[var(--home-ink)] transition-colors"
              >
                {t.nav.login}
              </Link>
              <Link
                href={registerHref}
                className="shrink-0 whitespace-nowrap px-3.5 sm:px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[var(--home-accent)] hover:bg-[var(--home-accent-hover)] transition-colors"
              >
                {t.nav.cta}
              </Link>
            </div>
          </nav>
        </header>

        <main id="main-content" role="main" className="flex flex-col flex-1">
          <section
            aria-labelledby="hero-heading"
            className="home-hero relative min-h-[min(88vh,780px)] flex flex-col justify-center px-4 sm:px-8 pt-10 pb-16 sm:pt-14 sm:pb-24 overflow-hidden"
          >
            <div className="home-hero-wash" aria-hidden="true" />
            <div className="home-hero-grid" aria-hidden="true" />
            <div className="relative z-[1] max-w-6xl mx-auto w-full">
              <p className="home-brand-mark animate-emotion-fade-in mb-5 sm:mb-6">
                {t.hero.brand}
              </p>
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[var(--home-accent)] mb-4 animate-emotion-fade-in">
                {t.hero.eyebrow}
              </p>
              <h1
                id="hero-heading"
                className="home-display text-4xl sm:text-5xl lg:text-[3.65rem] leading-[1.08] tracking-tight text-[var(--home-ink)] max-w-3xl mb-5 animate-emotion-fade-in"
              >
                {t.hero.title}
              </h1>
              <p className="text-base sm:text-lg text-[var(--home-muted)] max-w-xl leading-relaxed mb-8 animate-emotion-fade-in">
                {t.hero.body}
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 animate-emotion-fade-in">
                <Link
                  href={registerHref}
                  className="inline-flex justify-center px-7 py-3 rounded-lg text-sm font-semibold text-white bg-[var(--home-accent)] hover:bg-[var(--home-accent-hover)] transition-all duration-200 hover:-translate-y-0.5"
                >
                  {t.hero.ctaPrimary}
                </Link>
                <Link
                  href={clinicsHref}
                  className="inline-flex justify-center px-7 py-3 rounded-lg text-sm font-semibold text-[var(--home-clinic)] border border-[var(--home-clinic)]/35 hover:bg-[var(--home-clinic-soft)] transition-colors"
                >
                  {t.hero.ctaSecondary}
                </Link>
                <a
                  href="#como-funciona"
                  className="inline-flex justify-center px-7 py-3 rounded-lg text-sm font-semibold text-[var(--home-muted)] hover:text-[var(--home-ink)] transition-colors"
                >
                  {t.hero.ctaTertiary}
                </a>
              </div>
              <p className="text-xs text-[var(--home-subtle)] mt-7">
                {t.hero.trustLine}
              </p>
            </div>
          </section>

          <section
            id="como-funciona"
            className="py-16 sm:py-20 px-4 sm:px-8 scroll-mt-20 border-t border-[var(--home-line)]"
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="home-display text-3xl sm:text-4xl text-[var(--home-ink)] mb-3 max-w-xl">
                {t.howItWorks.title}
              </h2>
              <p className="text-sm sm:text-base text-[var(--home-muted)] max-w-lg mb-12">
                {t.howItWorks.subtitle}
              </p>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
                {t.howItWorks.steps.map((item) => (
                  <li key={item.step} className="relative pl-12">
                    <span className="absolute left-0 top-0 home-display text-2xl text-[var(--home-accent)]">
                      {item.step}
                    </span>
                    <h3 className="text-base font-semibold text-[var(--home-ink)] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[var(--home-muted)] leading-relaxed">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section
            id="segundo-cerebro"
            className="relative py-16 sm:py-20 px-4 sm:px-8 border-t border-[var(--home-line)] overflow-hidden scroll-mt-20"
          >
            <div
              className="absolute -right-20 top-10 w-[420px] h-[420px] rounded-full opacity-40 blur-3xl pointer-events-none animate-gentle-float"
              style={{ background: "var(--home-glow)" }}
              aria-hidden="true"
            />
            <div className="relative max-w-6xl mx-auto">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--home-accent)] mb-3">
                {t.secondBrain.eyebrow}
              </p>
              <h2 className="home-display text-3xl sm:text-4xl text-[var(--home-ink)] mb-5 max-w-2xl">
                {t.secondBrain.title}
              </h2>
              <p className="text-sm sm:text-base text-[var(--home-muted)] leading-relaxed max-w-2xl mb-12">
                {t.secondBrain.bodyBefore}{" "}
                <strong className="text-[var(--home-ink)] font-semibold">
                  {t.secondBrain.bodyEmphasis}
                </strong>
                {t.secondBrain.bodyAfter}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--home-subtle)] mb-3">
                    {t.secondBrain.ordinaryLabel}
                  </p>
                  <p className="text-sm text-[var(--home-muted)] leading-relaxed">
                    {t.secondBrain.ordinaryText}
                  </p>
                </div>
                <div className="border-l-2 border-[var(--home-accent)] pl-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--home-accent)] mb-3">
                    {t.secondBrain.withLabel}
                  </p>
                  <p className="text-sm text-[var(--home-ink)]/80 leading-relaxed">
                    {t.secondBrain.withText}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section
            id="produtos"
            className="py-16 sm:py-20 px-4 sm:px-8 border-t border-[var(--home-line)] bg-[var(--home-surface)] scroll-mt-20"
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="home-display text-3xl sm:text-4xl text-[var(--home-ink)] mb-3">
                {t.products.title}
              </h2>
              <p className="text-sm sm:text-base text-[var(--home-muted)] max-w-2xl mb-12">
                {t.products.subtitle}
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-5">
                {t.products.items.map((product) => (
                  <article
                    key={product.id}
                    className={`home-product home-product--${product.tone} flex flex-col p-6 sm:p-7`}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-3 opacity-80">
                      {product.eyebrow}
                    </p>
                    <h3 className="home-display text-2xl text-[var(--home-ink)] mb-3">
                      {product.title}
                    </h3>
                    <p className="text-sm text-[var(--home-muted)] leading-relaxed mb-5 flex-1">
                      {product.text}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {product.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="text-sm text-[var(--home-ink)]/75 flex gap-2"
                        >
                          <span className="text-[var(--home-accent)]" aria-hidden>
                            ·
                          </span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={productHref(locale, product.href)}
                      className="inline-flex text-sm font-semibold underline-offset-4 hover:underline"
                    >
                      {product.cta}
                    </Link>
                  </article>
                ))}
              </div>
              <p className="mt-10 text-sm text-[var(--home-muted)]">
                {t.products.clinicLoginBefore}{" "}
                <Link
                  href={clinicAppHref}
                  className="font-semibold text-[var(--home-clinic)] hover:underline"
                >
                  {t.products.clinicLoginCta}
                </Link>
              </p>
            </div>
          </section>

          <section
            id="seguranca"
            className="py-16 sm:py-20 px-4 sm:px-8 border-t border-[var(--home-line)] scroll-mt-20"
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="home-display text-3xl sm:text-4xl text-[var(--home-ink)] mb-3">
                {t.security.title}
              </h2>
              <p className="text-sm text-[var(--home-muted)] max-w-xl mb-12">
                {t.security.subtitle}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                {t.security.items.map((item) => (
                  <div key={item.title}>
                    <h3 className="text-base font-semibold text-[var(--home-ink)] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[var(--home-muted)] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="planos"
            className="py-16 sm:py-20 px-4 sm:px-8 border-t border-[var(--home-line)] bg-[var(--home-surface)] scroll-mt-20"
          >
            <div className="max-w-6xl mx-auto">
              <h2 className="home-display text-3xl sm:text-4xl text-[var(--home-ink)] mb-3">
                {t.plans.title}
              </h2>
              <p className="text-sm text-[var(--home-muted)] max-w-2xl mb-12">
                {t.plans.subtitle}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-stretch">
                {t.plans.items.map((plan) => (
                  <div
                    key={plan.name}
                    className={`flex flex-col p-6 rounded-2xl border ${
                      plan.highlighted
                        ? "border-[var(--home-accent)] bg-[var(--home-panel)] shadow-[0_20px_50px_-28px_var(--home-glow)]"
                        : "border-[var(--home-line)] bg-[var(--home-panel)]"
                    }`}
                  >
                    {plan.highlighted && (
                      <span className="self-start mb-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-white bg-[var(--home-accent)]">
                        {t.plans.highlightedBadge}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-[var(--home-ink)]">
                      {plan.name}
                    </h3>
                    <p className="text-2xl font-bold text-[var(--home-accent)] mt-1 mb-1">
                      {plan.price}
                    </p>
                    <p className="text-xs text-[var(--home-subtle)] mb-5">
                      {plan.tagline}
                    </p>
                    <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="text-sm text-[var(--home-muted)] flex gap-2"
                        >
                          <span className="text-[var(--home-accent)]" aria-hidden>
                            ·
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={
                        plan.name === "Cuidado"
                          ? localizedAuthCheckoutHref(
                              locale,
                              "/register",
                              "cuidado",
                            )
                          : registerHref
                      }
                      className={`text-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        plan.highlighted
                          ? "text-white bg-[var(--home-accent)] hover:bg-[var(--home-accent-hover)]"
                          : "text-[var(--home-ink)] border border-[var(--home-line)] hover:border-[var(--home-accent)]"
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-[var(--home-muted)]">
                <p>
                  {t.plans.detailsBefore}{" "}
                  <Link
                    href={localizedPath(locale, "/plans")}
                    prefetch={false}
                    className="text-[var(--home-accent)] hover:underline"
                  >
                    {t.plans.detailsLink}
                  </Link>
                  {t.plans.detailsAfter}
                </p>
                <p>
                  {t.plans.clinicsBefore}{" "}
                  <Link
                    href={clinicsHref}
                    className="text-[var(--home-clinic)] hover:underline font-medium"
                  >
                    {t.plans.clinicsLink}
                  </Link>
                  {t.plans.clinicsAfter}{" "}
                  <Link
                    href={clinicAppHref}
                    className="text-[var(--home-clinic)] font-semibold hover:underline"
                  >
                    {t.plans.clinicAppCta}
                  </Link>
                </p>
              </div>
            </div>
          </section>

          <section
            id="faq"
            className="py-16 sm:py-20 px-4 sm:px-8 border-t border-[var(--home-line)] scroll-mt-20"
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="home-display text-3xl sm:text-4xl text-[var(--home-ink)] text-center mb-10">
                {t.faq.title}
              </h2>
              <div className="flex flex-col gap-3">
                {faqEntries.map((entry) => (
                  <details
                    key={entry.question}
                    className="group border border-[var(--home-line)] rounded-xl bg-[var(--home-panel)] px-5 py-4"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none text-base font-semibold text-[var(--home-ink)] gap-3">
                      {entry.question}
                      <span className="text-[var(--home-accent)] transition-transform duration-200 group-open:rotate-45 shrink-0">
                        +
                      </span>
                    </summary>
                    <p className="text-sm text-[var(--home-muted)] leading-relaxed mt-3">
                      {entry.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 sm:py-20 px-4 sm:px-8 text-center border-t border-[var(--home-line)] home-final">
            <div className="max-w-xl mx-auto">
              <h2 className="home-display text-3xl sm:text-4xl text-[var(--home-ink)] mb-4">
                {t.finalCta.title}
              </h2>
              <p className="text-sm text-[var(--home-muted)] mb-8 leading-relaxed">
                {t.finalCta.bodyPrefix}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={registerHref}
                  className="inline-flex justify-center px-8 py-3 rounded-lg text-sm font-semibold text-white bg-[var(--home-accent)] hover:bg-[var(--home-accent-hover)] transition-colors"
                >
                  {t.finalCta.cta}
                </Link>
                <Link
                  href={clinicAppHref}
                  className="inline-flex justify-center px-8 py-3 rounded-lg text-sm font-semibold text-[var(--home-clinic)] border border-[var(--home-clinic)]/40 hover:bg-[var(--home-clinic-soft)] transition-colors"
                >
                  {t.finalCta.ctaClinics}
                </Link>
              </div>
              <p className="mt-6">
                <Link
                  href={loginHref}
                  className="text-sm text-[var(--home-accent)] hover:underline"
                >
                  {t.finalCta.loginLink}
                </Link>
              </p>
            </div>
          </section>
        </main>

        <footer
          className="py-10 text-center border-t border-[var(--home-line)]"
          role="contentinfo"
        >
          <p className="text-xs text-[var(--home-subtle)] max-w-lg mx-auto leading-relaxed px-4 mb-3">
            <strong className="text-[var(--home-ink)]/70 font-semibold">
              EmotiveCare
            </strong>{" "}
            · {t.footer.brandBlurb}{" "}
            <strong className="text-[var(--home-ink)]/70 font-semibold">
              MutterCorp
            </strong>
            .
          </p>
          <p className="text-[10px] text-[var(--home-subtle)] px-4">
            {t.footer.tagline}
          </p>
          <nav
            aria-label={t.footer.quickLinksAria}
            className="mt-6 flex flex-wrap justify-center gap-4 text-[11px] font-medium text-[var(--home-muted)]"
          >
            <Link href={localizedPath(locale, "/about")} prefetch={false} className="hover:text-[var(--home-accent)]">
              {t.footer.about}
            </Link>
            <Link href={localizedPath(locale, "/plans")} prefetch={false} className="hover:text-[var(--home-accent)]">
              {t.footer.plans}
            </Link>
            <Link href={clinicsHref} className="hover:text-[var(--home-clinic)]">
              {t.footer.clinics}
            </Link>
            <Link href={clinicAppHref} className="hover:text-[var(--home-clinic)]">
              {t.footer.clinicApp}
            </Link>
            <Link href={localizedPath(locale, "/faq")} prefetch={false} className="hover:text-[var(--home-accent)]">
              {t.footer.faq}
            </Link>
            <Link href={localizedPath(locale, "/blog")} prefetch={false} className="hover:text-[var(--home-accent)]">
              {t.footer.blog}
            </Link>
            <Link href={localizedPath(locale, "/privacy")} prefetch={false} className="hover:text-[var(--home-accent)]">
              {t.footer.privacy}
            </Link>
            <Link href={localizedPath(locale, "/terms")} prefetch={false} className="hover:text-[var(--home-accent)]">
              {t.footer.terms}
            </Link>
          </nav>
        </footer>
      </div>
    </>
  );
}
