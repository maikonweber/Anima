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
}

export const FORBIDDEN_MESSAGE =
  "Você não tem permissão para acessar este recurso.";

type ApiClientConfig = {
  getToken: () => string | null;
  onUnauthorized: () => void;
};

let clientConfig: ApiClientConfig | null = null;

export function configureApiClient(config: ApiClientConfig): void {
  clientConfig = config;
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
      res.status === 403
        ? FORBIDDEN_MESSAGE
        : typeof err.message === "string"
          ? err.message
          : Array.isArray(err.message)
            ? err.message.join(", ")
            : res.statusText;

    if (res.status === 401) {
      clientConfig?.onUnauthorized();
    }

    throw new ApiError(res.status, message, err);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
