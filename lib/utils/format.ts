import { format, parseISO } from "date-fns";

type DateValue = Date | string;

function parseDate(value: DateValue) {
  return typeof value === "string" ? parseISO(value) : value;
}

export function formatDate(value: DateValue, pattern = "MMM d, yyyy") {
  return format(parseDate(value), pattern);
}

export function formatDateTime(value: DateValue) {
  return formatDate(value, "MMM d, yyyy, h:mm a");
}

export function formatTime(value: DateValue) {
  return formatDate(value, "h:mm a");
}

export function formatDateTimeInput(value: string) {
  return formatDate(value, "yyyy-MM-dd'T'HH:mm");
}

export function toIsoDateTime(value: string) {
  return parseISO(value).toISOString();
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "MMK",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCountdown(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatSeatLabels(seats: ReadonlyArray<{ label: string }>, fallback = "Unassigned") {
  return seats.map((seat) => seat.label).join(", ") || fallback;
}
