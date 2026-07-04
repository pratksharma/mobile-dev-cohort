import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useHabits } from "@/hooks/use-habits";
import { describeFrequency } from "@/lib/habits/format";
import { effectiveStreak, isCompletedToday } from "@/lib/habits/streak";

export default function HabitDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { getHabit, complete, remove } = useHabits();

    const habit = getHabit(id);

    if (!habit) {
        return (
            <View style={styles.missing}>
                <Text style={styles.missingText}>
                    This habit no longer exists. It may have been deleted.
                </Text>
                <Pressable
                    style={styles.linkBtn}
                    onPress={() => router.replace("/")}
                >
                    <Text style={styles.linkBtnText}>Back to habits</Text>
                </Pressable>
            </View>
        );
    }

    const done = isCompletedToday(habit);
    const streak = effectiveStreak(habit);

    const confirmDelete = () =>
        Alert.alert(
            "Delete habit",
            `Delete “${habit.name}” and its reminders?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        void remove(habit.id);
                        router.replace("/");
                    },
                },
            ],
        );

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            <Stack.Screen options={{ title: habit.name }} />

            <View style={styles.hero}>
                <Text style={styles.emoji}>{habit.emoji || "✅"}</Text>
                <Text style={styles.name}>{habit.name}</Text>
                <Text style={styles.freq}>
                    {describeFrequency(habit.frequency)}
                </Text>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{streak}</Text>
                    <Text style={styles.statLabel}>day streak 🔥</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{done ? "Yes" : "No"}</Text>
                    <Text style={styles.statLabel}>done today</Text>
                </View>
            </View>

            <Text style={styles.detail}>
                Last completed:{" "}
                {habit.lastCompletedISO
                    ? new Date(habit.lastCompletedISO).toLocaleString()
                    : "never"}
            </Text>
            <Text style={styles.detail}>
                Scheduled reminders: {habit.notificationIds.length}
            </Text>

            <Pressable
                style={[styles.primary, done && styles.primaryDone]}
                disabled={done}
                onPress={() => void complete(habit.id)}
            >
                <Text style={styles.primaryText}>
                    {done ? "Completed for today ✓" : "Mark done for today"}
                </Text>
            </Pressable>

            <Pressable
                style={styles.secondary}
                onPress={() => router.push(`/new?id=${habit.id}`)}
            >
                <Text style={styles.secondaryText}>Edit habit</Text>
            </Pressable>

            <Pressable style={styles.deleteBtn} onPress={confirmDelete}>
                <Text style={styles.deleteText}>Delete habit</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F7FA" },
    content: { padding: 16, gap: 12 },
    hero: { alignItems: "center", paddingVertical: 20, gap: 4 },
    emoji: { fontSize: 56 },
    name: { fontSize: 24, fontWeight: "700" },
    freq: { fontSize: 14, color: "#667" },
    statsRow: { flexDirection: "row", gap: 12 },
    stat: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 14,
        paddingVertical: 20,
        alignItems: "center",
        gap: 4,
    },
    statValue: { fontSize: 28, fontWeight: "800", color: "#208AEF" },
    statLabel: { fontSize: 13, color: "#667" },
    detail: { fontSize: 13, color: "#556" },
    primary: {
        marginTop: 8,
        backgroundColor: "#208AEF",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
    },
    primaryDone: { backgroundColor: "#5FA463" },
    primaryText: { color: "white", fontSize: 16, fontWeight: "700" },
    secondary: {
        backgroundColor: "white",
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#208AEF",
    },
    secondaryText: { color: "#208AEF", fontSize: 16, fontWeight: "700" },
    deleteBtn: { paddingVertical: 16, alignItems: "center" },
    deleteText: { color: "#C0392B", fontSize: 15, fontWeight: "600" },
    missing: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        gap: 16,
    },
    missingText: { fontSize: 16, color: "#556", textAlign: "center" },
    linkBtn: {
        backgroundColor: "#208AEF",
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    linkBtnText: { color: "white", fontWeight: "700" },
});
