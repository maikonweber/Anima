import { useAuth } from "@/providers/auth-provider";
import { colors } from "@/constants/theme";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function AppLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator color={colors.violet} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!user.emailVerified) {
    return <Redirect href="/(auth)/awaiting-verification" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="care/patients" options={{ headerShown: true, title: "Acompanhamentos" }} />
      <Stack.Screen name="care/[ownerUserId]" options={{ headerShown: true, title: "Dashboard compartilhado" }} />
      <Stack.Screen name="care/invite" options={{ headerShown: true, title: "Convidar profissional" }} />
      <Stack.Screen name="perfil" options={{ headerShown: true, title: "Perfil" }} />
      <Stack.Screen name="assinatura/index" options={{ headerShown: true, title: "Planos" }} />
      <Stack.Screen name="assinatura/sucesso" options={{ headerShown: true, title: "Assinatura" }} />
      <Stack.Screen name="assinatura/gerenciar" options={{ headerShown: true, title: "Gerenciar assinatura" }} />
      <Stack.Screen name="diary/new" options={{ headerShown: true, title: "Novo registro" }} />
      <Stack.Screen name="diary/[id]" options={{ headerShown: true, title: "Registro" }} />
      <Stack.Screen name="diary/edit/[id]" options={{ headerShown: true, title: "Editar" }} />
    </Stack>
  );
}
