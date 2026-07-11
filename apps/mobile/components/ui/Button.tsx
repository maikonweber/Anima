import { colors, spacing } from "@/constants/theme";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type Variant = "primary" | "secondary" | "ghost" | "danger";

export function Button({
  title,
  loading,
  variant = "primary",
  disabled,
  style,
  ...props
}: Omit<PressableProps, "style"> & {
  title: string;
  loading?: boolean;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
}) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#fff" : colors.violet}
        />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label` as const]]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  primary: {
    backgroundColor: colors.violet,
  },
  secondary: {
    backgroundColor: "rgba(124, 92, 191, 0.12)",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: "rgba(239, 68, 68, 0.12)",
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  label: {
    fontSize: 15,
    fontWeight: "600",
  },
  primaryLabel: { color: "#fff" },
  secondaryLabel: { color: colors.violet },
  ghostLabel: { color: colors.violet },
  dangerLabel: { color: colors.danger },
});
