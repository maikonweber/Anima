"use client";

import { useMemo, useState } from "react";
import { CopyBlock } from "@/components/admin/CopyBlock";
import {
  SALES_CATEGORY_LABELS,
  SALES_CATEGORY_ORDER,
  SALES_SECTIONS,
  type SalesSection,
} from "@/lib/admin/sales-content";

function sectionCopyText(section: SalesSection): string {
  if (section.copyText) return section.copyText;
  if (section.html) {
    return section.html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<li>/gi, "• ")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
  return "";
}

export function SalesPlaybookView() {
  const [filter, setFilter] = useState<SalesSection["category"] | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SALES_SECTIONS.filter((s) => {
      if (filter !== "all" && s.category !== filter) return false;
      if (!q) return true;
      const blob = `${s.title} ${s.summary ?? ""} ${sectionCopyText(s)}`.toLowerCase();
      return blob.includes(q);
    });
  }, [filter, query]);

  const byCategory = useMemo(() => {
    const map = new Map<SalesSection["category"], SalesSection[]>();
    for (const cat of SALES_CATEGORY_ORDER) map.set(cat, []);
    for (const s of filtered) {
      map.get(s.category)?.push(s);
    }
    return map;
  }, [filtered]);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-anima-violet/70">
          Material interno
        </p>
        <h1 className="text-2xl font-semibold text-white/95">
          Playbook de vendas EmotiveCare
        </h1>
        <p className="max-w-2xl text-sm text-white/50 leading-relaxed">
          Pitches, descrições de planos, tabelas de preço e scripts prontos para
          copiar. Atualizado com regra Cuidado: dashboards ilimitados · até 15
          contas free patrocinadas (R$ 5/mês cada).
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Buscar pitch, objeção, script…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-anima-violet/30"
        />
        <div className="flex flex-wrap gap-1">
          <FilterChip
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="Todos"
          />
          {SALES_CATEGORY_ORDER.map((cat) => (
            <FilterChip
              key={cat}
              active={filter === cat}
              onClick={() => setFilter(cat)}
              label={SALES_CATEGORY_LABELS[cat]}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-white/40">Nenhum resultado para a busca.</p>
      ) : (
        SALES_CATEGORY_ORDER.map((cat) => {
          const items = byCategory.get(cat) ?? [];
          if (items.length === 0) return null;
          if (filter !== "all" && filter !== cat) return null;
          return (
            <section key={cat} className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-white/40">
                {SALES_CATEGORY_LABELS[cat]}
              </h2>
              <div className="space-y-4">
                {items.map((section) => (
                  <article
                    key={section.id}
                    id={section.id}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 scroll-mt-24"
                  >
                    <h3 className="text-base font-medium text-white/90 mb-1">
                      {section.title}
                    </h3>
                    {section.summary ? (
                      <p className="text-xs text-white/40 mb-4">{section.summary}</p>
                    ) : null}
                    {section.html ? (
                      <CopyBlock
                        label={section.copyText ? "Referência" : "Conteúdo"}
                        text={sectionCopyText(section)}
                        asHtml
                      />
                    ) : null}
                    {section.copyText ? (
                      <CopyBlock
                        label={section.html ? "Script" : "Conteúdo"}
                        text={section.copyText}
                      />
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          );
        })
      )}

      <nav className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <p className="text-xs font-medium text-white/40 mb-3">Índice rápido</p>
        <ul className="columns-1 sm:columns-2 gap-4 text-sm">
          {SALES_SECTIONS.map((s) => (
            <li key={s.id} className="mb-1.5 break-inside-avoid">
              <a
                href={`#${s.id}`}
                className="text-anima-violet/90 hover:underline"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
        active
          ? "bg-anima-violet/25 text-anima-violet"
          : "text-white/45 hover:bg-white/[0.05] hover:text-white/70"
      }`}
    >
      {label}
    </button>
  );
}
