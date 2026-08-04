"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";
import {
  useAcceptPatientAppInvite,
  usePatientAppInviteByToken,
} from "@/hooks/use-patients";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

function PatientInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { user, isLoading: authLoading } = useAuth();
  const inviteQuery = usePatientAppInviteByToken(token);
  const acceptMutation = useAcceptPatientAppInvite();
  const [acceptError, setAcceptError] = useState<string | null>(null);

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

  if (inviteQuery.isLoading || authLoading) {
    return (
      <AuthLayout title="Carregando convite" subtitle="Aguarde um momento...">
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 rounded-full border-2 border-anima-violet/30 border-t-anima-violet animate-spin" />
        </div>
      </AuthLayout>
    );
  }

  if (inviteQuery.error || !inviteQuery.data) {
    return (
      <AuthLayout
        title="Convite não encontrado"
        subtitle="Não foi possível carregar o convite."
      >
        <ErrorMessage
          message={
            inviteQuery.error instanceof ApiError
              ? inviteQuery.error.message
              : "Link inválido ou expirado."
          }
          onRetry={() => inviteQuery.refetch()}
        />
      </AuthLayout>
    );
  }

  const invite = inviteQuery.data;
  const pending = invite.status === "PENDENTE" && !invite.expirado;
  const loginHref = `/login?redirect=${encodeURIComponent(`/patient-invite?token=${token}`)}`;
  const registerHref = `/register?redirect=${encodeURIComponent(`/patient-invite?token=${token}`)}`;

  async function handleAccept() {
    if (!token) return;
    setAcceptError(null);
    try {
      await acceptMutation.mutateAsync({ token });
      router.push("/dashboard/perfil");
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
      title="Vínculo com a clínica"
      subtitle={`${invite.organization.name} convidou você a se conectar no app.`}
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-4 space-y-2">
          <p className="text-sm text-foreground/70">
            <strong className="text-foreground/85">{invite.inviter.nome}</strong>{" "}
            convidou{" "}
            <strong className="text-foreground/85">
              {invite.patient.fullName}
            </strong>
            .
          </p>
          <p className="text-xs text-foreground/45">
            E-mail do convite: {invite.email}
          </p>
          {invite.grantPleno && (
            <p className="text-xs text-foreground/55">
              Ao aceitar, você recebe os benefícios do plano Pleno enquanto o
              vínculo com o profissional estiver ativo.
            </p>
          )}
          <p className="text-[11px] text-foreground/35">Status: {invite.status}</p>
        </div>

        {invite.expirado || invite.status !== "PENDENTE" ? (
          <p className="text-sm text-foreground/50 text-center">
            Este convite não está mais disponível.
          </p>
        ) : !user ? (
          <div className="space-y-3">
            <p className="text-sm text-foreground/55 text-center">
              Entre com a conta do e-mail convidado para aceitar.
            </p>
            <Link href={loginHref}>
              <Button className="w-full">Entrar e aceitar</Button>
            </Link>
            <Link
              href={registerHref}
              className="block text-center text-sm text-anima-violet hover:text-anima-lilac"
            >
              Criar conta
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {acceptError && (
              <p className="text-xs text-red-500 text-center">{acceptError}</p>
            )}
            <Button
              type="button"
              className="w-full"
              isLoading={acceptMutation.isPending}
              disabled={!pending}
              onClick={() => void handleAccept()}
            >
              Aceitar vínculo
            </Button>
            <p className="text-[11px] text-foreground/35 text-center">
              Logado como {user.email}. Você pode se desvincular depois em
              Perfil.
            </p>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}

export default function PatientInvitePage() {
  return (
    <Suspense
      fallback={
        <AuthLayout title="Carregando" subtitle="Aguarde...">
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 rounded-full border-2 border-anima-violet/30 border-t-anima-violet animate-spin" />
          </div>
        </AuthLayout>
      }
    >
      <PatientInviteContent />
    </Suspense>
  );
}
