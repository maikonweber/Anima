"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ApiError } from "@/lib/api-client";
import { forgotPasswordApi } from "@/lib/api/auth";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { AuthLayout } from "@/components/ui/AuthLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const DEFAULT_SUCCESS_MESSAGE =
  "Se o e-mail estiver cadastrado, você receberá instruções para redefinir a senha.";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState(DEFAULT_SUCCESS_MESSAGE);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "E-mail inválido.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await forgotPasswordApi(parsed.data.email);
      setSuccessMessage(res.message || DEFAULT_SUCCESS_MESSAGE);
      setIsSent(true);
    } catch (err) {
      if (err instanceof ApiError && err.status >= 500) {
        setError("Tente novamente mais tarde.");
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível enviar o pedido. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Esqueci minha senha"
      subtitle="Enviaremos um link para redefinir sua senha"
    >
      <AnimatePresence mode="wait">
        {isSent ? (
          <motion.div
            key="sent"
            className="flex flex-col items-center gap-4 py-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div className="w-16 h-16 rounded-full bg-anima-violet/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-anima-violet"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </motion.div>
            <div className="text-center">
              <h3 className="text-base font-semibold text-foreground/80 mb-2">
                Verifique seu e-mail
              </h3>
              <p className="text-sm text-foreground/45 leading-relaxed max-w-xs">
                {successMessage}
              </p>
              <p className="text-xs text-foreground/35 mt-3">
                O link expira em 1 hora.
              </p>
            </div>
            <Link
              href="/login"
              className="mt-2 text-sm text-anima-violet hover:text-anima-lilac transition-colors font-medium"
            >
              Voltar ao login
            </Link>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-400/20 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <Button type="submit" isLoading={isLoading} className="mt-2">
              Enviar link de redefinição
            </Button>

            <p className="text-center text-xs text-foreground/40 mt-2">
              Lembrou a senha?{" "}
              <Link
                href="/login"
                className="text-anima-violet hover:text-anima-lilac transition-colors font-medium"
              >
                Voltar ao login
              </Link>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
