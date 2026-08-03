import { z } from "zod";

export const diaryEntryVisibilitySchema = z.enum([
  "PRIVADO",
  "COMPARTILHADO",
]);

export const diaryEntrySchema = z.object({
  texto: z.string().min(3, "Descreva como você se sente (mín. 3 caracteres)"),
  humor: z.string().optional(),
  ansiedadeInformada: z.number().min(0).max(100).optional(),
  intensidadeEmocional: z.number().min(0).max(100).optional(),
  tagsEmocionais: z.array(z.string().min(1)).optional(),
  tracking: z
    .object({
      sono: z.number().min(0).max(100).optional(),
      estresse: z.number().min(0).max(100).optional(),
      socializacao: z.number().min(0).max(100).optional(),
      motivacao: z.number().min(0).max(100).optional(),
      burnout: z.number().min(0).max(100).optional(),
    })
    .optional(),
  energiaInformada: z.number().min(0).max(100),
  emotions: z
    .array(
      z.object({
        emotionId: z.string().min(1),
        intensidade: z.number().min(1).max(5).optional(),
      }),
    )
    .min(1, "Selecione pelo menos uma emoção"),
  observacoes: z.string().optional(),
  visibility: diaryEntryVisibilitySchema.default("PRIVADO"),
  dataRegistro: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export type DiaryEntryFormInput = z.infer<typeof diaryEntrySchema>;
