"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { ApiError } from "@/lib/api-client";
import { inviteEmailSchema } from "@/lib/validations/care";
import {
  useCreateInvite,
  useSentInvites,
  useUpdateInvite,
} from "@/hooks/use-care";
import { InviteStatusBadge } from "@/components/care/InviteStatusBadge";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { CareInvitePublic } from "@/lib/types";
import { UpgradeBadge } from "@/components/subscription/UpgradeBadge";
import { useSubscription } from "@/providers/subscription-provider";
import Link from "next/link";

export default function DashboardCarePage() {
  const { canShareDashboard, usage } = useSubscription();
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const { data: invites, isLoading, error, refetch } = useSentInvites();
  const createMutation = useCreateInvite();
  const updateMutation = useUpdateInvite();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const parsed = inviteEmailSchema.safeParse({ viewerEmail: email });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "E-mail inválido.");
      return;
    }

    try {
      await createMutation.mutateAsync(parsed.data.viewerEmail);
      setEmail("");
      setFormSuccess("Convite enviado! O destinatário receberá instruções por e-mail.");
    } catch (err) {
      if (err instanceof ApiError && err.status === 402) return;
      setFormError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível enviar o convite.",
      );
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
          Vincular conta
        </h1>
        <p className="text-sm text-foreground/40 mb-8">
          Autorize outro Pleno (ou profissional Cuidado) a ver resumos e momentos
          que você marcar como compartilhados — somente leitura. O plano Essencial
          não participa de vínculos.
        </p>

        {!canShareDashboard && (
          <div className="glass-panel p-4 mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-foreground/50">
              Vincular com clínica ou outro Pleno faz parte do plano Pleno.
            </p>
            <UpgradeBadge planName="Pleno" href="/assinatura?plan=pleno" />
          </div>
        )}

        {usage &&
          usage.careInvitesActive.limit !== null &&
          canShareDashboard && (
          <p className="text-xs text-foreground/40 mb-4">
            Convites ativos: {usage.careInvitesActive.used}/
            {usage.careInvitesActive.limit}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="glass-panel p-5 mb-8 flex flex-col gap-4"
        >
          <h2 className="text-sm font-semibold text-foreground/70 flex items-center gap-2">
            Novo convite
            {!canShareDashboard && <UpgradeBadge planName="Pleno" />}
          </h2>

          {formError && (
            <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-400">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="rounded-lg bg-anima-violet/10 border border-anima-violet/20 px-4 py-3 text-sm text-anima-violet">
              {formSuccess}
            </div>
          )}

          <Input
            label="E-mail do profissional"
            type="email"
            placeholder="psicologo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!canShareDashboard}
          />

          {canShareDashboard ? (
            <Button type="submit" isLoading={createMutation.isPending}>
              Enviar convite
            </Button>
          ) : (
            <Link href="/assinatura?plan=pleno">
              <Button type="button">Assinar plano Pleno para convidar</Button>
            </Link>
          )}
        </form>

        <h2 className="text-sm font-semibold text-foreground/70 mb-4">
          Convites enviados
        </h2>

        {error && (
          <ErrorMessage
            message="Não foi possível carregar os convites."
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-20 rounded-2xl bg-foreground/[0.06] animate-pulse"
              />
            ))}
          </div>
        )}

        {!isLoading && !error && (!invites || invites.length === 0) && (
          <div className="glass-panel p-8 text-center">
            <p className="text-sm text-foreground/50">
              Você ainda não enviou convites. Envie pelo formulário acima quando quiser trazer sua rede de apoio clínico para dentro da sua jornada.
            </p>
          </div>
        )}

        <ul className="space-y-3">
          {invites?.map((invite) => (
            <SentInviteCard
              key={invite.id}
              invite={invite}
              onPause={() =>
                updateMutation.mutate({
                  id: invite.id,
                  body: { visualizacaoAtiva: false },
                })
              }
              onResume={() =>
                updateMutation.mutate({
                  id: invite.id,
                  body: { visualizacaoAtiva: true },
                })
              }
              onRevoke={() =>
                updateMutation.mutate({
                  id: invite.id,
                  body: { revogar: true },
                })
              }
              isUpdating={updateMutation.isPending}
            />
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

function SentInviteCard({
  invite,
  onPause,
  onResume,
  onRevoke,
  isUpdating,
}: {
  invite: CareInvitePublic;
  onPause: () => void;
  onResume: () => void;
  onRevoke: () => void;
  isUpdating: boolean;
}) {
  const canManage =
    invite.status !== "REVOGADO" && invite.status === "ACEITO";
  const pending = invite.status === "PENDENTE";
  const revoked = invite.status === "REVOGADO";

  return (
    <li className="glass-panel p-4">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-sm font-medium text-foreground/80">
            {invite.viewerEmail}
          </p>
          {invite.viewerNome && (
            <p className="text-xs text-foreground/40">{invite.viewerNome}</p>
          )}
        </div>
        <InviteStatusBadge status={invite.status} />
      </div>

      {invite.status === "ACEITO" && (
        <p className="text-xs text-foreground/40 mb-3">
          Visualização:{" "}
          {invite.visualizacaoAtiva ? (
            <span className="text-green-600">ativa</span>
          ) : (
            <span className="text-yellow-600">pausada</span>
          )}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {canManage && invite.visualizacaoAtiva && (
          <Button
            type="button"
            variant="secondary"
            disabled={isUpdating}
            onClick={onPause}
          >
            Pausar acesso
          </Button>
        )}
        {canManage && !invite.visualizacaoAtiva && (
          <Button
            type="button"
            variant="secondary"
            disabled={isUpdating}
            onClick={onResume}
          >
            Retomar acesso
          </Button>
        )}
        {(canManage || pending) && !revoked && (
          <Button
            type="button"
            variant="secondary"
            disabled={isUpdating}
            onClick={onRevoke}
            className="!text-red-400 hover:!bg-red-500/5"
          >
            Revogar
          </Button>
        )}
      </div>

      <p className="text-[10px] text-foreground/30 mt-2">
        Enviado em {formatDate(invite.criadoEm)}
        {invite.aceitoEm && ` · Aceito em ${formatDate(invite.aceitoEm)}`}
      </p>
    </li>
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
