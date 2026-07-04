import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useNotifications } from "@/hooks/use-notifications";

function statusColor(granted: boolean, canAskAgain: boolean): string {
    if (granted) return "#2E7D32";
    if (!canAskAgain) return "#C0392B";
    return "#B26A00";
}

export default function SettingsScreen() {
    const {
        ready,
        granted,
        canAskAgain,
        isDevice,
        status,
        request,
        openSettings,
    } = useNotifications();

    const [scheduledCount, setScheduledCount] = useState<number | null>(null);

    const refreshScheduled = useCallback(async () => {
        const all = await Notifications.getAllScheduledNotificationsAsync();
        setScheduledCount(all.length);
    }, []);

    useEffect(() => {
        // Sync from an external system (scheduled-notifications API); setState runs
        // after the async read resolves, not synchronously in the effect body.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void refreshScheduled();
    }, [refreshScheduled, granted]);

    const label = granted
        ? "Granted"
        : status === "denied" && !canAskAgain
          ? "Blocked"
          : "Not granted";

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Notification permission</Text>
                <View style={styles.statusRow}>
                    <View
                        style={[
                            styles.dot,
                            {
                                backgroundColor: statusColor(
                                    granted,
                                    canAskAgain,
                                ),
                            },
                        ]}
                    />
                    <Text style={styles.statusText}>
                        {ready ? label : "Checking…"}
                    </Text>
                </View>

                {!isDevice && (
                    <Text style={styles.note}>
                        Running on a simulator/emulator — reminders won&apos;t
                        actually fire here.
                    </Text>
                )}

                {!granted && canAskAgain && (
                    <Pressable
                        style={styles.primary}
                        onPress={() => void request()}
                    >
                        <Text style={styles.primaryText}>
                            Allow notifications
                        </Text>
                    </Pressable>
                )}

                {!granted && !canAskAgain && (
                    <>
                        <Text style={styles.note}>
                            You&apos;ve blocked notifications. Enable them in
                            system settings to receive habit reminders.
                        </Text>
                        <Pressable
                            style={styles.primary}
                            onPress={() => void openSettings()}
                        >
                            <Text style={styles.primaryText}>
                                Open system settings
                            </Text>
                        </Pressable>
                    </>
                )}

                {granted && (
                    <Text style={styles.note}>
                        You&apos;re all set — reminders will be delivered on
                        schedule.
                    </Text>
                )}
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Scheduled reminders</Text>
                <Text style={styles.big}>{scheduledCount ?? "—"}</Text>
                <Text style={styles.note}>
                    Total local notifications currently scheduled across all
                    habits.
                </Text>
                <Pressable
                    style={styles.secondary}
                    onPress={() => void refreshScheduled()}
                >
                    <Text style={styles.secondaryText}>Refresh</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F7FA" },
    content: { padding: 16, gap: 12 },
    card: { backgroundColor: "white", borderRadius: 14, padding: 16, gap: 8 },
    cardTitle: { fontSize: 16, fontWeight: "700" },
    statusRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    dot: { width: 12, height: 12, borderRadius: 6 },
    statusText: { fontSize: 16, fontWeight: "600" },
    note: { fontSize: 13, color: "#667", lineHeight: 18 },
    big: { fontSize: 40, fontWeight: "800", color: "#208AEF" },
    primary: {
        backgroundColor: "#208AEF",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 4,
    },
    primaryText: { color: "white", fontWeight: "700", fontSize: 15 },
    secondary: {
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#208AEF",
        marginTop: 4,
    },
    secondaryText: { color: "#208AEF", fontWeight: "700" },
});
