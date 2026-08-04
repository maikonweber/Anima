"use client";

import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
  /** Largura total do container (padrão em formulários). */
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  isLoading = false,
  fullWidth = true,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    `relative ${fullWidth ? "w-full" : "w-auto"} rounded-xl px-5 py-3 text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-anima-violet/30`;

  const variants = {
    primary:
      "text-white bg-gradient-to-r from-anima-violet to-anima-indigo hover:shadow-lg hover:shadow-anima-violet/20",
    secondary:
      "text-foreground/70 bg-foreground/[0.04] border border-foreground/[0.08] hover:bg-foreground/[0.07]",
    ghost:
      "text-foreground/50 hover:text-foreground/80 hover:bg-foreground/[0.04]",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Carregando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
