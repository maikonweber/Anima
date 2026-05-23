import type { Metadata } from "next";
import { NO_INDEX_METADATA } from "@/lib/seo/private-metadata";

export const metadata: Metadata = NO_INDEX_METADATA;

export default function AssinaturaGerenciarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
