import type { Metadata } from "next";
import { CareRouteLayout } from "@/components/care/CareRouteLayout";
import { NO_INDEX_METADATA } from "@/lib/seo/private-metadata";

export const metadata: Metadata = NO_INDEX_METADATA;

export default function CareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CareRouteLayout>{children}</CareRouteLayout>;
}
