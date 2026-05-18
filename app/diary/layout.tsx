"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DiaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <DiaryLayoutSpinner />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-full min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">{children}</main>
    </div>
  );
}

function DiaryLayoutSpinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-full border-2 border-anima-violet/30 border-t-anima-violet animate-spin" />
      <p className="text-sm text-foreground/40">Carregando...</p>
    </div>
  );
}
