"use client";

import { useEffect } from "react";
import { DM_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useLocale } from "@/lib/i18n/locale-provider";
import { ClinicRorschachLoader } from "@/components/clinic/ClinicRorschachLoader";
import { ClinicSidebar } from "@/components/clinic/ClinicSidebar";
import { useSubscription } from "@/providers/subscription-provider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-clinic",
});

export function ClinicRouteLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { isCuidado, isPreviewPlan } = useSubscription();
  const router = useRouter();
  const { localizedHref } = useLocale();
  const canAccessClinic = isCuidado || isPreviewPlan;

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(
        `${localizedHref("/login")}?redirect=${encodeURIComponent("/clinic")}`,
      );
      return;
    }
    // CRM profissional é exclusivo do plano Cuidado (RF-090).
    if (!canAccessClinic) {
      router.replace(localizedHref("/dashboard"));
    }
  }, [user, isLoading, canAccessClinic, router, localizedHref]);

  if (isLoading) {
    return (
      <div className={dmSans.variable}>
        <ClinicRorschachLoader />
      </div>
    );
  }

  if (!user || !canAccessClinic) return null;

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
