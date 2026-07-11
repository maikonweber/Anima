import { Button } from "@/components/ui/Button";
import { Card, CardTitle, Muted } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { colors, spacing } from "@/constants/theme";
import {
  fetchCorrelations,
  fetchMonthlyReport,
  fetchTrends,
} from "@anima/shared";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";

export default function InsightsScreen() {
  const trends = useQuery({
    queryKey: ["trends", 30],
    queryFn: () => fetchTrends(30),
  });
  const monthly = useQuery({
    queryKey: ["monthly-report"],
    queryFn: () => fetchMonthlyReport(),
  });
  const correlations = useQuery({
    queryKey: ["correlations"],
    queryFn: () => fetchCorrelations(90),
  });

  return (
    <Screen
      scroll
      title="Insights"
      subtitle="Tendências e padrões da sua jornada."
      loading={trends.isLoading && monthly.isLoading}
    >
      <Card>
        <CardTitle>Últimos 30 dias</CardTitle>
        {trends.data ? (
          <>
            <Text style={styles.stat}>
              {trends.data.totais.registros} registros
            </Text>
            <Muted>
              Energia média:{" "}
              {trends.data.totais.mediaEnergia != null
                ? Math.round(trends.data.totais.mediaEnergia)
                : "—"}{" "}
              · {trends.data.totais.tendencia}
            </Muted>
          </>
        ) : (
          <Muted>Sem dados de tendência.</Muted>
        )}
      </Card>

      <Card>
        <CardTitle>Relatório mensal</CardTitle>
        {monthly.data ? (
          <>
            <Muted>Mês {monthly.data.mes}</Muted>
            <Text style={styles.stat}>
              {monthly.data.quantidadeRegistros} registros
            </Text>
            <Muted>
              Energia média:{" "}
              {monthly.data.mediaEnergia != null
                ? Math.round(monthly.data.mediaEnergia)
                : "—"}
            </Muted>
            {monthly.data.emocoesMaisFrequentes[0] ? (
              <Muted>
                Emoção frequente: {monthly.data.emocoesMaisFrequentes[0].nome}
              </Muted>
            ) : null}
          </>
        ) : (
          <Muted>Sem relatório ainda.</Muted>
        )}
      </Card>

      <Card>
        <CardTitle>Correlações</CardTitle>
        {correlations.data?.correlacoes?.length ? (
          <View style={styles.gap}>
            {correlations.data.correlacoes.slice(0, 5).map((c) => (
              <View key={c.metrica}>
                <Text style={styles.corrTitle}>{c.metrica}</Text>
                <Muted>{c.interpretacao}</Muted>
              </View>
            ))}
          </View>
        ) : (
          <Muted>Registre mais dias para ver correlações.</Muted>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stat: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.violet,
  },
  gap: { gap: spacing.sm },
  corrTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
});
