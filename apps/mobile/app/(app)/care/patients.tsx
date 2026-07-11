import { Card, CardTitle, Muted } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { colors, spacing } from "@/constants/theme";
import { listAccessibleUsers } from "@anima/shared";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export default function CarePatientsScreen() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["accessible-users"],
    queryFn: listAccessibleUsers,
  });

  return (
    <Screen
      scroll
      title="Acompanhamentos"
      subtitle="Pacientes que compartilharam o diário com você."
      loading={isLoading}
    >
      {isError ? <Muted>Não foi possível carregar.</Muted> : null}
      <View style={styles.list}>
        {(data ?? []).map((item) => (
          <Pressable
            key={item.inviteId}
            onPress={() =>
              router.push(`/(app)/care/${item.owner.id}`)
            }
          >
            <Card>
              <CardTitle>{item.owner.nome}</CardTitle>
              <Muted>{item.owner.email}</Muted>
            </Card>
          </Pressable>
        ))}
        {!isLoading && (data?.length ?? 0) === 0 ? (
          <Muted>Nenhum acompanhamento ativo.</Muted>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
});
