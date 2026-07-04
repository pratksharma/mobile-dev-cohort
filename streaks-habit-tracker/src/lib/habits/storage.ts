/**
 * Habit persistence (AsyncStorage) + CRUD that coordinates notification
 * scheduling so notification IDs are always kept in sync with the habit.
 *
 * AsyncStorage is the single source of truth: every mutation reads the current
 * list, applies its change, and writes the full list back (including each
 * habit's scheduled `notificationIds`), so state survives app restarts. All
 * mutations run through a serial lock so rapid taps can't interleave and
 * clobber each other.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  cancelHabitReminders,
  rescheduleHabitReminders,
  scheduleHabitReminders,
} from "../notifications/schedule";
import { completeToday } from "./streak";
import type { Habit, HabitDraft } from "./types";

const STORAGE_KEY = "habits.v1";

/** Serial lock: chains mutations so they run one-at-a-time against storage. */
let queue: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  // Keep the chain alive regardless of individual task success/failure.
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

/** Simple unique-ish id without pulling in a uuid dependency. */
function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function loadHabits(): Promise<Habit[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Habit[]) : [];
  } catch {
    return [];
  }
}

async function saveHabits(habits: Habit[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

/** Create a habit: schedule reminders, persist the returned IDs, save. */
export function createHabit(draft: HabitDraft): Promise<Habit[]> {
  return enqueue(async () => {
    const id = makeId();
    const notificationIds = await scheduleHabitReminders({ id, ...draft });

    const habit: Habit = {
      id,
      name: draft.name,
      emoji: draft.emoji,
      frequency: draft.frequency,
      notificationIds,
      streak: 0,
      lastCompletedISO: null,
    };

    const next = [...(await loadHabits()), habit];
    await saveHabits(next);
    return next;
  });
}

/**
 * Edit a habit: cancel ONLY this habit's previous notifications, schedule new
 * ones, and store the new IDs. Streak/last-completed are preserved.
 */
export function updateHabit(id: string, draft: HabitDraft): Promise<Habit[]> {
  return enqueue(async () => {
    const habits = await loadHabits();
    const existing = habits.find((h) => h.id === id);
    if (!existing) return habits;

    const notificationIds = await rescheduleHabitReminders(
      existing.notificationIds,
      { id, ...draft },
    );

    const next = habits.map((h) =>
      h.id === id
        ? {
            ...h,
            name: draft.name,
            emoji: draft.emoji,
            frequency: draft.frequency,
            notificationIds,
          }
        : h,
    );
    await saveHabits(next);
    return next;
  });
}

/** Delete a habit: cancel ONLY its notifications, then remove it. */
export function deleteHabit(id: string): Promise<Habit[]> {
  return enqueue(async () => {
    const habits = await loadHabits();
    const existing = habits.find((h) => h.id === id);
    if (existing) {
      await cancelHabitReminders(existing.notificationIds);
    }
    const next = habits.filter((h) => h.id !== id);
    await saveHabits(next);
    return next;
  });
}

/** Mark a habit complete for today (no-op if already done today). */
export function completeHabit(
  id: string,
  now: Date = new Date(),
): Promise<Habit[]> {
  return enqueue(async () => {
    const habits = await loadHabits();
    const existing = habits.find((h) => h.id === id);
    if (!existing) return habits;

    const result = completeToday(existing, now);
    if (!result) return habits; // already completed today

    const next = habits.map((h) =>
      h.id === id
        ? {
            ...h,
            streak: result.streak,
            lastCompletedISO: result.lastCompletedISO,
          }
        : h,
    );
    await saveHabits(next);
    return next;
  });
}
