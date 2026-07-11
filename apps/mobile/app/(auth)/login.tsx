import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { colors, spacing } from "@/constants/theme";
import { useAuth } from "@/providers/auth-provider";
import { ApiError, loginSchema } from "@anima/shared";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { login, googleLogin, user } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: googleClientId || "placeholder.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (user?.emailVerified) {
      router.replace("/(app)/(tabs)");
    } else if (user && !user.emailVerified) {
      router.replace("/(auth)/awaiting-verification");
    }
  }, [user]);

  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.params.id_token;
      if (idToken) {
        void (async () => {
          setLoading(true);
          setError(null);
          try {
            await googleLogin(idToken);
            router.replace("/(app)/(tabs)");
          } catch (e) {
            setError(
              e instanceof ApiError ? e.message : "Falha no login com Google",
            );
          } finally {
            setLoading(false);
          }
        })();
      }
    }
  }, [response, googleLogin]);

  async function onSubmit() {
    setError(null);
    const parsed = loginSchema.safeParse({ email, senha });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }
    setLoading(true);
    try {
      const u = await login(parsed.data.email, parsed.data.senha);
      if (!u.emailVerified) {
        router.replace("/(auth)/awaiting-verification");
      } else {
        router.replace("/(app)/(tabs)");
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Não foi possível entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scroll title="EmotiveCare" subtitle="Seu segundo cérebro emocional.">
      <View style={styles.form}>
        <TextField
          label="E-mail"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />
        <TextField
          label="Senha"
          secureTextEntry
          autoComplete="password"
          value={senha}
          onChangeText={setSenha}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Entrar" loading={loading} onPress={onSubmit} />
        {googleClientId ? (
          <Button
            title="Continuar com Google"
            variant="secondary"
            disabled={!request || loading}
            onPress={() => void promptAsync()}
          />
        ) : null}
        <Link href="/(auth)/forgot-password" style={styles.link}>
          Esqueci minha senha
        </Link>
        <Link href="/(auth)/register" style={styles.link}>
          Criar conta
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
