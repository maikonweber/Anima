import Link from "next/link";
import {
  alternateBlogPath,
  blogPath,
  getBlogUi,
  type Locale,
} from "@/lib/seo/i18n";

export function BlogLanguageSwitch({
  locale,
  slug,
}: {
  locale: Locale;
  slug?: string;
}) {
  const ui = getBlogUi(locale);
  const other: Locale = locale === "en" ? "pt-BR" : "en";
  const currentHref = blogPath(locale, slug);
  const otherHref = alternateBlogPath(locale, slug);

  return (
    <nav
      aria-label={ui.languageLabel}
      className="mb-6 flex items-center gap-2 text-xs font-medium text-foreground/45"
    >
      <span className="uppercase tracking-[0.16em]">{ui.languageLabel}</span>
      <Link
        href={currentHref}
        hrefLang={locale === "en" ? "en" : "pt-BR"}
        className="text-foreground/75"
        aria-current="page"
      >
        {locale === "en" ? "EN" : "PT"}
      </Link>
      <span aria-hidden>·</span>
      <Link
        href={otherHref}
        hrefLang={other === "en" ? "en" : "pt-BR"}
        className="text-anima-violet hover:underline"
      >
        {other === "en" ? "EN" : "PT"}
      </Link>
    </nav>
  );
}
