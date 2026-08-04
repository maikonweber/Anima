"use client";

/** Mancha simétrica estilo Rorschach — loading do app paciente. */
export function PatientRorschachLoader({
  label = "Carregando…",
}: {
  label?: string;
}) {
  return (
    <div
      className="patient-shell patient-loading fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 px-6 font-[family-name:var(--font-patient)]"
      style={{ colorScheme: "light" }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="patient-rorschach" aria-hidden="true">
        <svg
          viewBox="0 0 240 240"
          className="w-40 h-40 sm:w-48 sm:h-48"
          fill="currentColor"
        >
          <path d="M120 28c-8 18-24 28-38 44-12 14-24 26-28 46-3 16 0 32 10 44 6 8 14 12 16 22 2 10-4 18-8 28-3 8-4 18 4 22 6 4 14-2 18-10 6-10 10-22 22-26 4-2 8-2 14-2s10 0 14 2c12 4 16 16 22 26 4 8 12 14 18 10 8-4 7-14 4-22-4-10-10-18-8-28 2-10 10-14 16-22 10-12 13-28 10-44-4-20-16-32-28-46-14-16-30-26-38-44z" />
          <path
            d="M52 96c-14 8-28 28-22 46 4 12 16 18 14 30-2 10-14 12-12 24 1 8 10 12 20 10 12-2 18-12 28-8 8 3 10 16 22 18 6 1 12-2 14-8"
            opacity="0.7"
          />
          <path
            d="M188 96c14 8 28 28 22 46-4 12-16 18-14 30 2 10 14 12 12 24-1 8-10 12-20 10-12-2-18-12-28-8-8 3-10 16-22 18-6 1-12-2-14-8"
            opacity="0.7"
          />
          <ellipse cx="88" cy="132" rx="9" ry="14" fill="var(--background)" />
          <ellipse cx="152" cy="132" rx="9" ry="14" fill="var(--background)" />
          <path
            d="M108 158c4 10 8 14 12 14s8-4 12-14"
            fill="none"
            stroke="var(--background)"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.9"
          />
        </svg>
      </div>
      <p className="text-sm font-medium tracking-wide text-[var(--patient-muted)]">
        {label}
      </p>
    </div>
  );
}
