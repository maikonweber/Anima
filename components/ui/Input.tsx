"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-foreground/60 mb-1.5">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
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
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors text-xs"
              tabIndex={-1}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
