import { colors, spacing } from "@/constants/theme";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ReactNode } from "react";

export function Screen({
  children,
  scroll,
  title,
  subtitle,
  loading,
  style,
  ...props
}: ViewProps & {
  children: ReactNode;
  scroll?: boolean;
  title?: string;
  subtitle?: string;
  loading?: boolean;
}) {
  const body = loading ? (
    <View style={styles.loading}>
      <ActivityIndicator color={colors.violet} size="large" />
    </View>
  ) : (
    <>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, style]}
          keyboardShouldPersistTaps="handled"
          {...props}
        >
          {body}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.flex, style]} {...props}>
          {body}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
    marginTop: -8,
  },
  loading: {
    flex: 1,
    minHeight: 200,
    alignItems: "center",
    justifyContent: "center",
  },
});
