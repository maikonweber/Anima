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

type ApiClientConfig = {
  getToken: () => string | null;
  onUnauthorized: () => void;
  onPaymentRequired?: (error: PlanLimitError) => void;
};

let clientConfig: ApiClientConfig | null = null;

export function configureApiClient(config: Partial<ApiClientConfig>): void {
  clientConfig = { ...(clientConfig ?? {}), ...config } as ApiClientConfig;
}

export function getApiUrl(): string {
  return API_URL;
}

export async function api<T>(
  path: string,
  options?: RequestInit & { token?: string; auth?: boolean },
): Promise<T> {
  const { token, auth, ...fetchOptions } = options ?? {};

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

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message =
      typeof err.message === "string"
        ? err.message
        : Array.isArray(err.message)
          ? err.message.join(", ")
          : res.status === 403
            ? FORBIDDEN_MESSAGE
            : res.statusText;

    if (res.status === 401) {
      clientConfig?.onUnauthorized();
    }

    if (res.status === 402 && typeof err === "object" && err !== null) {
      const planError = err as PlanLimitError;
      clientConfig?.onPaymentRequired?.(planError);
    }

    throw new ApiError(res.status, message, err);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
