"use client";

import { useEffect } from "react";
import { DM_Sans } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLocale } from "@/lib/i18n/locale-provider";
import { ClinicRorschachLoader } from "@/components/clinic/ClinicRorschachLoader";
import { ClinicSidebar } from "@/components/clinic/ClinicSidebar";
import { assinaturaCheckoutPath } from "@/lib/subscription/acquisition";
import { useSubscription } from "@/providers/subscription-provider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-clinic",
});

export function ClinicRouteLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { canAccessClinic, planSlug, isPleno, isEssencial } = useSubscription();
  const router = useRouter();
  const { locale, localizedHref } = useLocale();
  const upgradeHref = localizedHref(assinaturaCheckoutPath("cuidado"));

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(
        `${localizedHref("/login")}?redirect=${encodeURIComponent("/clinic")}`,
      );
    }
    // Free/Pleno: tela de bloqueio abaixo (sem shell do CRM). Cuidado segue.
  }, [user, isLoading, router, localizedHref]);

  if (isLoading) {
    return (
      <div className={dmSans.variable}>
        <ClinicRorschachLoader />
      </div>
    );
  }

  if (!user) return null;

  if (!canAccessClinic) {
    const planLabel = isPleno
      ? "Pleno"
      : isEssencial
        ? locale === "en"
          ? "Free"
          : "Essencial"
        : planSlug;

    const copy =
      locale === "en"
        ? {
            title: "Clinics requires Cuidado",
            body: `Your current plan (${planLabel}) is for the personal app only. Upgrade to Cuidado to use the professional CRM.`,
            cta: "Upgrade to Cuidado",
            back: "Back to app",
          }
        : locale === "es"
          ? {
              title: "Clínicas requiere Cuidado",
              body: `Tu plan actual (${planLabel}) es solo para la app personal. Mejora a Cuidado para usar el CRM profesional.`,
              cta: "Mejorar a Cuidado",
              back: "Volver a la app",
            }
          : {
              title: "Clínicas é exclusivo do Cuidado",
              body: `Seu plano atual (${planLabel}) é só do app pessoal. Faça upgrade para o Cuidado para usar o CRM profissional.`,
              cta: "Upgrade para Cuidado",
              back: "Voltar ao app",
            };

    return (
      <div
        className={`clinic-shell flex min-h-dvh items-center justify-center px-4 ${dmSans.variable} font-[family-name:var(--font-clinic)]`}
        style={{ colorScheme: "light" }}
      >
        <div className="max-w-md w-full rounded-2xl border border-[var(--clinic-border,#d7e0e6)] bg-white p-6 sm:p-8 text-center shadow-[0_1px_3px_rgba(15,28,36,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--clinic-accent,#0d7377)] mb-2">
            EmotiveCare Clínicas
          </p>
          <h1 className="text-xl font-semibold text-foreground mb-2">
            {copy.title}
          </h1>
          <p className="text-sm text-[var(--clinic-muted,#5c6b73)] leading-relaxed mb-6">
            {copy.body}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href={upgradeHref}
              className="inline-flex items-center justify-center rounded-lg bg-[var(--clinic-accent,#0d7377)] px-4 py-2.5 text-sm font-semibold text-white"
            >
              {copy.cta}
            </Link>
            <Link
              href={localizedHref("/dashboard")}
              className="inline-flex items-center justify-center rounded-lg border border-[var(--clinic-border,#d7e0e6)] px-4 py-2.5 text-sm font-semibold text-foreground"
            >
              {copy.back}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`clinic-shell flex min-h-dvh ${dmSans.variable} font-[family-name:var(--font-clinic)]`}
      style={{ colorScheme: "light" }}
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
