"use client";

import { useLocale } from "@/lib/i18n/locale-provider";
import type { Locale } from "@/lib/i18n/config";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

const RETRY_LABEL: Record<Locale, string> = {
  "pt-BR": "Tentar novamente",
  en: "Try again",
  es: "Intentar de nuevo",
};

export function ErrorMessage({
  message,
  onRetry,
  retryLabel,
}: ErrorMessageProps) {
  const { locale } = useLocale();
  const label = retryLabel ?? RETRY_LABEL[locale] ?? RETRY_LABEL["pt-BR"];

  return (
    <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-400 flex flex-col sm:flex-row sm:items-center gap-3">
      <p className="flex-1">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-xs font-medium underline hover:no-underline shrink-0"
        >
          {label}
        </button>
      )}
    </div>
  );
}
