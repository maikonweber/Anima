"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  PatientStatusBadge,
  STATUS_LABELS,
} from "@/components/clinic/PatientStatusBadge";
import { usePatients } from "@/hooks/use-patients";
import type { PatientStatus } from "@anima/shared";

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
      limit: 20,
    }),
    [q, status, page],
  );

  const { data, isLoading, error, refetch } = usePatients(orgId, query);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href={`/clinic/${orgId}`}
          className="text-sm text-foreground/40 hover:text-anima-violet mb-4 inline-block"
        >
          ← Clínica
        </Link>

        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
              Pacientes
            </h1>
            <p className="text-sm text-foreground/40">
              CRM clínico — somente dados deste tenant
            </p>
          </div>
          <Link href={`/clinic/${orgId}/patients/new`}>
            <Button type="button" className="w-auto whitespace-nowrap">
              Novo
            </Button>
          </Link>
        </div>

        <div className="space-y-3 mb-6">
          <Input
            label="Buscar"
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="Nome, e-mail ou telefone"
          />
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setPage(1);
                  setStatus(item);
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  status === item
                    ? "bg-anima-violet/15 text-anima-violet"
                    : "bg-foreground/[0.04] text-foreground/45 hover:text-foreground/70"
                }`}
              >
                {item === "ALL" ? "Todos" : STATUS_LABELS[item]}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <ErrorMessage
            message="Não foi possível carregar os pacientes."
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-2xl bg-foreground/[0.06] animate-pulse"
              />
            ))}
          </div>
        )}

        {!isLoading && !error && data?.items.length === 0 && (
          <div className="glass-panel p-10 text-center">
            <h3 className="text-base font-semibold text-foreground/70 mb-2">
              Nenhum paciente encontrado
            </h3>
            <p className="text-sm text-foreground/40 mb-4">
              Cadastre o primeiro paciente desta clínica.
            </p>
            <Link href={`/clinic/${orgId}/patients/new`}>
              <Button type="button" className="w-auto mx-auto">
                Cadastrar paciente
              </Button>
            </Link>
          </div>
        )}

        <ul className="space-y-3">
          {data?.items.map((patient) => (
            <li key={patient.id}>
              <Link
                href={`/clinic/${orgId}/patients/${patient.id}`}
                className="block glass-panel p-5 hover:scale-[1.01] transition-transform duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-foreground/85">
                      {patient.fullName}
                    </p>
                    <p className="text-xs text-foreground/40 mt-0.5">
                      {patient.email || patient.phone || "Sem contato"}
                    </p>
                  </div>
                  <PatientStatusBadge status={patient.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <Button
              type="button"
              variant="secondary"
              className="w-auto"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </Button>
            <span className="text-xs text-foreground/40">
              Página {data.page} de {data.totalPages}
            </span>
            <Button
              type="button"
              variant="secondary"
              className="w-auto"
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
