"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";

type Props = {
  /** Accessible label when switching to dark. */
  toDarkLabel: string;
  /** Accessible label when switching to light. */
  toLightLabel: string;
  className?: string;
};

export function ThemeToggle({
  toDarkLabel,
  toLightLabel,
  className = "",
}: Props) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === "dark";
  const label = isDark ? toLightLabel : toDarkLabel;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={mounted ? label : toDarkLabel}
      title={mounted ? label : undefined}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--home-muted)] transition-colors hover:bg-[var(--home-surface)] hover:text-[var(--home-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--home-accent)]/40 ${className}`}
    >
      {!mounted ? (
        <span className="h-[1.125rem] w-[1.125rem]" aria-hidden />
      ) : isDark ? (
        <svg
          className="h-[1.125rem] w-[1.125rem]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1.5M12 19.5V21M4.5 12H3m18 0h-1.5M6.34 6.34l-1.06-1.06M18.72 18.72l-1.06-1.06M6.34 17.66l-1.06 1.06M18.72 5.28l-1.06 1.06"
          />
          <circle cx="12" cy="12" r="3.75" />
        </svg>
      ) : (
        <svg
          className="h-[1.125rem] w-[1.125rem]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 14.25A8.25 8.25 0 1 1 9.75 3 6.75 6.75 0 0 0 21 14.25Z"
          />
        </svg>
      )}
    </button>
  );
}
