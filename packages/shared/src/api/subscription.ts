import { api, getApiUrl } from "../api-client";
import type {
  CancelResponse,
  CheckoutResponse,
  Plan,
  PlanSlug,
  PortalResponse,
  SubscriptionConfig,
  SubscriptionSummary,
} from "../types/subscription";

export async function fetchSubscriptionConfig(): Promise<SubscriptionConfig> {
  const res = await fetch(`${getApiUrl()}/subscription/config`);
  if (!res.ok) {
    throw new Error("subscription/config failed");
  }
  return res.json() as Promise<SubscriptionConfig>;
}

export async function fetchPlans() {
  return api<Plan[]>("/subscription/plans");
}

export async function fetchSubscriptionMe() {
  return api<SubscriptionSummary>("/subscription/me", { auth: true });
}

export async function checkout(
  planSlug: Exclude<PlanSlug, "essencial" | "preview">,
) {
  return api<CheckoutResponse>("/subscription/checkout", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ planSlug }),
  });
}

export async function openBillingPortal() {
  return api<PortalResponse>("/subscription/portal", {
    method: "POST",
    auth: true,
  });
}

export async function cancelSubscription() {
  return api<CancelResponse>("/subscription/cancel", {
    method: "POST",
    auth: true,
  });
}

export async function subscribe(
  planSlug: Exclude<PlanSlug, "essencial" | "preview">,
) {
  return checkout(planSlug);
}
