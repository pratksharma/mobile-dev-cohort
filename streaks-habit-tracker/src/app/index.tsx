import { Link, useRouter } from "expo-router";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PermissionBanner } from "@/components/permission-banner";
import { useHabits } from "@/hooks/use-habits";
import { describeFrequency } from "@/lib/habits/format";
import { effectiveStreak, isCompletedToday } from "@/lib/habits/streak";
import type { Habit } from "@/lib/habits/types";

function HabitRow({
  habit,
  onComplete,
}: {
  habit: Habit;
  onComplete: (id: string) => void;
}) {
  const done = isCompletedToday(habit);
  const streak = effectiveStreak(habit);

  return (
    <Link href={`/habit/${habit.id}`} asChild>
      <Pressable style={styles.row}>
        <Text style={styles.emoji}>{habit.emoji || "✅"}</Text>
        <View style={styles.rowMain}>
          <Text style={styles.name}>{habit.name}</Text>
          <Text style={styles.meta}>{describeFrequency(habit.frequency)}</Text>
          <Text style={styles.streak}>
            {streak > 0 ? `🔥 ${streak} day streak` : "No active streak"}
          </Text>
        </View>
        <Pressable
          hitSlop={8}
          style={[styles.done, done && styles.doneOn]}
          onPress={() => onComplete(habit.id)}
        >
          <Text style={[styles.doneText, done && styles.doneTextOn]}>
            {done ? "Done" : "Mark"}
          </Text>
        </Pressable>
      </Pressable>
    </Link>
  );
}

export default function Index() {
  const { habits, loading, complete } = useHabits();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={habits}
        keyExtractor={(h) => h.id}
        ListHeaderComponent={
          <View>
            <PermissionBanner />
            <View style={styles.headerRow}>
              <Text style={styles.heading}>Your habits</Text>
              <Link href="/settings" style={styles.settingsLink}>
                Settings
              </Link>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <HabitRow habit={item} onComplete={complete} />
        )}
        ListEmptyComponent={
          loading ? null : (
            <Text style={styles.empty}>
              No habits yet. Tap “New habit” to add your first one.
            </Text>
          )
        }
      />
      <Pressable style={styles.fab} onPress={() => router.push("/new")}>
        <Text style={styles.fabText}>＋ New habit</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  listContent: { padding: 16, paddingBottom: 96, gap: 10 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  heading: { fontSize: 22, fontWeight: "700" },
  settingsLink: { color: "#208AEF", fontWeight: "600", fontSize: 15 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  emoji: { fontSize: 28 },
  rowMain: { flex: 1, gap: 2 },
  name: { fontSize: 17, fontWeight: "600" },
  meta: { fontSize: 13, color: "#667" },
  streak: { fontSize: 13, color: "#C2410C", marginTop: 2 },
  done: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#208AEF",
  },
  doneOn: { backgroundColor: "#208AEF" },
  doneText: { color: "#208AEF", fontWeight: "700" },
  doneTextOn: { color: "white" },
  empty: {
    textAlign: "center",
    color: "#889",
    marginTop: 40,
    fontSize: 15,
    paddingHorizontal: 20,
  },
  fab: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: "#208AEF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  fabText: { color: "white", fontSize: 16, fontWeight: "700" },
});
