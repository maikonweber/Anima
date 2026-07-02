"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api-client";
import { diaryEntrySchema } from "@/lib/validations/diary";
import {
  useDiaryEntry,
  useEmotions,
  useUpdateDiaryEntry,
} from "@/hooks/use-diary";
import { EnergySlider } from "@/components/diary/EnergySlider";
import {
  EmotionPicker,
  type SelectedEmotion,
} from "@/components/diary/EmotionPicker";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { HUMOR_OPTIONS, Select } from "@/components/ui/Select";

type DiaryEntry = NonNullable<ReturnType<typeof useDiaryEntry>["data"]>;
type EmotionList = NonNullable<ReturnType<typeof useEmotions>["data"]>;

export default function EditDiaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: entry, isLoading, error } = useDiaryEntry(id);
  const { data: emotions = [], isLoading: loadingEmotions } = useEmotions();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 animate-pulse space-y-4">
        <div className="h-4 w-32 bg-foreground/[0.06] rounded" />
        <div className="h-64 bg-foreground/[0.06] rounded-2xl" />
      </div>
    );
  }

  if (error || !entry) {
    const forbidden = error instanceof ApiError && error.status === 403;
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <ErrorMessage
          message={forbidden ? error.message : "Registro não encontrado."}
        />
        <Link href="/diary" className="block mt-4 text-sm text-anima-violet">
          ← Voltar à linha do tempo
        </Link>
      </div>
    );
  }

  return (
    <EditDiaryForm
      key={entry.id}
      id={id}
      entry={entry}
      emotions={emotions}
      loadingEmotions={loadingEmotions}
    />
  );
}

function EditDiaryForm({
  id,
  entry,
  emotions,
  loadingEmotions,
}: {
  id: string;
  entry: DiaryEntry;
  emotions: EmotionList;
  loadingEmotions: boolean;
}) {
  const router = useRouter();
  const updateEntry = useUpdateDiaryEntry();

  const [texto, setTexto] = useState(entry.texto);
  const [humor, setHumor] = useState(entry.humor ?? "");
  const [ansiedade, setAnsiedade] = useState(entry.ansiedadeInformada ?? 50);
  const [intensidadeEmocional, setIntensidadeEmocional] = useState(
    entry.intensidadeEmocional ?? 50,
  );
  const [tagsText, setTagsText] = useState(
    entry.tagsEmocionais?.join(", ") ?? "",
  );
  const [tracking, setTracking] = useState({
    sono: entry.tracking?.sono ?? 50,
    estresse: entry.tracking?.estresse ?? 50,
    socializacao: entry.tracking?.socializacao ?? 50,
    motivacao: entry.tracking?.motivacao ?? 50,
    burnout: entry.tracking?.burnout ?? 50,
  });
  const [energia, setEnergia] = useState(entry.energiaInformada);
  const [selectedEmotions, setSelectedEmotions] = useState<SelectedEmotion[]>(
    entry.emotions.map((e) => ({
      emotionId: e.emotionId,
      intensidade: e.intensidade ?? undefined,
    })),
  );
  const [observacoes, setObservacoes] = useState(entry.observacoes ?? "");
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
      await updateEntry.mutateAsync({
        id,
        data: {
          texto: parsed.data.texto,
          humor: parsed.data.humor,
          ansiedadeInformada: parsed.data.ansiedadeInformada,
          intensidadeEmocional: parsed.data.intensidadeEmocional,
          tagsEmocionais: parsed.data.tagsEmocionais,
          tracking: parsed.data.tracking,
          energiaInformada: parsed.data.energiaInformada,
          emotions: parsed.data.emotions,
          observacoes: parsed.data.observacoes ?? null,
        },
      });
      router.push(`/diary/${id}`);
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível salvar as alterações.",
      );
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Link
        href={`/diary/${id}`}
        className="text-xs text-foreground/40 hover:text-anima-violet transition-colors"
      >
        ← Voltar ao registro
      </Link>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mt-3 mb-1">
        Editar registro
      </h1>
      <p className="text-sm text-foreground/40 mb-8">
        Atualize como você se sentiu neste dia
      </p>

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
            className="w-full bg-transparent text-foreground/80 text-sm leading-relaxed resize-none focus:outline-none"
            required
          />
        </div>

        <div className="glass-panel p-5 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-foreground/70">
              Humor
            </label>
            <Select
              value={humor}
              onChange={(e) => setHumor(e.target.value)}
              aria-label="Humor"
            >
              {HUMOR_OPTIONS.map((opt) => (
                <option key={opt.value || "empty"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
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
            disabled={updateEntry.isPending}
          />
        </div>

        <div className="glass-panel p-5">
          <EmotionPicker
            emotions={emotions}
            selected={selectedEmotions}
            onChange={setSelectedEmotions}
            disabled={updateEntry.isPending}
            isLoading={loadingEmotions}
          />
        </div>

        <div className="glass-panel p-5 space-y-2">
          <label
            htmlFor="observacoes"
            className="text-sm font-medium text-foreground/70"
          >
            Observações (opcional)
          </label>
          <textarea
            id="observacoes"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={2}
            className="w-full bg-transparent text-foreground/80 text-sm resize-none focus:outline-none"
          />
        </div>

        <Button type="submit" isLoading={updateEntry.isPending}>
          Salvar alterações
        </Button>
      </form>
    </div>
  );
}
