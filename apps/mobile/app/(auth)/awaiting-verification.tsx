import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { colors, spacing } from "@/constants/theme";
import { useAuth } from "@/providers/auth-provider";
import { ApiError, resendVerificationApi } from "@anima/shared";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AwaitingVerificationScreen() {
  const { user, logout, refreshUser } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function resend() {
    if (!user?.email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await resendVerificationApi(user.email);
      setMessage(res.message || "E-mail reenviado.");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Falha ao reenviar");
    } finally {
      setLoading(false);
    }
  }

  async function checkAgain() {
    setLoading(true);
    setError(null);
    try {
      const u = await refreshUser();
      if (u?.emailVerified) {
        router.replace("/(app)/(tabs)");
      } else {
        setMessage("Ainda não verificamos seu e-mail. Tente de novo em instantes.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen
      scroll
      title="Verifique seu e-mail"
      subtitle={`Enviamos um link para ${user?.email ?? "seu e-mail"}.`}
    >
      <View style={styles.form}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {message ? <Text style={styles.ok}>{message}</Text> : null}
        <Button title="Já verifiquei" loading={loading} onPress={checkAgain} />
        <Button
          title="Reenviar e-mail"
          variant="secondary"
          loading={loading}
          onPress={resend}
        />
        <Button title="Sair" variant="ghost" onPress={() => void logout()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md, marginTop: spacing.md },
  error: { color: colors.danger, fontSize: 13 },
  ok: { color: colors.success, fontSize: 13 },
});
