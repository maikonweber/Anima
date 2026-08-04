"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  CLINIC_HELP_UI,
  getClinicPatientTabHelp,
  type ClinicHelpLocale,
  type ClinicPatientTabId,
  type ClinicToolHelpDefinition,
} from "@/components/clinic/clinic-tool-help-content";
import { useLocale } from "@/lib/i18n/locale-provider";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  /** Preferred: pass tab id so PT/EN/ES content resolves from global locale */
  tab?: ClinicPatientTabId;
  /** Or pass a pre-resolved help object */
  help?: ClinicToolHelpDefinition;
  className?: string;
  defaultTopicId?: string;
};

const LOCALE_LANG: Record<ClinicHelpLocale, string> = {
  pt: "pt-BR",
  en: "en",
  es: "es",
};

function toHelpLocale(locale: Locale): ClinicHelpLocale {
  if (locale === "en") return "en";
  if (locale === "es") return "es";
  return "pt";
}

export function ClinicToolHelp({
  tab,
  help: helpProp,
  className = "",
  defaultTopicId,
}: Props) {
  const selectId = useId();
  const { locale: appLocale } = useLocale();
  const helpLocale = useMemo(() => toHelpLocale(appLocale), [appLocale]);
  const help =
    helpProp ??
    (tab ? getClinicPatientTabHelp(tab, helpLocale) : null);

  const ui = CLINIC_HELP_UI[helpLocale];
  const initialTopic =
    help && defaultTopicId && help.topics.some((t) => t.id === defaultTopicId)
      ? defaultTopicId
      : help?.topics[0]?.id ?? "";
  const [topicId, setTopicId] = useState(initialTopic);

  useEffect(() => {
    if (!help) return;
    setTopicId(
      defaultTopicId && help.topics.some((t) => t.id === defaultTopicId)
        ? defaultTopicId
        : help.topics[0]?.id ?? "",
    );
  }, [help, defaultTopicId, helpLocale]);

  if (!help) return null;

  const topic =
    help.topics.find((t) => t.id === topicId) ?? help.topics[0] ?? null;

  return (
    <aside
      className={`rounded-2xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-4 sm:p-5 mb-5 ${className}`.trim()}
      aria-label={`${ui.ariaPrefix}: ${help.title}`}
      lang={LOCALE_LANG[helpLocale]}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--clinic-accent)] font-semibold mb-1">
            {ui.eyebrow}
          </p>
          <h2 className="text-sm font-semibold text-foreground/85">
            {help.title}
          </h2>
          <p className="text-xs text-[var(--clinic-muted)] mt-1.5 leading-relaxed">
            {help.summary}
          </p>
        </div>
        <div className="shrink-0 w-full sm:w-56">
          <label
            htmlFor={selectId}
            className="block text-[11px] font-medium text-foreground/45 mb-1"
          >
            {ui.topicLabel}
          </label>
          <select
            id={selectId}
            value={topic?.id ?? ""}
            onChange={(e) => setTopicId(e.target.value)}
            className="w-full rounded-lg border border-[var(--clinic-border)] bg-transparent px-3 py-2 text-xs text-foreground/80 focus:outline-none focus:ring-2 focus:ring-[var(--clinic-accent)]/30"
          >
            {help.topics.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {topic ? (
        <div className="rounded-xl border border-[var(--clinic-border)] bg-foreground/[0.02] px-3.5 py-3 text-xs text-foreground/65 leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:text-foreground/80 [&_em]:text-foreground/70">
          <p className="text-[10px] uppercase tracking-wider text-foreground/35 font-semibold mb-2">
            {topic.label}
          </p>
          {topic.content}
        </div>
      ) : null}
    </aside>
  );
}
