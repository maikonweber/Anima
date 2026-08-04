import type { Metadata } from "next";
import { HomePage } from "@/components/marketing/HomePage";
import { OG_IMAGE_PATH, SITE_URL } from "@/lib/seo/site";

const title =
  "Emotional second brain and Clinics for psychologists and psychiatrists";
const description =
  "EmotiveCare for personal use: an emotional second brain with SENTIO AI, journaling, and semantic memory. EmotiveCare Clinics: CRM, scheduling, teleconsult, notes, and reviewable clinical AI for psychologists and psychiatrists. Start free.";
const canonical = `${SITE_URL}/en`;
const ogImage = `${SITE_URL}${OG_IMAGE_PATH}`;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical,
    languages: {
      "pt-BR": `${SITE_URL}/`,
      en: canonical,
      "x-default": `${SITE_URL}/`,
    },
  },
  keywords: [
    "EmotiveCare",
    "SENTIO AI",
    "emotional second brain",
    "personal knowledge emotional",
    "EmotiveCare Clinics",
    "software for psychologists",
    "software for psychiatrists",
    "clinical AI mental health",
    "psychology CRM",
    "teleconsult psychology",
  ],
  openGraph: {
    url: canonical,
    title: `EmotiveCare · ${title}`,
    description:
      "Personal second-brain app plus Clinics with CRM, teleconsult, and human-reviewed AI for mental health professionals.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "EmotiveCare — second brain and Clinics",
      },
    ],
    type: "website",
    locale: "en_US",
    alternateLocale: ["pt_BR"],
  },
  twitter: {
    card: "summary_large_image",
    title: `EmotiveCare · ${title}`,
    description:
      "Personal emotional second brain; Clinics with AI for psychologists and psychiatrists.",
  },
};

export default function EnHomePage() {
  return <HomePage locale="en" />;
}
