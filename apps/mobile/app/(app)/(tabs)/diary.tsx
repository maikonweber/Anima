import { Button } from "@/components/ui/Button";
import { Card, Muted } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { colors, spacing } from "@/constants/theme";
import { fetchDiaryEntries, type DiaryEntry } from "@anima/shared";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

function EntryRow({ item }: { item: DiaryEntry }) {
  return (
    <Pressable onPress={() => router.push(`/(app)/diary/${item.id}`)}>
      <Card>
        <Text style={styles.date}>
          {new Date(item.dataRegistro).toLocaleDateString("pt-BR")}
        </Text>
        <Text numberOfLines={2} style={styles.text}>
          {item.texto}
        </Text>
        <Muted>Energia {item.energiaInformada}</Muted>
      </Card>
    </Pressable>
  );
}

export default function DiaryListScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ["diary-entries"],
    queryFn: () => fetchDiaryEntries({ page: 1, limit: 30 }),
  });

  return (
    <Screen title="Diário" subtitle="Sua linha do tempo emocional." style={{ flex: 1 }}>
      <Button title="Novo registro" onPress={() => router.push("/(app)/diary/new")} />
      {isLoading ? (
        <Muted>Carregando…</Muted>
      ) : isError ? (
        <View style={styles.gap}>
          <Muted>Não foi possível carregar os registros.</Muted>
          <Button title="Tentar de novo" variant="secondary" onPress={() => void refetch()} />
        </View>
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={data?.data ?? []}
          keyExtractor={(item) => item.id}
          refreshing={isRefetching}
          onRefresh={() => void refetch()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Muted>Nenhum registro ainda. Comece hoje.</Muted>}
          renderItem={({ item }) => <EntryRow item={item} />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm, paddingBottom: spacing.xl },
  gap: { gap: spacing.sm },
  date: { fontSize: 12, fontWeight: "600", color: colors.textFaint },
  text: { fontSize: 15, color: colors.text, lineHeight: 22 },
});
