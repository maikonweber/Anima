import type { AuthResponse, User } from "../types";
import {
  getSessionFlagStorage,
  getTokenStorage,
} from "./token-storage";

export const TOKEN_KEY = "anima_access_token";
export const REFRESH_TOKEN_KEY = "anima_refresh_token";
export const EXPIRES_AT_KEY = "anima_access_token_expires_at";
export const USER_KEY = "anima_user";
export const SESSION_REUSE_WARNING_KEY = "anima_session_reuse_warning";

export const AUTH_STORAGE_KEYS = [
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  EXPIRES_AT_KEY,
  USER_KEY,
] as const;

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
  return getTokenStorage().getItem(TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  return getTokenStorage().getItem(REFRESH_TOKEN_KEY);
}

export function getStoredExpiresAt(): number | null {
  const raw = getTokenStorage().getItem(EXPIRES_AT_KEY);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function getStoredUser(): User | null {
  try {
    const raw = getTokenStorage().getItem(USER_KEY);
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
  const storage = getTokenStorage();
  storage.setItem(TOKEN_KEY, data.accessToken);
  storage.setItem(USER_KEY, JSON.stringify(data.user));

  if (data.refreshToken) {
    storage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  }

  let accessTokenExpiresAt = getStoredExpiresAt();
  if (data.accessTokenExpiresIn != null) {
    accessTokenExpiresAt = buildExpiresAt(data.accessTokenExpiresIn);
    if (accessTokenExpiresAt != null) {
      storage.setItem(EXPIRES_AT_KEY, String(accessTokenExpiresAt));
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
  // /auth/refresh devolve só tokens — preservar o user em cache.
  const user = response.user ?? getStoredUser();
  if (!user) {
    throw new Error("persistAuthResponse requires user on first persist");
  }
  return persistSession({
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    accessTokenExpiresIn: response.accessTokenExpiresIn,
    user,
  });
}

export function clearAuth(): void {
  const storage = getTokenStorage();
  storage.removeItem(TOKEN_KEY);
  storage.removeItem(REFRESH_TOKEN_KEY);
  storage.removeItem(EXPIRES_AT_KEY);
  storage.removeItem(USER_KEY);
}

export function setSessionReuseWarning(): void {
  getSessionFlagStorage().setItem(SESSION_REUSE_WARNING_KEY, "1");
}

export function consumeSessionReuseWarning(): boolean {
  const flags = getSessionFlagStorage();
  const had = flags.getItem(SESSION_REUSE_WARNING_KEY) === "1";
  flags.removeItem(SESSION_REUSE_WARNING_KEY);
  return had;
}
