import { colors, spacing } from "@/constants/theme";
import { StyleSheet, Text, View, type ViewProps } from "react-native";
import type { ReactNode } from "react";

export function Card({
  children,
  style,
  ...props
}: ViewProps & { children: ReactNode }) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Muted({ children }: { children: ReactNode }) {
  return <Text style={styles.muted}>{children}</Text>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  muted: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
