"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ApiError, configureApiClient } from "@/lib/api-client";
import { loginApi, meApi, registerApi } from "@/lib/api/auth";
import {
  clearAuth,
  getStoredToken,
  getStoredUser,
  persistAuth,
} from "@/lib/auth/storage";
import type { User } from "@/lib/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  setSession: (accessToken: string, user: User) => void;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
  });

  const logout = useCallback(() => {
    clearAuth();
    setState({ user: null, accessToken: null, isLoading: false });
  }, []);

  const handleUnauthorized = useCallback(() => {
    clearAuth();
    setState({ user: null, accessToken: null, isLoading: false });
    if (
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login") &&
      !window.location.pathname.startsWith("/register") &&
      !window.location.pathname.startsWith("/forgot-password") &&
      !window.location.pathname.startsWith("/reset-password") &&
      !window.location.pathname.startsWith("/care-invite")
    ) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    configureApiClient({
      getToken: () => getStoredToken(),
      onUnauthorized: handleUnauthorized,
    });
  }, [handleUnauthorized]);

  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();

    if (!token) {
      setState({ user: null, accessToken: null, isLoading: false });
      return;
    }

    meApi(token)
      .then((user) => {
        persistAuth(token, user);
        setState({ user, accessToken: token, isLoading: false });
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 401) {
          handleUnauthorized();
          return;
        }
        setState({
          user: storedUser,
          accessToken: storedUser ? token : null,
          isLoading: false,
        });
      });
  }, []);

  const login = useCallback(async (email: string, senha: string) => {
    const { accessToken, user } = await loginApi(email, senha);
    persistAuth(accessToken, user);
    setState({ user, accessToken, isLoading: false });
  }, []);

  const register = useCallback(
    async (nome: string, email: string, senha: string) => {
      const { accessToken, user } = await registerApi(nome, email, senha);
      persistAuth(accessToken, user);
      setState({ user, accessToken, isLoading: false });
    },
    [],
  );

  const setSession = useCallback((accessToken: string, user: User) => {
    persistAuth(accessToken, user);
    setState({ user, accessToken, isLoading: false });
  }, []);

  const getToken = useCallback(() => state.accessToken, [state.accessToken]);

  const value = useMemo(
    () => ({ ...state, login, register, setSession, logout, getToken }),
    [state, login, register, setSession, logout, getToken],
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
