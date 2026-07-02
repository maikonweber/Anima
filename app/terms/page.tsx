import type { Metadata } from "next";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListSchema } from "@/components/seo/schema";
import { TermsView } from "@/components/terms/TermsView";
import { DEFAULT_SITE_KEYWORDS, SITE_URL } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Termos de uso institucional",
  description:
    "Termos institucionais resumindo limites de uso clínico, responsabilidades do usuário e da empresa MutterCorp pela EmotiveCare.",
  alternates: { canonical: `${SITE_URL}/terms` },
  keywords: [...DEFAULT_SITE_KEYWORDS, "termos de uso", "responsabilidade"],
};

export default function TermsPage() {
  return (
    <>
      <JsonLd data={breadcrumbListSchema([
        { name: "Início", path: "/" },
        { name: "Termos", path: "/terms" },
      ])} />
      <MarketingChrome>
        <TermsView />
      </MarketingChrome>
    </>
  );
}
