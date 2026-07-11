import { Button } from "@/components/ui/Button";
import { Card, CardTitle, Muted } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { colors, spacing } from "@/constants/theme";
import { useAuth } from "@/providers/auth-provider";
import { fetchSubscriptionMe } from "@anima/shared";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

function UsageRow({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number | null;
}) {
  return (
    <Muted>
      {label}: {used}
      {limit == null ? " / ilimitado" : ` / ${limit}`}
    </Muted>
  );
}

export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth();
  const sub = useQuery({
    queryKey: ["subscription-me"],
    queryFn: fetchSubscriptionMe,
  });

  return (
    <Screen scroll title="Perfil" subtitle={user?.email}>
      <Card>
        <CardTitle>{user?.nome}</CardTitle>
        <Muted>
          Plano: {sub.data?.plan.nome ?? user?.subscription?.plan.nome ?? "—"}
        </Muted>
        <Muted>Status: {sub.data?.status ?? "—"}</Muted>
      </Card>

      {sub.data?.usage ? (
        <Card>
          <CardTitle>Uso no período {sub.data.usage.period}</CardTitle>
          <UsageRow
            label="Registros"
            used={sub.data.usage.diaryEntries.used}
            limit={sub.data.usage.diaryEntries.limit}
          />
          <UsageRow
            label="Análises IA"
            used={sub.data.usage.aiAnalyses.used}
            limit={sub.data.usage.aiAnalyses.limit}
          />
          {sub.data.usage.assistantMessages ? (
            <UsageRow
              label="Assistente"
              used={sub.data.usage.assistantMessages.used}
              limit={sub.data.usage.assistantMessages.limit}
            />
          ) : null}
        </Card>
      ) : null}

      <View style={styles.gap}>
        <Button title="Ver planos" onPress={() => router.push("/(app)/assinatura")} />
        <Button
          title="Atualizar dados"
          variant="secondary"
          onPress={() => void refreshUser()}
        />
        <Button title="Sair" variant="danger" onPress={() => void logout()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.sm },
});
