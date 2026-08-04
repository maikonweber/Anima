"use client";

interface MetricSliderProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  lowLabel: string;
  highLabel: string;
  disabled?: boolean;
  accentColor?: string;
}

export function MetricSlider({
  id,
  label,
  value,
  onChange,
  lowLabel,
  highLabel,
  disabled,
  accentColor = "var(--anima-violet, #7c6af0)",
}: MetricSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-foreground/70">
          {label}
        </label>
        <span className="text-sm font-semibold tabular-nums text-foreground/80">
          {value}
          <span className="text-foreground/30 font-normal"> /100</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 rounded-full appearance-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-anima-violet/40 disabled:opacity-50"
        style={{
          background: `linear-gradient(to right, ${accentColor} ${value}%, var(--anima-border-glass) ${value}%)`,
        }}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label={`${label}: ${value} de 100`}
      />
      <div className="flex justify-between text-[10px] text-foreground/30 px-0.5">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}
