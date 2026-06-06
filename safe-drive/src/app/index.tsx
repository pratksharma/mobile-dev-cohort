import {
    Accelerometer,
    DeviceMotion,
    Gyroscope,
    Magnetometer,
} from "expo-sensors";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import { APP_TAB_BAR_HEIGHT } from "../components/app-tab-bar";
import { useDriveHistory } from "../lib/drive-history";
import {
    createDriveSessionRecord,
    detectDrivingEvents,
    formatDuration,
    getDriveSummary,
    type DriveEvent,
    type DriveEventType,
    type SensorSample,
} from "../lib/driving";

type Subscription = { remove: () => void };

export default function Index() {
    const { addSession } = useDriveHistory();
    const [isDriveActive, setIsDriveActive] = useState(false);
    const insets = useSafeAreaInsets();
    const [isCoreSensorsReady, setIsCoreSensorsReady] = useState(false);
    const [isMagnetometerAvailable, setIsMagnetometerAvailable] =
        useState(false);
    const [sensorError, setSensorError] = useState<string | null>(null);
    const [events, setEvents] = useState<DriveEvent[]>([]);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [driveStartedAt, setDriveStartedAt] = useState<number | null>(null);

    const detectionContext = useRef({
        lastEventAt: {} as Partial<Record<DriveEventType, number>>,
        lastSampleAt: 0,
        hasPrimed: false,
    });
    const latestSampleRef = useRef<SensorSample | null>(null);
    const subscriptions = useRef<Subscription[]>([]);

    useEffect(() => {
        const prepareSensors = async () => {
            try {
                const [
                    accelerometerAvailable,
                    gyroscopeAvailable,
                    deviceMotionAvailable,
                    magnetometerAvailable,
                ] = await Promise.all([
                    Accelerometer.isAvailableAsync(),
                    Gyroscope.isAvailableAsync(),
                    DeviceMotion.isAvailableAsync(),
                    Magnetometer.isAvailableAsync().catch(() => false),
                ]);

                setIsCoreSensorsReady(
                    accelerometerAvailable &&
                        gyroscopeAvailable &&
                        deviceMotionAvailable,
                );
                setIsMagnetometerAvailable(magnetometerAvailable);
            } catch (error) {
                setSensorError(
                    error instanceof Error
                        ? error.message
                        : "Unable to initialize sensors.",
                );
            }
        };

        void prepareSensors();

        return () => {
            subscriptions.current.forEach((subscription) =>
                subscription.remove(),
            );
            subscriptions.current = [];
        };
    }, []);

    useEffect(() => {
        if (!isDriveActive) {
            return;
        }

        const interval = setInterval(() => {
            setElapsedSeconds((currentSeconds) => currentSeconds + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isDriveActive]);

    useEffect(() => {
        if (!isDriveActive) {
            return;
        }

        Accelerometer.setUpdateInterval(80);
        Gyroscope.setUpdateInterval(80);
        DeviceMotion.setUpdateInterval(80);

        if (isMagnetometerAvailable) {
            Magnetometer.setUpdateInterval(120);
        }

        const updateSample = (patch: Partial<SensorSample>) => {
            const timestamp = Date.now();
            const nextSample = {
                timestamp,
                ...(latestSampleRef.current ?? {}),
                ...patch,
            } as SensorSample;

            latestSampleRef.current = nextSample;

            const detectedEvents = detectDrivingEvents(
                nextSample,
                detectionContext.current,
            );

            if (detectedEvents.length > 0) {
                setEvents((currentEvents) =>
                    [...currentEvents, ...detectedEvents].slice(-120),
                );
            }
        };

        const createdSubscriptions: Subscription[] = [
            Accelerometer.addListener((measurement) => {
                updateSample({ accelerometer: measurement });
            }),
            Gyroscope.addListener((measurement) => {
                updateSample({ gyroscope: measurement });
            }),
            DeviceMotion.addListener((measurement) => {
                updateSample({
                    deviceMotion: {
                        acceleration: measurement.acceleration,
                        accelerationIncludingGravity:
                            measurement.accelerationIncludingGravity,
                        rotationRate: measurement.rotationRate,
                    },
                });
            }),
        ];

        if (isMagnetometerAvailable) {
            createdSubscriptions.push(
                Magnetometer.addListener((measurement) => {
                    updateSample({ magnetometer: measurement });
                }),
            );
        }

        subscriptions.current = createdSubscriptions;

        return () => {
            subscriptions.current.forEach((subscription) =>
                subscription.remove(),
            );
            subscriptions.current = [];
        };
    }, [isDriveActive, isMagnetometerAvailable]);

    const summary = useMemo(() => getDriveSummary(events), [events]);
    const recentEvents = [...events].slice(-4).reverse();
    const eventEntries = Object.entries(summary.breakdown).filter(
        ([, count]) => count > 0,
    );
    const durationText = formatDuration(elapsedSeconds);

    const handleStartDrive = async () => {
        setSensorError(null);

        try {
            await Promise.all([
                Accelerometer.requestPermissionsAsync().catch(() => null),
                Gyroscope.requestPermissionsAsync().catch(() => null),
                DeviceMotion.requestPermissionsAsync().catch(() => null),
                Magnetometer.requestPermissionsAsync().catch(() => null),
            ]);

            detectionContext.current = {
                lastEventAt: {},
                lastSampleAt: Date.now(),
                hasPrimed: false,
            };
            latestSampleRef.current = null;
            setEvents([]);
            setElapsedSeconds(0);
            setDriveStartedAt(Date.now());
            setIsDriveActive(true);
        } catch (error) {
            setSensorError(
                error instanceof Error
                    ? error.message
                    : "Unable to start drive session.",
            );
        }
    };

    const handleEndDrive = () => {
        const endedAt = Date.now();

        setIsDriveActive(false);

        if (driveStartedAt) {
            addSession(
                createDriveSessionRecord({
                    startedAt: driveStartedAt,
                    endedAt,
                    events,
                }),
            );
        }
    };

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
                                {isDriveActive
                                    ? "Live session"
                                    : "Ready to start"}
                            </Text>
                        </View>
                        <Text style={styles.kicker}>Safe Drive</Text>
                    </View>
                    <Text style={styles.title}>A calmer drive score.</Text>
                    <Text style={styles.subtitle}>
                        Start a session to detect braking, turns, and possible
                        phone handling.
                    </Text>

                    <View style={styles.microStatsRow}>
                        <View style={styles.microStatCard}>
                            <Text style={styles.microStatLabel}>Session</Text>
                            <Text style={styles.microStatValue}>
                                {isDriveActive ? "Live" : "Idle"}
                            </Text>
                        </View>
                        <View style={styles.microStatCard}>
                            <Text style={styles.microStatLabel}>Timer</Text>
                            <Text style={styles.microStatValue}>
                                {durationText}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.actionRow}>
                        <Pressable
                            accessibilityRole="button"
                            onPress={handleStartDrive}
                            style={({ pressed }) => [
                                styles.primaryButton,
                                pressed && styles.buttonPressed,
                                isDriveActive && styles.buttonDisabled,
                            ]}
                            disabled={isDriveActive}
                        >
                            <Text style={styles.primaryButtonText}>
                                {isDriveActive ? "Drive Active" : "Start Drive"}
                            </Text>
                        </Pressable>

                        <Pressable
                            accessibilityRole="button"
                            onPress={handleEndDrive}
                            style={({ pressed }) => [
                                styles.secondaryButton,
                                pressed && styles.buttonPressed,
                                !isDriveActive && styles.buttonDisabled,
                            ]}
                            disabled={!isDriveActive}
                        >
                            <Text style={styles.secondaryButtonText}>
                                End Drive
                            </Text>
                        </Pressable>
                    </View>

                    <View style={styles.statusRow}>
                        <View style={styles.statusPill}>
                            <Text style={styles.statusLabel}>Session</Text>
                            <Text style={styles.statusValue}>
                                {isDriveActive ? "Recording" : "Idle"}
                            </Text>
                        </View>
                        <View style={styles.statusPill}>
                            <Text style={styles.statusLabel}>Sensors</Text>
                            <Text style={styles.statusValue}>
                                {isCoreSensorsReady ? "Ready" : "Checking"}
                            </Text>
                        </View>
                        <View style={styles.statusPill}>
                            <Text style={styles.statusLabel}>Mode</Text>
                            <Text style={styles.statusValue}>
                                {isDriveActive ? "Watching" : "Paused"}
                            </Text>
                        </View>
                    </View>

                    {sensorError ? (
                        <Text style={styles.errorText}>{sensorError}</Text>
                    ) : null}
                </View>

                <View style={styles.scoreCard}>
                    <Text style={styles.sectionLabel}>Score</Text>
                    <View style={styles.scoreRow}>
                        <Text style={styles.scoreValue}>{summary.score}</Text>
                        <View style={styles.ratingPill}>
                            <Text style={styles.ratingText}>
                                {summary.rating}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.scoreDetail}>
                        {summary.deductions} points deducted from{" "}
                        {summary.totalEvents} events.
                    </Text>
                </View>

                <View style={styles.grid}>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>Duration</Text>
                        <Text style={styles.metricValue}>{durationText}</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>Events</Text>
                        <Text style={styles.metricValue}>
                            {summary.totalEvents}
                        </Text>
                    </View>
                </View>

                <View style={styles.panel}>
                    <Text style={styles.sectionLabel}>Event Breakdown</Text>
                    <View style={styles.breakdownWrap}>
                        {eventEntries.length > 0 ? (
                            eventEntries.map(([type, count]) => (
                                <View key={type} style={styles.breakdownChip}>
                                    <Text style={styles.breakdownChipLabel}>
                                        {type}
                                    </Text>
                                    <Text style={styles.breakdownChipValue}>
                                        {count}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.emptyText}>
                                No driving events detected yet.
                            </Text>
                        )}
                    </View>
                </View>

                <View style={styles.panel}>
                    <Text style={styles.sectionLabel}>Recent Events</Text>
                    {recentEvents.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>
                                Detected events will appear here while a drive
                                is active.
                            </Text>
                        </View>
                    ) : (
                        recentEvents.map((event) => (
                            <View
                                key={`${event.type}-${event.timestamp}`}
                                style={styles.timelineItem}
                            >
                                <View style={styles.timelineDot} />
                                <View style={styles.timelineBody}>
                                    <Text style={styles.breakdownType}>
                                        {event.type}
                                    </Text>
                                    <Text style={styles.timelineDetail}>
                                        {event.detail}
                                    </Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
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
        backgroundColor: "#22c55e",
    },
    liveBadgeText: {
        color: "#475569",
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
    microStatsRow: {
        flexDirection: "row",
        gap: 10,
    },
    microStatCard: {
        flex: 1,
        backgroundColor: "transparent",
        borderRadius: 0,
        paddingVertical: 10,
        paddingHorizontal: 0,
        gap: 4,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#e5e7eb",
    },
    microStatLabel: {
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        fontSize: 11,
        fontWeight: "700",
    },
    microStatValue: {
        color: "#0f172a",
        fontSize: 16,
        fontWeight: "700",
    },
    actionRow: {
        flexDirection: "row",
        gap: 12,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: "#0f172a",
        paddingVertical: 15,
        borderRadius: 16,
        alignItems: "center",
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingVertical: 15,
        borderRadius: 16,
        alignItems: "center",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#cbd5e1",
    },
    primaryButtonText: {
        color: "#ffffff",
        fontWeight: "700",
        fontSize: 15,
    },
    secondaryButtonText: {
        color: "#0f172a",
        fontWeight: "700",
        fontSize: 15,
    },
    buttonPressed: {
        opacity: 0.86,
        transform: [{ scale: 0.99 }],
    },
    buttonDisabled: {
        opacity: 0.45,
    },
    statusRow: {
        flexDirection: "row",
        gap: 10,
        flexWrap: "wrap",
    },
    statusPill: {
        backgroundColor: "transparent",
        borderRadius: 0,
        paddingVertical: 8,
        paddingHorizontal: 0,
        minWidth: 98,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#e5e7eb",
    },
    statusLabel: {
        color: "#64748b",
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: 0.8,
    },
    statusValue: {
        color: "#0f172a",
        fontSize: 15,
        marginTop: 4,
        fontWeight: "700",
    },
    errorText: {
        color: "#b91c1c",
        fontWeight: "700",
    },
    scoreCard: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        padding: 16,
        gap: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#e5e7eb",
        shadowColor: "#0f172a",
        shadowOpacity: 0.03,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 1,
    },
    sectionLabel: {
        color: "#475569",
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: 1.1,
        fontWeight: "800",
    },
    scoreRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    ratingPill: {
        backgroundColor: "transparent",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#e5e7eb",
    },
    scoreValue: {
        color: "#0f172a",
        fontSize: 54,
        lineHeight: 54,
        fontWeight: "800",
    },
    ratingText: {
        color: "#334155",
        fontSize: 12,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.8,
    },
    scoreDetail: {
        color: "#64748b",
        lineHeight: 19,
    },
    grid: {
        flexDirection: "row",
        gap: 12,
    },
    metricCard: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 14,
        gap: 6,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#e5e7eb",
    },
    metricLabel: {
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        fontSize: 11,
        fontWeight: "700",
    },
    metricValue: {
        color: "#0f172a",
        fontSize: 22,
        fontWeight: "900",
    },
    panel: {
        paddingTop: 8,
        gap: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#e5e7eb",
    },
    breakdownWrap: {
        gap: 10,
    },
    breakdownChip: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "transparent",
        borderRadius: 0,
        paddingHorizontal: 0,
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#e5e7eb",
    },
    breakdownType: {
        color: "#0f172a",
        fontSize: 14,
        fontWeight: "800",
        flex: 1,
    },
    breakdownChipLabel: {
        color: "#475569",
        fontSize: 12,
        fontWeight: "700",
    },
    breakdownChipValue: {
        color: "#1d4ed8",
        fontSize: 14,
        fontWeight: "900",
    },
    emptyText: {
        color: "#64748b",
        lineHeight: 19,
    },
    emptyState: {
        alignItems: "center",
        gap: 8,
        paddingVertical: 8,
    },
    emptyStateText: {
        color: "#64748b",
        lineHeight: 19,
    },
    timelineItem: {
        flexDirection: "row",
        gap: 10,
        alignItems: "flex-start",
        paddingVertical: 8,
    },
    timelineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginTop: 5,
        backgroundColor: "#0f172a",
    },
    timelineBody: {
        flex: 1,
        gap: 4,
    },
    timelineDetail: {
        color: "#64748b",
        lineHeight: 18,
    },
});
