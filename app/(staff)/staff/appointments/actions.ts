"use server";

import { revalidatePath } from "next/cache";

import {
  createManualAppointmentForStaff,
  readManualAppointmentDraft,
  redirectManualAppointmentCreate,
} from "@/features/bookings/manual-appointment";
import {
  redirectAppointmentsStatus,
  sanitizeAppointmentsRedirectPath,
} from "@/features/bookings/staff-actions";
import { requireStaffProfile } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

type AppointmentStatus = Database["public"]["Enums"]["appointment_status"];

const allowedStatuses: AppointmentStatus[] = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
];

export async function updateAppointmentStatus(formData: FormData) {
  await requireStaffProfile();
  const appointmentId = String(formData.get("appointment_id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const cancellationReason = String(
    formData.get("cancellation_reason") ?? "",
  ).trim();
  const redirectTo = sanitizeAppointmentsRedirectPath(
    String(formData.get("redirect_to") ?? "/staff/appointments").trim(),
  );

  if (!appointmentId) {
    redirectAppointmentsStatus(
      "Appointment id is required.",
      "error",
      redirectTo,
    );
  }

  if (!allowedStatuses.includes(status as AppointmentStatus)) {
    redirectAppointmentsStatus(
      "Choose a valid appointment status.",
      "error",
      redirectTo,
    );
  }

  const updatePayload: Database["public"]["Tables"]["appointments"]["Update"] =
    {
      status: status as AppointmentStatus,
      confirmed_at: status === "confirmed" ? new Date().toISOString() : null,
      completed_at: status === "completed" ? new Date().toISOString() : null,
      cancellation_reason:
        status === "cancelled"
          ? cancellationReason || "Cancelled by staff."
          : null,
    };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("appointments")
    .update(updatePayload)
    .eq("id", appointmentId);

  if (error) {
    redirectAppointmentsStatus(error.message, "error", redirectTo);
  }

  revalidatePath("/staff/appointments");
  redirectAppointmentsStatus(
    "Appointment status updated.",
    "success",
    redirectTo,
  );
}

export async function createManualAppointment(formData: FormData) {
  const staff = await requireStaffProfile();
  const draft = readManualAppointmentDraft(formData);

  const result = await createManualAppointmentForStaff({
    bookedBy: staff.id,
    draft,
  });

  if (result.error) {
    redirectManualAppointmentCreate("error", result.error, draft);
  }

  revalidatePath("/staff/appointments");
  revalidatePath("/staff/patients");
  redirectManualAppointmentCreate("success", "Appointment created.", {
    patientQuery: draft.patientQuery,
  });
}
