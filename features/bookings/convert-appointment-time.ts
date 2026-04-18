const weekdayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

export function toMinutes(timeValue: string) {
  const [hour, minute] = timeValue
    .slice(0, 5)
    .split(":")
    .map((value) => Number.parseInt(value, 10));
  return hour * 60 + minute;
}

export function toTimeValue(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function toTimeLabel(minutes: number) {
  const hour24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(baseDate: Date, days: number) {
  const cloned = new Date(baseDate);
  cloned.setDate(cloned.getDate() + days);
  return cloned;
}

export function normalizeTime(value: string) {
  const trimmed = value.trim();
  if (/^\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed.slice(0, 5);
  }
  return "";
}

export function getWeekday(dateValue: string) {
  return weekdayMap[new Date(`${dateValue}T00:00:00`).getDay()];
}
