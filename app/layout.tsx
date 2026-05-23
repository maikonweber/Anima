import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PreviewModeBanner } from "@/components/PreviewModeBanner";
import { AuthProvider } from "@/providers/auth-provider";
import { FeatureFlagsProvider } from "@/providers/feature-flags-provider";
import { GoogleProvider } from "@/providers/google-oauth-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SubscriptionProvider } from "@/providers/subscription-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EmotiveCare — O futuro do cuidado emocional · SENTIO AI",
  description:
    "Plataforma de acompanhamento emocional contínuo com inteligência SENTIO AI, memória emocional e insights terapêuticos — por MutterCorp. Para uso pessoal e profissional.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.png",
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
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
      <body className="min-h-full flex flex-col">
        <GoogleProvider>
          <QueryProvider>
            <AuthProvider>
              <FeatureFlagsProvider>
                <SubscriptionProvider>
                  <PreviewModeBanner />
                  {children}
                </SubscriptionProvider>
              </FeatureFlagsProvider>
            </AuthProvider>
          </QueryProvider>
        </GoogleProvider>
      </body>
    </html>
  );
}
