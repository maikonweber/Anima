import { z } from "zod";

export const registerWithClinicTrialInviteSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const redeemClinicTrialInviteSchema = z.object({
  token: z.string().min(1),
});
