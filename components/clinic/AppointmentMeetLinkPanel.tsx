"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Props = {
  meetLink: string | null | undefined;
  isSaving?: boolean;
  onSave: (meetLink: string) => Promise<void>;
};

function normalizeMeetUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function isLikelyMeetUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "http:" ||
      url.protocol === "https:" ||
      url.hostname.includes("meet.google") ||
      url.hostname.includes("zoom.us") ||
      url.hostname.includes("teams.microsoft")
    );
  } catch {
    return false;
  }
}

export function AppointmentMeetLinkPanel({
  meetLink,
  isSaving = false,
  onSave,
}: Props) {
  const [value, setValue] = useState(meetLink ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setValue(meetLink ?? "");
  }, [meetLink]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const normalized = normalizeMeetUrl(value);
    if (!normalized) {
      setError("Informe o link do Google Meet (ou outra plataforma).");
      return;
    }
    if (!isLikelyMeetUrl(normalized)) {
      setError("Link inválido. Use uma URL completa (ex.: meet.google.com/...).");
      return;
    }
    try {
      await onSave(normalized);
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível salvar o link.",
      );
    }
  }

  const href = meetLink?.trim() ? normalizeMeetUrl(meetLink) : null;

  return (
    <div className="glass-panel p-4 space-y-3">
      <div>
        <h2 className="text-base font-semibold text-foreground/85">
          Consulta online (Google Meet)
        </h2>
        <p className="text-xs text-foreground/45 mt-1 leading-relaxed">
          A sala de vídeo integrada está temporariamente desativada. Cadastre o
          link do Meet para esta sessão — o paciente verá o link na agenda.
        </p>
      </div>

      {href && (
        <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] px-3 py-2.5 text-sm">
          <p className="text-foreground/45 text-xs mb-1">Link atual</p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-anima-violet hover:underline break-all"
          >
            {href}
          </a>
        </div>
      )}

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
        <Input
          label="Link do Google Meet"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSaved(false);
          }}
          placeholder="https://meet.google.com/abc-defg-hij"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        {saved && (
          <p className="text-xs text-emerald-600">Link salvo com sucesso.</p>
        )}
        <Button type="submit" className="w-auto" isLoading={isSaving}>
          {href ? "Atualizar link" : "Salvar link"}
        </Button>
      </form>
    </div>
  );
}
