import { z } from "zod";

export const diaryEntrySchema = z.object({
  texto: z.string().min(3, "Descreva como você se sente (mín. 3 caracteres)"),
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
  dataRegistro: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export type DiaryEntryFormInput = z.infer<typeof diaryEntrySchema>;
