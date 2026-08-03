import type { Metadata } from "next";
import { ClinicRouteLayout } from "@/components/clinic/ClinicRouteLayout";
import { NO_INDEX_METADATA } from "@/lib/seo/private-metadata";

export const metadata: Metadata = NO_INDEX_METADATA;

export default function ClinicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClinicRouteLayout>{children}</ClinicRouteLayout>;
}
