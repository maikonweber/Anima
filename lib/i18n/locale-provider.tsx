"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  DEFAULT_LOCALE,
  localizedPath,
  localeFromPathname,
  pathWithoutLocale,
  type Locale,
} from "./config";

type LocaleContextValue = {
  locale: Locale;
  barePath: string;
  localizedHref: (path: string) => string;
  setLocale: (next: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  /** Optional SSR locale; pathname wins when prefixed. */
  initialLocale?: Locale;
}) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const fromPath = localeFromPathname(pathname);
  const locale =
    fromPath !== DEFAULT_LOCALE || pathname.startsWith("/en") || pathname.startsWith("/es")
      ? fromPath
      : (initialLocale ?? fromPath);
  const barePath = pathWithoutLocale(pathname);

  const localizedHref = useCallback(
    (path: string) => localizedPath(locale, path),
    [locale],
  );

  const setLocale = useCallback(
    (next: Locale) => {
      router.push(localizedPath(next, barePath));
    },
    [barePath, router],
  );

  const value = useMemo(
    () => ({ locale, barePath, localizedHref, setLocale }),
    [locale, barePath, localizedHref, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    // Fallback for trees outside provider (should be rare after root wrap).
    return {
      locale: DEFAULT_LOCALE,
      barePath: "/",
      localizedHref: (path) => localizedPath(DEFAULT_LOCALE, path),
      setLocale: () => undefined,
    };
  }
  return ctx;
}
