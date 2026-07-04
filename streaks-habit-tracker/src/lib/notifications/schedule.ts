/**
 * Scheduling, cancelling and rescheduling of a habit's local reminders.
 *
 * A daily habit -> one scheduled notification.
 * A weekly habit -> one scheduled notification per selected weekday.
 * Every schedule call returns the list of notification IDs so the caller can
 * persist them on the habit and cancel exactly those later (never "cancel all").
 */
import * as Notifications from "expo-notifications";

import type { Frequency, Habit } from "../habits/types";
import { REMINDERS_CHANNEL_ID } from "./setup";

/** Payload used for deep-linking a tapped reminder to the habit detail screen. */
export type ReminderData = {
  screen: "/habit";
  habitId: string;
};

function contentFor(habit: Pick<Habit, "id" | "name" | "emoji">) {
  return {
    title: `${habit.emoji} ${habit.name}`.trim(),
    body: "Tap to log it and keep your streak alive.",
    sound: true,
    data: {
      screen: "/habit",
      habitId: habit.id,
    } satisfies ReminderData,
  };
}

function triggersFor(
  frequency: Frequency,
): Notifications.NotificationTriggerInput[] {
  if (frequency.kind === "daily") {
    return [
      {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: frequency.hour,
        minute: frequency.minute,
        channelId: REMINDERS_CHANNEL_ID,
      },
    ];
  }

  // Weekly: one WEEKLY trigger per weekday. `weekday` is 1-7 (1 = Sunday),
  // which is exactly how we store it — no conversion needed.
  return frequency.weekdays.map((weekday) => ({
    type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
    weekday,
    hour: frequency.hour,
    minute: frequency.minute,
    channelId: REMINDERS_CHANNEL_ID,
  }));
}

/**
 * Schedule all reminders for a habit and return the created notification IDs.
 * Returns an empty array for a weekly habit with no weekdays selected.
 */
export async function scheduleHabitReminders(
  habit: Pick<Habit, "id" | "name" | "emoji" | "frequency">,
): Promise<string[]> {
  const content = contentFor(habit);
  const triggers = triggersFor(habit.frequency);

  const ids = await Promise.all(
    triggers.map((trigger) =>
      Notifications.scheduleNotificationAsync({ content, trigger }),
    ),
  );
  return ids;
}

/**
 * Cancel only the given habit's notifications. Missing/already-fired IDs are
 * ignored so this can't throw and take the app down.
 */
export async function cancelHabitReminders(
  notificationIds: string[],
): Promise<void> {
  await Promise.all(
    notificationIds.map(async (id) => {
      try {
        await Notifications.cancelScheduledNotificationAsync(id);
      } catch {
        // ID may no longer exist; nothing to cancel.
      }
    }),
  );
}

/**
 * Reschedule after an edit: cancel this habit's previous notifications, then
 * schedule fresh ones. Returns the new IDs to persist.
 */
export async function rescheduleHabitReminders(
  previousIds: string[],
  habit: Pick<Habit, "id" | "name" | "emoji" | "frequency">,
): Promise<string[]> {
  await cancelHabitReminders(previousIds);
  return scheduleHabitReminders(habit);
}
