import { getApiUrl } from "@/lib/api-client";

export type FeatureFlags = {
  previewMode: boolean;
};

export async function fetchFeatureFlags(): Promise<FeatureFlags> {
  const res = await fetch(`${getApiUrl()}/feature-flags`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("feature-flags failed");
  }
  return res.json() as Promise<FeatureFlags>;
}
