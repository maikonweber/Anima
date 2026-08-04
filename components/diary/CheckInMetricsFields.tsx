"use client";

import { useMemo, useState } from "react";
import { MetricSlider } from "@/components/diary/MetricSlider";
import { CrisisResourcesList } from "@/components/crisis/CrisisResourcesList";
import { useCrisisResources } from "@/hooks/use-crisis-resources";
import { useMyOrganizations } from "@/hooks/use-organizations";
import type { EmotionalTracking } from "@anima/shared";

export type CheckInMetricsValue = {
  humor?: string;
  ansiedadeInformada?: number;
  tagsEmocionais?: string[];
  tracking?: EmotionalTracking;
};

type Props = {
  value: CheckInMetricsValue;
  onChange: (next: CheckInMetricsValue) => void;
  disabled?: boolean;
};

const TRACKING_FIELDS: {
  key: keyof EmotionalTracking;
  label: string;
  low: string;
  high: string;
}[] = [
  { key: "sono", label: "Sono", low: "Ruim", high: "Reparador" },
  { key: "estresse", label: "Estresse", low: "Baixo", high: "Alto" },
  { key: "socializacao", label: "Socialização", low: "Isolado", high: "Conectado" },
  { key: "motivacao", label: "Motivação", low: "Baixa", high: "Alta" },
  { key: "burnout", label: "Burnout", low: "Baixo", high: "Alto" },
];

const FALLBACK_DISCLAIMER =
  "Este check-in não é canal de emergência. Em crise ou risco à vida, ligue 188 (CVV), 192 (SAMU) ou procure atendimento presencial.";

export function CheckInMetricsFields({ value, onChange, disabled }: Props) {
  const [tagsInput, setTagsInput] = useState(
    (value.tagsEmocionais ?? []).join(", "),
  );
  const { data: orgs } = useMyOrganizations();
  const patientOrgId = useMemo(
    () =>
      (orgs ?? []).find((item) => item.membership.role === "PATIENT")
        ?.organization.id,
    [orgs],
  );
  const crisis = useCrisisResources(patientOrgId ?? "", {}, !!patientOrgId);

  const tracking = value.tracking ?? {};

  function setAnxiety(next: number) {
    onChange({ ...value, ansiedadeInformada: next });
  }

  function setTrackingField(key: keyof EmotionalTracking, next: number) {
    onChange({
      ...value,
      tracking: { ...tracking, [key]: next },
    });
  }

  function setHumor(next: string) {
    onChange({ ...value, humor: next || undefined });
  }

  function commitTags(raw: string) {
    setTagsInput(raw);
    const tags = raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 8);
    onChange({
      ...value,
      tagsEmocionais: tags.length ? tags : undefined,
    });
  }

  return (
    <div className="glass-panel p-5 space-y-5">
      <div>
        <h2 className="text-sm font-semibold text-foreground/75">
          Check-in do dia
        </h2>
        <p className="text-xs text-foreground/40 mt-1">
          Opcional, mas ajuda a clínica a acompanhar padrões (só se você
          compartilhar o registro).
        </p>
      </div>

      <MetricSlider
        id="ansiedade-slider"
        label="Ansiedade"
        value={value.ansiedadeInformada ?? 50}
        onChange={setAnxiety}
        lowLabel="Calma"
        highLabel="Muito ansioso"
        disabled={disabled}
        accentColor="#e07a5f"
      />

      <div className="space-y-4 pt-1 border-t border-foreground/[0.06]">
        {TRACKING_FIELDS.map((field) => (
          <MetricSlider
            key={field.key}
            id={`tracking-${field.key}`}
            label={field.label}
            value={tracking[field.key] ?? 50}
            onChange={(next) => setTrackingField(field.key, next)}
            lowLabel={field.low}
            highLabel={field.high}
            disabled={disabled}
          />
        ))}
      </div>

      <div className="space-y-2 pt-1 border-t border-foreground/[0.06]">
        <label htmlFor="humor" className="text-sm font-medium text-foreground/70">
          Humor em uma palavra (opcional)
        </label>
        <input
          id="humor"
          type="text"
          value={value.humor ?? ""}
          onChange={(e) => setHumor(e.target.value.slice(0, 80))}
          disabled={disabled}
          placeholder="Ex.: esperançoso, cansado, aliviado…"
          className="w-full bg-transparent text-sm text-foreground/80 placeholder:text-foreground/25 border-b border-foreground/[0.08] pb-2 focus:outline-none focus:border-anima-violet/40 disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="tags" className="text-sm font-medium text-foreground/70">
          Tags (opcional, separadas por vírgula)
        </label>
        <input
          id="tags"
          type="text"
          value={tagsInput}
          onChange={(e) => commitTags(e.target.value)}
          disabled={disabled}
          placeholder="Ex.: trabalho, família, sono"
          className="w-full bg-transparent text-sm text-foreground/80 placeholder:text-foreground/25 border-b border-foreground/[0.08] pb-2 focus:outline-none focus:border-anima-violet/40 disabled:opacity-50"
        />
      </div>

      <div className="border-t border-foreground/[0.06] pt-3">
        {crisis.data ? (
          <CrisisResourcesList
            disclaimer={crisis.data.disclaimer}
            resources={crisis.data.resources.slice(0, 3)}
            compact
          />
        ) : (
          <p className="text-[11px] leading-relaxed text-foreground/35">
            {FALLBACK_DISCLAIMER}
          </p>
        )}
      </div>
    </div>
  );
}

export function toCheckInPayload(value: CheckInMetricsValue): CheckInMetricsValue {
  const trackingEntries = Object.entries(value.tracking ?? {}).filter(
    ([, v]) => typeof v === "number",
  );
  return {
    humor: value.humor?.trim() || undefined,
    ansiedadeInformada:
      typeof value.ansiedadeInformada === "number"
        ? value.ansiedadeInformada
        : undefined,
    tagsEmocionais: value.tagsEmocionais?.length
      ? value.tagsEmocionais
      : undefined,
    tracking: trackingEntries.length
      ? Object.fromEntries(trackingEntries)
      : undefined,
  };
}
