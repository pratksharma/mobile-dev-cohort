/**
 * Core domain types for the habit tracker.
 *
 * Weekday convention
 * ------------------
 * We store weekdays using the SAME numbering that `expo-notifications`
 * expects for its WEEKLY trigger: a number from 1 through 7, where
 * 1 = Sunday ... 7 = Saturday. Storing them this way means we never have
 * to translate when scheduling. Note this differs from JavaScript's
 * `Date.getDay()` (0 = Sunday), so use the helpers in `streak.ts` /
 * `schedule.ts` when converting to and from `Date`.
 */

/** 1 = Sunday, 2 = Monday, ... 7 = Saturday (matches expo-notifications). */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Short labels indexed by `Weekday` (index 0 is unused). */
export const WEEKDAY_LABELS: readonly string[] = [
  "",
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

/** Every weekday, in display order (Sun -> Sat). */
export const ALL_WEEKDAYS: readonly Weekday[] = [1, 2, 3, 4, 5, 6, 7];

export type Frequency =
  | {
      kind: "daily";
      hour: number;
      minute: number;
    }
  | {
      kind: "weekly";
      /** Which weekdays the reminder fires on (1 = Sunday ... 7 = Saturday). */
      weekdays: Weekday[];
      hour: number;
      minute: number;
    };

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  frequency: Frequency;
  /**
   * IDs returned by `Notifications.scheduleNotificationAsync`. A weekly habit
   * with N selected weekdays produces N IDs (one trigger per weekday).
   */
  notificationIds: string[];
  /** The stored streak as of `lastCompletedISO`. See `streak.ts`. */
  streak: number;
  /** ISO date-time of the last completion, or null if never completed. */
  lastCompletedISO: string | null;
};

/** Shape used when creating/editing; the store fills in id + notification IDs. */
export type HabitDraft = {
  name: string;
  emoji: string;
  frequency: Frequency;
};
