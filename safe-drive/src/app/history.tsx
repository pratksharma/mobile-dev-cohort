import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { APP_TAB_BAR_HEIGHT } from "../components/app-tab-bar";
import { useDriveHistory } from "../lib/drive-history";
import { formatDuration } from "../lib/driving";

export default function HistoryScreen() {
    const { history, isLoaded, clearHistory } = useDriveHistory();
    const insets = useSafeAreaInsets();

    const stats = useMemo(() => {
        const totalDrives = history.length;
        const bestScore = history.reduce(
            (currentBest, drive) => Math.max(currentBest, drive.summary.score),
            0,
        );

        return { totalDrives, bestScore };
    }, [history]);

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
            <ScrollView
                contentContainerStyle={[
                    styles.screen,
                    {
                        paddingBottom: insets.bottom + APP_TAB_BAR_HEIGHT + 28,
                    },
                ]}
            >
                <View style={styles.hero}>
                    <View style={styles.heroTopRow}>
                        <View style={styles.liveBadge}>
                            <View style={styles.liveDot} />
                            <Text style={styles.liveBadgeText}>
                                Saved drives
                            </Text>
                        </View>
                        <Text style={styles.kicker}>Drive History</Text>
                    </View>
                    <Text style={styles.title}>
                        Every session, clearly scored.
                    </Text>
                    <Text style={styles.subtitle}>
                        Review previous drives and compare the final score.
                    </Text>

                    <View style={styles.heroStats}>
                        <View style={styles.heroStatCard}>
                            <Text style={styles.heroStatLabel}>Drives</Text>
                            <Text style={styles.heroStatValue}>
                                {stats.totalDrives}
                            </Text>
                        </View>
                        <View style={styles.heroStatCard}>
                            <Text style={styles.heroStatLabel}>Best score</Text>
                            <Text style={styles.heroStatValue}>
                                {stats.bestScore}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.actionRow}>
                        <Pressable
                            accessibilityRole="button"
                            onPress={clearHistory}
                            style={({ pressed }) => [
                                styles.clearButton,
                                pressed && styles.buttonPressed,
                                !history.length && styles.buttonDisabled,
                            ]}
                            disabled={!history.length}
                        >
                            <Text style={styles.clearButtonText}>
                                Clear History
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.panel}>
                    <Text style={styles.sectionLabel}>Sessions</Text>
                    {!isLoaded ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyTitle}>
                                Loading history
                            </Text>
                            <Text style={styles.emptyText}>
                                Pulling the latest saved drives from this
                                device.
                            </Text>
                        </View>
                    ) : history.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyTitle}>No drives yet</Text>
                            <Text style={styles.emptyText}>
                                Start a drive from the Drive tab and the session
                                will appear here automatically.
                            </Text>
                        </View>
                    ) : (
                        history.map((drive) => {
                            const breakdownEntries = Object.entries(
                                drive.summary.breakdown,
                            ).filter(([, count]) => count > 0);

                            return (
                                <View key={drive.id} style={styles.sessionCard}>
                                    <View style={styles.sessionHeader}>
                                        <View style={styles.sessionTextBlock}>
                                            <Text style={styles.sessionDate}>
                                                {formatDate(drive.endedAt)}
                                            </Text>
                                            <Text style={styles.sessionMeta}>
                                                {formatDuration(
                                                    drive.durationSeconds,
                                                )}
                                                {" · "}
                                                {drive.summary.totalEvents}{" "}
                                                events
                                            </Text>
                                        </View>
                                        <View style={styles.scoreBadge}>
                                            <Text
                                                style={styles.scoreBadgeLabel}
                                            >
                                                {drive.summary.score}
                                            </Text>
                                            <Text
                                                style={styles.scoreBadgeCaption}
                                            >
                                                {drive.summary.rating}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.scoreRail}>
                                        <View
                                            style={[
                                                styles.scoreRailFill,
                                                {
                                                    width: `${drive.summary.score}%`,
                                                },
                                            ]}
                                        />
                                    </View>

                                    <View style={styles.breakdownWrap}>
                                        {breakdownEntries.length > 0 ? (
                                            breakdownEntries.map(
                                                ([label, count]) => (
                                                    <View
                                                        key={label}
                                                        style={
                                                            styles.breakdownChip
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.breakdownChipLabel
                                                            }
                                                        >
                                                            {label}
                                                        </Text>
                                                        <Text
                                                            style={
                                                                styles.breakdownChipValue
                                                            }
                                                        >
                                                            {count}
                                                        </Text>
                                                    </View>
                                                ),
                                            )
                                        ) : (
                                            <Text style={styles.noEventsText}>
                                                No notable events detected.
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function formatDate(timestamp: number) {
    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(timestamp);
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f7f6f2",
    },
    screen: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 120,
        gap: 16,
    },
    hero: {
        paddingTop: 4,
        paddingBottom: 8,
        gap: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#e5e7eb",
    },
    heroTopRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    liveBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 0,
        maxWidth: "72%",
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#1d4ed8",
    },
    liveBadgeText: {
        color: "#0f172a",
        fontSize: 11,
        lineHeight: 12,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.9,
        flexShrink: 1,
    },
    kicker: {
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: 1.5,
        fontSize: 12,
        fontWeight: "800",
    },
    title: {
        color: "#0f172a",
        fontSize: 30,
        lineHeight: 35,
        fontWeight: "700",
    },
    subtitle: {
        color: "#475569",
        fontSize: 14,
        lineHeight: 20,
    },
    heroStats: {
        flexDirection: "row",
        gap: 10,
    },
    heroStatCard: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 14,
        gap: 4,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#e5e7eb",
        shadowColor: "#0f172a",
        shadowOpacity: 0.03,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 1,
    },
    heroStatLabel: {
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        fontSize: 11,
        fontWeight: "700",
    },
    heroStatValue: {
        color: "#0f172a",
        fontSize: 18,
        fontWeight: "700",
    },
    actionRow: {
        flexDirection: "row",
        gap: 12,
    },
    clearButton: {
        flex: 1,
        backgroundColor: "#0f172a",
        paddingVertical: 15,
        borderRadius: 16,
        alignItems: "center",
        shadowColor: "#0f172a",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
    },
    clearButtonText: {
        color: "#ffffff",
        fontWeight: "800",
        fontSize: 15,
    },
    buttonPressed: {
        opacity: 0.86,
        transform: [{ scale: 0.99 }],
    },
    buttonDisabled: {
        opacity: 0.45,
    },
    panel: {
        paddingTop: 8,
        gap: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#e5e7eb",
    },
    sectionLabel: {
        color: "#475569",
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: 1.1,
        fontWeight: "800",
    },
    emptyState: {
        gap: 8,
        alignItems: "flex-start",
        paddingVertical: 8,
    },
    emptyTitle: {
        color: "#0f172a",
        fontSize: 16,
        fontWeight: "800",
    },
    emptyText: {
        color: "#64748b",
        lineHeight: 19,
    },
    sessionCard: {
        backgroundColor: "#ffffff",
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 14,
        gap: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#e5e7eb",
        shadowColor: "#0f172a",
        shadowOpacity: 0.03,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 1,
    },
    sessionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    sessionTextBlock: {
        flex: 1,
    },
    sessionDate: {
        color: "#0f172a",
        fontSize: 16,
        fontWeight: "900",
    },
    sessionMeta: {
        color: "#64748b",
        marginTop: 4,
    },
    scoreBadge: {
        alignItems: "flex-end",
        justifyContent: "center",
        backgroundColor: "#f8fafc",
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        minWidth: 82,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#e5e7eb",
    },
    scoreBadgeLabel: {
        color: "#0f172a",
        fontSize: 24,
        fontWeight: "700",
    },
    scoreBadgeCaption: {
        color: "#64748b",
        fontSize: 11,
        fontWeight: "700",
    },
    scoreRail: {
        height: 8,
        borderRadius: 999,
        backgroundColor: "#e5e7eb",
        overflow: "hidden",
    },
    scoreRailFill: {
        height: "100%",
        borderRadius: 999,
        backgroundColor: "#0f172a",
    },
    breakdownWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    breakdownChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#f8fafc",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#e5e7eb",
    },
    breakdownChipLabel: {
        color: "#475569",
        fontSize: 12,
        fontWeight: "700",
    },
    breakdownChipValue: {
        color: "#0f172a",
        fontSize: 12,
        fontWeight: "900",
    },
    noEventsText: {
        color: "#64748b",
    },
});
