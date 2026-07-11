import { Button } from "@/components/ui/Button";
import { Card, Muted } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { colors, spacing } from "@/constants/theme";
import {
  ApiError,
  getAssistantSuggestions,
  listAssistantSessions,
  sendAssistantChatMessage,
  type AssistantMessage,
} from "@anima/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function AssistantScreen() {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [messages, setMessages] = useState<
    Pick<AssistantMessage, "id" | "role" | "content" | "criadoEm">[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [planLimit, setPlanLimit] = useState<string | null>(null);

  const suggestions = useQuery({
    queryKey: ["assistant-suggestions"],
    queryFn: getAssistantSuggestions,
  });

  const sessions = useQuery({
    queryKey: ["assistant-sessions"],
    queryFn: () => listAssistantSessions(1, 10),
  });

  const send = useMutation({
    mutationFn: () => sendAssistantChatMessage(message.trim(), sessionId),
    onSuccess: (res) => {
      setSessionId(res.sessionId);
      setMessages((prev) => [
        ...prev,
        {
          id: `local-${Date.now()}`,
          role: "user",
          content: message.trim(),
          criadoEm: new Date().toISOString(),
        },
        res.message,
      ]);
      setMessage("");
      setError(null);
      setPlanLimit(null);
      void queryClient.invalidateQueries({ queryKey: ["assistant-sessions"] });
    },
    onError: (e) => {
      if (e instanceof ApiError && e.status === 402) {
        setPlanLimit(
          e.planLimit?.message ??
            "Limite do plano atingido. Faça upgrade para continuar.",
        );
        return;
      }
      setError(e instanceof ApiError ? e.message : "Falha ao enviar");
    },
  });

  return (
    <Screen title="Assistente" subtitle="Conversas ancoradas no seu diário.">
      {planLimit ? (
        <Card>
          <Text style={styles.warn}>{planLimit}</Text>
          <Button
            title="Ver planos"
            onPress={() => router.push("/(app)/assinatura")}
          />
        </Card>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.gap}>
            <Muted>Comece uma conversa ou escolha uma sugestão.</Muted>
            {suggestions.data?.suggestions.slice(0, 3).map((s) => (
              <Pressable key={s} onPress={() => setMessage(s)}>
                <Card>
                  <Text style={styles.suggestion}>{s}</Text>
                </Card>
              </Pressable>
            ))}
            {sessions.data?.data.length ? (
              <Muted>Sessões recentes: {sessions.data.data.length}</Muted>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === "user" ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text
              style={
                item.role === "user" ? styles.userText : styles.aiText
              }
            >
              {item.content}
            </Text>
          </View>
        )}
      />

      <View style={styles.composer}>
        <TextField
          label="Mensagem"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <Button
          title="Enviar"
          loading={send.isPending}
          disabled={!message.trim()}
          onPress={() => send.mutate()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  listContent: { gap: spacing.sm, paddingBottom: spacing.md },
  gap: { gap: spacing.sm },
  bubble: {
    borderRadius: 16,
    padding: spacing.md,
    maxWidth: "90%",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.violet,
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userText: { color: "#fff", fontSize: 15, lineHeight: 22 },
  aiText: { color: colors.text, fontSize: 15, lineHeight: 22 },
  composer: { gap: spacing.sm },
  suggestion: { color: colors.violet, fontWeight: "600" },
  error: { color: colors.danger, fontSize: 13 },
  warn: { color: colors.warning, fontWeight: "600", marginBottom: spacing.sm },
});
