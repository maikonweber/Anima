"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { isPlatformAdminEmail } from "@/lib/admin/platform-admin";
import { PatientRorschachLoader } from "@/components/patient/PatientRorschachLoader";

const NAV = [
  { href: "/admin", label: "Início" },
  { href: "/admin/vendas", label: "Playbook de vendas" },
  { href: "/admin/trials", label: "Trials clínica" },
  { href: "/admin/depoimentos", label: "Depoimentos" },
] as const;

export function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = isPlatformAdminEmail(user?.email);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!isLoading && user && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, isAdmin, router]);

  if (isLoading) {
    return <PatientRorschachLoader label="Carregando admin…" />;
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-dvh bg-[#0c0b10] text-foreground">
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#0c0b10]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-anima-violet/80">
              EmotiveCare
            </p>
            <h1 className="text-sm font-semibold text-white/90">Admin</h1>
          </div>
          <nav className="flex flex-wrap gap-1">
            {NAV.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    active
                      ? "bg-anima-violet/20 text-anima-violet"
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
