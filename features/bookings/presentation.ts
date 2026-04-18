import type { Database } from "@/types/database";

type BookingRequestStatus =
  Database["public"]["Enums"]["booking_request_status"];
type AppointmentStatus = Database["public"]["Enums"]["appointment_status"];

export const bookingRequestStatusOptions: Array<{
  value: BookingRequestStatus | "all";
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
  { value: "rejected", label: "Rejected" },
];

export const bookingRequestStatusColorMap: Record<
  BookingRequestStatus,
  string
> = {
  new: "bg-cyan-100 text-cyan-700",
  contacted: "bg-amber-100 text-amber-700",
  converted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

export const appointmentStatusOptions: Array<{
  value: AppointmentStatus | "all";
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "scheduled", label: "Scheduled" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No show" },
];

export const appointmentStatusColorMap: Record<AppointmentStatus, string> = {
  scheduled: "bg-cyan-100 text-cyan-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  completed: "bg-indigo-100 text-indigo-700",
  cancelled: "bg-rose-100 text-rose-700",
  no_show: "bg-amber-100 text-amber-700",
};

export function getAppointmentStatusLabel(status: AppointmentStatus) {
  return (
    appointmentStatusOptions.find((option) => option.value === status)?.label ??
    status
  );
}

export function formatBookingDate(date: string | null) {
  if (!date) {
    return "Not selected";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatAppointmentDateTime(dateTime: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateTime));
}

export function formatCompactDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  }).format(new Date(`${date}T00:00:00`));
}

export function buildBookingRequestsHref(query: string, status: string) {
  const params = new URLSearchParams();
  if (query) {
    params.set("q", query);
  }
  if (status && status !== "all") {
    params.set("status", status);
  }

  const queryString = params.toString();
  return queryString
    ? `/staff/booking-requests?${queryString}`
    : "/staff/booking-requests";
}

export function buildRequestDetailHref(
  requestId: string,
  query: string,
  status: string,
) {
  const params = new URLSearchParams();
  if (query) {
    params.set("q", query);
  }
  if (status && status !== "all") {
    params.set("status", status);
  }

  const queryString = params.toString();
  return queryString
    ? `/staff/booking-requests/${requestId}?${queryString}`
    : `/staff/booking-requests/${requestId}`;
}

export function buildAppointmentsHref(
  query: string,
  status: AppointmentStatus | "all",
) {
  const params = new URLSearchParams();
  if (query) {
    params.set("q", query);
  }
  if (status !== "all") {
    params.set("status", status);
  }

  const queryString = params.toString();
  return queryString
    ? `/staff/appointments?${queryString}`
    : "/staff/appointments";
}
