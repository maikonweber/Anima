import type { Metadata } from "next";
import { NO_INDEX_METADATA } from "@/lib/seo/private-metadata";
import { ClinicTrialInviteGenerator } from "@/components/admin/ClinicTrialInviteGenerator";

export const metadata: Metadata = {
  ...NO_INDEX_METADATA,
  title: "Trials clínica — Admin",
};

export default function AdminTrialsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white/95">
          Trial clínica — 1 mês
        </h1>
        <p className="mt-2 text-sm text-white/45 max-w-2xl">
          Gere links de trial do plano Cuidado (30 dias) para demos e vendas.
          Links abertos são de uso único; com e-mail, só aquela conta resgata.
        </p>
      </header>
      <ClinicTrialInviteGenerator />
    </div>
  );
}
