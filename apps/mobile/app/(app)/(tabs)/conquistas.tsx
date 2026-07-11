import { Card, CardTitle, Muted } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { colors, spacing } from "@/constants/theme";
import { fetchAchievements } from "@anima/shared";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, Text, View } from "react-native";

export default function AchievementsScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ["achievements"],
    queryFn: fetchAchievements,
  });

  return (
    <Screen
      scroll
      title="Conquistas"
      subtitle="Marcos da sua consistência emocional."
      loading={isLoading}
    >
      {data ? (
        <Card>
          <CardTitle>
            {data.resumo.desbloqueadas}/{data.resumo.total} desbloqueadas
          </CardTitle>
          <Muted>Streak atual: {data.resumo.streakAtual} dias</Muted>
        </Card>
      ) : null}

      <View style={styles.list}>
        {data?.achievements.map((a) => (
          <Card key={a.codigo}>
            <View style={styles.row}>
              <Text style={styles.title}>{a.titulo}</Text>
              <Text
                style={[
                  styles.badge,
                  a.desbloqueado ? styles.unlocked : styles.locked,
                ]}
              >
                {a.desbloqueado ? "✓" : `${a.progresso.percentual}%`}
              </Text>
            </View>
            <Muted>{a.descricao}</Muted>
            <Muted>
              Progresso {a.progresso.atual}/{a.progresso.meta}
            </Muted>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  badge: {
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
  },
  unlocked: {
    color: colors.success,
    backgroundColor: "rgba(34, 197, 94, 0.12)",
  },
  locked: {
    color: colors.textMuted,
    backgroundColor: colors.border,
  },
});
