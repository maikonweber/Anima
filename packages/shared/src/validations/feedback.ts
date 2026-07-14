import { z } from "zod";

export const feedbackTypeSchema = z.enum([
  "support",
  "bug",
  "feature",
  "praise",
  "other",
]);

export const feedbackSchema = z.object({
  type: feedbackTypeSchema,
  subject: z
    .string()
    .trim()
    .max(120, "Assunto deve ter no máximo 120 caracteres."),
  message: z
    .string()
    .trim()
    .min(10, "Mensagem deve ter pelo menos 10 caracteres.")
    .max(4000, "Mensagem deve ter no máximo 4000 caracteres."),
  contact: z
    .string()
    .trim()
    .max(254, "Contato deve ter no máximo 254 caracteres."),
});

export type FeedbackFormInput = z.infer<typeof feedbackSchema>;
