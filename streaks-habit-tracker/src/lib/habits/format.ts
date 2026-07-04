/** Small display helpers for habits (kept out of components). */
import { WEEKDAY_LABELS, type Frequency } from "./types";

/** "07:05", "18:30" — 24h clock, zero-padded. */
export function formatTime(hour: number, minute: number): string {
  const h = String(hour).padStart(2, "0");
  const m = String(minute).padStart(2, "0");
  return `${h}:${m}`;
}

/** Human summary of a frequency, e.g. "Daily · 08:00" or "Mon, Wed · 18:30". */
export function describeFrequency(frequency: Frequency): string {
  const time = formatTime(frequency.hour, frequency.minute);
  if (frequency.kind === "daily") return `Daily · ${time}`;

  if (frequency.weekdays.length === 0) return `Weekly (no days) · ${time}`;
  const days = [...frequency.weekdays]
    .sort((a, b) => a - b)
    .map((w) => WEEKDAY_LABELS[w])
    .join(", ");
  return `${days} · ${time}`;
}
