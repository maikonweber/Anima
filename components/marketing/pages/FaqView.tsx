import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { getFaqEntries } from "@/lib/seo/faq";

export function FaqView({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).faq;
  const entries = getFaqEntries(locale);

  return (
    <MarketingChrome locale={locale}>
      <article>
        <p className="mkt-eyebrow mb-3">FAQ</p>
        <h1 className="text-3xl sm:text-4xl mb-8">{t.title}</h1>
        <div className="space-y-4">
          {entries.map((item) => (
            <section
              key={item.question}
              aria-labelledby={`faq-${item.question.slice(0, 12)}`}
              className="mkt-card"
            >
              <h2
                id={`faq-${item.question.slice(0, 12)}`}
                className="text-lg mb-2"
              >
                {item.question}
              </h2>
              <p className="text-sm leading-relaxed">{item.answer}</p>
            </section>
          ))}
        </div>
      </article>
    </MarketingChrome>
  );
}
