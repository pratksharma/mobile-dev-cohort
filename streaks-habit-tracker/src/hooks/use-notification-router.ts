/**
 * Single notification-tap handler. Turns a tapped reminder into navigation to
 * the correct habit detail screen using the payload we set in `schedule.ts`
 * (`{ screen: "/habit", habitId }`).
 *
 * Handles both cases:
 *  - warm/foreground taps via `addNotificationResponseReceivedListener`
 *  - cold start (app launched by tapping a notification) via
 *    `getLastNotificationResponseAsync`
 */
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect } from "react";

import type { ReminderData } from "@/lib/notifications/schedule";

function habitIdFrom(response: Notifications.NotificationResponse): string | null {
  const data = response.notification.request.content.data as
    | Partial<ReminderData>
    | undefined;
  if (data?.screen === "/habit" && typeof data.habitId === "string") {
    return data.habitId;
  }
  return null;
}

export function useNotificationRouter() {
  const router = useRouter();

  useEffect(() => {
    let handled = false;

    const go = (response: Notifications.NotificationResponse | null) => {
      if (!response) return;
      const habitId = habitIdFrom(response);
      if (habitId) router.push(`/habit/${habitId}`);
    };

    // Cold start: app was opened by tapping a notification.
    void Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!handled) go(response);
    });

    // Warm: user taps while the app is running.
    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        handled = true;
        go(response);
      },
    );

    return () => sub.remove();
  }, [router]);
}
