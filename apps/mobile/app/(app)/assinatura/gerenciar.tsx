import { Button } from "@/components/ui/Button";
import { Card, CardTitle, Muted } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { colors, spacing } from "@/constants/theme";
import { useAuth } from "@/providers/auth-provider";
import {
  ApiError,
  cancelSubscription,
  fetchSubscriptionMe,
  openBillingPortal,
} from "@anima/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ManageSubscriptionScreen() {
  const { refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const me = useQuery({ queryKey: ["subscription-me"], queryFn: fetchSubscriptionMe });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const portal = useMutation({
    mutationFn: openBillingPortal,
    onSuccess: async (res) => {
      await WebBrowser.openBrowserAsync(res.url);
    },
    onError: (e) => {
      setError(e instanceof ApiError ? e.message : "Falha ao abrir portal");
    },
  });

  const cancel = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: async (res) => {
      setMessage(res.message);
      await refreshUser();
      void queryClient.invalidateQueries({ queryKey: ["subscription-me"] });
    },
    onError: (e) => {
      setError(e instanceof ApiError ? e.message : "Falha ao cancelar");
    },
  });

  return (
    <Screen scroll title="Gerenciar assinatura" loading={me.isLoading}>
      {me.data ? (
        <Card>
          <CardTitle>{me.data.plan.nome}</CardTitle>
          <Muted>Status: {me.data.status}</Muted>
          {me.data.currentPeriodEnd ? (
            <Muted>
              Período até{" "}
              {new Date(me.data.currentPeriodEnd).toLocaleDateString("pt-BR")}
            </Muted>
          ) : null}
        </Card>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {message ? <Text style={styles.ok}>{message}</Text> : null}

      <View style={styles.gap}>
        <Button
          title="Abrir portal Stripe"
          loading={portal.isPending}
          onPress={() => portal.mutate()}
        />
        <Button
          title="Cancelar assinatura"
          variant="danger"
          loading={cancel.isPending}
          onPress={() => cancel.mutate()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.sm },
  error: { color: colors.danger, fontSize: 13 },
  ok: { color: colors.success, fontSize: 13 },
});
