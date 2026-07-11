import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { spacing } from "@/constants/theme";
import { useAuth } from "@/providers/auth-provider";
import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function SubscriptionSuccessScreen() {
  const { refreshUser } = useAuth();

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  return (
    <Screen
      title="Assinatura atualizada"
      subtitle="Obrigado! Seu plano será refletido em instantes."
    >
      <View style={{ gap: spacing.sm }}>
        <Button title="Ir ao início" onPress={() => router.replace("/(app)/(tabs)")} />
        <Button
          title="Ver perfil"
          variant="secondary"
          onPress={() => router.replace("/(app)/perfil")}
        />
      </View>
    </Screen>
  );
}
