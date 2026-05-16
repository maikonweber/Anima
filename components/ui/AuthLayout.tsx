"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-full flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl animate-gentle-float"
          style={{ backgroundColor: "var(--anima-violet)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl animate-gentle-float"
          style={{
            backgroundColor: "var(--anima-lilac)",
            animationDelay: "3s",
          }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground/90 mb-1">
            Anima
          </h1>
          <div className="w-8 h-0.5 mx-auto rounded-full bg-gradient-to-r from-anima-violet to-anima-lilac mb-4" />
          <h2 className="text-lg font-semibold text-foreground/80">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-foreground/40 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Card */}
        <div className="glass-panel p-6 sm:p-8">{children}</div>
      </motion.div>
    </div>
  );
}
