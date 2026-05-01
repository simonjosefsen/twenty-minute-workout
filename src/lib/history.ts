import { useEffect, useState } from "react";

const KEY = "pulse.history.v1";

export type HistoryEntry = {
  routineId: string;
  routineName: string;
  date: string; // ISO
  durationSec: number;
  completed: number; // exercises checked
  total: number;
};

export const loadHistory = (): HistoryEntry[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
};

export const saveHistoryEntry = (entry: HistoryEntry) => {
  const all = loadHistory();
  all.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 60)));
};

export const deleteHistoryEntry = (index: number) => {
  const all = loadHistory();
  all.splice(index, 1);
  localStorage.setItem(KEY, JSON.stringify(all));
};

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  useEffect(() => setHistory(loadHistory()), []);
  return { history, refresh: () => setHistory(loadHistory()) };
};

/**
 * Returns the start (Sunday 00:00) of the week that contains `date`.
 * Week runs Sunday → Sunday (next Sunday exclusive).
 */
export const startOfWeekSunday = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay()); // Sunday = 0
  return d;
};

const WEEKLY_GOAL_KEY = "weeklyGoal";
const DEFAULT_WEEKLY_GOAL = 2;
const FIRE_THRESHOLD = 3;

export const loadWeeklyGoal = (): number | null => {
  try {
    const raw = localStorage.getItem(WEEKLY_GOAL_KEY);
    if (!raw) return null;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
};

export const saveWeeklyGoal = (goal: number) => {
  try {
    localStorage.setItem(WEEKLY_GOAL_KEY, String(goal));
  } catch {
    // ignore
  }
};

export type WeeklyStreak = {
  /** Sessions completed in the current week (Sun → next Sun). */
  thisWeek: number;
  /** Weekly goal (2). */
  goal: number;
  /** Number of consecutive prior weeks that hit the goal. */
  streak: number;
  /** True if last completed week had >= 3 sessions (carry the flame). */
  fire: boolean;
};

export const computeWeeklyStreak = (
  history: HistoryEntry[],
  now: Date = new Date()
): WeeklyStreak => {
  const thisWeekStart = startOfWeekSunday(now);
  const counts = new Map<number, number>();
  for (const h of history) {
    const ws = startOfWeekSunday(new Date(h.date)).getTime();
    counts.set(ws, (counts.get(ws) ?? 0) + 1);
  }

  const thisWeek = counts.get(thisWeekStart.getTime()) ?? 0;

  // Walk backwards through prior weeks counting consecutive goal hits.
  let streak = 0;
  const cursor = new Date(thisWeekStart);
  cursor.setDate(cursor.getDate() - 7);
  const goal = loadWeeklyGoal() ?? DEFAULT_WEEKLY_GOAL;
  while ((counts.get(cursor.getTime()) ?? 0) >= goal) {
    streak++;
    cursor.setDate(cursor.getDate() - 7);
  }

  // Flame carries from last *completed* week if it had >= 3 sessions.
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const lastWeekCount = counts.get(lastWeekStart.getTime()) ?? 0;
  const fire = lastWeekCount >= FIRE_THRESHOLD || thisWeek >= FIRE_THRESHOLD;

  return { thisWeek, goal, streak, fire };
};
