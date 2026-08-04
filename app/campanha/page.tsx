"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";
import {
  useMarketingOfferByToken,
  useRedeemMarketingCampaign,
  useRegisterWithMarketingCampaign,
} from "@/hooks/use-marketing";
import { registerWithMarketingCampaignSchema } from "@/lib/validations/marketing";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { MarketingOfferByToken } from "@anima/shared";

const PLAN_LABELS: Record<string, string> = {
  cuidado: "Cuidado (Profissional)",
  pleno: "Pleno (Paciente)",
};

function postRedeemPath(planSlug: string): string {
  return planSlug === "cuidado" ? "/clinic" : "/dashboard";
}

function formatExpiry(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(iso));
}

function CampanhaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { user, isLoading: authLoading, logout } = useAuth();
  const { data: offer, isLoading, error, refetch } =
    useMarketingOfferByToken(token);
  const redeemMutation = useRedeemMarketingCampaign();
  const [redeemError, setRedeemError] = useState<string | null>(null);

  if (!token) {
    return (
      <AuthLayout
        title="Campanha inválida"
        subtitle="O link não contém um token válido."
      >
        <p className="text-sm text-foreground/50 text-center">
          Verifique o link enviado por e-mail ou peça um novo convite.
        </p>
      </AuthLayout>
    );
  }

  if (isLoading || authLoading) {
    return (
      <AuthLayout title="Carregando oferta" subtitle="Aguarde um momento...">
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 rounded-full border-2 border-anima-violet/30 border-t-anima-violet animate-spin" />
        </div>
      </AuthLayout>
    );
  }

  if (error) {
    return (
      <AuthLayout
        title="Oferta não encontrada"
        subtitle="Não foi possível carregar a campanha."
      >
        <ErrorMessage
          message={
            error instanceof ApiError
              ? error.message
              : "Link inválido ou expirado."
          }
          onRetry={() => refetch()}
        />
      </AuthLayout>
    );
  }

  if (!offer) return null;

  const loginHref = `/login?redirect=${encodeURIComponent(`/campanha?token=${token}`)}`;
  const redeemed = offer.status === "RESGATADO";
  const unavailable = !offer.canRedeem && !redeemed;
  const planLabel =
    PLAN_LABELS[offer.campaign.planSlug] ?? offer.campaign.planSlug;

  async function handleRedeem() {
    if (!token) return;
    setRedeemError(null);
    try {
      const result = await redeemMutation.mutateAsync(token);
      router.push(postRedeemPath(result.planSlug));
    } catch (err) {
      setRedeemError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível ativar o acesso promocional.",
      );
    }
  }

  return (
    <AuthLayout
      title={offer.campaign.nome}
      subtitle={
        redeemed
          ? "Seu acesso promocional já foi ativado."
          : unavailable
            ? "Esta oferta não está mais disponível."
            : `${offer.campaign.trialDays} dias grátis no plano ${planLabel}.`
      }
    >
      <motion.div
        className="space-y-5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <OfferSummary offer={offer} planLabel={planLabel} />

        {unavailable && !redeemed && (
          <p className="text-sm text-red-400 text-center">
            O link expirou ou a campanha foi encerrada. Entre em contato com
            quem enviou o convite.
          </p>
        )}

        {redeemed && (
          <div className="text-center space-y-4">
            <p className="text-sm text-foreground/60">
              Você já resgatou esta oferta.
            </p>
            {user ? (
              <Link href={postRedeemPath(offer.campaign.planSlug)}>
                <Button className="w-full">Ir para a plataforma</Button>
              </Link>
            ) : (
              <Link href={loginHref}>
                <Button className="w-full">Entrar na conta</Button>
              </Link>
            )}
          </div>
        )}

        {offer.canRedeem && !user && (
          <>
            <Link href={loginHref}>
              <Button className="w-full" variant="secondary">
                Já tenho conta — Entrar e ativar
              </Button>
            </Link>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-foreground/[0.06]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-3 text-foreground/30">
                  ou criar conta
                </span>
              </div>
            </div>

            <CampaignRegisterForm offer={offer} token={token} />
          </>
        )}

        {offer.canRedeem && user && (
          <div className="space-y-4">
            {user.email.toLowerCase() !== offer.email.toLowerCase() ? (
              <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-400">
                Você está logado como {user.email}. O e-mail da conta deve ser o
                mesmo do convite ({offer.email}).{" "}
                <button
                  type="button"
                  onClick={() => logout()}
                  className="underline text-anima-violet"
                >
                  Sair e usar outra conta
                </button>
              </div>
            ) : (
              <>
                {redeemError && (
                  <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-400">
                    {redeemError}
                  </div>
                )}
                <Button
                  className="w-full"
                  onClick={handleRedeem}
                  isLoading={redeemMutation.isPending}
                >
                  Ativar {offer.campaign.trialDays} dias grátis
                </Button>
              </>
            )}
            <p className="text-xs text-center text-foreground/35">
              Logado como {user.email}
            </p>
          </div>
        )}
      </motion.div>
    </AuthLayout>
  );
}

function OfferSummary({
  offer,
  planLabel,
}: {
  offer: MarketingOfferByToken;
  planLabel: string;
}) {
  return (
    <div className="rounded-xl bg-foreground/[0.04] border border-foreground/[0.08] p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-anima-violet font-semibold">
            Oferta promocional
          </p>
          <p className="text-lg font-semibold text-foreground/90 mt-1">
            {offer.campaign.trialDays} dias grátis
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-anima-violet/15 px-3 py-1 text-xs font-medium text-anima-violet">
          {planLabel}
        </span>
      </div>

      <ul className="text-sm text-foreground/65 space-y-1.5 list-disc pl-4">
        {offer.campaign.planSlug === "cuidado" ? (
          <>
            <li>Dashboard clínico e gestão de pacientes</li>
            <li>Alertas clínicos e sínteses com IA</li>
            <li>Agenda, teleconsulta e prontuário</li>
          </>
        ) : (
          <>
            <li>Diário emocional ilimitado</li>
            <li>Análises de IA e assistente terapêutico</li>
            <li>Vínculo com profissionais de saúde</li>
          </>
        )}
      </ul>

      <p className="text-xs text-foreground/40 pt-1 border-t border-foreground/[0.06]">
        E-mail do convite: {offer.email}
        <br />
        Link válido até {formatExpiry(offer.linkExpiresAt)}
      </p>
    </div>
  );
}

function CampaignRegisterForm({
  offer,
  token,
}: {
  offer: MarketingOfferByToken;
  token: string;
}) {
  const router = useRouter();
  const { setSession } = useAuth();
  const registerMutation = useRegisterWithMarketingCampaign();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState(offer.email ?? "");
  const [senha, setSenha] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const parsed = registerWithMarketingCampaignSchema.safeParse({
      nome,
      email,
      senha,
    });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Verifique os campos.");
      return;
    }

    if (parsed.data.email.toLowerCase() !== offer.email.toLowerCase()) {
      setFormError("Use o mesmo e-mail indicado no convite da campanha.");
      return;
    }

    try {
      const res = await registerMutation.mutateAsync({
        ...parsed.data,
        token,
      });
      setSession({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        accessTokenExpiresIn: res.accessTokenExpiresIn,
        user: res.user,
      });
      router.push(postRedeemPath(res.redemption.planSlug));
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível criar sua conta.",
      );
    }
  }

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-3">
      {formError && (
        <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-400">
          {formError}
        </div>
      )}

      <Input
        label="Nome"
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Senha"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />

      <p className="text-xs text-foreground/40">
        Ao criar a conta, você ativa automaticamente{" "}
        {offer.campaign.trialDays} dias do plano{" "}
        {PLAN_LABELS[offer.campaign.planSlug] ?? offer.campaign.planSlug}, sem
        cartão de crédito.
      </p>

      <Button
        type="submit"
        isLoading={registerMutation.isPending}
        className="mt-1"
      >
        Criar conta e ativar oferta
      </Button>
    </form>
  );
}

export default function CampanhaPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout title="Carregando" subtitle="Aguarde...">
          <div className="py-8 text-center text-sm text-foreground/40">
            Carregando...
          </div>
        </AuthLayout>
      }
    >
      <CampanhaContent />
    </Suspense>
  );
}
