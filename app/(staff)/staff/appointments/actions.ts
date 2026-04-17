"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

function sanitizeRedirectPath(path: string) {
  if (path.startsWith("/staff/appointments")) {
    return path;
  }

  return "/staff/appointments";
}

function redirectWithStatus(
  message: string,
  type: "error" | "success",
  path = "/staff/appointments",
): never {
  const params = new URLSearchParams({ [type]: message });
  redirect(`${sanitizeRedirectPath(path)}?${params.toString()}`);
}

export async function updateAppointmentStatus(formData: FormData) {
  await requireStaffProfile();
  const appointmentId = String(formData.get("appointment_id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const cancellationReason = String(
    formData.get("cancellation_reason") ?? "",
  ).trim();
  const redirectTo = sanitizeRedirectPath(
    String(formData.get("redirect_to") ?? "/staff/appointments").trim(),
  );

  if (!appointmentId) {
    redirectWithStatus("Appointment id is required.", "error", redirectTo);
  }

  if (!allowedStatuses.includes(status as AppointmentStatus)) {
    redirectWithStatus(
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
    redirectWithStatus(error.message, "error", redirectTo);
  }

  revalidatePath("/staff/appointments");
  redirectWithStatus("Appointment status updated.", "success", redirectTo);
}
