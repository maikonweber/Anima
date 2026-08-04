"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";
import {
  useClinicTrialInviteByToken,
  useRedeemClinicTrialInvite,
  useRegisterWithClinicTrialInvite,
} from "@/hooks/use-clinic-trial-invites";
import { registerWithClinicTrialInviteSchema } from "@/lib/validations/clinic-trial-invites";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import type { ClinicTrialInviteByToken } from "@anima/shared";

function formatExpiry(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(iso));
}

function TrialContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { user, isLoading: authLoading, logout } = useAuth();
  const { data: offer, isLoading, error, refetch } =
    useClinicTrialInviteByToken(token);
  const redeemMutation = useRedeemClinicTrialInvite();
  const [redeemError, setRedeemError] = useState<string | null>(null);

  if (!token) {
    return (
      <AuthLayout
        title="Trial inválido"
        subtitle="O link não contém um token válido."
      >
        <p className="text-sm text-foreground/50 text-center">
          Peça um novo link à equipe EmotiveCare.
        </p>
      </AuthLayout>
    );
  }

  if (isLoading || authLoading) {
    return (
      <AuthLayout title="Carregando trial" subtitle="Aguarde um momento...">
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 rounded-full border-2 border-anima-violet/30 border-t-anima-violet animate-spin" />
        </div>
      </AuthLayout>
    );
  }

  if (error) {
    return (
      <AuthLayout
        title="Link não encontrado"
        subtitle="Não foi possível carregar o trial."
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

  const loginHref = `/login?redirect=${encodeURIComponent(`/trial?token=${token}`)}`;
  const redeemed = offer.status === "RESGATADO";
  const unavailable = !offer.canRedeem && !redeemed;

  async function handleRedeem() {
    if (!token) return;
    setRedeemError(null);
    try {
      await redeemMutation.mutateAsync(token);
      router.push("/clinic");
    } catch (err) {
      setRedeemError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível ativar o trial.",
      );
    }
  }

  const emailMismatch =
    !!user &&
    !!offer.emailBound &&
    !!offer.email &&
    user.email.toLowerCase() !== offer.email.toLowerCase();

  return (
    <AuthLayout
      title={offer.label?.trim() || "Trial Clínica EmotiveCare"}
      subtitle={
        redeemed
          ? "Seu trial já foi ativado."
          : unavailable
            ? "Este link não está mais disponível."
            : `${offer.trialDays} dias grátis no plano Cuidado.`
      }
    >
      <motion.div
        className="space-y-5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <OfferSummary offer={offer} />

        {unavailable && !redeemed && (
          <p className="text-sm text-red-400 text-center">
            O link expirou ou foi revogado. Peça um novo convite.
          </p>
        )}

        {redeemed && (
          <div className="text-center space-y-4">
            <p className="text-sm text-foreground/60">
              Trial já resgatado. Crie ou acesse sua clínica.
            </p>
            {user ? (
              <Link href="/clinic">
                <Button className="w-full">Ir para a clínica</Button>
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

            <TrialRegisterForm offer={offer} token={token} />
          </>
        )}

        {offer.canRedeem && user && (
          <div className="space-y-4">
            {emailMismatch ? (
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
                  Ativar {offer.trialDays} dias grátis
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

function OfferSummary({ offer }: { offer: ClinicTrialInviteByToken }) {
  return (
    <div className="rounded-xl bg-foreground/[0.04] border border-foreground/[0.08] p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-anima-violet font-semibold">
            Trial clínica
          </p>
          <p className="text-lg font-semibold text-foreground/90 mt-1">
            {offer.trialDays} dias grátis
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-anima-violet/15 px-3 py-1 text-xs font-medium text-anima-violet">
          Cuidado
        </span>
      </div>

      <ul className="text-sm text-foreground/65 space-y-1.5 list-disc pl-4">
        <li>Dashboard clínico e gestão de pacientes</li>
        <li>Alertas clínicos e sínteses com IA</li>
        <li>Agenda, teleconsulta e prontuário</li>
      </ul>

      <p className="text-xs text-foreground/40 pt-1 border-t border-foreground/[0.06]">
        {offer.emailBound && offer.email
          ? `E-mail do convite: ${offer.email}`
          : "Link aberto — uso único"}
        <br />
        Link válido até {formatExpiry(offer.linkExpiresAt)}
      </p>
    </div>
  );
}

function TrialRegisterForm({
  offer,
  token,
}: {
  offer: ClinicTrialInviteByToken;
  token: string;
}) {
  const router = useRouter();
  const { setSession } = useAuth();
  const registerMutation = useRegisterWithClinicTrialInvite();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState(offer.email ?? "");
  const [senha, setSenha] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const parsed = registerWithClinicTrialInviteSchema.safeParse({
      nome,
      email,
      senha,
    });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Verifique os campos.");
      return;
    }

    if (
      offer.emailBound &&
      offer.email &&
      parsed.data.email.toLowerCase() !== offer.email.toLowerCase()
    ) {
      setFormError("Use o mesmo e-mail indicado no convite.");
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
      router.push("/clinic");
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
        disabled={offer.emailBound && !!offer.email}
      />
      <Input
        label="Senha"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />

      <p className="text-xs text-foreground/40">
        Ao criar a conta, você ativa automaticamente {offer.trialDays} dias do
        plano Cuidado, sem cartão. Em seguida, crie sua clínica.
      </p>

      <Button
        type="submit"
        isLoading={registerMutation.isPending}
        className="mt-1"
      >
        Criar conta e ativar trial
      </Button>
    </form>
  );
}

export default function TrialPage() {
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
      <TrialContent />
    </Suspense>
  );
}
