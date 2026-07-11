import type { Metadata } from "next";
import { ContactView } from "@/components/marketing/pages/ContactView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "pt-BR" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Contato com o time da EmotiveCare",
  description:
    "Canais oficiais de contato MutterCorp e EmotiveCare para suporte, parcerias e imprensa.",
  path: "/contact",
  locale: LOCALE,
  keywords: ["contato", "suporte EmotiveCare"],
});

export default function ContactPage() {
  const dict = getDictionary(LOCALE);
  return (
    <>
      <JsonLd
        data={breadcrumbListSchema([
          { name: dict.common.home, path: localizedPath(LOCALE, "/") },
          { name: dict.nav.contact, path: localizedPath(LOCALE, "/contact") },
        ])}
      />
      <ContactView locale={LOCALE} />
    </>
  );
}
