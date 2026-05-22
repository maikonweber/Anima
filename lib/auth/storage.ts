import type { AuthResponse, User } from "@/lib/types";

const TOKEN_KEY = "anima_access_token";
const REFRESH_TOKEN_KEY = "anima_refresh_token";
const EXPIRES_AT_KEY = "anima_access_token_expires_at";
const USER_KEY = "anima_user";

export interface AuthSession {
  accessToken: string;
  refreshToken: string | null;
  accessTokenExpiresAt: number | null;
  user: User;
}

export function buildExpiresAt(accessTokenExpiresIn?: number): number | null {
  if (accessTokenExpiresIn == null) return null;
  return Date.now() + accessTokenExpiresIn * 1000;
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredExpiresAt(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(EXPIRES_AT_KEY);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function getStoredSession(): AuthSession | null {
  const accessToken = getStoredToken();
  const user = getStoredUser();
  if (!accessToken || !user) return null;

  return {
    accessToken,
    refreshToken: getStoredRefreshToken(),
    accessTokenExpiresAt: getStoredExpiresAt(),
    user,
  };
}

export function persistSession(data: {
  accessToken: string;
  refreshToken?: string | null;
  accessTokenExpiresIn?: number;
  user: User;
}): AuthSession {
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));

  if (data.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  }

  let accessTokenExpiresAt = getStoredExpiresAt();
  if (data.accessTokenExpiresIn != null) {
    accessTokenExpiresAt = buildExpiresAt(data.accessTokenExpiresIn);
    if (accessTokenExpiresAt != null) {
      localStorage.setItem(EXPIRES_AT_KEY, String(accessTokenExpiresAt));
    }
  }

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken ?? getStoredRefreshToken(),
    accessTokenExpiresAt,
    user: data.user,
  };
}

/** @deprecated Use persistSession */
export function persistAuth(accessToken: string, user: User): AuthSession {
  return persistSession({ accessToken, user });
}

export function persistAuthResponse(response: AuthResponse): AuthSession {
  return persistSession({
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    accessTokenExpiresIn: response.accessTokenExpiresIn,
    user: response.user,
  });
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
  localStorage.removeItem(USER_KEY);
}

export const SESSION_REUSE_WARNING_KEY = "anima_session_reuse_warning";

export function setSessionReuseWarning(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_REUSE_WARNING_KEY, "1");
}

export function consumeSessionReuseWarning(): boolean {
  if (typeof window === "undefined") return false;
  const had = sessionStorage.getItem(SESSION_REUSE_WARNING_KEY) === "1";
  sessionStorage.removeItem(SESSION_REUSE_WARNING_KEY);
  return had;
}
