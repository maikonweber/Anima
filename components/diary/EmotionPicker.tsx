"use client";

import type { Emotion } from "@/lib/types";

export interface SelectedEmotion {
  emotionId: string;
  intensidade?: number;
}

/** Nomes das 10 emoções positivas do catálogo rastreável. */
const POSITIVE_EMOTION_NAMES = new Set([
  "alegria",
  "calma",
  "esperança",
  "gratidão",
  "amor",
  "orgulho",
  "alívio",
  "entusiasmo",
  "confiança",
  "paz",
]);

interface EmotionPickerProps {
  emotions: Emotion[];
  selected: SelectedEmotion[];
  onChange: (selected: SelectedEmotion[]) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function EmotionPicker({
  emotions,
  selected,
  onChange,
  disabled,
  isLoading,
}: EmotionPickerProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <EmotionPickerSkeleton key={i} />
        ))}
      </div>
    );
  }

  const activeEmotions = emotions.filter((e) => e.ativo);
  const positive = activeEmotions.filter((e) =>
    POSITIVE_EMOTION_NAMES.has(e.nome.toLowerCase()),
  );
  const challenging = activeEmotions.filter(
    (e) => !POSITIVE_EMOTION_NAMES.has(e.nome.toLowerCase()),
  );

  function toggle(emotion: Emotion) {
    if (disabled) return;
    const exists = selected.find((s) => s.emotionId === emotion.id);
    if (exists) {
      onChange(selected.filter((s) => s.emotionId !== emotion.id));
    } else {
      onChange([...selected, { emotionId: emotion.id, intensidade: 3 }]);
    }
  }

  function setIntensity(emotionId: string, intensidade: number) {
    onChange(
      selected.map((s) =>
        s.emotionId === emotionId ? { ...s, intensidade } : s,
      ),
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-foreground/70">
        Emoções que você sente
      </p>

      {positive.length > 0 && (
        <EmotionPickerGroup
          label="Mais leve"
          emotions={positive}
          selected={selected}
          disabled={disabled}
          onToggle={toggle}
        />
      )}

      {challenging.length > 0 && (
        <EmotionPickerGroup
          label="Mais pesada"
          emotions={challenging}
          selected={selected}
          disabled={disabled}
          onToggle={toggle}
        />
      )}

      {selected.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-foreground/[0.06]">
          <p className="text-xs text-foreground/40">Intensidade (1–5)</p>
          {selected.map((sel) => {
            const emotion = activeEmotions.find((e) => e.id === sel.emotionId);
            if (!emotion) return null;
            return (
              <EmotionPickerIntensity
                key={sel.emotionId}
                emotion={emotion}
                intensidade={sel.intensidade ?? 3}
                disabled={disabled}
                onChange={(v) => setIntensity(sel.emotionId, v)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmotionPickerGroup({
  label,
  emotions,
  selected,
  disabled,
  onToggle,
}: {
  label: string;
  emotions: Emotion[];
  selected: SelectedEmotion[];
  disabled?: boolean;
  onToggle: (emotion: Emotion) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">
        {label}
      </p>
      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-2"
        role="group"
        aria-label={label}
      >
        {emotions.map((emotion) => {
          const isSelected = selected.some((s) => s.emotionId === emotion.id);
          const color = emotion.cor ?? "#7c5cbf";
          return (
            <EmotionPickerChip
              key={emotion.id}
              emotion={emotion}
              isSelected={isSelected}
              color={color}
              disabled={disabled}
              onToggle={() => onToggle(emotion)}
            />
          );
        })}
      </div>
    </div>
  );
}

function EmotionPickerSkeleton() {
  return (
    <div className="h-10 w-full rounded-xl bg-foreground/[0.06] animate-pulse" />
  );
}

function EmotionPickerChip({
  emotion,
  isSelected,
  color,
  disabled,
  onToggle,
}: {
  emotion: Emotion;
  isSelected: boolean;
  color: string;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={isSelected}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 disabled:opacity-50 ${
        isSelected
          ? "border-transparent text-white shadow-md"
          : "border-foreground/[0.08] text-foreground/60 hover:border-foreground/20 bg-foreground/[0.03]"
      }`}
      style={
        isSelected
          ? { backgroundColor: color, boxShadow: `0 4px 14px -4px ${color}80` }
          : undefined
      }
    >
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <span className="capitalize truncate">{emotion.nome}</span>
    </button>
  );
}

function EmotionPickerIntensity({
  emotion,
  intensidade,
  disabled,
  onChange,
}: {
  emotion: Emotion;
  intensidade: number;
  disabled?: boolean;
  onChange: (v: number) => void;
}) {
  const color = emotion.cor ?? "#7c5cbf";
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-foreground/60 w-28 shrink-0 capitalize">
        {emotion.nome}
      </span>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={intensidade}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} ${(intensidade / 5) * 100}%, var(--anima-border-glass) ${(intensidade / 5) * 100}%)`,
        }}
        aria-label={`Intensidade de ${emotion.nome}`}
      />
      <span className="text-xs font-medium text-foreground/50 w-4">
        {intensidade}
      </span>
    </div>
  );
}
