"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  ApiError,
  FEEDBACK_TYPE_OPTIONS,
  type FeedbackType,
} from "@anima/shared";
import {
  reserveFeedbackAttachment,
  submitFeedback,
  uploadFeedbackAttachment,
} from "@/lib/api/feedback";
import { feedbackSchema } from "@/lib/validations/feedback";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function SuportePage() {
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [type, setType] = useState<FeedbackType>("support");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [contactPrefillDone, setContactPrefillDone] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [protocolId, setProtocolId] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    if (!contactPrefillDone && user?.email) {
      setContact(user.email);
      setContactPrefillDone(true);
    }
  }, [user?.email, contactPrefillDone]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setErrorMessage(null);
    setProtocolId(null);

    const parsed = feedbackSchema.safeParse({
      type,
      subject,
      message,
      contact,
    });

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!next[key]) next[key] = issue.message;
      }
      setFieldErrors(next);
      setStatus("error");
      return;
    }

    const search = searchParams.toString();
    const page = `${pathname}${search ? `?${search}` : ""}`.slice(0, 2048);

    setStatus("loading");

    try {
      const attachmentIds: string[] = [];
      for (const image of images) {
        const reservation = await reserveFeedbackAttachment(image);
        await uploadFeedbackAttachment(image, reservation);
        attachmentIds.push(reservation.objectId);
      }
      const payload = {
        type: parsed.data.type,
        message: parsed.data.message,
        ...(parsed.data.subject ? { subject: parsed.data.subject } : {}),
        ...(parsed.data.contact ? { contact: parsed.data.contact } : {}),
        page,
        metadata: {
          frontend: "anima-web",
          language:
            typeof navigator !== "undefined" ? navigator.language : "pt-BR",
          viewportWidth:
            typeof window !== "undefined" ? window.innerWidth : null,
          viewportHeight:
            typeof window !== "undefined" ? window.innerHeight : null,
        },
        ...(attachmentIds.length ? { attachmentIds } : {}),
      };
      const res = await submitFeedback(payload);
      if (!res?.ok) {
        throw new Error("Resposta inválida do servidor.");
      }
      setStatus("success");
      setProtocolId(res.id ?? null);
      setMessage("");
      setSubject("");
      setImages([]);
    } catch (err) {
      setStatus("error");
      if (err instanceof ApiError) {
        if (err.status === 400) {
          setErrorMessage(
            err.message || "Verifique os campos e tente novamente.",
          );
          return;
        }
        if (err.status === 502 || err.status === 503 || err.status === 504) {
          setErrorMessage(
            "Não foi possível enviar agora. Tente novamente em instantes.",
          );
          return;
        }
        setErrorMessage(
          err.message || "Não foi possível enviar. Tente novamente.",
        );
        return;
      }
      setErrorMessage("Não foi possível enviar. Tente novamente.");
    }
  }

  const isLoading = status === "loading";

  function handleImages(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
    const invalid = selected.find(
      (file) => !allowed.has(file.type) || file.size > 5 * 1024 * 1024,
    );
    if (invalid) {
      setErrorMessage("Use JPEG, PNG ou WebP com no máximo 5 MB por imagem.");
      event.target.value = "";
      return;
    }
    setImages((current) => [...current, ...selected].slice(0, 3));
    event.target.value = "";
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
          Suporte e feedback
        </h1>
        <p className="text-sm text-foreground/40 mb-8">
          Conte o que aconteceu, faça uma pergunta ou envie uma sugestão. Nossa
          equipe recebe pelo canal interno — não compartilhe senhas nem tokens.
        </p>

        <form
          onSubmit={handleSubmit}
          className="glass-panel p-5 sm:p-6 flex flex-col gap-4"
        >
          {status === "success" && (
            <div className="rounded-lg bg-anima-violet/10 border border-anima-violet/20 px-4 py-3 text-sm text-anima-violet">
              Mensagem enviada com sucesso.
              {protocolId ? (
                <span className="block mt-1 text-foreground/50">
                  Protocolo: {protocolId}
                </span>
              ) : null}
            </div>
          )}

          {errorMessage && (
            <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-400">
              {errorMessage}
            </div>
          )}

          <div className="w-full">
            <label
              htmlFor="feedback-type"
              className="block text-sm font-medium text-foreground/60 mb-1.5"
            >
              Tipo
            </label>
            <Select
              id="feedback-type"
              value={type}
              onChange={(e) => setType(e.target.value as FeedbackType)}
              disabled={isLoading}
              required
            >
              {FEEDBACK_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
            {fieldErrors.type && (
              <p className="mt-1.5 text-xs text-red-400">{fieldErrors.type}</p>
            )}
          </div>

          <Input
            label="Assunto (opcional)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            maxLength={120}
            disabled={isLoading}
            placeholder="Resumo curto"
            error={fieldErrors.subject}
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-foreground/60 mb-1.5">
              Imagens (opcional, até 3)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={isLoading || images.length >= 3}
              onChange={handleImages}
              className="block w-full text-sm text-foreground/60 file:mr-3 file:rounded-lg file:border-0 file:px-3 file:py-2 file:bg-anima-violet/10 file:text-anima-violet"
            />
            {images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {images.map((file, index) => (
                  <button
                    key={`${file.name}-${file.lastModified}-${index}`}
                    type="button"
                    disabled={isLoading}
                    onClick={() =>
                      setImages((current) =>
                        current.filter((_, currentIndex) => currentIndex !== index),
                      )
                    }
                    className="rounded-lg border border-foreground/10 px-2 py-1 text-xs text-foreground/60"
                    title="Remover imagem"
                  >
                    {file.name} ×
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full">
            <label
              htmlFor="feedback-message"
              className="block text-sm font-medium text-foreground/60 mb-1.5"
            >
              Mensagem
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
              required
              minLength={10}
              maxLength={4000}
              rows={6}
              placeholder="Descreva com o máximo de detalhes úteis."
              className={`
                w-full rounded-xl px-4 py-3 text-sm resize-y min-h-[9rem]
                bg-foreground/[0.03] border border-foreground/[0.08]
                text-foreground/90 placeholder:text-foreground/25
                focus:outline-none focus:ring-2 focus:ring-anima-violet/30 focus:border-anima-violet/40
                transition-all duration-200
                ${fieldErrors.message ? "border-red-400/60 focus:ring-red-400/30" : ""}
              `}
            />
            <div className="mt-1.5 flex items-center justify-between gap-3">
              {fieldErrors.message ? (
                <p className="text-xs text-red-400">{fieldErrors.message}</p>
              ) : (
                <span />
              )}
              <p className="text-xs text-foreground/35 tabular-nums shrink-0">
                {message.length}/4000
              </p>
            </div>
          </div>

          <Input
            label="Contato (opcional)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            maxLength={254}
            disabled={isLoading}
            placeholder="E-mail ou outra forma de retorno"
            error={fieldErrors.contact}
          />

          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            Enviar
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
