"use client";

import type { SharedDiaryEntry } from "@/lib/types";
import { getCategoryFromEnergy, getCategoryStyle } from "@/lib/energy";

interface SharedDiaryListProps {
  entries: SharedDiaryEntry[];
}

export function SharedDiaryList({ entries }: SharedDiaryListProps) {
  if (entries.length === 0) {
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
