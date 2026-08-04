import { JsonLd } from "@/components/seo/JsonLd";
import {
  clinicsSoftwareSchema,
  organizationSchema,
  softwareSchema,
  websiteSchema,
} from "@/components/seo/schema";

export function GlobalJsonLd() {
  return (
    <JsonLd
      data={[
        organizationSchema(),
        websiteSchema(),
        softwareSchema(),
        clinicsSoftwareSchema(),
      ]}
    />
  );
}
