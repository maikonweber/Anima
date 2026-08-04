"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ApiError,
  configureApiClient,
  type UnauthorizedReason,
} from "@/lib/api-client";
import {
  googleLoginApi,
  loginApi,
  logoutApi,
  meApi,
  registerApi,
} from "@/lib/api/auth";
import { refreshAccessToken } from "@/lib/auth/refresh-access-token";
import {
  clearAuth,
  getStoredRefreshToken,
  getStoredSession,
  getStoredToken,
  persistAuthResponse,
  persistSession,
  type AuthSession,
} from "@/lib/auth/storage";
import type { AuthResponse, User } from "@/lib/types";

const PROACTIVE_REFRESH_LEAD_MS = 60_000;

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: number | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, senha: string) => Promise<User>;
  register: (nome: string, email: string, senha: string) => Promise<User>;
  googleLogin: (idToken: string) => Promise<User>;
  setSession: (response: AuthResponse) => void;
  refreshUser: () => Promise<User | null>;
  logout: () => Promise<void>;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function sessionToState(session: AuthSession): Omit<AuthState, "isLoading"> {
  return {
    user: session.user,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    accessTokenExpiresAt: session.accessTokenExpiresAt,
  };
}

function shouldRedirectToLogin(): boolean {
  if (typeof window === "undefined") return false;
  const path = window.location.pathname;
  return (
    !path.startsWith("/login") &&
    !path.startsWith("/register") &&
    !path.startsWith("/forgot-password") &&
    !path.startsWith("/reset-password") &&
    !path.startsWith("/care-invite") &&
    !path.startsWith("/assinatura")
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    accessTokenExpiresAt: null,
    isLoading: true,
  });

  const applySession = useCallback((session: AuthSession) => {
    setState({ ...sessionToState(session), isLoading: false });
  }, []);

  const clearSession = useCallback(() => {
    clearAuth();
    setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      accessTokenExpiresAt: null,
      isLoading: false,
    });
  }, []);

  // reason is accepted for call-site clarity (e.g. "expired") but not needed here.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUnauthorized = useCallback((_reason?: UnauthorizedReason) => {
    clearSession();
    if (shouldRedirectToLogin()) {
      window.location.href = "/login";
    }
  }, [clearSession]);

  const handleEmailNotVerified = useCallback(() => {
    if (typeof window === "undefined") return;
    const path = window.location.pathname;
    if (
      !path.startsWith("/aguardando-verificacao") &&
      !path.startsWith("/verify-email") &&
      !path.startsWith("/login") &&
      !path.startsWith("/register") &&
      !path.startsWith("/assinatura")
    ) {
      window.location.href = "/aguardando-verificacao";
    }
  }, []);

  const syncSessionFromStorage = useCallback(() => {
    const session = getStoredSession();
    if (session) {
      applySession(session);
    }
  }, [applySession]);

  useEffect(() => {
    configureApiClient({
      getToken: () => getStoredToken(),
      onUnauthorized: handleUnauthorized,
      onEmailNotVerified: handleEmailNotVerified,
      onSessionUpdated: syncSessionFromStorage,
    });
  }, [handleUnauthorized, handleEmailNotVerified, syncSessionFromStorage]);

  const bootstrapDone = useRef(false);

  useEffect(() => {
    if (bootstrapDone.current) return;
    bootstrapDone.current = true;

    const BOOTSTRAP_TIMEOUT_MS = 12_000;

    async function bootstrap() {
      const session = getStoredSession();
      if (!session) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      const refreshToken = getStoredRefreshToken();
      const expiresAt = session.accessTokenExpiresAt;
      const accessExpired = expiresAt != null && Date.now() >= expiresAt;
      const expiresSoon =
        expiresAt != null &&
        Date.now() >= expiresAt - PROACTIVE_REFRESH_LEAD_MS;

      if (refreshToken && (accessExpired || expiresSoon)) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          applySession(getStoredSession()!);
          return;
        }
        if (accessExpired) {
          handleUnauthorized("expired");
          return;
        }
      }

      try {
        const user = await meApi(session.accessToken);
        const updated = persistSession({
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          user,
        });
        applySession(updated);
      } catch (err: unknown) {
        if (err instanceof ApiError && err.status === 401) {
          if (refreshToken) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
              try {
                const user = await meApi(refreshed.accessToken);
                const updated = persistAuthResponse({ ...refreshed, user });
                applySession(updated);
                return;
              } catch {
                /* fall through */
              }
            }
          }
          handleUnauthorized("expired");
          return;
        }
        applySession(session);
      }
    }

    const timeoutId = window.setTimeout(() => {
      setState((prev) => {
        if (!prev.isLoading) return prev;
        const session = getStoredSession();
        if (session) return { ...sessionToState(session), isLoading: false };
        return { ...prev, isLoading: false };
      });
    }, BOOTSTRAP_TIMEOUT_MS);

    void bootstrap().finally(() => {
      window.clearTimeout(timeoutId);
    });
  }, [applySession, handleUnauthorized]);

  const proactiveRefreshTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    if (proactiveRefreshTimer.current) {
      clearTimeout(proactiveRefreshTimer.current);
      proactiveRefreshTimer.current = null;
    }

    const accessTokenExpiresAt = state.accessTokenExpiresAt;
    const refreshToken = state.refreshToken;
    if (!accessTokenExpiresAt || !refreshToken) return;

    const delay = accessTokenExpiresAt - Date.now() - PROACTIVE_REFRESH_LEAD_MS;
    if (delay <= 0) {
      void refreshAccessToken().then((refreshed) => {
        if (refreshed) syncSessionFromStorage();
      });
      return;
    }

    proactiveRefreshTimer.current = setTimeout(() => {
      void refreshAccessToken().then((refreshed) => {
        if (refreshed) syncSessionFromStorage();
      });
    }, delay);

    return () => {
      if (proactiveRefreshTimer.current) {
        clearTimeout(proactiveRefreshTimer.current);
      }
    };
  }, [
    state.accessTokenExpiresAt,
    state.refreshToken,
    state.accessToken,
    syncSessionFromStorage,
  ]);

  const applyAuthResponse = useCallback(
    (response: AuthResponse) => {
      const session = persistAuthResponse(response);
      applySession(session);
      return response.user;
    },
    [applySession],
  );

  const login = useCallback(
    async (email: string, senha: string) => {
      const response = await loginApi(email, senha);
      return applyAuthResponse(response);
    },
    [applyAuthResponse],
  );

  const register = useCallback(
    async (nome: string, email: string, senha: string) => {
      const response = await registerApi(nome, email, senha);
      return applyAuthResponse(response);
    },
    [applyAuthResponse],
  );

  const googleLogin = useCallback(
    async (idToken: string) => {
      const response = await googleLoginApi(idToken);
      return applyAuthResponse(response);
    },
    [applyAuthResponse],
  );

  const setSession = useCallback(
    (response: AuthResponse) => {
      applyAuthResponse(response);
    },
    [applyAuthResponse],
  );

  const refreshUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) return null;
    try {
      const user = await meApi(token);
      const session = getStoredSession();
      if (!session) return null;
      const updated = persistSession({
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        user,
      });
      applySession(updated);
      return user;
    } catch {
      return null;
    }
  }, [applySession]);

  const logout = useCallback(async () => {
    const refreshToken = getStoredRefreshToken();
    if (refreshToken) {
      try {
        await logoutApi(refreshToken);
      } catch {
        /* revoke best-effort */
      }
    }
    clearSession();
  }, [clearSession]);

  const getToken = useCallback(() => state.accessToken, [state.accessToken]);

  const value = useMemo(
    () => ({
      ...state,
      login,
      register,
      googleLogin,
      setSession,
      refreshUser,
      logout,
      getToken,
    }),
    [
      state,
      login,
      register,
      googleLogin,
      setSession,
      refreshUser,
      logout,
      getToken,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
