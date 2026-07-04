/**
 * Notification setup: foreground handler, Android channel, and permission
 * helpers. All notification *side effects* live under `src/lib/notifications`
 * so components/screens stay free of platform plumbing.
 */
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/** ID of the high-importance channel used for habit reminders (Android). */
export const REMINDERS_CHANNEL_ID = "habit-reminders";

/**
 * Foreground handler — controls how a notification is presented while the app
 * is open. Registered at module load (import this file once, from the root
 * layout) so the handler exists before any notification can arrive.
 *
 * We use `shouldShowBanner` / `shouldShowList` (SDK 53+) instead of the
 * deprecated `shouldShowAlert`.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Create the Android reminders channel.
 *
 * WHY THIS MUST RUN BEFORE REQUESTING PERMISSION:
 * On Android 13+ the OS notification permission prompt will not appear until
 * the app has registered at least one notification channel. If we asked for
 * permission first, the system dialog could silently fail to show. Channels
 * also carry the importance/sound/vibration settings the user can later tune
 * in system settings, so the reminder channel must be defined as a
 * high-importance (heads-up) channel up front. No-op on non-Android platforms.
 */
export async function ensureAndroidChannelAsync(): Promise<void> {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(REMINDERS_CHANNEL_ID, {
    name: "Habit reminders",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#208AEF",
  });
}

export type PermissionState = {
  granted: boolean;
  /** Whether the OS will still let us show a prompt (false once denied). */
  canAskAgain: boolean;
  status: Notifications.PermissionStatus;
  /** True on simulators/emulators, where local notifications are limited. */
  isDevice: boolean;
};

function toState(
  perm: Notifications.NotificationPermissionsStatus,
): PermissionState {
  const granted =
    perm.granted ||
    perm.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  return {
    granted,
    canAskAgain: perm.canAskAgain,
    status: perm.status,
    isDevice: Device.isDevice,
  };
}

/** Read the current permission status without prompting. */
export async function getPermissionStateAsync(): Promise<PermissionState> {
  const perm = await Notifications.getPermissionsAsync();
  return toState(perm);
}

/**
 * Ensure the Android channel exists, then request permission if we don't
 * already have it and are still allowed to ask. Safe to call repeatedly —
 * it never throws, so a denied permission can't crash the app.
 */
export async function requestPermissionAsync(): Promise<PermissionState> {
  await ensureAndroidChannelAsync();

  const current = await Notifications.getPermissionsAsync();
  if (current.granted || current.status === "granted") {
    return toState(current);
  }
  if (!current.canAskAgain) {
    // OS won't show a prompt anymore; caller should deep-link to settings.
    return toState(current);
  }

  const requested = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
  });
  return toState(requested);
}
