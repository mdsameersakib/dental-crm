"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createPatientFollowUpRequest,
  validatePatientFollowUpRequest,
} from "@/features/patient-portal/follow-up";
import { requirePatientProfile } from "@/lib/auth/session";

function redirectDashboardStatus(
  type: "error" | "success",
  message: string,
): never {
  const params = new URLSearchParams({
    [type]: message,
  });

  redirect(`/patient/dashboard?${params.toString()}`);
}

export async function submitPatientFollowUpRequest(formData: FormData) {
  const profile = await requirePatientProfile("/patient/dashboard");
  const validation = validatePatientFollowUpRequest(formData);

  if (!validation.success) {
    redirectDashboardStatus("error", validation.error);
  }

  const fullName =
    `${profile.firstName} ${profile.lastName}`.trim() || "Patient";
  const result = await createPatientFollowUpRequest({
    patientName: fullName,
    email: profile.email,
    phone: validation.data.phone,
    serviceId: validation.data.serviceId,
    preferredDentistId: validation.data.preferredDentistId,
    preferredDate: validation.data.preferredDate,
    preferredTime: validation.data.preferredTime,
    notes: validation.data.notes,
  });

  if (result.error) {
    redirectDashboardStatus(
      "error",
      "Unable to submit your follow-up request right now.",
    );
  }

  revalidatePath("/patient/dashboard");
  redirectDashboardStatus(
    "success",
    "Your request has been sent. Staff will confirm the appointment with you.",
  );
}
