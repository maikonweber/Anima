import { LoginPageClient } from "@/components/auth/LoginPageClient";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";

export default async function LoginPage() {
  const locale = await getRequestLocale();
  return <LoginPageClient locale={locale} />;
}
