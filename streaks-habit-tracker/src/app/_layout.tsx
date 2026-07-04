import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import { HabitsProvider, useHabits } from "@/hooks/use-habits";
import { useNotificationRouter } from "@/hooks/use-notification-router";
// Importing setup registers the foreground notification handler at load time.
import { ensureAndroidChannelAsync } from "@/lib/notifications/setup";

function RootNavigator() {
  // Single tap handler that deep-links reminders to the right habit.
  useNotificationRouter();
  // Touch the context so the provider is required to exist above this tree.
  useHabits();

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "Today" }} />
      <Stack.Screen name="new" options={{ title: "New habit", presentation: "modal" }} />
      <Stack.Screen name="habit/[id]" options={{ title: "Habit" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    // Create the Android channel as early as possible — it must exist before
    // any permission prompt so the OS dialog can appear (Android 13+).
    void ensureAndroidChannelAsync();
  }, []);

  return (
    <HabitsProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </HabitsProvider>
  );
}
