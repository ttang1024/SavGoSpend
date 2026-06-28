/**
 * "What's On" event helpers. Pure and side-effect free (no React Native
 * imports) so filtering and date formatting can be unit-tested in isolation.
 */
import type { WhatsOnEvent } from '@/types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** True when the event starts at or after `now` (defaults to the current time). */
export function isUpcoming(event: WhatsOnEvent, now: Date = new Date()): boolean {
  return new Date(event.startsAt).getTime() >= now.getTime();
}

/** Upcoming events only, soonest first. Past events are dropped. */
export function upcomingEvents(events: WhatsOnEvent[], now: Date = new Date()): WhatsOnEvent[] {
  return events
    .filter((event) => isUpcoming(event, now))
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

/** Full, spoken-friendly date and time, e.g. "Sunday, 5 July at 9:30 am". */
export function formatEventWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Whole-day difference between two instants, ignoring the time of day. */
function calendarDaysBetween(from: Date, to: Date): number {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / MS_PER_DAY);
}

/**
 * A short, plain proximity label for the event date: "Today", "Tomorrow",
 * "In 3 days", or "In 2 weeks". Returns `null` for dates further out, where the
 * full date alone reads better.
 */
export function relativeDay(iso: string, now: Date = new Date()): string | null {
  const days = calendarDaysBetween(now, new Date(iso));
  if (days < 0) return null;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days < 7) return `In ${days} days`;
  if (days < 14) return 'In 1 week';
  if (days < 28) return `In ${Math.floor(days / 7)} weeks`;
  return null;
}
