import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/providers/auth-provider";
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
  title: "Anima — Diário de Energia Emocional",
  description:
    "Diário emocional com análise de IA. Registre como você se sente e descubra insights sobre sua energia.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
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
              <SubscriptionProvider>{children}</SubscriptionProvider>
            </AuthProvider>
          </QueryProvider>
        </GoogleProvider>
      </body>
    </html>
  );
}
