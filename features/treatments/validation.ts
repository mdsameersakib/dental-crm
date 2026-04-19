import type { TreatmentStatus } from "./types";

const allowedStatuses = [
  "planned",
  "in_progress",
  "completed",
] satisfies readonly TreatmentStatus[];

export type ValidatedTreatmentForm = {
  id: string | null;
  redirectTo: string;
  patientId: string;
  appointmentId: string | null;
  serviceId: string | null;
  dentistId: string;
  treatmentName: string;
  treatmentCode: string | null;
  toothNumber: number | null;
  description: string | null;
  status: TreatmentStatus;
  statusNotes: string | null;
  cost: number | null;
  aftercareInstructions: string | null;
  followUpDate: string | null;
  performedAt: string | null;
};

export function validateTreatmentForm(
  formData: FormData,
):
  | { success: true; data: ValidatedTreatmentForm }
  | { success: false; error: string } {
  const id = String(formData.get("id") ?? "").trim() || null;
  const redirectTo = String(
    formData.get("redirect_to") ?? "/staff/treatments",
  ).trim();
  const patientId = String(formData.get("patient_id") ?? "").trim();
  const appointmentId =
    String(formData.get("appointment_id") ?? "").trim() || null;
  const serviceId = String(formData.get("service_id") ?? "").trim() || null;
  const dentistId = String(formData.get("dentist_id") ?? "").trim();
  const treatmentName = String(formData.get("treatment_name") ?? "").trim();
  const treatmentCode =
    String(formData.get("treatment_code") ?? "").trim() || null;
  const toothNumberInput = String(formData.get("tooth_number") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "").trim();
  const statusNotes = String(formData.get("status_notes") ?? "").trim() || null;
  const costInput = String(formData.get("cost") ?? "").trim();
  const aftercareInstructions =
    String(formData.get("aftercare_instructions") ?? "").trim() || null;
  const followUpDate =
    String(formData.get("follow_up_date") ?? "").trim() || null;
  const performedAtInput = String(formData.get("performed_at") ?? "").trim();

  if (!patientId) {
    return { success: false, error: "Choose a patient before saving." };
  }

  if (!dentistId) {
    return { success: false, error: "Choose a dentist before saving." };
  }

  if (!allowedStatuses.includes(status as TreatmentStatus)) {
    return { success: false, error: "Choose a valid treatment status." };
  }

  let toothNumber: number | null = null;
  if (toothNumberInput) {
    const parsed = Number(toothNumberInput);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      return {
        success: false,
        error: "Tooth number must be a positive whole number.",
      };
    }
    toothNumber = parsed;
  }

  let cost: number | null = null;
  if (costInput) {
    const parsed = Number(costInput);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return {
        success: false,
        error: "Cost must be zero or a positive amount.",
      };
    }
    cost = parsed;
  }

  const performedAt = performedAtInput
    ? new Date(performedAtInput).toISOString()
    : null;

  if (performedAtInput && Number.isNaN(new Date(performedAtInput).getTime())) {
    return { success: false, error: "Choose a valid performed time." };
  }

  return {
    success: true,
    data: {
      id,
      redirectTo,
      patientId,
      appointmentId,
      serviceId,
      dentistId,
      treatmentName,
      treatmentCode,
      toothNumber,
      description,
      status: status as TreatmentStatus,
      statusNotes,
      cost,
      aftercareInstructions,
      followUpDate,
      performedAt,
    },
  };
}
