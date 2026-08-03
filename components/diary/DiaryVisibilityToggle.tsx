"use client";

import type { DiaryEntryVisibility } from "@anima/shared";

type Props = {
  value: DiaryEntryVisibility;
  onChange: (value: DiaryEntryVisibility) => void;
  disabled?: boolean;
};

export function DiaryVisibilityToggle({ value, onChange, disabled }: Props) {
  const shared = value === "COMPARTILHADO";

  return (
    <div className="glass-panel p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground/70">
            Compartilhamento
          </p>
          <p className="text-xs text-foreground/40 mt-1 leading-relaxed">
            {shared
              ? "Este registro pode aparecer para quem você autorizou (care ou clínica com consentimento DIARIO_CHECKIN)."
              : "Privado: só você vê este registro. Ninguém do care ou da clínica terá acesso a ele."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={shared}
          disabled={disabled}
          onClick={() =>
            onChange(shared ? "PRIVADO" : "COMPARTILHADO")
          }
          className={`relative shrink-0 h-7 w-12 rounded-full transition-colors ${
            shared ? "bg-anima-violet/80" : "bg-foreground/15"
          } disabled:opacity-50`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white transition-transform ${
              shared ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
      <p className="text-[11px] text-foreground/35">
        Status:{" "}
        <span className="text-foreground/55">
          {shared ? "Compartilhado" : "Privado"}
        </span>
      </p>
    </div>
  );
}

export function DiaryVisibilityBadge({
  visibility,
}: {
  visibility?: DiaryEntryVisibility | null;
}) {
  const shared = visibility === "COMPARTILHADO";
  return (
    <span
      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
        shared
          ? "border-anima-violet/30 text-anima-violet/90"
          : "border-foreground/15 text-foreground/45"
      }`}
    >
      {shared ? "Compartilhado" : "Privado"}
    </span>
  );
}
