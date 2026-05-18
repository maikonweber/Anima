"use client";

import type { Emotion } from "@/lib/types";

export interface SelectedEmotion {
  emotionId: string;
  intensidade?: number;
}

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
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <EmotionPickerSkeleton key={i} />
        ))}
      </div>
    );
  }

  const activeEmotions = emotions.filter((e) => e.ativo);

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
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground/70">
        Emoções que você sente
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Selecionar emoções">
        {activeEmotions.map((emotion) => {
          const sel = selected.find((s) => s.emotionId === emotion.id);
          const isSelected = !!sel;
          const color = emotion.cor ?? "#7c5cbf";

          return (
            <EmotionPickerChip
              key={emotion.id}
              emotion={emotion}
              isSelected={isSelected}
              color={color}
              disabled={disabled}
              onToggle={() => toggle(emotion)}
            />
          );
        })}
      </div>

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

function EmotionPickerSkeleton() {
  return <div className="h-9 w-24 rounded-full bg-foreground/[0.06] animate-pulse" />;
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
      className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border transition-all duration-200 disabled:opacity-50 ${
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
      {emotion.nome}
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
      <span className="text-sm text-foreground/60 w-28 shrink-0">{emotion.nome}</span>
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
      <span className="text-xs font-medium text-foreground/50 w-4">{intensidade}</span>
    </div>
  );
}
