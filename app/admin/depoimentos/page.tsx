import type { Metadata } from "next";
import { NO_INDEX_METADATA } from "@/lib/seo/private-metadata";
import { HomeTestimonialsAdminView } from "@/components/admin/HomeTestimonialsAdminView";

export const metadata: Metadata = {
  ...NO_INDEX_METADATA,
  title: "Depoimentos — Admin",
};

export default function AdminTestimonialsPage() {
  return <HomeTestimonialsAdminView />;
}
