"use client";

import { getCategoryFromEnergy, getCategoryStyle } from "@/lib/energy";

interface EnergySliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function EnergySlider({ value, onChange, disabled }: EnergySliderProps) {
  const category = getCategoryFromEnergy(value);
  const { label, color, bg } = getCategoryStyle(category);

  return (
    <div className="min-w-0 space-y-3">
      <div className="flex items-center justify-between gap-3 min-w-0">
        <label htmlFor="energia-slider" className="text-sm font-medium text-foreground/70">
          Energia emocional
        </label>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-bold tabular-nums" style={{ color }} aria-live="polite">
            {value}
          </span>
          <span className="text-foreground/30 text-sm">/100</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${bg}`}>
            {label}
          </span>
        </div>
      </div>

      <input
        id="energia-slider"
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="block w-full min-w-0 max-w-full h-2 rounded-full appearance-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-anima-violet/40 disabled:opacity-50"
        style={{
          background: `linear-gradient(to right, ${color} ${value}%, var(--anima-border-glass) ${value}%)`,
        }}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label={`Energia emocional: ${value} de 100, escala ${label}`}
      />

      <div className="flex justify-between text-[10px] text-foreground/30 px-0.5">
        <span>Exaustão</span>
        <span>Expansiva</span>
      </div>
    </div>
  );
}
