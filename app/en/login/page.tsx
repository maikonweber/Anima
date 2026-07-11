import type { Metadata } from "next";
import { LoginPageClient } from "@/components/auth/LoginPageClient";
import { NO_INDEX_METADATA } from "@/lib/seo/private-metadata";

export const metadata: Metadata = NO_INDEX_METADATA;

export default function EnLoginPage() {
  return <LoginPageClient locale="en" />;
}
