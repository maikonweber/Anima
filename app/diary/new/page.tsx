"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ApiError } from "@/lib/api-client";
import { diaryEntrySchema } from "@/lib/validations/diary";
import { useCreateDiaryEntry, useEmotions } from "@/hooks/use-diary";
import { EnergySlider } from "@/components/diary/EnergySlider";
import { EmotionPicker, type SelectedEmotion } from "@/components/diary/EmotionPicker";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { UsageMeter } from "@/components/subscription/UsageMeter";
import { useSubscription } from "@/providers/subscription-provider";
import { isNearLimit } from "@/lib/subscription/utils";

export default function NewDiaryPage() {
  const router = useRouter();
  const { usage } = useSubscription();
  const { data: emotions = [], isLoading: loadingEmotions, error: emotionsError, refetch } = useEmotions();
  const createEntry = useCreateDiaryEntry();

  const [texto, setTexto] = useState("");
  const [energia, setEnergia] = useState(50);
  const [selectedEmotions, setSelectedEmotions] = useState<SelectedEmotion[]>([]);
  const [observacoes, setObservacoes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const parsed = diaryEntrySchema.safeParse({
      texto,
      energiaInformada: energia,
      emotions: selectedEmotions,
      observacoes: observacoes || undefined,
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Verifique os campos.");
      return;
    }

    try {
      const entry = await createEntry.mutateAsync({
        texto: parsed.data.texto,
        energiaInformada: parsed.data.energiaInformada,
        emotions: parsed.data.emotions,
        observacoes: parsed.data.observacoes,
      });
      router.push(`/diary/${entry.id}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 402) return;
      if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError("Não foi possível salvar o registro. Tente novamente.");
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-xs text-foreground/40 hover:text-anima-violet transition-colors"
        >
          ← Voltar ao início
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mt-3 mb-1">
          Novo registro
        </h1>
        <p className="text-sm text-foreground/40">
          Como você está se sentindo hoje?
        </p>
      </div>

      {emotionsError && (
        <div className="mb-4">
          <ErrorMessage
            message="Não foi possível carregar as emoções."
            onRetry={() => refetch()}
          />
        </div>
      )}

      {usage && (
        <div className="glass-panel p-4 mb-6">
          <UsageMeter
            label="Registros este mês"
            used={usage.diaryEntries.used}
            limit={usage.diaryEntries.limit}
          />
          {usage.diaryEntries.limit !== null &&
            isNearLimit(
              usage.diaryEntries.used,
              usage.diaryEntries.limit,
            ) && (
              <p className="text-xs text-amber-500/90 mt-2">
                Você está perto do limite.{" "}
                <Link href="/assinatura" className="underline">
                  Ver planos
                </Link>
              </p>
            )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {formError && <ErrorMessage message={formError} />}

        <div className="glass-panel p-5 space-y-2">
          <label htmlFor="texto" className="text-sm font-medium text-foreground/70">
            O que você está vivendo?
          </label>
          <textarea
            id="texto"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={5}
            placeholder="Descreva seus sentimentos, o dia, o que está no coração..."
            className="w-full bg-transparent text-foreground/80 placeholder:text-foreground/25 text-sm leading-relaxed resize-none focus:outline-none"
            required
          />
        </div>

        <div className="glass-panel p-5">
          <EnergySlider
            value={energia}
            onChange={setEnergia}
            disabled={createEntry.isPending}
          />
        </div>

        <NewDiaryEmotionPickerSection
          emotions={emotions}
          selected={selectedEmotions}
          onChange={setSelectedEmotions}
          disabled={createEntry.isPending}
          isLoading={loadingEmotions}
        />

        <div className="glass-panel p-5 space-y-2">
          <label htmlFor="observacoes" className="text-sm font-medium text-foreground/70">
            Observações (opcional)
          </label>
          <textarea
            id="observacoes"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={2}
            placeholder="Algo mais que queira registrar..."
            className="w-full bg-transparent text-foreground/80 placeholder:text-foreground/25 text-sm resize-none focus:outline-none"
          />
        </div>

        <Button type="submit" isLoading={createEntry.isPending}>
          Salvar e analisar
        </Button>
      </form>
    </div>
  );
}

function NewDiaryEmotionPickerSection(props: React.ComponentProps<typeof EmotionPicker>) {
  return (
    <div className="glass-panel p-5">
      <EmotionPicker {...props} />
    </div>
  );
}
