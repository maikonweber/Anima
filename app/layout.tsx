import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";
import { PreviewModeBanner } from "@/components/PreviewModeBanner";
import { TermsGate } from "@/components/terms/TermsGate";
import { SkipLink } from "@/components/layout/SkipLink";
import { GlobalJsonLd } from "@/components/seo/GlobalJsonLd";
import { AuthProvider } from "@/providers/auth-provider";
import { FeatureFlagsProvider } from "@/providers/feature-flags-provider";
import { SubscriptionConfigProvider } from "@/providers/subscription-config-provider";
import { GoogleProvider } from "@/providers/google-oauth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SubscriptionProvider } from "@/providers/subscription-provider";
import { DEFAULT_SITE_KEYWORDS, OG_IMAGE_PATH, SITE_URL } from "@/lib/seo/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const ogImageAbsolute = `${SITE_URL}${OG_IMAGE_PATH}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "EmotiveCare · Segundo cérebro emocional e Clínicas para psicólogos e psiquiatras",
    template: "%s · EmotiveCare",
  },
  description:
    "EmotiveCare: segundo cérebro emocional para uso pessoal com SENTIO AI; plano Cuidado para profissionais; EmotiveCare Clínicas com CRM, agenda, teleconsulta, prontuário e IA clínica revisável para psicólogos e psiquiatras.",
  applicationName: "EmotiveCare",
  authors: [{ name: "MutterCorp", url: SITE_URL }],
  creator: "MutterCorp",
  publisher: "MutterCorp",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  keywords: [...DEFAULT_SITE_KEYWORDS],
  alternates: {
    languages: {
      "pt-BR": "/",
      en: "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "EmotiveCare",
    title:
      "EmotiveCare — segundo cérebro emocional · Clínicas para psicólogos e psiquiatras",
    description:
      "App pessoal com memória emocional e SENTIO AI. EmotiveCare Clínicas: CRM, agenda, teleconsulta e IA assistiva com revisão humana para saúde mental.",
    images: [
      {
        url: ogImageAbsolute,
        width: 1200,
        height: 630,
        alt: "EmotiveCare · segundo cérebro e Clínicas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EmotiveCare · segundo cérebro emocional e Clínicas",
    description:
      "Uso pessoal como segundo cérebro; Clínicas com IA para psicólogos e psiquiatras.",
    images: [ogImageAbsolute],
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.png",
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f7fc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f1a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        <GlobalJsonLd />
        <SkipLink />
        <GoogleProvider>
          <QueryProvider>
            <AuthProvider>
              <FeatureFlagsProvider>
                <SubscriptionConfigProvider>
                <SubscriptionProvider>
                  <PreviewModeBanner />
                  {children}
                  <TermsGate />
                </SubscriptionProvider>
                </SubscriptionConfigProvider>
              </FeatureFlagsProvider>
            </AuthProvider>
          </QueryProvider>
        </GoogleProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
