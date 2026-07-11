import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { colors, spacing } from "@/constants/theme";
import { useAuth } from "@/providers/auth-provider";
import { ApiError, registerSchema } from "@anima/shared";
import { Link, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    const parsed = registerSchema.safeParse({ nome, email, senha });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }
    setLoading(true);
    try {
      const u = await register(
        parsed.data.nome,
        parsed.data.email,
        parsed.data.senha,
      );
      if (!u.emailVerified) {
        router.replace("/(auth)/awaiting-verification");
      } else {
        router.replace("/(app)/(tabs)");
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Não foi possível criar a conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scroll title="Criar conta" subtitle="Comece grátis. Seus dados são seus.">
      <View style={styles.form}>
        <TextField label="Nome" value={nome} onChangeText={setNome} />
        <TextField
          label="E-mail"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          label="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Criar conta" loading={loading} onPress={onSubmit} />
        <Link href="/(auth)/login" style={styles.link}>
          Já tenho conta
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md, marginTop: spacing.md },
  error: { color: colors.danger, fontSize: 13 },
  link: {
    color: colors.violet,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
  },
});
