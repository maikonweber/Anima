import { Button } from "@/components/ui/Button";
import { Card, CardTitle, Muted } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { colors, spacing } from "@/constants/theme";
import { useAuth } from "@/providers/auth-provider";
import { fetchStreak, fetchWeekSummary } from "@anima/shared";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function DashboardScreen() {
  const { user } = useAuth();
  const week = useQuery({ queryKey: ["week-summary"], queryFn: fetchWeekSummary });
  const streak = useQuery({ queryKey: ["streak"], queryFn: fetchStreak });

  return (
    <Screen
      scroll
      title={`Olá, ${user?.nome?.split(" ")[0] ?? ""}`}
      subtitle="Como está sua energia emocional hoje?"
      loading={week.isLoading && streak.isLoading}
    >
      <Button
        title="Novo registro"
        onPress={() => router.push("/(app)/diary/new")}
      />

      <Card>
        <CardTitle>Streak</CardTitle>
        {streak.data ? (
          <>
            <Text style={styles.stat}>{streak.data.streakAtual} dias</Text>
            <Muted>{streak.data.alerta.mensagem}</Muted>
          </>
        ) : (
          <Muted>Carregando…</Muted>
        )}
      </Card>

      <Card>
        <CardTitle>Resumo da semana</CardTitle>
        {week.data ? (
          <>
            <Text style={styles.stat}>
              Energia média: {Math.round(week.data.mediaEnergia)}
            </Text>
            <Muted>
              {week.data.quantidadeRegistros} registros · tendência{" "}
              {week.data.tendenciaSemana.toLowerCase()}
            </Muted>
            {week.data.emocoesMaisFrequentes[0] ? (
              <Muted>
                Emoção frequente: {week.data.emocoesMaisFrequentes[0].nome}
              </Muted>
            ) : null}
          </>
        ) : week.isError ? (
          <Muted>Não foi possível carregar o resumo.</Muted>
        ) : (
          <Muted>Carregando…</Muted>
        )}
      </Card>

      <View style={styles.row}>
        <Button
          title="Ver diário"
          variant="secondary"
          style={styles.half}
          onPress={() => router.push("/(app)/(tabs)/diary")}
        />
        <Button
          title="Assistente"
          variant="secondary"
          style={styles.half}
          onPress={() => router.push("/(app)/(tabs)/assistente")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stat: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.violet,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  half: { flex: 1 },
});
