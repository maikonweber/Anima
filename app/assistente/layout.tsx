import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AssistenteRouteLayout } from "@/components/assistant/AssistenteRouteLayout";
import { NO_INDEX_METADATA } from "@/lib/seo/private-metadata";

export const metadata: Metadata = NO_INDEX_METADATA;

export default function AssistenteLayout({ children }: { children: ReactNode }) {
  return <AssistenteRouteLayout>{children}</AssistenteRouteLayout>;
}
