"use client";

import { useEffect } from "react";
import { DM_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { PatientRorschachLoader } from "@/components/patient/PatientRorschachLoader";
import { useLocale } from "@/lib/i18n/locale-provider";
import { getProductDictionary } from "@/lib/i18n/product-dictionary";
import { useSubscription } from "@/providers/subscription-provider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-patient",
});

export function DashboardRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const { isCuidado } = useSubscription();
  const router = useRouter();
  const { locale, localizedHref, barePath } = useLocale();
  const t = getProductDictionary(locale);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(localizedHref("/login"));
    }
  }, [user, isLoading, router, localizedHref]);

  // Conta Cuidado não usa o app pessoal — manda para Clínicas.
  useEffect(() => {
    if (isLoading || !user || !isCuidado) return;
    const allowed =
      barePath.startsWith("/dashboard/perfil") ||
      barePath.startsWith("/assinatura") ||
      barePath.startsWith("/suporte") ||
      barePath.startsWith("/assistente");
    if (!allowed) {
      router.replace(localizedHref("/clinic"));
    }
  }, [isLoading, user, isCuidado, barePath, router, localizedHref]);

  if (isLoading) {
    return (
      <div className={dmSans.variable}>
        <PatientRorschachLoader label={t.common.loading} />
      </div>
    );
  }

  if (!user) return null;

  if (isCuidado) {
    const allowed =
      barePath.startsWith("/dashboard/perfil") ||
      barePath.startsWith("/assinatura") ||
      barePath.startsWith("/suporte") ||
      barePath.startsWith("/assistente");
    if (!allowed) return null;
  }

  return (
    <div
      className={`patient-shell flex min-h-dvh w-full max-w-[100vw] overflow-x-hidden ${dmSans.variable} font-[family-name:var(--font-patient)]`}
      style={{ colorScheme: "light" }}
    >
      <Sidebar />
      <main
        id="main-content"
        className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto pb-20 lg:pb-0 patient-main"
      >
        {children}
      </main>
    </div>
  );
}
