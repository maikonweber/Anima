import { Button } from "@/components/ui/Button";
import { EnergySlider } from "@/components/ui/EnergySlider";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { colors, spacing } from "@/constants/theme";
import {
  ApiError,
  diaryEntrySchema,
  fetchDiaryEntry,
  fetchEmotions,
  updateDiaryEntry,
} from "@anima/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function EditDiaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const entry = useQuery({
    queryKey: ["diary-entry", id],
    queryFn: () => fetchDiaryEntry(id!),
    enabled: !!id,
  });
  const emotions = useQuery({ queryKey: ["emotions"], queryFn: fetchEmotions });

  const [texto, setTexto] = useState("");
  const [energia, setEnergia] = useState(50);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entry.data) return;
    setTexto(entry.data.texto);
    setEnergia(entry.data.energiaInformada);
    setSelected(entry.data.emotions?.map((e) => e.emotionId) ?? []);
  }, [entry.data]);

  const activeEmotions = useMemo(
    () => (emotions.data ?? []).filter((e) => e.ativo),
    [emotions.data],
  );

  const update = useMutation({
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
      return updateDiaryEntry(id!, parsed.data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["diary-entry", id] });
      void queryClient.invalidateQueries({ queryKey: ["diary-entries"] });
      router.back();
    },
    onError: (e) => {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Falha");
    },
  });

  return (
    <Screen scroll loading={entry.isLoading} title="Editar registro">
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
              onPress={() =>
                setSelected((prev) =>
                  prev.includes(e.id)
                    ? prev.filter((x) => x !== e.id)
                    : [...prev, e.id],
                )
              }
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
      <Button title="Salvar" loading={update.isPending} onPress={() => update.mutate()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.violet, borderColor: colors.violet },
  chipText: { color: colors.text, fontSize: 13, fontWeight: "600" },
  chipTextOn: { color: "#fff" },
  error: { color: colors.danger, fontSize: 13 },
});
