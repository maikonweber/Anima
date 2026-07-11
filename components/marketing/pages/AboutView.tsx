import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localizedPath } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { MarketingChrome } from "@/components/marketing/MarketingChrome";

export function AboutView({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.about;

  return (
    <MarketingChrome locale={locale}>
      <article>
        <h1 className="text-3xl font-bold text-foreground/90 mb-6">{t.title}</h1>
        <p className="text-sm text-foreground/55 leading-relaxed mb-6">
          {t.introBefore ? `${t.introBefore} ` : null}
          <strong className="text-foreground/75 font-semibold">{t.introBrand}</strong>{" "}
          {t.introMid}{" "}
          <strong className="font-semibold">{t.introCompany}</strong>
          {t.introAfter}{" "}
          <a
            href="https://emotivecare.com.br"
            className="text-anima-violet hover:underline"
          >
            {t.introDomain}
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold text-foreground/82 mb-3">
          {t.missionTitle}
        </h2>
        <p className="text-sm text-foreground/55 leading-relaxed mb-6">
          {t.missionBody}
        </p>

        <h2 className="text-xl font-semibold text-foreground/82 mb-3">
          {t.sentioTitle}
        </h2>
        <p className="text-sm text-foreground/55 leading-relaxed mb-6">
          {t.sentioBefore ? `${t.sentioBefore} ` : null}
          <strong className="font-semibold">{t.sentioBrand}</strong>{" "}
          {t.sentioAfter}
        </p>

        <section aria-labelledby="sobre-ai-search" className="mb-10">
          <h2
            id="sobre-ai-search"
            className="text-xl font-semibold text-foreground/82 mb-3"
          >
            {t.whatWeDoTitle}
          </h2>
          <ul className="list-disc space-y-2 ps-6 text-sm text-foreground/55">
            {t.whatWeDo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="sobre-nao" className="mb-10">
          <h2
            id="sobre-nao"
            className="text-xl font-semibold text-foreground/82 mb-3"
          >
            {t.whatWeDontTitle}
          </h2>
          <p className="text-sm text-foreground/55 leading-relaxed">
            {t.whatWeDontBody}
          </p>
        </section>

        <p className="text-sm font-medium mb-6">
          <Link
            className="text-anima-violet hover:underline"
            href={localizedPath(locale, "/plans")}
          >
            {t.linkPlans}
          </Link>
          {" · "}
          <Link
            className="text-anima-violet hover:underline"
            href={localizedPath(locale, "/blog")}
          >
            {t.linkBlog}
          </Link>
          {" · "}
          <Link
            className="text-anima-violet hover:underline"
            href={localizedPath(locale, "/register")}
          >
            {t.linkRegister}
          </Link>
        </p>
      </article>
    </MarketingChrome>
  );
}
