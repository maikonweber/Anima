"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";
import {
  useAcceptInvite,
  useInviteByToken,
  useRegisterWithInvite,
} from "@/hooks/use-care";
import { registerWithInviteSchema } from "@/lib/validations/care";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { InviteStatusBadge } from "@/components/care/InviteStatusBadge";

function CareInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { user, isLoading: authLoading, setSession, logout } = useAuth();
  const { data: invite, isLoading, error, refetch } = useInviteByToken(token);
  const acceptMutation = useAcceptInvite();
  const registerMutation = useRegisterWithInvite();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  useEffect(() => {
    if (invite?.viewerEmail) {
      setEmail(invite.viewerEmail);
    }
  }, [invite?.viewerEmail]);

  if (!token) {
    return (
      <AuthLayout
        title="Convite inválido"
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
      <AuthLayout title="Carregando convite" subtitle="Aguarde um momento...">
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 rounded-full border-2 border-anima-violet/30 border-t-anima-violet animate-spin" />
        </div>
      </AuthLayout>
    );
  }

  if (error) {
    return (
      <AuthLayout title="Convite não encontrado" subtitle="Não foi possível carregar o convite.">
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

  if (!invite) return null;

  const revoked = invite.expirado || invite.status === "REVOGADO";
  const accepted = invite.status === "ACEITO";
  const pending = invite.status === "PENDENTE" && !invite.expirado;
  const loginHref = `/login?redirect=${encodeURIComponent(`/care-invite?token=${token}`)}`;

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const parsed = registerWithInviteSchema.safeParse({ nome, email, senha });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Verifique os campos.");
      return;
    }

    if (
      parsed.data.email.toLowerCase() !== invite!.viewerEmail.toLowerCase()
    ) {
      setFormError("Use o mesmo e-mail indicado no convite.");
      return;
    }

    try {
      const res = await registerMutation.mutateAsync({
        ...parsed.data,
        inviteToken: token!,
      });
      setSession({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        accessTokenExpiresIn: res.accessTokenExpiresIn,
        user: res.user,
      });
      router.push("/care/patients");
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível criar sua conta.",
      );
    }
  }

  async function handleAcceptClick() {
    if (!token) return;
    setAcceptError(null);
    try {
      await acceptMutation.mutateAsync(token);
      router.push("/care/patients");
    } catch (err) {
      setAcceptError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível aceitar o convite.",
      );
    }
  }

  return (
    <AuthLayout
      title="Convite de acompanhamento"
      subtitle={
        revoked
          ? "Este convite não está mais disponível."
          : `${invite.owner.nome} convidou você para acompanhar o dashboard emocional.`
      }
    >
      <motion.div
        className="space-y-5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="rounded-xl bg-foreground/[0.04] border border-foreground/[0.08] p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-foreground/70">
              Paciente: <strong>{invite.owner.nome}</strong>
            </p>
            <InviteStatusBadge status={invite.status} />
          </div>
          <p className="text-xs text-foreground/40">
            E-mail do convite: {invite.viewerEmail}
          </p>
        </div>

        {revoked && (
          <p className="text-sm text-red-400 text-center">
            Este convite foi revogado ou expirou. Peça um novo convite ao
            paciente.
          </p>
        )}

        {accepted && (
          <div className="text-center space-y-4">
            <p className="text-sm text-foreground/60">
              Este convite já foi aceito.
            </p>
            {user ? (
              <Link href="/care/patients">
                <Button className="w-full">Ver pacientes</Button>
              </Link>
            ) : (
              <Link href={loginHref}>
                <Button className="w-full">Entrar na conta</Button>
              </Link>
            )}
          </div>
        )}

        {pending && !user && (
          <>
            <Link href={loginHref}>
              <Button className="w-full" variant="secondary">
                Já tenho conta — Entrar e aceitar
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

              <Button
                type="submit"
                isLoading={registerMutation.isPending}
                className="mt-1"
              >
                Criar conta e aceitar
              </Button>
            </form>
          </>
        )}

        {pending && user && (
          <div className="space-y-4">
            {user.email.toLowerCase() !== invite.viewerEmail.toLowerCase() ? (
              <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-400">
                Você está logado como {user.email}. O e-mail da conta deve ser o
                mesmo do convite ({invite.viewerEmail}).{" "}
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
                {acceptMutation.isPending && (
                  <p className="text-sm text-foreground/50 text-center">
                    Aceitando convite...
                  </p>
                )}
                {acceptError && (
                  <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-400">
                    {acceptError}
                  </div>
                )}
                {!acceptMutation.isPending && (
                  <Button
                    className="w-full"
                    onClick={handleAcceptClick}
                    isLoading={acceptMutation.isPending}
                  >
                    Aceitar convite
                  </Button>
                )}
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

export default function CareInvitePage() {
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
      <CareInviteContent />
    </Suspense>
  );
}
