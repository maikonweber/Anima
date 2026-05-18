import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido").max(255),
  senha: z
    .string()
    .min(6, "Senha deve ter entre 6 e 128 caracteres")
    .max(128),
});

export const registerSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(255, "Máx. 255 caracteres"),
  email: z.string().email("E-mail inválido").max(255),
  senha: z
    .string()
    .min(6, "Senha deve ter entre 6 e 128 caracteres")
    .max(128),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido").max(255),
});

export const resetPasswordFormSchema = z
  .object({
    token: z.string().min(1, "Link inválido"),
    senha: z
      .string()
      .min(6, "Mínimo 6 caracteres")
      .max(128, "Máx. 128 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>;
