"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useAuth } from "@/providers/auth-provider";

/**
 * Shell igual ao Diary, mas sem scroll no `main` — o próprio chat controla áreas roláveis
 * (mensagens / drawer). Melhora UX mobile-first no assistente.
 */
export function AssistenteRouteLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <LayoutSpinner />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-[100dvh] min-h-0 w-full max-w-[100vw] overflow-x-hidden">
      <Sidebar />
      <main
        id="main-content"
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-hidden pb-[max(4.75rem,calc(env(safe-area-inset-bottom)+5rem))] lg:overflow-y-auto lg:pb-0"
      >
        {children}
      </main>
    </div>
  );
}

function LayoutSpinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-anima-violet/30 border-t-anima-violet" />
      <p className="text-sm text-foreground/40">Carregando...</p>
    </div>
  );
}
