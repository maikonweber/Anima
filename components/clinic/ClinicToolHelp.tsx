"use client";

import { useEffect, useId, useState } from "react";
import {
  CLINIC_HELP_UI,
  getClinicPatientTabHelp,
  type ClinicHelpLocale,
  type ClinicPatientTabId,
  type ClinicToolHelpDefinition,
} from "@/components/clinic/clinic-tool-help-content";

type Props = {
  /** Preferred: pass tab id so PT/EN/ES switch works */
  tab?: ClinicPatientTabId;
  /** Or pass a pre-resolved help object */
  help?: ClinicToolHelpDefinition;
  className?: string;
  defaultTopicId?: string;
  defaultLocale?: ClinicHelpLocale;
};

const LOCALE_LANG: Record<ClinicHelpLocale, string> = {
  pt: "pt-BR",
  en: "en",
  es: "es",
};

const LOCALE_BUTTONS: Array<{ code: ClinicHelpLocale; label: string }> = [
  { code: "pt", label: "PT" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

export function ClinicToolHelp({
  tab,
  help: helpProp,
  className = "",
  defaultTopicId,
  defaultLocale = "pt",
}: Props) {
  const selectId = useId();
  const [locale, setLocale] = useState<ClinicHelpLocale>(defaultLocale);
  const help =
    helpProp ??
    (tab ? getClinicPatientTabHelp(tab, locale) : null);

  const ui = CLINIC_HELP_UI[locale];
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
  }, [help, defaultTopicId, locale]);

  if (!help) return null;

  const topic =
    help.topics.find((t) => t.id === topicId) ?? help.topics[0] ?? null;

  return (
    <aside
      className={`rounded-2xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-4 sm:p-5 mb-5 ${className}`.trim()}
      aria-label={`${ui.ariaPrefix}: ${help.title}`}
      lang={LOCALE_LANG[locale]}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--clinic-accent)] font-semibold">
              {ui.eyebrow}
            </p>
            <div
              className="inline-flex rounded-lg border border-[var(--clinic-border)] p-0.5"
              role="group"
              aria-label={ui.languageLabel}
            >
              {LOCALE_BUTTONS.map(({ code, label }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocale(code)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase transition-colors ${
                    locale === code
                      ? "bg-[var(--clinic-accent-soft)] text-[var(--clinic-accent)]"
                      : "text-foreground/40 hover:text-foreground/65"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
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
