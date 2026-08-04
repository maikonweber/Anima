import { api } from "../api-client";
import type {
  MarketingOfferByToken,
  MarketingRedemptionResult,
  RegisterWithMarketingCampaignPayload,
  RegisterWithMarketingCampaignResponse,
} from "../types/marketing";

export async function getMarketingOfferByToken(token: string) {
  return api<MarketingOfferByToken>(
    `/marketing-campaigns/by-token/${encodeURIComponent(token)}`,
  );
}

export async function redeemMarketingCampaign(token: string) {
  return api<MarketingRedemptionResult>("/marketing-campaigns/redeem", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ token }),
  });
}

export async function registerWithMarketingCampaign(
  payload: RegisterWithMarketingCampaignPayload,
) {
  return api<RegisterWithMarketingCampaignResponse>(
    "/marketing-campaigns/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
