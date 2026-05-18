"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { User, AuthState } from "./types";

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "anima_user";

const MOCK_USER: User = {
  id: "1",
  name: "Usuário Anima",
  email: "",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setState({ user: JSON.parse(stored), isLoading: false });
      } else {
        setState({ user: null, isLoading: false });
      }
    } catch {
      setState({ user: null, isLoading: false });
    }
  }, []);

  const persistUser = useCallback((user: User) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setState({ user, isLoading: false });
  }, []);

  const login = useCallback(
    async (email: string, _password: string) => {
      await new Promise((r) => setTimeout(r, 800));
      persistUser({ ...MOCK_USER, email });
    },
    [persistUser],
  );

  const register = useCallback(
    async (name: string, email: string, _password: string) => {
      await new Promise((r) => setTimeout(r, 800));
      persistUser({
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim(),
      });
    },
    [persistUser],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ user: null, isLoading: false });
  }, []);

  const resetPassword = useCallback(async (_email: string) => {
    await new Promise((r) => setTimeout(r, 1000));
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
