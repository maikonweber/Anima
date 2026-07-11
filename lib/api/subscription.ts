export {
  fetchSubscriptionConfig,
  fetchPlans,
  fetchSubscriptionMe,
  checkout,
  openBillingPortal,
  cancelSubscription,
} from "@anima/shared";

import { checkout as checkoutShared } from "@anima/shared";
import type { PlanSlug } from "@/types/subscription";

/** Web helper: opens Stripe Checkout in the same tab. */
export async function subscribe(
  planSlug: Exclude<PlanSlug, "essencial" | "preview">,
) {
  const res = await checkoutShared(planSlug);
  window.location.href = res.url;
}
