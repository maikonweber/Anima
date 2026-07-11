import { Card, CardTitle, Muted } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { colors, spacing } from "@/constants/theme";
import { useAuth } from "@/providers/auth-provider";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const LINKS = [
  { href: "/(app)/care/patients", title: "Acompanhamentos", subtitle: "Pacientes e dashboards Care" },
  { href: "/(app)/care/invite", title: "Convidar profissional", subtitle: "Compartilhe seu diário com consentimento" },
  { href: "/(app)/perfil", title: "Perfil", subtitle: "Conta e uso do plano" },
  { href: "/(app)/assinatura", title: "Planos", subtitle: "Essencial, Pleno e Cuidado" },
  { href: "/(app)/assinatura/gerenciar", title: "Gerenciar assinatura", subtitle: "Portal Stripe" },
] as const;

export default function MoreScreen() {
  const { user, logout } = useAuth();

  return (
    <Screen scroll title="Mais" subtitle={user?.email}>
      <View style={styles.list}>
        {LINKS.map((link) => (
          <Pressable key={link.href} onPress={() => router.push(link.href)}>
            <Card>
              <CardTitle>{link.title}</CardTitle>
              <Muted>{link.subtitle}</Muted>
            </Card>
          </Pressable>
        ))}
      </View>
      <Pressable onPress={() => void logout()} style={styles.logout}>
        <Text style={styles.logoutText}>Sair</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  logout: {
    marginTop: spacing.lg,
    alignItems: "center",
    padding: spacing.md,
  },
  logoutText: {
    color: colors.danger,
    fontWeight: "700",
    fontSize: 15,
  },
});
