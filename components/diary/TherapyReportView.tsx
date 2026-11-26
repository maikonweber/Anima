"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ENERGY_CATEGORIES, getCategoryFromEnergy } from "@/lib/energy";
import type { EnergyCategory } from "@/lib/types";
import {
  formatDisplayDate,
  periodRange,
  summarizeEntries,
  type ReportPeriod,
} from "@/lib/diary-range";
import { useDiaryRange } from "@/hooks/use-diary-range";
import { useAuth } from "@/providers/auth-provider";
import { useLocale } from "@/lib/i18n/locale-provider";
import { getProductDictionary } from "@/lib/i18n/product-dictionary";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";

const PERIODS: ReportPeriod[] = [7, 30, 90];

function interpolate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

export function TherapyReportView() {
  const { user } = useAuth();
  const { locale, localizedHref } = useLocale();
  const t = getProductDictionary(locale);
  const [period, setPeriod] = useState<ReportPeriod>(30);
  const [includeNotes, setIncludeNotes] = useState(true);

  const range = useMemo(() => periodRange(period), [period]);
  const { data: entries, isLoading, error, refetch } = useDiaryRange(range.from, range.to);
  const summary = useMemo(() => summarizeEntries(entries ?? []), [entries]);
  const generatedAt = useMemo(
    () => new Date().toLocaleString(locale, { dateStyle: "long", timeStyle: "short" }),
    [locale],
  );
  const firstName = user?.nome?.split(" ")[0] ?? "";

  function handlePrint() {
    window.print();
  }

  const periodLabel = `${formatDisplayDate(range.from, locale)} – ${formatDisplayDate(range.to, locale)}`;

  return (
    <div className="max-w-3xl w-full min-w-0 mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="no-print mb-6">
        <Link
          href={localizedHref("/diary")}
          className="text-sm text-anima-violet hover:underline"
        >
          ← {t.report.backToDiary}
        </Link>
      </div>

      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
          {t.report.title}
        </h1>
        <p className="text-sm text-foreground/45 max-w-2xl">{t.report.subtitle}</p>
      </header>

      <div className="no-print glass-panel p-4 sm:p-5 mb-6 space-y-4">
        <fieldset>
          <legend className="text-sm font-medium text-foreground/70 mb-2">
            {t.report.periodLabel}
          </legend>
          <div className="flex flex-wrap gap-2">
            {PERIODS.map((option) => {
              const label =
                option === 7 ? t.report.days7 : option === 30 ? t.report.days30 : t.report.days90;
              const active = period === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setPeriod(option)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-anima-violet/15 text-anima-violet"
                      : "bg-foreground/[0.04] text-foreground/55 hover:text-foreground/75"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeNotes}
            onChange={(event) => setIncludeNotes(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-foreground/20 text-anima-violet focus:ring-anima-violet/50"
          />
          <span className="min-w-0">
            <span className="block text-sm font-medium text-foreground/75">
              {t.report.includeNotes}
            </span>
            <span className="block text-xs text-foreground/45 mt-0.5">
              {t.report.includeNotesHint}
            </span>
          </span>
        </label>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Button type="button" onClick={handlePrint} className="sm:w-auto">
            {t.report.print}
          </Button>
          <p className="text-xs text-foreground/45">{t.report.printHint}</p>
        </div>
      </div>

      {error && (
        <div className="no-print mb-6">
          <ErrorMessage message={t.common.error} onRetry={() => refetch()} />
        </div>
      )}

      {isLoading ? (
        <div className="h-64 rounded-2xl bg-foreground/[0.05] animate-pulse" />
      ) : (
        <article className="therapy-print-sheet glass-panel p-5 sm:p-8">
          <header className="border-b border-foreground/[0.08] pb-4 mb-5">
            <p className="text-xs uppercase tracking-[0.18em] text-foreground/40 mb-1">
              EmotiveCare
            </p>
            <h2 className="text-xl font-semibold text-foreground/90">{t.report.title}</h2>
            {firstName ? (
              <p className="text-sm text-foreground/60 mt-1">{firstName}</p>
            ) : null}
            <p className="text-sm text-foreground/50 mt-2">
              {t.report.periodFromTo}: {periodLabel}
            </p>
            <p className="text-xs text-foreground/40 mt-1">
              {t.report.generatedAt}: {generatedAt}
            </p>
          </header>

          <p className="text-xs text-foreground/45 mb-6">{t.report.availableHint}</p>

          <section className="mb-6" aria-labelledby="report-mood">
            <h3 id="report-mood" className="text-base font-semibold text-foreground/80 mb-3">
              {t.report.moodSummary}
            </h3>
            {summary.entries.length === 0 ? (
              <p className="text-sm text-foreground/50">{t.report.noEntries}</p>
            ) : (
              <>
                <p className="text-sm text-foreground/65 mb-3">
                  {interpolate(t.report.entriesCount, {
                    n: summary.entries.length,
                    d: summary.daysWithEntries,
                    entries:
                      summary.entries.length === 1
                        ? t.report.entryWord
                        : t.report.entryWordPlural,
                    days:
                      summary.daysWithEntries === 1
                        ? t.report.dayWord
                        : t.report.dayWordPlural,
                  })}
                </p>
                {summary.averageEnergy != null && (
                  <p className="text-sm text-foreground/65 mb-3">
                    {t.report.avgEnergy}:{" "}
                    <strong className="font-semibold text-foreground/80">
                      {summary.averageEnergy}
                    </strong>
                    {" · "}
                    {t.calendar.energy[getCategoryFromEnergy(summary.averageEnergy)]}
                  </p>
                )}
                {summary.categories.length > 0 && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-foreground/40 mb-2">
                      {t.report.distribution}
                    </p>
                    <ul className="space-y-1.5">
                      {summary.categories.map((item) => (
                        <CategoryBar
                          key={item.category}
                          category={item.category}
                          count={item.count}
                          total={summary.entries.length}
                          label={t.calendar.energy[item.category]}
                        />
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </section>

          <div className="grid gap-6 sm:grid-cols-2 mb-6">
            <section>
              <h3 className="text-base font-semibold text-foreground/80 mb-2">
                {t.report.topTags}
              </h3>
              {summary.tags.length === 0 ? (
                <p className="text-sm text-foreground/50">{t.report.noneTags}</p>
              ) : (
                <ChipList items={summary.tags.slice(0, 8)} />
              )}
            </section>
            <section>
              <h3 className="text-base font-semibold text-foreground/80 mb-2">
                {t.report.topEmotions}
              </h3>
              {summary.emotions.length === 0 ? (
                <p className="text-sm text-foreground/50">{t.report.noneEmotions}</p>
              ) : (
                <ChipList items={summary.emotions.slice(0, 8)} />
              )}
            </section>
          </div>

          <section aria-labelledby="report-entries">
            <h3 id="report-entries" className="text-base font-semibold text-foreground/80 mb-3">
              {t.report.entriesTitle}
            </h3>
            {!includeNotes && (
              <p className="text-xs text-foreground/45 mb-3">{t.report.notesHidden}</p>
            )}
            {summary.entries.length === 0 ? (
              <p className="text-sm text-foreground/50">{t.report.noEntries}</p>
            ) : (
              <ol className="space-y-4">
                {summary.entries.map((entry) => {
                  const category = getCategoryFromEnergy(entry.energiaInformada);
                  return (
                    <li
                      key={entry.id}
                      className="border-t border-foreground/[0.06] pt-3 break-inside-avoid"
                    >
                      <p className="text-sm font-medium text-foreground/80">
                        {formatDisplayDate(entry.dataRegistro || entry.criadoEm, locale, {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-foreground/45 mt-0.5">
                        {t.report.energy}: {entry.energiaInformada} · {t.calendar.energy[category]}
                      </p>
                      {(entry.emotions?.length || entry.tagsEmocionais?.length) ? (
                        <p className="text-xs text-foreground/50 mt-1">
                          {[
                            ...(entry.emotions ?? []).map((emotion) => emotion.nome),
                            ...(entry.tagsEmocionais ?? []),
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      ) : null}
                      {includeNotes && entry.texto?.trim() ? (
                        <p className="text-sm text-foreground/70 mt-2 whitespace-pre-wrap break-words">
                          <span className="block text-[11px] uppercase tracking-wide text-foreground/40 mb-0.5">
                            {t.report.notesLabel}
                          </span>
                          {entry.texto.trim()}
                        </p>
                      ) : null}
                      {includeNotes && entry.observacoes?.trim() ? (
                        <p className="text-sm text-foreground/70 mt-2 whitespace-pre-wrap break-words">
                          <span className="block text-[11px] uppercase tracking-wide text-foreground/40 mb-0.5">
                            {t.report.extraNotes}
                          </span>
                          {entry.observacoes.trim()}
                        </p>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            )}
          </section>

          <footer className="mt-8 pt-4 border-t border-foreground/[0.08]">
            <p className="text-xs leading-relaxed text-foreground/45">{t.report.disclaimer}</p>
          </footer>
        </article>
      )}
    </div>
  );
}

function ChipList({ items }: { items: { name: string; count: number }[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item.name}
          className="rounded-full bg-foreground/[0.05] px-2.5 py-1 text-xs text-foreground/70"
        >
          {item.name} · {item.count}
        </li>
      ))}
    </ul>
  );
}

function CategoryBar({
  category,
  count,
  total,
  label,
}: {
  category: EnergyCategory;
  count: number;
  total: number;
  label: string;
}) {
  const width = total ? Math.max(6, Math.round((count / total) * 100)) : 0;
  return (
    <li className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-xs text-foreground/60">{label}</span>
      <span className="flex-1 h-2 rounded-full bg-foreground/[0.06] overflow-hidden">
        <span
          className="block h-full rounded-full"
          style={{ width: `${width}%`, backgroundColor: ENERGY_CATEGORIES[category].color }}
        />
      </span>
      <span className="w-6 text-right text-xs tabular-nums text-foreground/45">{count}</span>
    </li>
  );
}
