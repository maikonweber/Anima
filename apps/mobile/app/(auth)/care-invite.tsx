import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { colors, spacing } from "@/constants/theme";
import { useAuth } from "@/providers/auth-provider";
import {
  ApiError,
  acceptInvite,
  getInviteByToken,
  registerWithInvite,
  registerWithInviteSchema,
  type CareInviteByToken,
} from "@anima/shared";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CareInviteScreen() {
  const { token: tokenParam } = useLocalSearchParams<{ token?: string }>();
  const token = typeof tokenParam === "string" ? tokenParam : "";
  const { user, setSession, logout } = useAuth();
  const [invite, setInvite] = useState<CareInviteByToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Convite inválido");
      setLoading(false);
      return;
    }
    void (async () => {
      try {
        const data = await getInviteByToken(token);
        setInvite(data);
        setEmail(data.viewerEmail);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Convite não encontrado");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  async function acceptExisting() {
    if (!token) return;
    setSubmitting(true);
    setError(null);
    try {
      await acceptInvite(token);
      router.replace("/(app)/care/patients");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Falha ao aceitar");
    } finally {
      setSubmitting(false);
    }
  }

  async function registerNew() {
    if (!token) return;
    const parsed = registerWithInviteSchema.safeParse({ nome, email, senha });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await registerWithInvite({
        ...parsed.data,
        inviteToken: token,
      });
      setSession(res);
      if (res.requiresViewerPlan) {
        router.replace("/(app)/(tabs)/more");
        return;
      }
      router.replace("/(app)/care/patients");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Falha no cadastro");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen
      scroll
      loading={loading}
      title="Convite Care"
      subtitle={
        invite
          ? `${invite.owner.nome} convidou você para acompanhar o diário.`
          : undefined
      }
    >
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {invite && !invite.expirado ? (
        user ? (
          <View style={styles.form}>
            <Text style={styles.muted}>
              Aceitar como {user.email}?
            </Text>
            <Button
              title="Aceitar convite"
              loading={submitting}
              onPress={acceptExisting}
            />
            <Button title="Usar outra conta" variant="ghost" onPress={() => void logout()} />
          </View>
        ) : (
          <View style={styles.form}>
            <TextField label="Nome" value={nome} onChangeText={setNome} />
            <TextField
              label="E-mail"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextField
              label="Senha"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
            <Button
              title="Criar conta e aceitar"
              loading={submitting}
              onPress={registerNew}
            />
          </View>
        )
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md },
  error: { color: colors.danger, fontSize: 13 },
  muted: { color: colors.textMuted, fontSize: 14 },
});
