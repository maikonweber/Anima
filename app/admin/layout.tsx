import type { Metadata } from "next";
import { NO_INDEX_METADATA } from "@/lib/seo/private-metadata";
import { AdminRouteLayout } from "@/components/admin/AdminRouteLayout";

export const metadata: Metadata = {
  ...NO_INDEX_METADATA,
  title: "Admin — EmotiveCare",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminRouteLayout>{children}</AdminRouteLayout>;
}
