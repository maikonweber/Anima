import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DashboardRouteLayout } from "@/components/dashboard/DashboardRouteLayout";
import { NO_INDEX_METADATA } from "@/lib/seo/private-metadata";

export const metadata: Metadata = NO_INDEX_METADATA;

export default function SuporteLayout({ children }: { children: ReactNode }) {
  return <DashboardRouteLayout>{children}</DashboardRouteLayout>;
}
