"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { ApiError } from "@/lib/api-client";
import {
  useHomeTestimonialInviteByToken,
  useSubmitHomeTestimonialInvite,
} from "@/hooks/use-home-testimonials";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Falha ao ler a imagem."));
    };
    reader.onerror = () => reject(new Error("Falha ao ler a imagem."));
    reader.readAsDataURL(file);
  });
}

function DepoimentoContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { data: invite, isLoading, error, refetch } =
    useHomeTestimonialInviteByToken(token);
  const submitMutation = useSubmitHomeTestimonialInvite();

  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [quote, setQuote] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!invite) return;
    setAuthorName((prev) => prev || invite.authorNameHint || "");
    setAuthorRole((prev) => prev || invite.authorRoleHint || "");
  }, [invite]);

  if (!token) {
    return (
      <AuthLayout title="Link inválido" subtitle="Este link não contém um token.">
        <p className="text-sm text-foreground/50 text-center">
          Peça um novo link à equipe EmotiveCare.
        </p>
      </AuthLayout>
    );
  }

  if (isLoading) {
    return (
      <AuthLayout title="Carregando" subtitle="Aguarde um momento...">
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 rounded-full border-2 border-anima-violet/30 border-t-anima-violet animate-spin" />
        </div>
      </AuthLayout>
    );
  }

  if (error) {
    return (
      <AuthLayout title="Link não encontrado" subtitle="Não foi possível validar o convite.">
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

  if (submitted) {
    return (
      <AuthLayout
        title="Depoimento enviado!"
        subtitle="Obrigado por compartilhar sua experiência."
      >
        <p className="text-sm text-foreground/60 text-center leading-relaxed">
          Recebemos seu depoimento. Nossa equipe revisará antes de publicar na
          home do EmotiveCare.
        </p>
      </AuthLayout>
    );
  }

  if (!invite.canSubmit) {
    return (
      <AuthLayout
        title="Link indisponível"
        subtitle={`Status: ${invite.status}`}
      >
        <p className="text-sm text-foreground/50 text-center">
          Este link já foi usado, expirou ou foi revogado.
        </p>
      </AuthLayout>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setFormError(null);

    if (!authorName.trim() || !quote.trim()) {
      setFormError("Preencha nome e depoimento.");
      return;
    }

    try {
      let photoBase64: string | undefined;
      if (photoFile) {
        photoBase64 = await fileToDataUrl(photoFile);
      }

      await submitMutation.mutateAsync({
        token,
        authorName: authorName.trim(),
        authorRole: authorRole.trim() || undefined,
        quote: quote.trim(),
        photoBase64,
      });
      setSubmitted(true);
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível enviar o depoimento.",
      );
    }
  }

  const prefilledName = authorName;
  const prefilledRole = authorRole;

  return (
    <AuthLayout
      title="Compartilhe sua experiência"
      subtitle={
        invite.label
          ? invite.label
          : "Conte como a EmotiveCare faz diferença para você."
      }
    >
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {formError ? (
          <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-400">
            {formError}
          </div>
        ) : null}

        <Input
          label="Seu nome"
          value={prefilledName}
          onChange={(e) => setAuthorName(e.target.value)}
          required
        />
        <Input
          label="Cargo / contexto (opcional)"
          value={prefilledRole}
          onChange={(e) => setAuthorRole(e.target.value)}
          placeholder="Ex.: Psicóloga · Clínica X"
        />

        <label className="block text-sm">
          <span className="mb-1.5 block text-foreground/70">Seu depoimento</span>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            required
            rows={5}
            placeholder="Conte em poucas linhas como você usa a plataforma..."
            className="w-full rounded-xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2 text-sm outline-none focus:border-anima-violet/40"
          />
        </label>

        <label className="block text-sm text-foreground/70">
          <span className="mb-1.5 block">Sua foto (opcional, max 2 MB)</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            className="block w-full text-xs text-foreground/50 file:mr-3 file:rounded-lg file:border-0 file:bg-anima-violet/15 file:px-3 file:py-2 file:text-xs file:text-anima-violet"
          />
        </label>

        <p className="text-xs text-foreground/40">
          Ao enviar, você autoriza a publicação do depoimento na home do
          EmotiveCare após revisão da equipe.
        </p>

        <Button type="submit" isLoading={submitMutation.isPending} className="w-full">
          Enviar depoimento
        </Button>
      </motion.form>
    </AuthLayout>
  );
}

export default function DepoimentoPage() {
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
      <DepoimentoContent />
    </Suspense>
  );
}
