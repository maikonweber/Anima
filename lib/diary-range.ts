import type { DiaryEntry, EnergyCategory } from "@/lib/types";
import { getCategoryFromEnergy } from "@/lib/energy";

export type ReportPeriod = 7 | 30 | 90;

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + amount);
  return next;
}

/** Avoid UTC off-by-one when the API returns a bare YYYY-MM-DD. */
export function entryDateKey(entry: Pick<DiaryEntry, "dataRegistro" | "criadoEm">): string {
  const raw = entry.dataRegistro || entry.criadoEm;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  return toISODate(new Date(raw));
}

export function periodRange(days: ReportPeriod, now = new Date()) {
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = addDays(end, -(days - 1));
  return { from: toISODate(start), to: toISODate(end) };
}

export function startOfWeek(date: Date, weekStartsOn: 0 | 1): Date {
  const x = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = x.getDay();
  const diff = weekStartsOn === 1 ? (day === 0 ? -6 : 1 - day) : -day;
  x.setDate(x.getDate() + diff);
  return x;
}

export function weekStartsOnForLocale(locale: string): 0 | 1 {
  return locale === "en" ? 0 : 1;
}

export type TagCount = { name: string; count: number };
export type CategoryCount = { category: EnergyCategory; count: number };

export interface DiarySummary {
  entries: DiaryEntry[];
  byDay: Map<string, DiaryEntry[]>;
  daysWithEntries: number;
  averageEnergy: number | null;
  categories: CategoryCount[];
  tags: TagCount[];
  emotions: TagCount[];
}

function bump(map: Map<string, number>, key: string, amount = 1) {
  const name = key.trim();
  if (!name) return;
  map.set(name, (map.get(name) ?? 0) + amount);
}

export function summarizeEntries(entries: DiaryEntry[]): DiarySummary {
  const byDay = new Map<string, DiaryEntry[]>();
  const tagMap = new Map<string, number>();
  const emotionMap = new Map<string, number>();
  const categoryMap = new Map<EnergyCategory, number>();
  let energySum = 0;
  let energyN = 0;

  const sorted = [...entries].sort((a, b) =>
    entryDateKey(b).localeCompare(entryDateKey(a)),
  );

  for (const entry of sorted) {
    const key = entryDateKey(entry);
    const list = byDay.get(key) ?? [];
    list.push(entry);
    byDay.set(key, list);

    if (typeof entry.energiaInformada === "number") {
      energySum += entry.energiaInformada;
      energyN += 1;
      const category = getCategoryFromEnergy(entry.energiaInformada);
      categoryMap.set(category, (categoryMap.get(category) ?? 0) + 1);
    }

    for (const tag of entry.tagsEmocionais ?? []) bump(tagMap, tag);
    for (const emotion of entry.emotions ?? []) bump(emotionMap, emotion.nome);
  }

  const toCounts = (map: Map<string, number>): TagCount[] =>
    [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const categoryOrder: EnergyCategory[] = [
    "EXAUSTAO",
    "BAIXA",
    "INSTAVEL",
    "FUNCIONAL",
    "EXPANSIVA",
  ];

  return {
    entries: sorted,
    byDay,
    daysWithEntries: byDay.size,
    averageEnergy: energyN ? Math.round(energySum / energyN) : null,
    categories: categoryOrder
      .filter((category) => categoryMap.has(category))
      .map((category) => ({ category, count: categoryMap.get(category) ?? 0 })),
    tags: toCounts(tagMap),
    emotions: toCounts(emotionMap),
  };
}

export function averageEnergyForDay(entries: DiaryEntry[]): number | null {
  const values = entries
    .map((entry) => entry.energiaInformada)
    .filter((value): value is number => typeof value === "number");
  if (!values.length) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function formatDisplayDate(iso: string, locale: string, options?: Intl.DateTimeFormatOptions) {
  const key = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso : toISODate(new Date(iso));
  return parseISODate(key).toLocaleDateString(locale, options ?? {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
