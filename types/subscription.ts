export type PlanSlug = "essencial" | "pleno" | "cuidado" | "preview";

export type PlanLimits = {
  diaryEntriesPerMonth: number | null;
  aiAnalysesPerMonth: number | null;
  /** Mensagens do assistente conversacional por mês; `null` = sem teto no plano (raro — o chat ainda respeita limites da rota `/assistant/*`) */
  assistantMessagesPerMonth?: number | null;
  historyDays: number | null;
  careInvitesActive: number | null;
  accessiblePatients: number | null;
  canShareDashboard: boolean;
  canViewSharedDashboard: boolean;
};

export type SubscriptionSummary = {
  plan: { slug: PlanSlug; nome: string; limits: PlanLimits };
  status: "active" | "trialing" | "past_due" | "canceled" | string;
  currentPeriodEnd: string | null;
  stripeConfigured: boolean;
  /** Usuário com benefícios tipo Pleno via profissional no plano Cuidado */
  sponsoredByPsychologist?: boolean;
  /** Resposta em modo demonstração (slug pode ser `preview`) */
  preview?: boolean;
  usage: {
    period: string;
    diaryEntries: { used: number; limit: number | null };
    aiAnalyses: { used: number; limit: number | null };
    /** Assistente conversacional — omitido em clientes/backends mais antigos */
    assistantMessages?: { used: number; limit: number | null };
    careInvitesActive: { used: number; limit: number | null };
    accessiblePatients: { used: number; limit: number | null };
  };
};

export type Plan = {
  slug: PlanSlug;
  nome: string;
  descricao: string | null;
  limits: PlanLimits;
  stripePriceId: string | null;
};

export type PlanLimitErrorDetails = {
  limit?: number | null;
  used?: number;
  resetsAt?: string;
  planSlug?: string;
};

export type PlanLimitError = {
  statusCode: 402;
  error?: string;
  code: string;
  message: string;
  limit?: number | null;
  used?: number;
  resetsAt?: string;
  planSlug?: string;
  /** Corpo estruturado retornado pela API em alguns limites */
  details?: PlanLimitErrorDetails;
};

export type SubscriptionConfig = {
  paymentsEnabled: boolean;
  stripePublishableKey: string | null;
};

export type CheckoutResponse = { url: string };
export type PortalResponse = { url: string };
export type CancelResponse = { message: string };
