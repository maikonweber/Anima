import { Button } from "@/components/ui/Button";
import { Card, CardTitle, Muted } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { colors, spacing } from "@/constants/theme";
import {
  ApiError,
  analyzeDiaryEntry,
  deleteDiaryEntry,
  fetchDiaryAnalysis,
  fetchDiaryEntry,
  getCategoryFromEnergy,
  getCategoryStyle,
} from "@anima/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function DiaryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const entry = useQuery({
    queryKey: ["diary-entry", id],
    queryFn: () => fetchDiaryEntry(id!),
    enabled: !!id,
  });

  const analysis = useQuery({
    queryKey: ["diary-analysis", id],
    queryFn: () => fetchDiaryAnalysis(id!),
    enabled: !!id,
  });

  const analyze = useMutation({
    mutationFn: () => analyzeDiaryEntry(id!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["diary-analysis", id] });
    },
  });

  const remove = useMutation({
    mutationFn: () => deleteDiaryEntry(id!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["diary-entries"] });
      router.replace("/(app)/(tabs)/diary");
    },
  });

  const cat =
    analysis.data?.categoriaEnergia ??
    (entry.data
      ? getCategoryFromEnergy(entry.data.energiaInformada)
      : null);
  const catStyle = cat ? getCategoryStyle(cat) : null;

  return (
    <Screen scroll loading={entry.isLoading} title="Registro">
      {entry.data ? (
        <>
          <Muted>
            {new Date(entry.data.dataRegistro).toLocaleString("pt-BR")}
          </Muted>
          <Text style={styles.body}>{entry.data.texto}</Text>
          <Muted>Energia informada: {entry.data.energiaInformada}</Muted>
          {entry.data.emotions?.length ? (
            <Muted>
              Emoções: {entry.data.emotions.map((e) => e.nome).join(", ")}
            </Muted>
          ) : null}

          <View style={styles.row}>
            <Button
              title="Editar"
              variant="secondary"
              style={styles.half}
              onPress={() => router.push(`/(app)/diary/edit/${id}`)}
            />
            <Button
              title="Analisar"
              style={styles.half}
              loading={analyze.isPending}
              onPress={() => analyze.mutate()}
            />
          </View>

          {analyze.error instanceof ApiError && analyze.error.status === 402 ? (
            <Card>
              <Text style={styles.warn}>
                {analyze.error.planLimit?.message ?? "Limite de análises atingido."}
              </Text>
              <Button
                title="Ver planos"
                onPress={() => router.push("/(app)/assinatura")}
              />
            </Card>
          ) : null}

          {analysis.data ? (
            <Card>
              <CardTitle>Análise SENTIO</CardTitle>
              {catStyle ? (
                <Text style={{ color: catStyle.color, fontWeight: "700" }}>
                  {catStyle.label} · energia {analysis.data.energiaCalculada}
                </Text>
              ) : null}
              <Muted>{analysis.data.resumoEmocional}</Muted>
              <Muted>Necessidade: {analysis.data.necessidadeIdentificada}</Muted>
              <Muted>Desejo: {analysis.data.desejoIdentificado}</Muted>
              <Muted>Ação sugerida: {analysis.data.acaoSugerida}</Muted>
              <Muted>
                Composta: {analysis.data.emocaoComposta} · Oculta:{" "}
                {analysis.data.emocaoOculta}
              </Muted>
            </Card>
          ) : (
            <Muted>Sem análise ainda. Toque em Analisar.</Muted>
          )}

          <Button
            title="Excluir registro"
            variant="danger"
            loading={remove.isPending}
            onPress={() => remove.mutate()}
          />
        </>
      ) : (
        <Muted>Registro não encontrado.</Muted>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  row: { flexDirection: "row", gap: spacing.sm },
  half: { flex: 1 },
  warn: { color: colors.warning, fontWeight: "600", marginBottom: spacing.sm },
});
