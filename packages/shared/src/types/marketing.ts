import type { User } from "./domain";

export type MarketingCampaignRedemptionStatus =
  | "PENDENTE"
  | "RESGATADO"
  | "EXPIRADO";

export interface MarketingOfferByToken {
  campaign: {
    nome: string;
    slug: string;
    planSlug: string;
    trialDays: number;
  };
  email: string;
  status: MarketingCampaignRedemptionStatus;
  linkExpiresAt: string;
  canRedeem: boolean;
  requiresLogin: boolean;
}

export interface MarketingRedemptionResult {
  planSlug: string;
  trialDays: number;
  expiresAt: string;
  campaign: {
    id: string;
    nome: string;
    slug: string;
  };
}

export interface RegisterWithMarketingCampaignPayload {
  nome: string;
  email: string;
  senha: string;
  token: string;
}

export interface RegisterWithMarketingCampaignResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  user: User;
  redemption: MarketingRedemptionResult;
  message: string;
}
