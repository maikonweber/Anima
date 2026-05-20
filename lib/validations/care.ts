import { z } from "zod";

export const inviteEmailSchema = z.object({
  viewerEmail: z
    .string()
    .min(1, "Informe o e-mail do acompanhante.")
    .email("E-mail inválido."),
});

export const registerWithInviteSchema = z.object({
  nome: z.string().min(1, "Informe seu nome."),
  email: z.string().email("E-mail inválido."),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});
