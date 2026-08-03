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
        <p className="text-[11px] uppercase tracking-[0.16em] text-anima-violet font-medium mb-3">
          {t.eyebrow}
        </p>
        <h1 className="text-3xl font-bold text-foreground/90 mb-4">{t.title}</h1>
        <p className="text-sm text-foreground/55 leading-relaxed mb-8 max-w-3xl">
          {t.intro}
        </p>

        <section className="mb-10 rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-foreground/85 mb-2">
            {t.splitTitle}
          </h2>
          <p className="text-sm text-foreground/50 leading-relaxed">{t.splitBody}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground/82 mb-4">
            {t.modulesTitle}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {t.modules.map((mod) => (
              <li
                key={mod.title}
                className="rounded-xl border border-foreground/[0.08] p-4"
              >
                <p className="text-sm font-semibold text-foreground/85 mb-1">
                  {mod.title}
                </p>
                <p className="text-sm text-foreground/45 leading-relaxed">
                  {mod.text}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground/82 mb-3">
            {t.forWhomTitle}
          </h2>
          <ul className="list-disc ps-6 text-sm text-foreground/55 space-y-2">
            {t.forWhom.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground/82 mb-3">
            {t.ethicsTitle}
          </h2>
          <p className="text-sm text-foreground/55 leading-relaxed">{t.ethicsBody}</p>
        </section>

        <nav
          aria-label={t.title}
          className="flex flex-wrap gap-4 font-medium text-anima-violet"
        >
          <Link href="/clinic" className="hover:underline">
            {t.ctaOpen}
          </Link>
          <Link
            href={localizedPath(locale, "/plans")}
            className="hover:underline"
          >
            {t.ctaPlans}
          </Link>
          <Link
            href={localizedPath(locale, "/psychologists")}
            className="hover:underline"
          >
            {t.ctaPsych}
          </Link>
        </nav>
      </article>
    </MarketingChrome>
  );
}
