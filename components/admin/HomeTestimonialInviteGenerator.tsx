"use client";

import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api-client";
import {
  useCreateHomeTestimonialInvites,
  useHomeTestimonialInvitesAdmin,
  useRevokeHomeTestimonialInvite,
  useSendHomeTestimonialInviteEmail,
} from "@/hooks/use-home-testimonials";
import type { HomeTestimonialInvitePublic } from "@anima/shared";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CopyBlock } from "@/components/admin/CopyBlock";

type GeneratorForm = {
  label: string;
  authorNameHint: string;
  authorRoleHint: string;
  expiresInDays: string;
  quantity: string;
  emailsText: string;
};

const EMPTY: GeneratorForm = {
  label: "",
  authorNameHint: "",
  authorRoleHint: "",
  expiresInDays: "30",
  quantity: "1",
  emailsText: "",
};

function parseEmails(text: string): string[] {
  return [
    ...new Set(
      text
        .split(/[\n,;]+/)
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

export function HomeTestimonialInviteGenerator() {
  const { data: invites, refetch } = useHomeTestimonialInvitesAdmin();
  const createMutation = useCreateHomeTestimonialInvites();
  const revokeMutation = useRevokeHomeTestimonialInvite();
  const sendMutation = useSendHomeTestimonialInviteEmail();

  const [form, setForm] = useState<GeneratorForm>(EMPTY);
  const [generated, setGenerated] = useState<HomeTestimonialInvitePublic[]>(
    [],
  );
  const [emailSummary, setEmailSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resendEmail, setResendEmail] = useState<Record<string, string>>({});

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setGenerated([]);
    setEmailSummary(null);

    const expiresInDays = Number.parseInt(form.expiresInDays, 10);
    const emails = parseEmails(form.emailsText);

    if (Number.isNaN(expiresInDays) || expiresInDays < 1) {
      setError("Validade deve ser ≥ 1 dia.");
      return;
    }

    const quantity = emails.length
      ? emails.length
      : Number.parseInt(form.quantity, 10);

    if (!emails.length && (Number.isNaN(quantity) || quantity < 1)) {
      setError("Quantidade deve ser ≥ 1.");
      return;
    }

    try {
      const res = await createMutation.mutateAsync({
        label: form.label.trim() || undefined,
        authorNameHint: form.authorNameHint.trim() || undefined,
        authorRoleHint: form.authorRoleHint.trim() || undefined,
        expiresInDays,
        quantity: emails.length ? undefined : quantity,
        emails: emails.length ? emails : undefined,
      });
      setGenerated(res.invites);
      if (res.emailResults?.length) {
        const sent = res.emailResults.filter((r) => r.status === "sent").length;
        const failed = res.emailResults.length - sent;
        setEmailSummary(
          failed > 0
            ? `${sent} e-mail(s) enviado(s), ${failed} falha(s).`
            : `${sent} e-mail(s) enviado(s) com sucesso.`,
        );
      }
      await refetch();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Falha ao gerar links.",
      );
    }
  }

  async function handleRevoke(id: string) {
    if (!window.confirm("Revogar este link?")) return;
    try {
      await revokeMutation.mutateAsync(id);
      await refetch();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Falha ao revogar link.",
      );
    }
  }

  async function handleSendEmail(invite: HomeTestimonialInvitePublic) {
    setError(null);
    const email = (resendEmail[invite.id] ?? invite.email ?? "").trim();
    if (!email) {
      setError("Informe o e-mail para enviar o convite.");
      return;
    }
    try {
      await sendMutation.mutateAsync({ id: invite.id, email });
      await refetch();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Falha ao enviar e-mail.",
      );
    }
  }

  const pendingInvites =
    invites?.filter((i) => i.status === "PENDENTE") ?? [];

  return (
    <section className="space-y-5 rounded-2xl border border-anima-violet/20 bg-anima-violet/[0.04] p-5">
      <div>
        <h2 className="text-sm font-medium text-white/85">
          Gerador de links e e-mails
        </h2>
        <p className="mt-1 text-xs text-white/45 max-w-2xl">
          Gere links únicos ou envie convites por e-mail. Depoimentos chegam como{" "}
          <strong className="text-white/60">inativos</strong> — você revisa e
          ativa na lista abaixo.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="grid gap-3 sm:grid-cols-2">
        {error ? (
          <div className="sm:col-span-2 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}
        {emailSummary ? (
          <div className="sm:col-span-2 rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {emailSummary}
          </div>
        ) : null}

        <Input
          label="Rótulo interno (opcional)"
          value={form.label}
          onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
          placeholder="Ex.: Dr. Ana — março"
        />
        <Input
          label="Nome sugerido (opcional)"
          value={form.authorNameHint}
          onChange={(e) =>
            setForm((p) => ({ ...p, authorNameHint: e.target.value }))
          }
        />
        <Input
          label="Cargo sugerido (opcional)"
          value={form.authorRoleHint}
          onChange={(e) =>
            setForm((p) => ({ ...p, authorRoleHint: e.target.value }))
          }
          placeholder="Ex.: Psicóloga"
        />
        <Input
          label="Validade (dias)"
          type="number"
          min={1}
          value={form.expiresInDays}
          onChange={(e) =>
            setForm((p) => ({ ...p, expiresInDays: e.target.value }))
          }
        />

        <label className="block text-sm sm:col-span-2">
          <span className="mb-1.5 block text-foreground/70">
            E-mails para enviar convite (opcional)
          </span>
          <textarea
            value={form.emailsText}
            onChange={(e) =>
              setForm((p) => ({ ...p, emailsText: e.target.value }))
            }
            rows={3}
            placeholder={"psicologo@clinica.com\noutro@email.com"}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/90 outline-none focus:border-anima-violet/40"
          />
          <span className="mt-1 block text-[11px] text-white/35">
            Um e-mail por linha (ou separados por vírgula). Se informado, envia
            automaticamente e ignora a quantidade.
          </span>
        </label>

        {!form.emailsText.trim() ? (
          <Input
            label="Quantidade de links (sem e-mail)"
            type="number"
            min={1}
            max={50}
            value={form.quantity}
            onChange={(e) =>
              setForm((p) => ({ ...p, quantity: e.target.value }))
            }
          />
        ) : null}

        <div className="sm:col-span-2 flex flex-wrap gap-2">
          <Button type="submit" isLoading={createMutation.isPending}>
            {form.emailsText.trim()
              ? "Gerar e enviar e-mails"
              : `Gerar link${Number(form.quantity) > 1 ? "s" : ""}`}
          </Button>
        </div>
      </form>

      {generated.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-anima-violet/70">
            {form.emailsText.trim() ? "Convites enviados agora" : "Links gerados agora"}
          </p>
          {generated.map((invite) => (
            <CopyBlock
              key={invite.id}
              label={
                invite.email ??
                invite.label ??
                invite.authorNameHint ??
                "Link de depoimento"
              }
              text={invite.inviteUrl}
            />
          ))}
        </div>
      ) : null}

      {pendingInvites.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-white/40">
            Links pendentes ({pendingInvites.length})
          </p>
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {pendingInvites.map((invite) => (
              <li
                key={invite.id}
                className="flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-black/20 p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm text-white/80 truncate">
                    {invite.label ?? invite.authorNameHint ?? "Sem rótulo"}
                    {invite.email ? (
                      <span className="ml-2 text-white/40">· {invite.email}</span>
                    ) : null}
                  </p>
                  <p className="text-[11px] text-white/35 truncate">
                    {invite.inviteUrl}
                  </p>
                  {invite.sentAt ? (
                    <p className="text-[10px] text-emerald-400/70 mt-1">
                      E-mail enviado em{" "}
                      {new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(new Date(invite.sentAt))}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="email"
                    placeholder="E-mail para enviar"
                    value={resendEmail[invite.id] ?? invite.email ?? ""}
                    onChange={(e) =>
                      setResendEmail((prev) => ({
                        ...prev,
                        [invite.id]: e.target.value,
                      }))
                    }
                    className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/30 px-2 py-1.5 text-xs text-white/80 outline-none focus:border-anima-violet/30"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="!w-auto !py-1.5 !px-3 text-xs"
                    onClick={() => navigator.clipboard.writeText(invite.inviteUrl)}
                  >
                    Copiar
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="!w-auto !py-1.5 !px-3 text-xs"
                    onClick={() => handleSendEmail(invite)}
                    isLoading={sendMutation.isPending}
                  >
                    {invite.sentAt ? "Reenviar" : "Enviar e-mail"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="!w-auto !py-1.5 !px-3 text-xs"
                    onClick={() => handleRevoke(invite.id)}
                    isLoading={revokeMutation.isPending}
                  >
                    Revogar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
