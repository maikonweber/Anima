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
  const max =
    width === "narrow" ? "max-w-2xl" : "max-w-5xl";

  return (
    <div
      className={`${max} mx-auto w-full min-w-0 px-3 sm:px-5 lg:px-6 py-5 sm:py-8 ${className}`.trim()}
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 mb-5 sm:mb-6">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--clinic-accent)] font-medium mb-1.5 sm:mb-2">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-foreground/90 break-words">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-foreground/40 mt-1 max-w-xl">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto [&_button]:!w-auto [&_a]:inline-flex">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
