import type { Metadata } from "next";
import { ContactView } from "@/components/marketing/pages/ContactView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedPath } from "@/lib/i18n/config";
import { buildMarketingMetadata } from "@/lib/seo/page-metadata";

const LOCALE = "en" as const;

export const metadata: Metadata = buildMarketingMetadata({
  title: "Contact the EmotiveCare team",
  description:
    "Official MutterCorp and EmotiveCare contact channels for support, partnerships, and press.",
  path: "/contact",
  locale: LOCALE,
  keywords: ["contact", "EmotiveCare support"],
});

export default function EnContactPage() {
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
