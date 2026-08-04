import Link from "next/link";
import {
  LOCALE_LABEL,
  LOCALES,
  type Locale,
} from "@/lib/i18n/config";
import { blogPath, getBlogUi } from "@/lib/seo/i18n";

export function BlogLanguageSwitch({
  locale,
  slug,
}: {
  locale: Locale;
  slug?: string;
}) {
  const ui = getBlogUi(locale);

  return (
    <nav
      aria-label={ui.languageLabel}
      className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-foreground/45"
    >
      <span className="uppercase tracking-[0.16em]">{ui.languageLabel}</span>
      {LOCALES.map((code, index) => (
        <span key={code} className="inline-flex items-center gap-2">
          {index > 0 ? <span aria-hidden>·</span> : null}
          <Link
            href={blogPath(code, slug)}
            hrefLang={code === "pt-BR" ? "pt-BR" : code}
            className={
              code === locale
                ? "text-foreground/75"
                : "text-anima-violet hover:underline"
            }
            aria-current={code === locale ? "page" : undefined}
          >
            {LOCALE_LABEL[code]}
          </Link>
        </span>
      ))}
    </nav>
  );
}
