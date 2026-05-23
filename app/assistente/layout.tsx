import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DiaryRouteLayout } from "@/components/diary/DiaryRouteLayout";
import { NO_INDEX_METADATA } from "@/lib/seo/private-metadata";

export const metadata: Metadata = NO_INDEX_METADATA;

export default function AssistenteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DiaryRouteLayout>{children}</DiaryRouteLayout>;
}
