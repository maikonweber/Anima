import type { Metadata } from "next";
import { HomePage } from "@/components/marketing/HomePage";
import { OG_IMAGE_PATH, SITE_URL } from "@/lib/seo/site";

const title = "Your emotional second brain";
const description =
  "EmotiveCare is an emotional energy journal with AI that remembers for you: it understands what you feel, connects your patterns over time, and returns personalized reflections. Start free.";
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
    "emotional energy journal",
    "AI emotional journal",
    "emotional memory",
  ],
  openGraph: {
    url: canonical,
    title: `EmotiveCare · ${title}`,
    description:
      "An emotional energy journal with AI that understands what you write, connects your patterns, and returns reflections made for your story. It feels with you and remembers for you.",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "EmotiveCare — your emotional second brain",
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
      "Emotional energy journal with AI that remembers for you and connects your patterns over time.",
  },
};

export default function EnHomePage() {
  return <HomePage locale="en" />;
}
