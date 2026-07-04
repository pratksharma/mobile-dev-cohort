/**
 * Reactive banner shown when notifications aren't usable. Never crashes the
 * app on denial — it just explains the state and offers the right action
 * (request the prompt, or deep-link to system settings if we can't ask again).
 */
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useNotifications } from "@/hooks/use-notifications";

export function PermissionBanner() {
  const { ready, granted, canAskAgain, isDevice, request, openSettings } =
    useNotifications();

  // While loading, or when everything's fine, show nothing.
  if (!ready || granted) return null;

  if (!isDevice) {
    return (
      <View style={[styles.banner, styles.warn]}>
        <Text style={styles.title}>Notifications limited</Text>
        <Text style={styles.body}>
          You&apos;re on a simulator/emulator. Reminders schedule, but use a real
          device to see them fire.
        </Text>
      </View>
    );
  }

  const canPrompt = canAskAgain;
  return (
    <View style={[styles.banner, styles.error]}>
      <Text style={styles.title}>Reminders are off</Text>
      <Text style={styles.body}>
        {canPrompt
          ? "Allow notifications so your habit reminders can fire."
          : "Notifications are blocked. Enable them in system settings to get reminders."}
      </Text>
      <Pressable
        style={styles.action}
        onPress={() => (canPrompt ? void request() : void openSettings())}
      >
        <Text style={styles.actionText}>
          {canPrompt ? "Allow notifications" : "Open settings"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    gap: 6,
  },
  warn: { backgroundColor: "#FFF4E5" },
  error: { backgroundColor: "#FDECEA" },
  title: { fontWeight: "700", fontSize: 15 },
  body: { fontSize: 13, color: "#444", lineHeight: 18 },
  action: {
    alignSelf: "flex-start",
    marginTop: 4,
    backgroundColor: "#208AEF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionText: { color: "white", fontWeight: "600" },
});
