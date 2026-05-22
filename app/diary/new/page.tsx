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
  const [humor, setHumor] = useState("");
  const [ansiedade, setAnsiedade] = useState(50);
  const [intensidadeEmocional, setIntensidadeEmocional] = useState(50);
  const [tagsText, setTagsText] = useState("");
  const [tracking, setTracking] = useState({
    sono: 50,
    estresse: 50,
    socializacao: 50,
    motivacao: 50,
    burnout: 50,
  });
  const [energia, setEnergia] = useState(50);
  const [selectedEmotions, setSelectedEmotions] = useState<SelectedEmotion[]>([]);
  const [observacoes, setObservacoes] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const tagsEmocionais = tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const parsed = diaryEntrySchema.safeParse({
      texto,
      humor: humor || undefined,
      ansiedadeInformada: ansiedade,
      intensidadeEmocional,
      tagsEmocionais: tagsEmocionais.length > 0 ? tagsEmocionais : undefined,
      tracking,
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
        humor: parsed.data.humor,
        ansiedadeInformada: parsed.data.ansiedadeInformada,
        intensidadeEmocional: parsed.data.intensidadeEmocional,
        tagsEmocionais: parsed.data.tagsEmocionais,
        tracking: parsed.data.tracking,
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

        <div className="glass-panel p-5 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-foreground/70">
              Humor
            </label>
            <select
              value={humor}
              onChange={(e) => setHumor(e.target.value)}
              className="w-full bg-transparent border border-foreground/[0.08] rounded-xl px-3 py-2 text-sm text-foreground/80"
            >
              <option value="">Escolher humor</option>
              <option value="Calmo">Calmo</option>
              <option value="Tenso">Tenso</option>
              <option value="Esperançoso">Esperançoso</option>
              <option value="Sobrecarregado">Sobrecarregado</option>
              <option value="Confuso">Confuso</option>
            </select>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1 text-sm text-foreground/70">
                <span>Ansiedade informada</span>
                <span>{ansiedade}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={ansiedade}
                onChange={(e) => setAnsiedade(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1 text-sm text-foreground/70">
                <span>Intensidade emocional</span>
                <span>{intensidadeEmocional}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={intensidadeEmocional}
                onChange={(e) => setIntensidadeEmocional(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 space-y-6">
          <div className="space-y-2">
            <label htmlFor="tagsEmocionais" className="text-sm font-medium text-foreground/70">
              Tags emocionais
            </label>
            <input
              id="tagsEmocionais"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="ansiedade, cansaço, foco"
              className="w-full bg-transparent border border-foreground/[0.08] rounded-xl px-3 py-2 text-sm text-foreground/80"
            />
            <p className="text-xs text-foreground/40">
              Separe as tags com vírgulas para identificar temas-chave.
            </p>
          </div>

          <div className="space-y-4">
            {(
              [
                { label: "Sono", field: "sono" },
                { label: "Estresse", field: "estresse" },
                { label: "Socialização", field: "socializacao" },
                { label: "Motivação", field: "motivacao" },
                { label: "Burnout", field: "burnout" },
              ] as const
            ).map(({ label, field }) => (
              <div key={field}>
                <div className="flex items-center justify-between mb-1 text-sm text-foreground/70">
                  <span>{label}</span>
                  <span>{tracking[field]}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={tracking[field]}
                  onChange={(e) =>
                    setTracking((current) => ({
                      ...current,
                      [field]: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
              </div>
            ))}
          </div>
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
