import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { colors, spacing } from "@/constants/theme";
import { ApiError, forgotPasswordApi, forgotPasswordSchema } from "@anima/shared";
import { Link } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    setMessage(null);
    const parsed = forgotPasswordSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "E-mail inválido");
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPasswordApi(parsed.data.email);
      setMessage(res.message || "Se o e-mail existir, enviamos instruções.");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Falha ao enviar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scroll title="Recuperar senha" subtitle="Enviaremos um link para o seu e-mail.">
      <View style={styles.form}>
        <TextField
          label="E-mail"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {message ? <Text style={styles.ok}>{message}</Text> : null}
        <Button title="Enviar link" loading={loading} onPress={onSubmit} />
        <Link href="/(auth)/login" style={styles.link}>
          Voltar ao login
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md, marginTop: spacing.md },
  error: { color: colors.danger, fontSize: 13 },
  ok: { color: colors.success, fontSize: 13 },
  link: {
    color: colors.violet,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
  },
});
