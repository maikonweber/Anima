"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useAccessibleUsers } from "@/hooks/use-care";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export default function CarePatientsPage() {
  const { data: patients, isLoading, error, refetch } = useAccessibleUsers();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
          Acompanhamentos
        </h1>
        <p className="text-sm text-foreground/40 mb-8">
          Pessoas Pleno que autorizaram você a acompanhar o painel em leitura
        </p>

        {error && (
          <ErrorMessage
            message="Não foi possível carregar a lista de acompanhamentos."
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-foreground/[0.06] animate-pulse"
              />
            ))}
          </div>
        )}

        {!isLoading && !error && (!patients || patients.length === 0) && (
          <div className="glass-panel p-10 text-center">
            <p className="text-4xl mb-3" aria-hidden>
              👥
            </p>
            <h3 className="text-base font-semibold text-foreground/70 mb-2">
              Nenhum acompanhamento ainda
            </h3>
            <p className="text-sm text-foreground/40 max-w-sm mx-auto">
              Quando uma pessoa autorizar você a ver seus dados, aparecerá
              aqui.
            </p>
          </div>
        )}

        <ul className="space-y-3">
          {patients?.map((item) => (
            <li key={item.inviteId}>
              <Link
                href={`/care/patients/${item.owner.id}`}
                className="block glass-panel p-5 hover:scale-[1.01] transition-transform duration-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-foreground/85">
                      {item.owner.nome}
                    </p>
                    <p className="text-xs text-foreground/40 mt-0.5">
                      {item.owner.email}
                    </p>
                  </div>
                  <span className="text-anima-violet text-sm">Ver →</span>
                </div>
                {item.aceitoEm && (
                  <p className="text-[10px] text-foreground/30 mt-2">
                    Acesso desde {formatDate(item.aceitoEm)}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

function formatDate(iso: string): string {
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
