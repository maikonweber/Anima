import type { Metadata } from "next";
import { HomePage } from "@/components/marketing/HomePage";
import { OG_IMAGE_PATH, SITE_URL } from "@/lib/seo/site";

const title = "People, Cuidado, and Clinics";
const description =
  "Emotional second brain in the person app (Essential/Pleno), Cuidado between sessions, and EmotiveCare Clinics for CRM, scheduling, and teleconsult. Start free.";
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
    "EmotiveCare Clinics",
    "emotional second brain",
    "Pleno plan",
    "Cuidado plan",
  ],
  openGraph: {
    url: canonical,
    title: `EmotiveCare · ${title}`,
    description:
      "Person app with SENTIO AI, Cuidado for professionals, and EmotiveCare Clinics for clinic operations.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "EmotiveCare — people and clinics",
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
      "Emotional memory for people and secure operations for clinics.",
  },
};

export default function EnHomePage() {
  return <HomePage locale="en" />;
}
