"use client";

import { useSyncExternalStore } from "react";

/**
 * Contador local (só neste dispositivo) de pausas concluídas.
 * Nada é enviado ao servidor.
 */
const KEY = "anima.calm.sessions.v1";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const listeners = new Set<() => void>();

function read(): number[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((n): n is number => typeof n === "number")
      : [];
  } catch {
    return [];
  }
}

export function recordCalmSession(): void {
  try {
    const cutoff = Date.now() - WEEK_MS * 4;
    const next = [...read().filter((t) => t > cutoff), Date.now()].slice(-100);
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage indisponível (modo privado) — ignora */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getWeekCount(): number {
  const cutoff = Date.now() - WEEK_MS;
  return read().filter((t) => t > cutoff).length;
}

export function useCalmSessionsThisWeek(): number {
  return useSyncExternalStore(subscribe, getWeekCount, () => 0);
}
