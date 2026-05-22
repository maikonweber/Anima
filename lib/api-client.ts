import { refreshAccessToken } from "@/lib/auth/refresh-access-token";
import {
  getStoredRefreshToken,
  setSessionReuseWarning,
} from "@/lib/auth/storage";
import type { PlanLimitError } from "@/types/subscription";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }

  get planLimit(): PlanLimitError | null {
    if (this.status !== 402 || !this.details || typeof this.details !== "object") {
      return null;
    }
    const d = this.details as Record<string, unknown>;
    if (typeof d.code !== "string") return null;
    return d as PlanLimitError;
  }
}

export const FORBIDDEN_MESSAGE =
  "Você não tem permissão para acessar este recurso.";

export type UnauthorizedReason = "expired" | "session_reuse";

type ApiClientConfig = {
  getToken: () => string | null;
  onUnauthorized: (reason?: UnauthorizedReason) => void;
  onSessionUpdated?: () => void;
  onEmailNotVerified?: () => void;
  onPaymentRequired?: (error: PlanLimitError) => void;
};

let clientConfig: ApiClientConfig | null = null;

export function configureApiClient(config: Partial<ApiClientConfig>): void {
  clientConfig = { ...(clientConfig ?? {}), ...config } as ApiClientConfig;
}

export function getApiUrl(): string {
  return API_URL;
}

const AUTH_PUBLIC_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/google",
  "/auth/refresh",
  "/auth/logout",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/resend-verification",
  "/care-invites/register",
];

function isAuthPublicPath(path: string): boolean {
  const normalized = path.split("?")[0] ?? path;
  return AUTH_PUBLIC_PATHS.some(
    (p) => normalized === p || normalized.endsWith(p),
  );
}

function isSessionReuseMessage(message: string): boolean {
  return (
    message.includes("Sessão inválida") ||
    message.includes("Faça login novamente")
  );
}

function parseErrorMessage(err: unknown, status: number, statusText: string): string {
  if (typeof err === "object" && err !== null) {
    const message = (err as Record<string, unknown>).message;
    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message.join(", ");
  }
  return status === 403 ? FORBIDDEN_MESSAGE : statusText;
}

type ApiOptions = RequestInit & {
  token?: string;
  auth?: boolean;
  /** Internal: prevents infinite 401 → refresh → retry loops */
  _authRetried?: boolean;
};

async function fetchWithAuth<T>(
  path: string,
  options: ApiOptions,
): Promise<T> {
  const { token, auth, _authRetried, ...fetchOptions } = options;

  const resolvedToken =
    token ?? (auth ? (clientConfig?.getToken() ?? null) : null);

  const res = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
      ...fetchOptions.headers,
    },
  });

  if (res.ok) {
    if (res.status === 204) {
      return undefined as T;
    }
    return res.json() as Promise<T>;
  }

  const err = await res.json().catch(() => ({}));
  const message = parseErrorMessage(err, res.status, res.statusText);

  if (res.status === 401) {
    const canRetry =
      !_authRetried &&
      !isAuthPublicPath(path) &&
      !!getStoredRefreshToken() &&
      (auth || !!token);

    if (canRetry) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        clientConfig?.onSessionUpdated?.();
        return fetchWithAuth<T>(path, {
          ...options,
          token: refreshed.accessToken,
          _authRetried: true,
        });
      }
    }

    const reason: UnauthorizedReason | undefined =
      isSessionReuseMessage(message) ? "session_reuse" : "expired";

    if (reason === "session_reuse") {
      setSessionReuseWarning();
    }

    if (!isAuthPublicPath(path) || path.includes("/auth/refresh")) {
      clientConfig?.onUnauthorized(reason);
    }
  }

  if (
    res.status === 403 &&
    typeof err === "object" &&
    err !== null &&
    (err as Record<string, unknown>).code === "EMAIL_NOT_VERIFIED"
  ) {
    clientConfig?.onEmailNotVerified?.();
  }

  if (res.status === 402 && typeof err === "object" && err !== null) {
    const planError = err as PlanLimitError;
    clientConfig?.onPaymentRequired?.(planError);
  }

  throw new ApiError(res.status, message, err);
}

export async function api<T>(
  path: string,
  options?: ApiOptions,
): Promise<T> {
  return fetchWithAuth<T>(path, options ?? {});
}
