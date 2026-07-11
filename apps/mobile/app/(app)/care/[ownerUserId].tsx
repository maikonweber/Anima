import { Card, CardTitle, Muted } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { colors, spacing } from "@/constants/theme";
import {
  getSharedDashboard,
  hasIntelligentReportContent,
  hasPreConsultContent,
} from "@anima/shared";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function SharedDashboardScreen() {
  const { ownerUserId } = useLocalSearchParams<{ ownerUserId: string }>();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["shared-dashboard", ownerUserId],
    queryFn: () => getSharedDashboard(ownerUserId!),
    enabled: !!ownerUserId,
  });

  return (
    <Screen
      scroll
      loading={isLoading}
      title={data?.owner.nome ?? "Dashboard"}
      subtitle={data?.owner.email}
    >
      {isError ? <Muted>Sem permissão ou dashboard indisponível.</Muted> : null}

      {data ? (
        <View style={styles.list}>
          <Card>
            <CardTitle>Resumo da semana</CardTitle>
            <Text style={styles.stat}>
              Energia {Math.round(data.weekSummary.mediaEnergia)}
            </Text>
            <Muted>
              {data.weekSummary.quantidadeRegistros} registros ·{" "}
              {data.weekSummary.tendenciaSemana}
            </Muted>
          </Card>

          {data.alerts?.length ? (
            <Card>
              <CardTitle>Alertas</CardTitle>
              {data.alerts.map((a) => (
                <View key={a.id}>
                  <Text style={styles.itemTitle}>{a.title}</Text>
                  <Muted>{a.description}</Muted>
                </View>
              ))}
            </Card>
          ) : null}

          {hasPreConsultContent(data.preConsultSummary) ? (
            <Card>
              <CardTitle>Pré-consulta</CardTitle>
              {data.preConsultSummary?.subtitle ? (
                <Muted>{data.preConsultSummary.subtitle}</Muted>
              ) : null}
              {data.preConsultSummary?.points.map((p) => (
                <Muted key={p}>• {p}</Muted>
              ))}
            </Card>
          ) : null}

          {hasIntelligentReportContent(data.intelligentReport) ? (
            <Card>
              <CardTitle>Relatório inteligente</CardTitle>
              {data.intelligentReport?.recommendations?.map((r) => (
                <Muted key={r}>• {r}</Muted>
              ))}
              {data.intelligentReport?.risks?.map((r) => (
                <Muted key={r}>Risco: {r}</Muted>
              ))}
            </Card>
          ) : null}

          <Card>
            <CardTitle>Registros recentes</CardTitle>
            {data.diaryEntries.slice(0, 8).map((e) => (
              <View key={e.id} style={styles.entry}>
                <Muted>
                  {new Date(e.dataRegistro).toLocaleDateString("pt-BR")} · energia{" "}
                  {e.energiaInformada}
                </Muted>
                <Text numberOfLines={3} style={styles.entryText}>
                  {e.texto}
                </Text>
              </View>
            ))}
          </Card>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  stat: { fontSize: 22, fontWeight: "700", color: colors.violet },
  itemTitle: { fontWeight: "700", color: colors.text },
  entry: { gap: 4, paddingVertical: 6 },
  entryText: { color: colors.text, fontSize: 14, lineHeight: 20 },
});
