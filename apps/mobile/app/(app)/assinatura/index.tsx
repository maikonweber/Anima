import { Button } from "@/components/ui/Button";
import { Card, CardTitle, Muted } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { colors, spacing } from "@/constants/theme";
import {
  ApiError,
  checkout,
  fetchPlans,
  fetchSubscriptionMe,
  type PlanSlug,
} from "@anima/shared";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function PlansScreen() {
  const plans = useQuery({ queryKey: ["plans"], queryFn: fetchPlans });
  const me = useQuery({ queryKey: ["subscription-me"], queryFn: fetchSubscriptionMe });
  const [error, setError] = useState<string | null>(null);

  const buy = useMutation({
    mutationFn: (slug: Exclude<PlanSlug, "essencial" | "preview">) =>
      checkout(slug),
    onSuccess: async (res) => {
      await WebBrowser.openBrowserAsync(res.url);
    },
    onError: (e) => {
      setError(e instanceof ApiError ? e.message : "Falha no checkout");
    },
  });

  return (
    <Screen
      scroll
      title="Planos"
      subtitle="Escolha o nível de acompanhamento."
      loading={plans.isLoading}
    >
      {me.data ? (
        <Muted>Plano atual: {me.data.plan.nome}</Muted>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.list}>
        {(plans.data ?? []).map((plan) => {
          const paid =
            plan.slug !== "essencial" && plan.slug !== "preview";
          return (
            <Card key={plan.slug}>
              <CardTitle>{plan.nome}</CardTitle>
              {plan.descricao ? <Muted>{plan.descricao}</Muted> : null}
              <Muted>
                Diário/mês: {plan.limits.diaryEntriesPerMonth ?? "∞"} · Análises:{" "}
                {plan.limits.aiAnalysesPerMonth ?? "∞"}
              </Muted>
              {paid ? (
                <Button
                  title={
                    plan.checkoutEnabled === false
                      ? "Checkout indisponível"
                      : "Assinar"
                  }
                  disabled={plan.checkoutEnabled === false}
                  loading={buy.isPending}
                  onPress={() =>
                    buy.mutate(plan.slug as Exclude<PlanSlug, "essencial" | "preview">)
                  }
                />
              ) : (
                <Muted>Plano gratuito base</Muted>
              )}
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  error: { color: colors.danger, fontSize: 13 },
});
