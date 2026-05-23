"use client";

import Link from "next/link";
import { useFeatureFlagsContext } from "@/providers/feature-flags-provider";

export function PreviewModeBanner() {
  const { previewMode } = useFeatureFlagsContext();

  if (!previewMode) return null;

  return (
    <div
      role="banner"
      aria-live="polite"
      className="sticky top-0 z-[90] w-full border-b border-amber-500/25 bg-gradient-to-r from-amber-500/15 via-anima-violet/10 to-anima-lilac/15 backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-center sm:text-left">
        <p className="text-xs sm:text-sm text-foreground/75 leading-snug">
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            Modo preview
          </span>
          {" — "}
          você está usando uma versão experimental da EmotiveCare. Os limites podem
          ser mais amplos que no lançamento; em breve migraremos para os planos
          premium oficiais.
        </p>
        <Link
          href="/assinatura"
          className="shrink-0 text-xs font-medium text-anima-violet hover:text-anima-lilac transition-colors underline-offset-2 hover:underline"
        >
          Conhecer planos
        </Link>
      </div>
    </div>
  );
}
