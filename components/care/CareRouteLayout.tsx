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

export function CareRouteLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { isCuidado } = useSubscription();
  const router = useRouter();
  const { locale, localizedHref } = useLocale();
  const t = getProductDictionary(locale);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(localizedHref("/login"));
    }
  }, [user, isLoading, router, localizedHref]);

  // Conta Cuidado não usa acompanhamentos B2C nem convites de vigiar.
  useEffect(() => {
    if (!isLoading && user && isCuidado) {
      router.replace(localizedHref("/clinic"));
    }
  }, [isLoading, user, isCuidado, router, localizedHref]);

  if (isLoading || (user && isCuidado)) {
    return (
      <div className={dmSans.variable}>
        <PatientRorschachLoader label={t.common.loading} />
      </div>
    );
  }

  if (!user) return null;

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
