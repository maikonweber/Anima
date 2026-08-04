"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { DM_Sans } from "next/font/google";
import { AnimaLogo } from "@/components/brand/AnimaLogo";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-patient",
});

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showLanguageSwitcher?: boolean;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  showLanguageSwitcher = true,
}: AuthLayoutProps) {
  return (
    <div
      className={`patient-shell min-h-full flex items-center justify-center px-4 py-12 relative overflow-hidden ${dmSans.variable} font-[family-name:var(--font-patient)]`}
      style={{ colorScheme: "light" }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: "rgba(61, 90, 128, 0.35)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
          style={{ backgroundColor: "rgba(196, 92, 74, 0.25)" }}
        />
      </div>

      {showLanguageSwitcher && (
        <div className="absolute top-4 right-4 z-20">
          <LanguageSwitcher variant="pills" />
        </div>
      )}

      <motion.div
        className="relative z-10 w-full max-w-sm"
        id="main-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center text-center mb-8">
          <AnimaLogo size="xl" className="mb-4" />
          <h2 className="text-lg font-semibold text-foreground/80">{title}</h2>
          {subtitle && (
            <p className="text-sm text-foreground/40 mt-1">{subtitle}</p>
          )}
        </div>

        <div className="glass-panel p-6 sm:p-8">{children}</div>
      </motion.div>
    </div>
  );
}
