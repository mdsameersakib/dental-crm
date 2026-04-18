import { redirect } from "next/navigation";

export function sanitizeBookingStaffRedirectPath(path: string) {
  if (path.startsWith("/staff/booking-requests")) {
    return path;
  }

  if (path.startsWith("/staff/appointments")) {
    return path;
  }

  return "/staff/booking-requests";
}

export function sanitizeAppointmentsRedirectPath(path: string) {
  if (path.startsWith("/staff/appointments")) {
    return path;
  }

  return "/staff/appointments";
}

export function redirectBookingStaffStatus(
  message: string,
  type: "error" | "success",
  path = "/staff/booking-requests",
): never {
  const params = new URLSearchParams({ [type]: message });
  redirect(`${sanitizeBookingStaffRedirectPath(path)}?${params.toString()}`);
}

export function redirectAppointmentsStatus(
  message: string,
  type: "error" | "success",
  path = "/staff/appointments",
): never {
  const params = new URLSearchParams({ [type]: message });
  redirect(`${sanitizeAppointmentsRedirectPath(path)}?${params.toString()}`);
}

export function getDateTimeValue(date: string, time: string) {
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  return new Date(`${date}T${normalizedTime}`);
}

export const weekdayMap = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
] as const;

export function toMinutes(timeValue: string) {
  const [hour, minute] = timeValue
    .slice(0, 5)
    .split(":")
    .map((value) => Number.parseInt(value, 10));
  return hour * 60 + minute;
}
