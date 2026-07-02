"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", disabled, ...props }, ref) => {
    return (
      <label
        className={`flex items-start gap-3 cursor-pointer select-none ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
      >
        <input
          ref={ref}
          type="checkbox"
          disabled={disabled}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-foreground/25 bg-foreground/[0.03] text-anima-violet accent-anima-violet focus:outline-none focus:ring-2 focus:ring-anima-violet/30 cursor-pointer disabled:cursor-not-allowed"
          {...props}
        />
        <span className="text-sm text-foreground/70 leading-relaxed">
          {label}
        </span>
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
