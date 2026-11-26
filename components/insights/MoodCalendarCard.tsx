"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ENERGY_CATEGORIES, getCategoryFromEnergy } from "@/lib/energy";
import type { EnergyCategory } from "@/lib/types";
import {
  addDays,
  averageEnergyForDay,
  startOfWeek,
  summarizeEntries,
  toISODate,
  weekStartsOnForLocale,
} from "@/lib/diary-range";
import {
  CHECKIN_GOAL_OPTIONS,
  readCheckinGoal,
  writeCheckinGoal,
  type CheckinGoalDays,
} from "@/lib/checkin-goal";
import { useDiaryRange } from "@/hooks/use-diary-range";
import { useAuth } from "@/providers/auth-provider";
import { useLocale } from "@/lib/i18n/locale-provider";
import { getProductDictionary } from "@/lib/i18n/product-dictionary";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

const CATEGORY_ORDER: EnergyCategory[] = [
  "EXAUSTAO",
  "BAIXA",
  "INSTAVEL",
  "FUNCIONAL",
  "EXPANSIVA",
];

export function MoodCalendarCard() {
  const { user } = useAuth();
  const { locale, localizedHref } = useLocale();
  const t = getProductDictionary(locale);
  const weekStartsOn = weekStartsOnForLocale(locale);

  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  const todayKey = toISODate(today);

  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<string | null>(todayKey);
  const [goal, setGoal] = useState<CheckinGoalDays>(3);
  const [goalUserId, setGoalUserId] = useState<string | undefined>(undefined);
  if (user?.id !== goalUserId) {
    setGoalUserId(user?.id);
    setGoal(readCheckinGoal(user?.id));
  }

  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
  const gridStart = startOfWeek(monthStart, weekStartsOn);
  const gridEnd = addDays(startOfWeek(monthEnd, weekStartsOn), 6);
  const from = toISODate(gridStart);
  const to = toISODate(gridEnd > today ? today : gridEnd);

  const { data: entries, isLoading, error, refetch } = useDiaryRange(from, to);
  const summary = useMemo(() => summarizeEntries(entries ?? []), [entries]);

  const weekStart = startOfWeek(today, weekStartsOn);
  const weekEnd = addDays(weekStart, 6);
  const daysThisWeek = useMemo(() => {
    const keys = new Set<string>();
    for (const [key] of summary.byDay) {
      const date = new Date(key + "T12:00:00");
      if (date >= weekStart && date <= weekEnd) keys.add(key);
    }
    return keys.size;
  }, [summary.byDay, weekStart, weekEnd]);

  const weekdayLabels = useMemo(() => {
    const start = startOfWeek(today, weekStartsOn);
    return Array.from({ length: 7 }, (_, i) =>
      addDays(start, i).toLocaleDateString(locale, { weekday: "short" }),
    );
  }, [locale, today, weekStartsOn]);

  const cells = useMemo(() => {
    const list: Date[] = [];
    for (let date = new Date(gridStart); date <= gridEnd; date = addDays(date, 1)) {
      list.push(date);
    }
    return list;
  }, [gridStart, gridEnd]);

  const monthLabel = cursor.toLocaleDateString(locale, { month: "long", year: "numeric" });
  const canGoNext =
    cursor.getFullYear() < today.getFullYear() ||
    (cursor.getFullYear() === today.getFullYear() && cursor.getMonth() < today.getMonth());

  function onChangeGoal(next: CheckinGoalDays) {
    setGoal(next);
    if (user?.id) writeCheckinGoal(user.id, next);
  }

  const selectedEntries = selectedDay ? (summary.byDay.get(selectedDay) ?? []) : [];
  const reached = daysThisWeek >= goal;
  const almost = !reached && daysThisWeek >= Math.max(1, goal - 1);
  const progressLabel = t.calendar.progress
    .replace("{done}", String(daysThisWeek))
    .replace("{goal}", String(goal));
  const progressRatio = Math.min(1, daysThisWeek / goal);

  return (
    <section className="glass-panel p-5 sm:p-6 scroll-mt-20" aria-label={t.calendar.title}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4 mb-4">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground/85">{t.calendar.title}</h2>
          <p className="text-sm text-foreground/45 mt-0.5">{t.calendar.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="rounded-lg px-2.5 py-1.5 text-sm text-foreground/60 hover:bg-foreground/[0.05] hover:text-foreground/80"
            aria-label={t.calendar.prevMonth}
          >
            ←
          </button>
          <p className="min-w-[9.5rem] text-center text-sm font-medium text-foreground/80">
            {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
          </p>
          <button
            type="button"
            onClick={() => canGoNext && setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            disabled={!canGoNext}
            className="rounded-lg px-2.5 py-1.5 text-sm text-foreground/60 hover:bg-foreground/[0.05] hover:text-foreground/80 disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label={t.calendar.nextMonth}
          >
            →
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={t.common.error} onRetry={() => refetch()} />
        </div>
      )}

      {isLoading ? (
        <div className="h-56 rounded-xl bg-foreground/[0.05] animate-pulse" />
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5" role="grid" aria-label={monthLabel}>
            {weekdayLabels.map((label) => (
              <div
                key={label}
                className="text-[10px] sm:text-xs font-medium uppercase tracking-wide text-foreground/40 text-center py-1"
              >
                {label}
              </div>
            ))}
            {cells.map((date) => {
              const key = toISODate(date);
              const inMonth = date.getMonth() === cursor.getMonth();
              const isFuture = date > today;
              const dayEntries = summary.byDay.get(key) ?? [];
              const avg = averageEnergyForDay(dayEntries);
              const category = avg != null ? getCategoryFromEnergy(avg) : null;
              const color = category ? ENERGY_CATEGORIES[category].color : undefined;
              const selected = selectedDay === key;
              const isToday = key === todayKey;
              const label = category
                ? `${date.getDate()}, ${t.calendar.energy[category]}, ${dayEntries.length}`
                : `${date.getDate()}`;

              return (
                <button
                  key={key}
                  type="button"
                  role="gridcell"
                  aria-label={label}
                  aria-selected={selected}
                  disabled={isFuture}
                  onClick={() => setSelectedDay(key)}
                  className={`relative min-h-10 sm:min-h-11 rounded-lg text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anima-violet/60 ${
                    selected ? "ring-2 ring-anima-violet/70" : ""
                  } ${isToday && !selected ? "ring-1 ring-foreground/20" : ""} ${
                    isFuture
                      ? "text-foreground/20 cursor-default"
                      : inMonth
                        ? "text-foreground/75 hover:bg-foreground/[0.04]"
                        : "text-foreground/30"
                  }`}
                  style={
                    color && inMonth && !isFuture
                      ? { backgroundColor: `${color}22`, boxShadow: `inset 0 -3px 0 ${color}` }
                      : undefined
                  }
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {!summary.daysWithEntries && (
            <p className="mt-3 text-sm text-foreground/45">{t.calendar.noData}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2" aria-label={t.calendar.legend}>
            {CATEGORY_ORDER.map((category) => (
              <span
                key={category}
                className="inline-flex items-center gap-1.5 text-[11px] text-foreground/50"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: ENERGY_CATEGORIES[category].color }}
                  aria-hidden
                />
                {t.calendar.energy[category]}
              </span>
            ))}
          </div>

          {selectedDay && (
            <div className="mt-4 border-t border-foreground/[0.06] pt-4">
              <h3 className="text-sm font-medium text-foreground/70 mb-2">
                {t.calendar.entriesOnDay} ·{" "}
                {new Date(selectedDay + "T12:00:00").toLocaleDateString(locale, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h3>
              {selectedEntries.length === 0 ? (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-foreground/45">{t.calendar.emptyDay}</p>
                  {selectedDay === todayKey && (
                    <Link
                      href={localizedHref("/diary/new")}
                      className="text-sm font-medium text-anima-violet hover:underline"
                    >
                      {t.calendar.newToday}
                    </Link>
                  )}
                </div>
              ) : (
                <ul className="space-y-2">
                  {selectedEntries.map((entry) => {
                    const category = getCategoryFromEnergy(entry.energiaInformada);
                    return (
                      <li key={entry.id}>
                        <Link
                          href={localizedHref(`/diary/${entry.id}`)}
                          className="flex items-start justify-between gap-3 rounded-xl px-3 py-2 hover:bg-foreground/[0.04]"
                        >
                          <span className="min-w-0">
                            <span className="block text-sm text-foreground/75 truncate">
                              {entry.texto?.trim() || t.calendar.openEntry}
                            </span>
                            <span className="block text-[11px] text-foreground/40 mt-0.5">
                              {t.calendar.energy[category]} · {entry.energiaInformada}
                            </span>
                          </span>
                          <span className="shrink-0 text-xs font-medium text-anima-violet">
                            {t.calendar.openEntry}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </>
      )}

      <div className="mt-5 border-t border-foreground/[0.06] pt-5">
        <h3 className="text-sm font-semibold text-foreground/80">{t.calendar.goalTitle}</h3>
        <p className="text-sm text-foreground/45 mt-0.5 mb-3">{t.calendar.goalSubtitle}</p>

        <fieldset className="mb-3">
          <legend className="sr-only">{t.calendar.goalLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {CHECKIN_GOAL_OPTIONS.map((option) => {
              const label = option === 3 ? t.calendar.days3 : option === 5 ? t.calendar.days5 : t.calendar.days7;
              const active = goal === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChangeGoal(option)}
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

        <p className="text-sm font-medium text-foreground/70 mb-2">
          {t.calendar.goalLabel}: {progressLabel}
        </p>
        <div
          className="h-2 rounded-full bg-foreground/[0.08] overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={goal}
          aria-valuenow={Math.min(daysThisWeek, goal)}
          aria-label={progressLabel}
        >
          <div
            className="h-full rounded-full bg-anima-violet/80 transition-[width] duration-300"
            style={{ width: `${Math.round(progressRatio * 100)}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-foreground/50">
          {reached ? t.calendar.reached : almost ? t.calendar.almost : t.calendar.encouragement}
        </p>
      </div>
    </section>
  );
}
