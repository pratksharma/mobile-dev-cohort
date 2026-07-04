/**
 * Hook exposing notification permission state + actions to the UI. All actual
 * notification side effects live in `src/lib/notifications`; this hook just
 * makes them reactive and keeps components clean.
 */
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import { AppState, Linking } from "react-native";

import {
  getPermissionStateAsync,
  requestPermissionAsync,
  type PermissionState,
} from "@/lib/notifications/setup";

export function useNotifications() {
  const [permission, setPermission] = useState<PermissionState | null>(null);

  const refresh = useCallback(async () => {
    setPermission(await getPermissionStateAsync());
  }, []);

  const request = useCallback(async () => {
    const next = await requestPermissionAsync();
    setPermission(next);
    return next;
  }, []);

  /** Open the OS settings page so a user who denied can re-enable. */
  const openSettings = useCallback(async () => {
    await Linking.openSettings();
  }, []);

  useEffect(() => {
    // Sync from an external system (OS permission API); setState runs after the
    // async read resolves, not synchronously in the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();

    // Re-check when returning from system settings so the UI updates if the
    // user flipped the permission there.
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") void refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  return {
    permission,
    /** True once we've loaded the initial status. */
    ready: permission !== null,
    granted: permission?.granted ?? false,
    canAskAgain: permission?.canAskAgain ?? true,
    isDevice: permission?.isDevice ?? true,
    status: permission?.status ?? Notifications.PermissionStatus.UNDETERMINED,
    request,
    refresh,
    openSettings,
  };
}
