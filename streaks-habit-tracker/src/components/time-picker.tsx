/**
 * Lightweight in-app time picker (no native dependency). Hour/minute steppers
 * that wrap around, plus quick +/- controls. Minute steps by 5.
 */
import { Pressable, StyleSheet, Text, View } from "react-native";

import { formatTime } from "@/lib/habits/format";

function wrap(value: number, delta: number, max: number): number {
  return (value + delta + max) % max;
}

function Stepper({
  label,
  value,
  onChange,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max: number;
  step: number;
}) {
  return (
    <View style={styles.stepper}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <Pressable
          style={styles.stepBtn}
          onPress={() => onChange(wrap(value, -step, max))}
        >
          <Text style={styles.stepBtnText}>−</Text>
        </Pressable>
        <Text style={styles.stepValue}>{String(value).padStart(2, "0")}</Text>
        <Pressable
          style={styles.stepBtn}
          onPress={() => onChange(wrap(value, step, max))}
        >
          <Text style={styles.stepBtnText}>＋</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function TimePicker({
  hour,
  minute,
  onChange,
}: {
  hour: number;
  minute: number;
  onChange: (next: { hour: number; minute: number }) => void;
}) {
  return (
    <View>
      <View style={styles.row}>
        <Stepper
          label="Hour"
          value={hour}
          max={24}
          step={1}
          onChange={(h) => onChange({ hour: h, minute })}
        />
        <Text style={styles.colon}>:</Text>
        <Stepper
          label="Minute"
          value={minute}
          max={60}
          step={5}
          onChange={(m) => onChange({ hour, minute: m })}
        />
      </View>
      <Text style={styles.preview}>Reminder at {formatTime(hour, minute)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  colon: { fontSize: 28, fontWeight: "700", marginHorizontal: 8, marginTop: 18 },
  stepper: { alignItems: "center" },
  stepperLabel: { fontSize: 12, color: "#889", marginBottom: 6 },
  stepperControls: { flexDirection: "row", alignItems: "center", gap: 12 },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E9F1FD",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBtnText: { fontSize: 22, color: "#208AEF", fontWeight: "700" },
  stepValue: { fontSize: 26, fontWeight: "700", minWidth: 44, textAlign: "center" },
  preview: { textAlign: "center", color: "#667", marginTop: 10 },
});
