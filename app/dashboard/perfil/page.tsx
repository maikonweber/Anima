"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { SponsoredBenefitBadge } from "@/components/subscription/SponsoredBenefitBadge";
import { SubscriptionUsagePanel } from "@/components/subscription/SubscriptionUsagePanel";
import { UsageMeter } from "@/components/subscription/UsageMeter";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/lib/api-client";
import { deleteAccountApi } from "@/lib/api/auth";
import { clearAuth } from "@/lib/auth/storage";
import { useAuth } from "@/providers/auth-provider";
import { useSubscription } from "@/providers/subscription-provider";

export default function PerfilPage() {
  const router = useRouter();
  const { user, logout, getToken, refreshUser } = useAuth();
  const {
    subscription,
    planSlug,
    hasPaidSubscription,
    sponsoredByPsychologist,
    shouldSuggestUpgrade,
    isPreviewPlan,
    previewMode,
  } = useSubscription();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const planNome = subscription?.plan.nome ?? "Essencial";
  const displayPlanNome =
    isPreviewPlan || planSlug === "preview"
      ? `${planNome} (demonstração)`
      : planNome;
  const statusLabel = getStatusLabel(subscription?.status);
  const needsPassword = user?.hasPassword !== false;

  async function handleDeleteAccount() {
    setDeleteError(null);
    if (!user?.email) return;

    if (
      confirmationEmail.trim().toLowerCase() !== user.email.trim().toLowerCase()
    ) {
      setDeleteError("Digite o e-mail da conta exatamente para confirmar.");
      return;
    }

    if (needsPassword && !senha) {
      setDeleteError("Informe sua senha para confirmar.");
      return;
    }

    const token = getToken();
    if (!token) {
      setDeleteError("Sessão expirada. Entre novamente.");
      return;
    }

    setDeleting(true);
    try {
      await deleteAccountApi({
        confirmationEmail: confirmationEmail.trim(),
        senha: needsPassword ? senha : undefined,
        token,
      });
      clearAuth();
      router.replace("/login");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Não foi possível excluir a conta. Tente novamente.";
      setDeleteError(message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-8">
          Perfil
        </h1>
      </motion.div>

      <motion.div
        className="glass-panel p-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-anima-violet/15 flex items-center justify-center">
            <span className="text-xl font-bold text-anima-violet">
              {user?.nome?.charAt(0) ?? "U"}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground/80">
              {user?.nome}
            </h2>
            <p className="text-sm text-foreground/40">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-3 border-t border-foreground/[0.06] pt-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/50">Nome</span>
            <span className="text-sm font-medium text-foreground/70">
              {user?.nome}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-foreground/50">Email</span>
            <span className="text-sm font-medium text-foreground/70">
              {user?.email}
            </span>
          </div>
          <div className="pt-2">
            <Link
              href="/dashboard/consents"
              className="text-sm text-anima-violet hover:text-anima-lilac transition-colors"
            >
              Gerenciar consentimentos com clínicas →
            </Link>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="glass-panel p-6 mt-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <h2 className="text-sm font-semibold text-foreground/70 mb-4">
          Seu plano
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-anima-violet/10 text-anima-violet">
                {displayPlanNome}
              </span>
              {sponsoredByPsychologist && <SponsoredBenefitBadge />}
            </div>
            {sponsoredByPsychologist && (
              <p className="text-[10px] text-foreground/45 max-w-xs">
                Você permanece no plano gratuito, com limites ampliados pelo
                vínculo com seu profissional — conforme retornado pela API.
              </p>
            )}
            {(previewMode || isPreviewPlan) && (
              <p className="text-[10px] text-foreground/40">
                Modo demonstração ativo.
              </p>
            )}
            {statusLabel && (
              <p className="text-[10px] text-foreground/35">{statusLabel}</p>
            )}
          </div>
          <Link
            href="/assinatura"
            className="text-sm text-anima-violet hover:text-anima-lilac transition-colors"
          >
            Ver planos →
          </Link>
        </div>

        {subscription?.usage && (
          <div className="space-y-3 mb-4">
            <UsageMeter
              label="Momentos registrados este mês"
              used={subscription.usage.diaryEntries.used}
              limit={subscription.usage.diaryEntries.limit}
            />
            <UsageMeter
              label="Insights SENTIO AI este mês"
              used={subscription.usage.aiAnalyses.used}
              limit={subscription.usage.aiAnalyses.limit}
            />
          </div>
        )}

        {hasPaidSubscription && (
          <Link href="/assinatura/gerenciar">
            <Button variant="secondary">Gerenciar assinatura</Button>
          </Link>
        )}

        {shouldSuggestUpgrade && (
          <Link href="/assinatura" className="block mt-2">
            <Button>Fazer upgrade</Button>
          </Link>
        )}
      </motion.div>

      {subscription?.usage && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <SubscriptionUsagePanel usage={subscription.usage} />
        </motion.div>
      )}

      <motion.div
        className="glass-panel p-6 mt-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-sm font-semibold text-foreground/70 mb-2">
          Precisa de ajuda?
        </h2>
        <p className="text-sm text-foreground/40 mb-4">
          Envie uma dúvida, reporte um problema ou sugestão para a equipe.
        </p>
        <Link href="/suporte">
          <Button variant="secondary">Suporte e feedback</Button>
        </Link>
      </motion.div>

      <motion.div
        className="glass-panel p-6 mt-6 border border-red-500/15"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <h2 className="text-sm font-semibold text-red-400/90 mb-2">
          Zona de risco
        </h2>
        <p className="text-sm text-foreground/40 mb-4">
          Excluir a conta remove seu diário, sessões do assistente e dados
          pessoais do app. Prontuários e registros clínicos em clínicas podem
          ser retidos por obrigação legal.
        </p>

        {!deleteOpen ? (
          <Button
            variant="ghost"
            className="!text-red-400 hover:!bg-red-500/5"
            onClick={() => {
              setDeleteOpen(true);
              setDeleteError(null);
              setConfirmationEmail("");
              setSenha("");
              void refreshUser();
            }}
          >
            Excluir dados e conta
          </Button>
        ) : (
          <div className="space-y-3">
            <Input
              label="Digite seu e-mail para confirmar"
              type="email"
              autoComplete="email"
              value={confirmationEmail}
              onChange={(e) => setConfirmationEmail(e.target.value)}
              placeholder={user?.email}
            />
            {needsPassword && (
              <Input
                label="Senha"
                type="password"
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            )}
            {deleteError && (
              <p className="text-xs text-red-400">{deleteError}</p>
            )}
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="ghost"
                className="!text-red-400 hover:!bg-red-500/10 sm:flex-1"
                isLoading={deleting}
                onClick={() => void handleDeleteAccount()}
              >
                Confirmar exclusão permanente
              </Button>
              <Button
                variant="secondary"
                className="sm:flex-1"
                disabled={deleting}
                onClick={() => {
                  setDeleteOpen(false);
                  setDeleteError(null);
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          variant="ghost"
          onClick={logout}
          className="!text-red-400 hover:!bg-red-500/5"
        >
          Sair da conta
        </Button>
      </motion.div>
    </div>
  );
}

function getStatusLabel(status: string | undefined): string | null {
  if (!status || status === "active") return null;
  const labels: Record<string, string> = {
    trialing: "Período de teste",
    past_due: "Pagamento pendente — limites do Essencial",
    canceled: "Cancelada — limites do Essencial",
  };
  return labels[status] ?? null;
}
