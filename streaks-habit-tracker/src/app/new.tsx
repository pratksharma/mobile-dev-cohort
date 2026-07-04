import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { TimePicker } from "@/components/time-picker";
import { useHabits } from "@/hooks/use-habits";
import {
  ALL_WEEKDAYS,
  WEEKDAY_LABELS,
  type Frequency,
  type HabitDraft,
  type Weekday,
} from "@/lib/habits/types";

const EMOJI_CHOICES = ["💧", "💪", "📚", "🧘", "🏃", "💻", "🥗", "😴", "🧹", "✍️"];

export default function NewHabitScreen() {
  // When `id` is present we're editing an existing habit.
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { getHabit, create, update } = useHabits();

  const editing = id ? getHabit(id) : undefined;

  const [name, setName] = useState(editing?.name ?? "");
  const [emoji, setEmoji] = useState(editing?.emoji ?? EMOJI_CHOICES[0]);
  const [kind, setKind] = useState<Frequency["kind"]>(
    editing?.frequency.kind ?? "daily",
  );
  const [hour, setHour] = useState(editing?.frequency.hour ?? 8);
  const [minute, setMinute] = useState(editing?.frequency.minute ?? 0);
  const [weekdays, setWeekdays] = useState<Weekday[]>(
    editing?.frequency.kind === "weekly" ? editing.frequency.weekdays : [2, 4, 6],
  );

  const toggleWeekday = (w: Weekday) =>
    setWeekdays((current) =>
      current.includes(w)
        ? current.filter((d) => d !== w)
        : [...current, w].sort((a, b) => a - b),
    );

  const canSave = useMemo(() => {
    if (name.trim().length === 0) return false;
    if (kind === "weekly" && weekdays.length === 0) return false;
    return true;
  }, [name, kind, weekdays]);

  const onSave = async () => {
    const frequency: Frequency =
      kind === "daily"
        ? { kind: "daily", hour, minute }
        : { kind: "weekly", weekdays, hour, minute };

    const draft: HabitDraft = { name: name.trim(), emoji, frequency };

    if (editing) {
      await update(editing.id, draft);
    } else {
      await create(draft);
    }
    router.back();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Drink water"
        value={name}
        onChangeText={setName}
        autoFocus={!editing}
      />

      <Text style={styles.label}>Icon</Text>
      <View style={styles.emojiRow}>
        {EMOJI_CHOICES.map((e) => (
          <Pressable
            key={e}
            style={[styles.emojiChip, emoji === e && styles.emojiChipOn]}
            onPress={() => setEmoji(e)}
          >
            <Text style={styles.emojiText}>{e}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Frequency</Text>
      <View style={styles.segment}>
        {(["daily", "weekly"] as const).map((k) => (
          <Pressable
            key={k}
            style={[styles.segmentBtn, kind === k && styles.segmentBtnOn]}
            onPress={() => setKind(k)}
          >
            <Text style={[styles.segmentText, kind === k && styles.segmentTextOn]}>
              {k === "daily" ? "Daily" : "Weekly"}
            </Text>
          </Pressable>
        ))}
      </View>

      {kind === "weekly" && (
        <View style={styles.weekRow}>
          {ALL_WEEKDAYS.map((w) => {
            const on = weekdays.includes(w);
            return (
              <Pressable
                key={w}
                style={[styles.dayChip, on && styles.dayChipOn]}
                onPress={() => toggleWeekday(w)}
              >
                <Text style={[styles.dayText, on && styles.dayTextOn]}>
                  {WEEKDAY_LABELS[w]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <Text style={styles.label}>Reminder time</Text>
      <View style={styles.timeCard}>
        <TimePicker
          hour={hour}
          minute={minute}
          onChange={({ hour: h, minute: m }) => {
            setHour(h);
            setMinute(m);
          }}
        />
      </View>

      <Pressable
        style={[styles.save, !canSave && styles.saveDisabled]}
        disabled={!canSave}
        onPress={() => void onSave()}
      >
        <Text style={styles.saveText}>
          {editing ? "Save changes" : "Create habit"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  content: { padding: 16, gap: 8, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: "700", marginTop: 12, color: "#334" },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  emojiRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  emojiChip: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  emojiChipOn: { borderColor: "#208AEF", backgroundColor: "#E9F1FD" },
  emojiText: { fontSize: 24 },
  segment: {
    flexDirection: "row",
    backgroundColor: "#E4E9F0",
    borderRadius: 10,
    padding: 4,
  },
  segmentBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center" },
  segmentBtnOn: { backgroundColor: "white" },
  segmentText: { fontWeight: "600", color: "#667" },
  segmentTextOn: { color: "#208AEF" },
  weekRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  dayChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "transparent",
  },
  dayChipOn: { borderColor: "#208AEF", backgroundColor: "#E9F1FD" },
  dayText: { fontWeight: "600", color: "#667" },
  dayTextOn: { color: "#208AEF" },
  timeCard: { backgroundColor: "white", borderRadius: 12, padding: 16 },
  save: {
    marginTop: 24,
    backgroundColor: "#208AEF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveDisabled: { backgroundColor: "#A9C7EE" },
  saveText: { color: "white", fontSize: 16, fontWeight: "700" },
});
