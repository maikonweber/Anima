"use client";

import { useEffect, useId, useState } from "react";
import type { ClinicToolHelpDefinition } from "@/components/clinic/clinic-tool-help-content";

type Props = {
  help: ClinicToolHelpDefinition;
  className?: string;
  /** Topic id to open first */
  defaultTopicId?: string;
};

export function ClinicToolHelp({
  help,
  className = "",
  defaultTopicId,
}: Props) {
  const selectId = useId();
  const initial =
    defaultTopicId && help.topics.some((t) => t.id === defaultTopicId)
      ? defaultTopicId
      : help.topics[0]?.id ?? "";
  const [topicId, setTopicId] = useState(initial);

  useEffect(() => {
    setTopicId(
      defaultTopicId && help.topics.some((t) => t.id === defaultTopicId)
        ? defaultTopicId
        : help.topics[0]?.id ?? "",
    );
  }, [help, defaultTopicId]);

  const topic =
    help.topics.find((t) => t.id === topicId) ?? help.topics[0] ?? null;

  return (
    <aside
      className={`rounded-2xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] p-4 sm:p-5 mb-5 ${className}`.trim()}
      aria-label={`Ajuda: ${help.title}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--clinic-accent)] font-semibold mb-1">
            Como usar
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
            Tópico de ajuda
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
