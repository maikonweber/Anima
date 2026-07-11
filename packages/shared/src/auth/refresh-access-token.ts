import { getApiUrl } from "../api-client";
import {
  getStoredRefreshToken,
  persistAuthResponse,
  setSessionReuseWarning,
} from "./storage";
import type { AuthResponse } from "../types";

let refreshInFlight: Promise<AuthResponse | null> | null = null;

function isSessionReuseMessage(message: string): boolean {
  return (
    message.includes("Sessão inválida") ||
    message.includes("Faça login novamente")
  );
}

export async function refreshAccessToken(): Promise<AuthResponse | null> {
  if (refreshInFlight) return refreshInFlight;

  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) return null;

  refreshInFlight = (async () => {
    try {
      const res = await fetch(`${getApiUrl()}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          message?: string | string[];
        };
        const message =
          typeof err.message === "string"
            ? err.message
            : Array.isArray(err.message)
              ? err.message.join(", ")
              : "";
        if (res.status === 401 && isSessionReuseMessage(message)) {
          setSessionReuseWarning();
        }
        return null;
      }

      const data = (await res.json()) as AuthResponse;
      persistAuthResponse(data);
      return data;
    } catch {
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}
