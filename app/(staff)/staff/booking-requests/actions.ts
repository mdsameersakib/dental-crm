"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireStaffProfile } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

type BookingRequestStatus =
  Database["public"]["Enums"]["booking_request_status"];
type AppointmentStatus = Database["public"]["Enums"]["appointment_status"];

const allowedBookingStatuses: BookingRequestStatus[] = [
  "new",
  "contacted",
  "converted",
  "rejected",
];

const allowedAppointmentStatuses: AppointmentStatus[] = [
  "scheduled",
  "confirmed",
];

function sanitizeRedirectPath(path: string) {
  if (path.startsWith("/staff/booking-requests")) {
    return path;
  }

  if (path.startsWith("/staff/appointments")) {
    return path;
  }

  return "/staff/booking-requests";
}

function redirectWithStatus(
  message: string,
  type: "error" | "success",
  path = "/staff/booking-requests",
): never {
  const params = new URLSearchParams({ [type]: message });
  redirect(`${sanitizeRedirectPath(path)}?${params.toString()}`);
}

async function updateBookingRequestStatus(
  requestId: string,
  status: BookingRequestStatus,
) {
  const supabase = createAdminClient();
  return supabase
    .from("booking_requests")
    .update({ status })
    .eq("id", requestId);
}

function getDateTimeValue(date: string, time: string) {
  const normalizedTime = time.length === 5 ? `${time}:00` : time;
  return new Date(`${date}T${normalizedTime}`);
}

const weekdayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function toMinutes(timeValue: string) {
  const [hour, minute] = timeValue
    .slice(0, 5)
    .split(":")
    .map((value) => Number.parseInt(value, 10));
  return hour * 60 + minute;
}

export async function markBookingRequestAsContacted(formData: FormData) {
  await requireStaffProfile();
  const requestId = String(formData.get("request_id") ?? "").trim();
  const redirectTo = sanitizeRedirectPath(
    String(formData.get("redirect_to") ?? "/staff/booking-requests").trim(),
  );

  if (!requestId) {
    redirectWithStatus("Booking request id is required.", "error", redirectTo);
  }

  const { error } = await updateBookingRequestStatus(requestId, "contacted");
  if (error) {
    redirectWithStatus(error.message, "error", redirectTo);
  }

  revalidatePath("/staff/booking-requests");
  redirectWithStatus("Request marked as contacted.", "success", redirectTo);
}

export async function rejectBookingRequest(formData: FormData) {
  await requireStaffProfile();
  const requestId = String(formData.get("request_id") ?? "").trim();
  const redirectTo = sanitizeRedirectPath(
    String(formData.get("redirect_to") ?? "/staff/booking-requests").trim(),
  );

  if (!requestId) {
    redirectWithStatus("Booking request id is required.", "error", redirectTo);
  }

  const { error } = await updateBookingRequestStatus(requestId, "rejected");
  if (error) {
    redirectWithStatus(error.message, "error", redirectTo);
  }

  revalidatePath("/staff/booking-requests");
  redirectWithStatus("Request rejected.", "success", redirectTo);
}

export async function convertBookingRequestToAppointment(formData: FormData) {
  const staff = await requireStaffProfile();
  const requestId = String(formData.get("request_id") ?? "").trim();
  const redirectTo = sanitizeRedirectPath(
    String(formData.get("redirect_to") ?? "/staff/booking-requests").trim(),
  );
  const dentistId = String(formData.get("dentist_id") ?? "").trim();
  const serviceId = String(formData.get("service_id") ?? "").trim();
  const appointmentDate = String(formData.get("appointment_date") ?? "").trim();
  const appointmentTime = String(formData.get("appointment_time") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const durationMinRaw = String(formData.get("duration_min") ?? "").trim();
  const appointmentStatus = String(
    formData.get("appointment_status") ?? "",
  ).trim();

  if (
    !requestId ||
    !serviceId ||
    !dentistId ||
    !appointmentDate ||
    !appointmentTime
  ) {
    redirectWithStatus(
      "Complete service, dentist, date, and time before converting the request.",
      "error",
      redirectTo,
    );
  }

  const durationMin = Number.parseInt(durationMinRaw, 10);
  if (!Number.isFinite(durationMin) || durationMin <= 0) {
    redirectWithStatus(
      "Duration must be a positive number.",
      "error",
      redirectTo,
    );
  }

  if (
    !allowedAppointmentStatuses.includes(appointmentStatus as AppointmentStatus)
  ) {
    redirectWithStatus(
      "Choose a valid appointment status.",
      "error",
      redirectTo,
    );
  }

  const startAt = getDateTimeValue(appointmentDate, appointmentTime);
  if (Number.isNaN(startAt.getTime())) {
    redirectWithStatus(
      "Choose a valid appointment date and time.",
      "error",
      redirectTo,
    );
  }

  const endAt = new Date(startAt.getTime() + durationMin * 60_000);
  const supabase = createAdminClient();

  const weekday = weekdayMap[startAt.getDay()];
  const startMinutes = toMinutes(appointmentTime);
  const endMinutes = startMinutes + durationMin;
  const { data: schedules, error: scheduleError } = await supabase
    .from("dentist_schedules")
    .select("start_time, end_time, is_available")
    .eq("dentist_id", dentistId)
    .eq("day_of_week", weekday);

  if (scheduleError) {
    redirectWithStatus(scheduleError.message, "error", redirectTo);
  }

  const isWithinSchedule = (schedules ?? []).some((entry) => {
    if (!entry.is_available) {
      return false;
    }
    const scheduleStart = toMinutes(entry.start_time);
    const scheduleEnd = toMinutes(entry.end_time);
    return startMinutes >= scheduleStart && endMinutes <= scheduleEnd;
  });

  if (!isWithinSchedule) {
    redirectWithStatus(
      "Selected dentist is not available at this date/time.",
      "error",
      redirectTo,
    );
  }

  const { data: overlappingAppointments, error: overlapError } = await supabase
    .from("appointments")
    .select("id")
    .eq("dentist_id", dentistId)
    .in("status", ["scheduled", "confirmed"])
    .lt("start_at", endAt.toISOString())
    .gt("end_at", startAt.toISOString())
    .limit(1);

  if (overlapError) {
    redirectWithStatus(overlapError.message, "error", redirectTo);
  }

  if ((overlappingAppointments ?? []).length > 0) {
    redirectWithStatus(
      "Selected dentist already has an appointment during this time.",
      "error",
      redirectTo,
    );
  }

  const { data: bookingRequest, error: requestError } = await supabase
    .from("booking_requests")
    .select("id, email, patient_name, status")
    .eq("id", requestId)
    .maybeSingle();

  if (requestError) {
    redirectWithStatus(requestError.message, "error", redirectTo);
  }

  if (!bookingRequest) {
    redirectWithStatus("Booking request was not found.", "error", redirectTo);
  }

  if (!allowedBookingStatuses.includes(bookingRequest.status)) {
    redirectWithStatus(
      "Booking request status is invalid.",
      "error",
      redirectTo,
    );
  }

  if (bookingRequest.status === "rejected") {
    redirectWithStatus(
      "Rejected requests cannot be converted. Move it to contacted first if needed.",
      "error",
      redirectTo,
    );
  }

  if (bookingRequest.status === "converted") {
    redirectWithStatus(
      "This booking request is already converted to an appointment.",
      "error",
      redirectTo,
    );
  }

  const normalizedEmail = bookingRequest.email.toLowerCase().trim();
  const { data: patientProfileRef, error: patientError } = await supabase
    .from("profiles")
    .select("id, patient_profiles(id)")
    .eq("email", normalizedEmail)
    .eq("role", "patient")
    .maybeSingle();

  if (patientError) {
    redirectWithStatus(patientError.message, "error", redirectTo);
  }

  const patientProfiles = patientProfileRef?.patient_profiles;
  const patientProfileId = Array.isArray(patientProfiles)
    ? patientProfiles[0]?.id
    : patientProfiles?.id;

  const appointmentPayload: Database["public"]["Tables"]["appointments"]["Insert"] =
    {
      patient_id: patientProfileId ?? null,
      patient_email: normalizedEmail,
      patient_name: bookingRequest.patient_name || null,
      dentist_id: dentistId,
      service_id: serviceId,
      booked_by: staff.id,
      start_at: startAt.toISOString(),
      end_at: endAt.toISOString(),
      duration_min: durationMin,
      status: appointmentStatus as AppointmentStatus,
      source: "staff_manual",
      notes: notes || null,
      confirmed_at:
        appointmentStatus === "confirmed" ? new Date().toISOString() : null,
    };

  const { error: appointmentError } = await supabase
    .from("appointments")
    .insert(appointmentPayload);

  if (appointmentError) {
    redirectWithStatus(appointmentError.message, "error", redirectTo);
  }

  const { error: updateError } = await updateBookingRequestStatus(
    requestId,
    "converted",
  );
  if (updateError) {
    redirectWithStatus(updateError.message, "error", redirectTo);
  }

  revalidatePath("/staff/booking-requests");
  revalidatePath("/staff/appointments");
  redirectWithStatus(
    "Booking request converted to appointment.",
    "success",
    "/staff/appointments",
  );
}
