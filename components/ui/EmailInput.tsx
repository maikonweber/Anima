"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { sanitizeEmailInput } from "@/lib/email-mask";

interface EmailInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ label, error, value, onChange, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-foreground/60 mb-1.5">
          {label}
        </label>
        <input
          ref={ref}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={value}
          onChange={(e) => onChange(sanitizeEmailInput(e.target.value))}
          placeholder="seuemail@exemplo.com"
          className={`
            w-full rounded-xl px-4 py-3 text-sm
            bg-foreground/[0.03] border border-foreground/[0.08]
            text-foreground/90 placeholder:text-foreground/25
            focus:outline-none focus:ring-2 focus:ring-anima-violet/30 focus:border-anima-violet/40
            transition-all duration-200
            ${error ? "border-red-400/60 focus:ring-red-400/30" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);

EmailInput.displayName = "EmailInput";
