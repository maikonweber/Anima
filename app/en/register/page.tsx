import type { Metadata } from "next";
import { RegisterPageClient } from "@/components/auth/RegisterPageClient";
import { NO_INDEX_METADATA } from "@/lib/seo/private-metadata";

export const metadata: Metadata = NO_INDEX_METADATA;

export default function EnRegisterPage() {
  return <RegisterPageClient locale="en" />;
}
