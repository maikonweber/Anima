"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";

export const selectClassName =
  "anima-select w-full rounded-xl px-4 py-3 text-sm cursor-pointer " +
  "bg-foreground/[0.03] border border-foreground/[0.08] " +
  "text-foreground/90 " +
  "focus:outline-none focus:ring-2 focus:ring-anima-violet/30 focus:border-anima-violet/40 " +
  "transition-all duration-200";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <select ref={ref} className={`${selectClassName} ${className}`.trim()} {...props}>
        {children}
      </select>
    );
  },
);

Select.displayName = "Select";

export const HUMOR_OPTIONS = [
  { value: "", label: "Escolher humor" },
  { value: "Calmo", label: "Calmo" },
  { value: "Tenso", label: "Tenso" },
  { value: "Esperançoso", label: "Esperançoso" },
  { value: "Sobrecarregado", label: "Sobrecarregado" },
  { value: "Confuso", label: "Confuso" },
] as const;
