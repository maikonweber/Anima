import { colors, spacing } from "@/constants/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function EnergySlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const clamp = (n: number) => Math.max(0, Math.min(100, n));

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{Math.round(value)}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamp(value)}%` }]} />
      </View>
      <View style={styles.controls}>
        {[-10, -1, 1, 10].map((delta) => (
          <Pressable
            key={delta}
            onPress={() => onChange(clamp(value + delta))}
            style={styles.chip}
          >
            <Text style={styles.chipText}>
              {delta > 0 ? `+${delta}` : delta}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
  },
  value: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.violet,
  },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.violet,
  },
  controls: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  chip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(124, 92, 191, 0.1)",
  },
  chipText: {
    color: colors.violet,
    fontWeight: "600",
    fontSize: 13,
  },
});
