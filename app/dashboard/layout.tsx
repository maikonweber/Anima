import type { Metadata } from "next";
import { DashboardRouteLayout } from "@/components/dashboard/DashboardRouteLayout";
import { NO_INDEX_METADATA } from "@/lib/seo/private-metadata";

export const metadata: Metadata = NO_INDEX_METADATA;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardRouteLayout>{children}</DashboardRouteLayout>;
}
