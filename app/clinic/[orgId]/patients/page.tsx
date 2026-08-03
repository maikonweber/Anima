"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { ClinicPagination } from "@/components/clinic/ClinicPagination";
import {
  PatientStatusBadge,
  STATUS_LABELS,
} from "@/components/clinic/PatientStatusBadge";
import { usePatients } from "@/hooks/use-patients";
import type { PatientStatus } from "@anima/shared";

const PAGE_SIZE = 20;

const STATUS_FILTERS: Array<PatientStatus | "ALL"> = [
  "ALL",
  "LEAD",
  "TRIAGEM",
  "ATIVO",
  "PAUSADO",
  "ALTA",
  "INATIVO",
];

export default function ClinicPatientsPage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<PatientStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const query = useMemo(
    () => ({
      q: q.trim() || undefined,
      status: status === "ALL" ? undefined : status,
      page,
      limit: PAGE_SIZE,
    }),
    [q, status, page],
  );

  const { data, isLoading, error, refetch } = usePatients(orgId, query);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--clinic-accent)] font-medium mb-2">
              CRM clínico
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground/90 mb-1">
              Pacientes
            </h1>
            <p className="text-sm text-foreground/40">
              Cadastro operacional desta organização — dados isolados por tenant
            </p>
          </div>
          <Link href={`/clinic/${orgId}/patients/new`}>
            <Button type="button" className="w-auto whitespace-nowrap !rounded-lg">
              Novo paciente
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border border-[var(--clinic-border)] bg-[var(--clinic-panel)] overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-[var(--clinic-border)] space-y-3">
            <div className="relative">
              <SearchIcon />
              <input
                type="search"
                value={q}
                onChange={(e) => {
                  setPage(1);
                  setQ(e.target.value);
                }}
                placeholder="Buscar por nome, e-mail ou telefone"
                className="w-full rounded-lg pl-10 pr-3 py-2.5 text-sm bg-foreground/[0.03] border border-[var(--clinic-border)] text-foreground/90 placeholder:text-foreground/30 focus:outline-none focus:ring-2 focus:ring-[var(--clinic-accent)]/25"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_FILTERS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setPage(1);
                    setStatus(item);
                  }}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    status === item
                      ? "bg-[var(--clinic-accent-soft)] text-[var(--clinic-accent)]"
                      : "text-foreground/45 hover:bg-foreground/[0.04] hover:text-foreground/70"
                  }`}
                >
                  {item === "ALL" ? "Todos" : STATUS_LABELS[item]}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4">
              <ErrorMessage
                message="Não foi possível carregar os pacientes."
                onRetry={() => refetch()}
              />
            </div>
          )}

          {isLoading && (
            <div className="divide-y divide-[var(--clinic-border)]">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-12 px-4 flex items-center gap-4 animate-pulse">
                  <div className="h-3 w-40 rounded bg-foreground/[0.06]" />
                  <div className="h-3 w-32 rounded bg-foreground/[0.04] hidden sm:block" />
                  <div className="h-3 w-16 rounded bg-foreground/[0.04] ml-auto" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && data?.items.length === 0 && (
            <div className="px-4 py-14 text-center">
              <h3 className="text-base font-semibold text-foreground/70 mb-1">
                Nenhum paciente encontrado
              </h3>
              <p className="text-sm text-foreground/40 mb-5 max-w-sm mx-auto">
                Cadastre o primeiro paciente ou ajuste a busca e os filtros.
              </p>
              <Link href={`/clinic/${orgId}/patients/new`}>
                <Button type="button" className="w-auto mx-auto !rounded-lg">
                  Cadastrar paciente
                </Button>
              </Link>
            </div>
          )}

          {!isLoading && !error && data && data.items.length > 0 && (
            <>
              <div className="hidden sm:grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_7.5rem_1.5rem] gap-3 px-4 py-2 text-[10px] uppercase tracking-wider text-foreground/35 border-b border-[var(--clinic-border)] bg-foreground/[0.015]">
                <span>Nome</span>
                <span>Contato</span>
                <span>Status</span>
                <span />
              </div>
              <ul className="divide-y divide-[var(--clinic-border)]">
                {data.items.map((patient, index) => (
                  <li key={patient.id}>
                    <Link
                      href={`/clinic/${orgId}/patients/${patient.id}`}
                      className="grid grid-cols-1 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_7.5rem_1.5rem] gap-1 sm:gap-3 items-center px-4 py-2.5 hover:bg-[var(--clinic-row-hover)] transition-colors"
                      style={{ animationDelay: `${Math.min(index, 12) * 20}ms` }}
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground/85 truncate">
                          {patient.fullName}
                        </p>
                        <p className="sm:hidden text-xs text-foreground/40 truncate mt-0.5">
                          {patient.email || patient.phone || "Sem contato"}
                        </p>
                      </div>
                      <p className="hidden sm:block text-xs text-foreground/45 truncate">
                        {patient.email || patient.phone || "—"}
                      </p>
                      <div className="flex items-center gap-2 sm:block">
                        <PatientStatusBadge status={patient.status} />
                        {patient.phone && patient.email && (
                          <span className="sm:hidden text-[10px] text-foreground/30 truncate">
                            {patient.phone}
                          </span>
                        )}
                      </div>
                      <span className="hidden sm:block text-foreground/25 text-sm text-right">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {data && !error && (
            <div className="px-4 pb-4">
              <ClinicPagination
                page={data.page}
                totalPages={Math.max(data.totalPages, 1)}
                total={data.total}
                limit={data.limit}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 pointer-events-none"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}
