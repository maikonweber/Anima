import type { User } from "./domain";

export type ClinicTrialInviteStatus =
  | "PENDENTE"
  | "RESGATADO"
  | "EXPIRADO"
  | "REVOGADO";

export type ClinicTrialInvitePublic = {
  id: string;
  token: string;
  label: string | null;
  email: string | null;
  planSlug: string;
  trialDays: number;
  status: ClinicTrialInviteStatus | string;
  inviteUrl: string;
  linkExpiresAt: string;
  sentAt: string | null;
  redeemedAt: string | null;
  criadoEm: string;
};

export type ClinicTrialInviteByToken = {
  status: ClinicTrialInviteStatus | string;
  label: string | null;
  email: string | null;
  planSlug: string;
  trialDays: number;
  linkExpiresAt: string;
  canRedeem: boolean;
  requiresLogin: boolean;
  emailBound: boolean;
};

export type CreateClinicTrialInvitePayload = {
  label?: string;
  expiresInDays?: number;
  quantity?: number;
  emails?: string[];
};

export type CreateClinicTrialInvitesResponse = {
  invites: ClinicTrialInvitePublic[];
  total: number;
  sent?: number;
  emailResults?: Array<{
    email: string;
    status: "sent" | "error";
    message?: string;
    inviteId?: string;
  }>;
};

export type ClinicTrialRedemptionResult = {
  planSlug: string;
  trialDays: number;
  expiresAt: string;
};

export type RegisterWithClinicTrialInvitePayload = {
  nome: string;
  email: string;
  senha: string;
  token: string;
};

export type RegisterWithClinicTrialInviteResponse = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  user: User;
  redemption: ClinicTrialRedemptionResult;
  message: string;
};
