"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { ApiError } from "@/lib/api-client";
import { resolvePostAuthDestination } from "@/lib/subscription/acquisition";
import { useAuth } from "@/providers/auth-provider";
import { useLocale } from "@/lib/i18n/locale-provider";

interface GoogleAuthButtonProps {
  /** Rótulo do botão do Google. */
  text?: "signin_with" | "signup_with" | "continue_with";
  /** Destino após autenticar (quando o e-mail já está verificado). */
  redirectTo?: string | null;
  /** Reporta erros para a página exibir na sua própria caixa de aviso. */
  onError?: (message: string) => void;
}

/**
 * Botão "Entrar/Cadastrar com Google" reutilizável e responsivo.
 * Centraliza o fluxo de ID token + navegação usado em login e cadastro.
 */
export function GoogleAuthButton({
  text = "signin_with",
  redirectTo,
  onError,
}: GoogleAuthButtonProps) {
  const router = useRouter();
  const { locale } = useLocale();
  const { googleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSuccess(idToken: string) {
    setIsLoading(true);
    onError?.("");
    try {
      const user = await googleLogin(idToken);
      router.push(
        resolvePostAuthDestination(
          user.emailVerified,
          redirectTo,
          locale,
          user.subscription?.plan.slug,
        ),
      );
    } catch (err) {
      setIsLoading(false);
      onError?.(
        err instanceof ApiError
          ? err.message
          : "Não foi possível entrar com Google. Tente novamente.",
      );
    }
  }

  return (
    <div
      className={`flex w-full justify-center overflow-hidden transition-opacity ${
        isLoading ? "pointer-events-none opacity-50" : ""
      }`}
      aria-busy={isLoading}
    >
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          const idToken = credentialResponse.credential;
          if (!idToken) {
            onError?.("Não foi possível entrar com Google. Tente novamente.");
            return;
          }
          void handleSuccess(idToken);
        }}
        onError={() =>
          onError?.("Não foi possível entrar com Google. Tente novamente.")
        }
        text={text}
        useOneTap={false}
        theme="outline"
        shape="pill"
      />
    </div>
  );
}
