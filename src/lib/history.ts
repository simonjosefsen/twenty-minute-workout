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

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  useEffect(() => setHistory(loadHistory()), []);
  return { history, refresh: () => setHistory(loadHistory()) };
};
