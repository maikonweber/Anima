"use client";

import { Button } from "@/components/ui/Button";

type ClinicPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
};

export function ClinicPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: ClinicPaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const pages = buildPageWindow(page, totalPages);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-[var(--clinic-border)]">
      <p className="text-xs text-foreground/40">
        {total === 0
          ? "Nenhum registro"
          : `Mostrando ${from}–${to} de ${total}`}
      </p>
      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-0.5">
        <Button
          type="button"
          variant="secondary"
          className="w-auto !px-3 !py-2 text-xs shrink-0"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </Button>
        <div className="flex items-center gap-1 px-1">
          {pages.map((item, idx) =>
            item === "…" ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-1 text-xs text-foreground/30"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                className={`min-w-8 h-8 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  item === page
                    ? "bg-[var(--clinic-accent-soft)] text-[var(--clinic-accent)]"
                    : "text-foreground/45 hover:bg-foreground/[0.04] hover:text-foreground/70"
                }`}
              >
                {item}
              </button>
            ),
          )}
        </div>
        <Button
          type="button"
          variant="secondary"
          className="w-auto !px-3 !py-2 text-xs shrink-0"
          disabled={page >= totalPages || totalPages === 0}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}

function buildPageWindow(
  current: number,
  totalPages: number,
): Array<number | "…"> {
  if (totalPages <= 1) return totalPages === 1 ? [1] : [];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages, current]);
  for (let i = current - 1; i <= current + 1; i++) {
    if (i >= 1 && i <= totalPages) pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: Array<number | "…"> = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("…");
    result.push(sorted[i]);
  }
  return result;
}
