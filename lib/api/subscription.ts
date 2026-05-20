import { api } from "@/lib/api-client";
import type {
  CheckoutResponse,
  Plan,
  PlanSlug,
  PortalResponse,
  SubscriptionSummary,
} from "@/types/subscription";

export async function fetchPlans() {
  return api<Plan[]>("/subscription/plans");
}

export async function fetchSubscriptionMe() {
  return api<SubscriptionSummary>("/subscription/me", { auth: true });
}

export async function checkout(planSlug: Exclude<PlanSlug, "essencial">) {
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

export async function subscribe(planSlug: Exclude<PlanSlug, "essencial">) {
  const res = await checkout(planSlug);
  window.location.href = res.url;
}
