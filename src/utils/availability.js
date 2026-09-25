/**
 * Shared availability-display helpers.
 *
 * The server (see profileController.js) stores and returns overnight
 * slots as a single {day, start_time, end_time} object where
 * end_time is numerically less than start_time (e.g. Monday 18:04 ->
 * 07:04 means "until 07:04 the next day"). Any UI that lists
 * availability needs to recognize that case and say so explicitly --
 * otherwise a slot like "Monday 18:04 to 07:04" reads as a mistake
 * rather than an overnight window.
 */

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/** True when a slot's end time is at/before its start time, i.e. it runs past midnight. */
export const isOvernight = (slot) => {
  if (!slot?.start_time || !slot?.end_time) return false;
  return slot.end_time <= slot.start_time;
};

/** The day after `day`, wrapping Sunday -> Monday. Matches unrecognized input as-is. */
export const getNextDay = (day) => {
  const idx = DAYS.findIndex((d) => d.toLowerCase() === String(day).toLowerCase());
  if (idx === -1) return day;
  return DAYS[(idx + 1) % DAYS.length];
};

/** "18:04:00" -> "18:04". Leaves already-short values (e.g. "18:04") untouched. */
const trimSeconds = (time) => (time?.length > 5 ? time.slice(0, 5) : time);

/**
 * Renders one availability slot as a display string, e.g.
 *   "Friday — 09:00 to 17:00"
 *   "Monday 18:04 → Tuesday 07:04 (overnight)"
 */
export const formatAvailabilitySlot = (slot) => {
  const { day, start_time, end_time } = slot;
  const start = trimSeconds(start_time);
  const end = trimSeconds(end_time);

  if (isOvernight(slot)) {
    return `${day} ${start} → ${getNextDay(day)} ${end} (overnight)`;
  }
  return `${day} — ${start} to ${end}`;
};