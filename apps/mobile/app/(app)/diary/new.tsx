import { Button } from "@/components/ui/Button";
import { EnergySlider } from "@/components/ui/EnergySlider";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { colors, spacing } from "@/constants/theme";
import {
  ApiError,
  analyzeDiaryEntry,
  createDiaryEntry,
  diaryEntrySchema,
  fetchEmotions,
} from "@anima/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function NewDiaryScreen() {
  const queryClient = useQueryClient();
  const emotions = useQuery({ queryKey: ["emotions"], queryFn: fetchEmotions });
  const [texto, setTexto] = useState("");
  const [energia, setEnergia] = useState(50);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const activeEmotions = useMemo(
    () => (emotions.data ?? []).filter((e) => e.ativo),
    [emotions.data],
  );

  const create = useMutation({
    mutationFn: async () => {
      const payload = {
        texto,
        energiaInformada: energia,
        emotions: selected.map((emotionId) => ({ emotionId })),
      };
      const parsed = diaryEntrySchema.safeParse(payload);
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "Dados inválidos");
      }
      const entry = await createDiaryEntry(parsed.data);
      try {
        await analyzeDiaryEntry(entry.id);
      } catch {
        /* analysis optional on create */
      }
      return entry;
    },
    onSuccess: (entry) => {
      void queryClient.invalidateQueries({ queryKey: ["diary-entries"] });
      void queryClient.invalidateQueries({ queryKey: ["week-summary"] });
      void queryClient.invalidateQueries({ queryKey: ["streak"] });
      router.replace(`/(app)/diary/${entry.id}`);
    },
    onError: (e) => {
      if (e instanceof ApiError && e.status === 402) {
        setError(e.planLimit?.message ?? "Limite do plano atingido.");
        return;
      }
      setError(e instanceof Error ? e.message : "Falha ao salvar");
    },
  });

  function toggleEmotion(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <Screen scroll title="Novo registro" subtitle="Como você está se sentindo?">
      <TextField
        label="Texto"
        multiline
        value={texto}
        onChangeText={setTexto}
        style={{ minHeight: 120, textAlignVertical: "top" }}
      />
      <EnergySlider label="Energia" value={energia} onChange={setEnergia} />
      <Text style={styles.label}>Emoções</Text>
      <View style={styles.chips}>
        {activeEmotions.map((e) => {
          const on = selected.includes(e.id);
          return (
            <Pressable
              key={e.id}
              onPress={() => toggleEmotion(e.id)}
              style={[styles.chip, on && styles.chipOn]}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>
                {e.nome}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        title="Salvar e analisar"
        loading={create.isPending}
        onPress={() => create.mutate()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: {
    backgroundColor: colors.violet,
    borderColor: colors.violet,
  },
  chipText: { color: colors.text, fontSize: 13, fontWeight: "600" },
  chipTextOn: { color: "#fff" },
  error: { color: colors.danger, fontSize: 13 },
});
