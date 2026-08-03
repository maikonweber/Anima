import type { Metadata } from "next";
import { ClinicRouteLayout } from "@/components/clinic/ClinicRouteLayout";
import { NO_INDEX_METADATA } from "@/lib/seo/private-metadata";

export const metadata: Metadata = {
  ...NO_INDEX_METADATA,
  title: "Clínicas",
  description:
    "EmotiveCare Clínicas — CRM e agenda para profissionais de saúde, separado do app do paciente.",
};

export default function ClinicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClinicRouteLayout>{children}</ClinicRouteLayout>;
}
