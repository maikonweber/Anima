"use client";

import { useEffect } from "react";
import { DM_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { ClinicSidebar } from "@/components/clinic/ClinicSidebar";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-clinic",
});

export function ClinicRouteLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className={`clinic-shell min-h-full flex items-center justify-center ${dmSans.variable}`}>
        <div className="flex flex-col items-center gap-3 font-[family-name:var(--font-clinic)]">
          <div className="w-10 h-10 rounded-full border-2 border-[var(--clinic-accent)]/30 border-t-[var(--clinic-accent)] animate-spin" />
          <p className="text-sm text-foreground/40">Carregando clínicas...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div
      className={`clinic-shell flex min-h-dvh ${dmSans.variable} font-[family-name:var(--font-clinic)]`}
    >
      <ClinicSidebar />
      <main
        id="main-content"
        className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto clinic-main clinic-main-pad"
      >
        {children}
      </main>
    </div>
  );
}
