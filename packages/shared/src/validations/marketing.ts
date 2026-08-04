import { z } from "zod";

export const registerWithMarketingCampaignSchema = z.object({
  nome: z.string().min(1, "Informe seu nome."),
  email: z.string().email("E-mail inválido."),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export const redeemMarketingCampaignSchema = z.object({
  token: z.string().min(1, "Token da campanha é obrigatório."),
});
