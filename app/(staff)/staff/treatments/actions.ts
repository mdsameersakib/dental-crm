"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  addTreatmentDocumentForStaff,
  deleteTreatmentDocumentForStaff,
} from "@/features/documents/admin";
import {
  getAppointmentPrefillForTreatment,
  getServiceDefaultsForTreatment,
} from "@/features/treatments/admin";
import { sanitizeTreatmentsRedirectPath } from "@/features/treatments/presentation";
import { validateTreatmentForm } from "@/features/treatments/validation";
import { requireStaffProfile } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

function redirectWithStatus(
  message: string,
  type: "error" | "success",
  path = "/staff/treatments",
): never {
  const params = new URLSearchParams({
    [type]: message,
  });

  redirect(`${sanitizeTreatmentsRedirectPath(path)}?${params.toString()}`);
}

export async function saveTreatment(formData: FormData) {
  await requireStaffProfile();
  const validation = validateTreatmentForm(formData);

  if (!validation.success) {
    redirectWithStatus(
      validation.error,
      "error",
      sanitizeTreatmentsRedirectPath(
        String(formData.get("redirect_to") ?? "/staff/treatments").trim(),
      ),
    );
  }

  const supabase = createAdminClient();
  const redirectTo = sanitizeTreatmentsRedirectPath(validation.data.redirectTo);
  let patientId = validation.data.patientId;
  let dentistId = validation.data.dentistId;
  let serviceId = validation.data.serviceId;

  if (validation.data.appointmentId) {
    const appointment = await getAppointmentPrefillForTreatment(
      validation.data.appointmentId,
    );

    if (!appointment || !appointment.patient_id) {
      redirectWithStatus(
        "The selected appointment is not linked to a saved patient profile.",
        "error",
        redirectTo,
      );
    }

    if (appointment.patient_id !== validation.data.patientId) {
      redirectWithStatus(
        "Selected appointment does not belong to the chosen patient.",
        "error",
        redirectTo,
      );
    }

    patientId = appointment.patient_id;
    dentistId = validation.data.dentistId || appointment.dentist_id;
    serviceId = validation.data.serviceId ?? appointment.service_id ?? null;
  }

  let treatmentName = validation.data.treatmentName;
  let aftercareInstructions = validation.data.aftercareInstructions;

  if (serviceId && (!treatmentName || !aftercareInstructions)) {
    const serviceDefaults = await getServiceDefaultsForTreatment(serviceId);
    if (!treatmentName) {
      treatmentName = serviceDefaults?.name?.trim() ?? "";
    }
    if (!aftercareInstructions) {
      aftercareInstructions =
        serviceDefaults?.recommended_aftercare?.trim() || null;
    }
  }

  if (!treatmentName) {
    redirectWithStatus(
      "Enter a treatment name or select a service to prefill it.",
      "error",
      redirectTo,
    );
  }

  const payload: Database["public"]["Tables"]["treatments"]["Insert"] = {
    appointment_id: validation.data.appointmentId,
    patient_id: patientId,
    dentist_id: dentistId,
    service_id: serviceId,
    treatment_name: treatmentName,
    treatment_code: validation.data.treatmentCode,
    tooth_number: validation.data.toothNumber,
    description: validation.data.description,
    status: validation.data.status,
    status_notes: validation.data.statusNotes,
    cost: validation.data.cost,
    aftercare_instructions: aftercareInstructions,
    follow_up_date: validation.data.followUpDate,
    performed_at:
      validation.data.status === "completed"
        ? (validation.data.performedAt ?? new Date().toISOString())
        : validation.data.performedAt,
  };

  if (validation.data.id) {
    const result = await supabase
      .from("treatments")
      .update(payload)
      .eq("id", validation.data.id);

    if (result.error) {
      redirectWithStatus(result.error.message, "error", redirectTo);
    }

    revalidatePath("/staff/treatments");
    revalidatePath("/staff/dashboard");
    revalidatePath("/staff/patients");
    revalidatePath("/patient/dashboard");
    revalidatePath("/patient/appointments");
    redirectWithStatus("Treatment updated.", "success", redirectTo);
  }

  const createResult = await supabase
    .from("treatments")
    .insert(payload)
    .select("id")
    .single();

  if (createResult.error) {
    redirectWithStatus(createResult.error.message, "error", redirectTo);
  }

  revalidatePath("/staff/treatments");
  revalidatePath("/staff/dashboard");
  revalidatePath("/staff/patients");
  revalidatePath("/patient/dashboard");
  revalidatePath("/patient/appointments");
  redirectWithStatus(
    "Treatment created.",
    "success",
    createResult.data?.id
      ? `/staff/treatments/${createResult.data.id}`
      : "/staff/treatments",
  );
}

export async function deleteTreatment(formData: FormData) {
  await requireStaffProfile();
  const treatmentId = String(formData.get("id") ?? "").trim();
  const redirectTo = sanitizeTreatmentsRedirectPath(
    String(formData.get("redirect_to") ?? "/staff/treatments").trim(),
  );

  if (!treatmentId) {
    redirectWithStatus(
      "Treatment id is required for deletion.",
      "error",
      redirectTo,
    );
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("treatments")
    .delete()
    .eq("id", treatmentId);

  if (error) {
    redirectWithStatus(error.message, "error", redirectTo);
  }

  revalidatePath("/staff/treatments");
  revalidatePath("/staff/dashboard");
  revalidatePath("/staff/patients");
  revalidatePath("/patient/dashboard");
  revalidatePath("/patient/appointments");
  redirectWithStatus("Treatment deleted.", "success", "/staff/treatments");
}

export async function uploadTreatmentDocument(formData: FormData) {
  const staff = await requireStaffProfile();
  const treatmentId = String(formData.get("treatment_id") ?? "").trim();
  const patientId = String(formData.get("patient_id") ?? "").trim();
  const appointmentId =
    String(formData.get("appointment_id") ?? "").trim() || null;
  const documentType = String(
    formData.get("document_type") ?? "other",
  ).trim() as Database["public"]["Enums"]["document_type"];
  const visibleToPatient =
    String(formData.get("visible_to_patient") ?? "yes").trim() === "yes";
  const notes = String(formData.get("document_notes") ?? "").trim() || null;
  const file = formData.get("document_file");

  if (
    !treatmentId ||
    !patientId ||
    !(file instanceof File) ||
    file.size === 0
  ) {
    redirectWithStatus(
      "Choose a file before uploading a treatment document.",
      "error",
      treatmentId ? `/staff/treatments/${treatmentId}` : "/staff/treatments",
    );
  }

  const result = await addTreatmentDocumentForStaff({
    treatmentId,
    patientId,
    appointmentId,
    uploadedBy: staff.id,
    file,
    documentType,
    notes,
    isVisibleToPatient: visibleToPatient,
  });

  if (result.error) {
    redirectWithStatus(
      "Unable to upload the treatment document right now.",
      "error",
      `/staff/treatments/${treatmentId}`,
    );
  }

  revalidatePath(`/staff/treatments/${treatmentId}`);
  revalidatePath("/patient/dashboard");
  redirectWithStatus(
    "Treatment document uploaded.",
    "success",
    `/staff/treatments/${treatmentId}`,
  );
}

export async function deleteTreatmentDocument(formData: FormData) {
  await requireStaffProfile();
  const documentId = String(formData.get("document_id") ?? "").trim();
  const treatmentId = String(formData.get("treatment_id") ?? "").trim();

  if (!documentId || !treatmentId) {
    redirectWithStatus(
      "Unable to remove this document.",
      "error",
      "/staff/treatments",
    );
  }

  const result = await deleteTreatmentDocumentForStaff(documentId);

  if (result.error) {
    redirectWithStatus(
      "Unable to delete this treatment document right now.",
      "error",
      `/staff/treatments/${treatmentId}`,
    );
  }

  revalidatePath(`/staff/treatments/${treatmentId}`);
  revalidatePath("/patient/dashboard");
  redirectWithStatus(
    "Treatment document deleted.",
    "success",
    `/staff/treatments/${treatmentId}`,
  );
}
