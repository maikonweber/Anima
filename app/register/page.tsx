import { RegisterPageClient } from "@/components/auth/RegisterPageClient";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";

export default async function RegisterPage() {
  const locale = await getRequestLocale();
  return <RegisterPageClient locale={locale} />;
}
