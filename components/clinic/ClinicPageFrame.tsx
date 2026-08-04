"use client";

import type { ReactNode } from "react";

type ClinicPageFrameProps = {
  children: ReactNode;
  /** default | narrow for forms */
  width?: "default" | "narrow";
  className?: string;
};

export function ClinicPageFrame({
  children,
  width = "default",
  className = "",
}: ClinicPageFrameProps) {
  const max = width === "narrow" ? "max-w-2xl" : "max-w-5xl";

  return (
    <div
      className={`${max} mx-auto w-full min-w-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-10 ${className}`.trim()}
    >
      {children}
    </div>
  );
}

type ClinicPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function ClinicPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: ClinicPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6 mb-7 sm:mb-8">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--clinic-accent)] font-semibold mb-2">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-semibold tracking-tight text-foreground leading-tight break-words">
          {title}
        </h1>
        {description ? (
          <p className="text-sm sm:text-[15px] text-[var(--clinic-muted)] mt-2 max-w-lg leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto [&_button]:!w-auto [&_a]:inline-flex">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
