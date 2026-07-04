/**
 * Streak logic, kept pure and separate from storage/UI so it's easy to reason
 * about (and test).
 *
 * Rules:
 *  - Completing today increases the streak if yesterday was the last
 *    completion, otherwise starts a new streak at 1.
 *  - Completing again on the same day is a no-op (streak unchanged).
 *  - Missing a day resets the streak: a habit whose last completion is older
 *    than yesterday has an *effective* streak of 0.
 *
 * We compare by calendar day in the device's local timezone.
 */
import type { Habit } from "./types";

/** Local calendar day as `YYYY-MM-DD`. */
export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Whole-day difference (a - b) using local calendar days. */
function dayDiff(a: Date, b: Date): number {
  const startA = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const startB = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  return Math.round((startA - startB) / MS_PER_DAY);
}

export function isSameDay(a: Date, b: Date): boolean {
  return dayDiff(a, b) === 0;
}

/** True if the habit has already been completed on `today`'s calendar day. */
export function isCompletedToday(habit: Habit, today: Date = new Date()): boolean {
  if (!habit.lastCompletedISO) return false;
  return isSameDay(new Date(habit.lastCompletedISO), today);
}

/**
 * The streak to *display*. If the last completion is older than yesterday the
 * streak has lapsed, so we show 0 even though the stored value is higher.
 * (The stored value is only rewritten on the next completion.)
 */
export function effectiveStreak(habit: Habit, today: Date = new Date()): number {
  if (!habit.lastCompletedISO) return 0;
  const diff = dayDiff(today, new Date(habit.lastCompletedISO));
  if (diff <= 1) return habit.streak; // completed today or yesterday
  return 0; // missed at least one full day
}

/**
 * Compute the new `{ streak, lastCompletedISO }` when the user marks a habit
 * complete now. Returns `null` if it was already completed today (no change).
 */
export function completeToday(
  habit: Habit,
  now: Date = new Date(),
): { streak: number; lastCompletedISO: string } | null {
  if (isCompletedToday(habit, now)) return null;

  let nextStreak: number;
  if (!habit.lastCompletedISO) {
    nextStreak = 1;
  } else {
    const diff = dayDiff(now, new Date(habit.lastCompletedISO));
    nextStreak = diff === 1 ? habit.streak + 1 : 1;
  }

  return { streak: nextStreak, lastCompletedISO: now.toISOString() };
}
