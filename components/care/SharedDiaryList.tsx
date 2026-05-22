"use client";

import type { SharedDiaryEntry } from "@/lib/types";
import { getCategoryFromEnergy, getCategoryStyle } from "@/lib/energy";

interface SharedDiaryListProps {
  entries: SharedDiaryEntry[];
}

export function SharedDiaryList({ entries }: SharedDiaryListProps) {
  if (!entries || entries.length === 0) {
    return (
      <div className="glass-panel p-10 text-center">
        <p className="text-sm text-foreground/50">
          Nenhum registro disponível para visualização.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {entries.map((entry) => {
        const style = getCategoryStyle(
          getCategoryFromEnergy(entry.energiaInformada),
        );
        return (
          <li key={entry.id} className="glass-panel p-4">
            <div className="flex justify-between items-start gap-3 mb-2">
              <span className="text-xs text-foreground/35">
                {formatShortDate(entry.dataRegistro ?? entry.criadoEm)}
              </span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${style.bg}`}
              >
                {entry.energiaInformada} — {style.label}
              </span>
            </div>
            <p className="text-sm text-foreground/70 line-clamp-3">
              {entry.texto}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-foreground/50">
              {entry.humor && (
                <span className="rounded-full border border-foreground/[0.08] px-2 py-1">
                  Humor: {entry.humor}
                </span>
              )}
              {typeof entry.ansiedadeInformada === "number" && (
                <span className="rounded-full border border-foreground/[0.08] px-2 py-1">
                  Ansiedade: {entry.ansiedadeInformada}%
                </span>
              )}
              {entry.tagsEmocionais?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-foreground/[0.08] px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
            {entry.observacoes && (
              <p className="text-xs text-foreground/40 mt-2 line-clamp-2">
                {entry.observacoes}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function formatShortDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
