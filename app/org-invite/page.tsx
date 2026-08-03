"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import {
  useAcceptOrganizationInvite,
  useOrganizationInviteByToken,
} from "@/hooks/use-organizations";
import { useAuth } from "@/providers/auth-provider";

function OrgInviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const inviteQuery = useOrganizationInviteByToken(token);
  const acceptInvite = useAcceptOrganizationInvite();

  useEffect(() => {
    if (!authLoading && !user && token) {
      router.replace(`/login?next=${encodeURIComponent(`/org-invite?token=${token}`)}`);
    }
  }, [authLoading, user, token, router]);

  if (!token) {
    return (
      <div className="glass-panel p-8 text-center">
        <p className="text-sm text-foreground/50">
          Token de convite ausente na URL.
        </p>
      </div>
    );
  }

  if (inviteQuery.isLoading || authLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 rounded-full border-2 border-anima-violet/30 border-t-anima-violet animate-spin" />
      </div>
    );
  }

  if (inviteQuery.error || !inviteQuery.data) {
    return (
      <ErrorMessage
        message="Convite inválido ou expirado."
        onRetry={() => inviteQuery.refetch()}
      />
    );
  }

  const invite = inviteQuery.data;

  async function handleAccept() {
    try {
      const result = await acceptInvite.mutateAsync(token!);
      if (invite.role === "PATIENT") {
        router.push("/dashboard/consents");
        return;
      }
      router.push(`/clinic/${result.organization.id}`);
    } catch {
      // surfaced via mutation error below
    }
  }

  return (
    <div className="glass-panel p-8 space-y-4">
      <h1 className="text-2xl font-bold text-foreground/90">
        Convite para clínica
      </h1>
      <p className="text-sm text-foreground/50">
        Você foi convidado para{" "}
        <strong className="text-foreground/80">
          {invite.organizationName || "uma clínica"}
        </strong>{" "}
        como <strong className="text-foreground/80">{invite.role}</strong>.
      </p>
      <p className="text-xs text-foreground/35">
        Status: {invite.status} · E-mail: {invite.email}
      </p>
      {acceptInvite.error && (
        <p className="text-xs text-red-400">
          {acceptInvite.error instanceof Error
            ? acceptInvite.error.message
            : "Não foi possível aceitar o convite."}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          onClick={handleAccept}
          isLoading={acceptInvite.isPending}
          disabled={!user || invite.status !== "PENDENTE"}
        >
          Aceitar convite
        </Button>
        <Link href="/clinic" className="sm:w-auto">
          <Button type="button" variant="secondary">
            Ir para clínicas
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrgInvitePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Suspense
          fallback={
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 rounded-full border-2 border-anima-violet/30 border-t-anima-violet animate-spin" />
            </div>
          }
        >
          <OrgInviteContent />
        </Suspense>
      </motion.div>
    </div>
  );
}
