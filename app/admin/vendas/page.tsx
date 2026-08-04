import type { Metadata } from "next";
import { NO_INDEX_METADATA } from "@/lib/seo/private-metadata";
import { SalesPlaybookView } from "@/components/admin/SalesPlaybookView";

export const metadata: Metadata = {
  ...NO_INDEX_METADATA,
  title: "Playbook de vendas — Admin",
};

export default function AdminVendasPage() {
  return <SalesPlaybookView />;
}
