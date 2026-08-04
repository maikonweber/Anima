import type { Metadata } from "next";
import { AssinaturaShell } from "@/components/subscription/AssinaturaShell";
import { NO_INDEX_METADATA } from "@/lib/seo/private-metadata";

export const metadata: Metadata = NO_INDEX_METADATA;

export default function AssinaturaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AssinaturaShell>{children}</AssinaturaShell>;
}
