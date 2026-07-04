/**
 * Habits state shared across all screens via React Context, so adding /
 * editing / deleting / completing on one screen is reflected everywhere
 * without manual refetching. Backed by the persistence + scheduling logic in
 * `src/lib/habits`, which is the source of truth and returns the fresh list
 * after every mutation.
 */
import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  completeHabit,
  createHabit,
  deleteHabit,
  loadHabits,
  updateHabit,
} from "@/lib/habits/storage";
import type { Habit, HabitDraft } from "@/lib/habits/types";

type HabitsContextValue = {
  habits: Habit[];
  loading: boolean;
  getHabit: (id: string) => Habit | undefined;
  create: (draft: HabitDraft) => Promise<void>;
  update: (id: string, draft: HabitDraft) => Promise<void>;
  remove: (id: string) => Promise<void>;
  complete: (id: string) => Promise<void>;
};

const HabitsContext = createContext<HabitsContextValue | null>(null);

export function HabitsProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadHabits().then((loaded) => {
      if (active) {
        setHabits(loaded);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const getHabit = useCallback(
    (id: string) => habits.find((h) => h.id === id),
    [habits],
  );

  // Each storage mutation returns the fresh, persisted list; we just commit it.
  const create = useCallback(async (draft: HabitDraft) => {
    setHabits(await createHabit(draft));
  }, []);

  const update = useCallback(async (id: string, draft: HabitDraft) => {
    setHabits(await updateHabit(id, draft));
  }, []);

  const remove = useCallback(async (id: string) => {
    setHabits(await deleteHabit(id));
  }, []);

  const complete = useCallback(async (id: string) => {
    setHabits(await completeHabit(id));
  }, []);

  const value = useMemo<HabitsContextValue>(
    () => ({ habits, loading, getHabit, create, update, remove, complete }),
    [habits, loading, getHabit, create, update, remove, complete],
  );

  return createElement(HabitsContext.Provider, { value }, children);
}

export function useHabits(): HabitsContextValue {
  const ctx = useContext(HabitsContext);
  if (!ctx) {
    throw new Error("useHabits must be used within a <HabitsProvider>");
  }
  return ctx;
}
