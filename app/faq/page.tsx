import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema, faqSchema } from "@/components/seo/schema";
import { DEFAULT_SITE_KEYWORDS, SITE_URL } from "@/lib/seo/site";
import { faqEntries } from "@/lib/seo/faq";

export const metadata: Metadata = {
  title: "FAQ — EmotiveCare e SENTIO AI",
  description:
    "Respostas claras sobre acompanhamento emocional, compartilhamento com psicólogos, privacidade e uso responsável da SENTIO AI.",
  alternates: { canonical: `${SITE_URL}/faq` },
  keywords: [...DEFAULT_SITE_KEYWORDS, "perguntas frequentes"],
};

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbListSchema([
            { name: "Início", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
          faqSchema(faqEntries),
        ]}
      />
      <MarketingChrome>
        <article>
          <h1 className="text-3xl font-bold text-foreground/90 mb-8">
            Perguntas frequentes
          </h1>
          <div className="space-y-8">
            {faqEntries.map((item) => (
              <section
                key={item.question}
                aria-labelledby={`faq-${item.question.slice(0, 12)}`}
              >
                <h2
                  id={`faq-${item.question.slice(0, 12)}`}
                  className="text-lg font-semibold text-foreground/85 mb-2"
                >
                  {item.question}
                </h2>
                <p className="text-sm text-foreground/55 leading-relaxed">
                  {item.answer}
                </p>
              </section>
            ))}
          </div>
        </article>
      </MarketingChrome>
    </>
  );
}
