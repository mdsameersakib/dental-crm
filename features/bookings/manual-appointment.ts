import { redirect } from "next/navigation";

import { getDentistsForStaff } from "@/features/dentists/admin";
import { getPatientDetailForStaff } from "@/features/patients/admin";
import { getServicesForStaff } from "@/features/services/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";
import { getActiveAppointmentSlotsForStaff } from "./appointment-queries";
import { canDentistTakeSlot } from "./convert-appointment-availability";
import { getDateTimeValue, toMinutes, weekdayMap } from "./staff-actions";

type AppointmentStatus = Database["public"]["Enums"]["appointment_status"];

export type ManualAppointmentDraft = {
  patientQuery: string;
  selectedPatient: string;
  serviceId: string;
  dentistId: string;
  appointmentDate: string;
  appointmentTime: string;
  durationMin: string;
  appointmentStatus: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientGender: string;
  patientAge: string;
  notes: string;
};

const allowedStatuses: AppointmentStatus[] = ["scheduled", "confirmed"];

function setParam(params: URLSearchParams, key: string, value: string) {
  if (value) {
    params.set(key, value);
  }
}

export function buildManualAppointmentCreateHref(
  draft: Partial<ManualAppointmentDraft> & {
    error?: string;
    success?: string;
  } = {},
) {
  const params = new URLSearchParams();

  setParam(params, "q", draft.patientQuery ?? "");
  setParam(params, "patient", draft.selectedPatient ?? "");
  setParam(params, "service_id", draft.serviceId ?? "");
  setParam(params, "dentist_id", draft.dentistId ?? "");
  setParam(params, "date", draft.appointmentDate ?? "");
  setParam(params, "time", draft.appointmentTime ?? "");
  setParam(params, "duration", draft.durationMin ?? "");
  setParam(params, "status", draft.appointmentStatus ?? "");
  setParam(params, "patient_name", draft.patientName ?? "");
  setParam(params, "patient_email", draft.patientEmail ?? "");
  setParam(params, "patient_phone", draft.patientPhone ?? "");
  setParam(params, "patient_gender", draft.patientGender ?? "");
  setParam(params, "patient_age", draft.patientAge ?? "");
  setParam(params, "notes", draft.notes ?? "");
  setParam(params, "error", draft.error ?? "");
  setParam(params, "success", draft.success ?? "");

  const queryString = params.toString();
  return queryString
    ? `/staff/appointments/new?${queryString}`
    : "/staff/appointments/new";
}

export function redirectManualAppointmentCreate(
  type: "error" | "success",
  message: string,
  draft: Partial<ManualAppointmentDraft> = {},
): never {
  redirect(
    buildManualAppointmentCreateHref({
      ...draft,
      [type]: message,
    }),
  );
}

export function readManualAppointmentDraft(
  formData: FormData,
): ManualAppointmentDraft {
  return {
    patientQuery: String(formData.get("patient_query") ?? "").trim(),
    selectedPatient: String(formData.get("selected_patient") ?? "").trim(),
    serviceId: String(formData.get("service_id") ?? "").trim(),
    dentistId: String(formData.get("dentist_id") ?? "").trim(),
    appointmentDate: String(formData.get("appointment_date") ?? "").trim(),
    appointmentTime: String(formData.get("appointment_time") ?? "").trim(),
    durationMin: String(formData.get("duration_min") ?? "").trim(),
    appointmentStatus: String(formData.get("appointment_status") ?? "").trim(),
    patientName: String(formData.get("patient_name") ?? "").trim(),
    patientEmail: String(formData.get("patient_email") ?? "").trim(),
    patientPhone: String(formData.get("patient_phone") ?? "").trim(),
    patientGender: String(formData.get("patient_gender") ?? "").trim(),
    patientAge: String(formData.get("patient_age") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
  };
}

function buildManualAppointmentNotes(draft: ManualAppointmentDraft) {
  const noteParts = [draft.notes.trim()].filter(Boolean);

  if (!draft.selectedPatient) {
    const intakeParts = [
      draft.patientPhone ? `Phone: ${draft.patientPhone}` : "",
      draft.patientGender ? `Gender: ${draft.patientGender}` : "",
      draft.patientAge ? `Age: ${draft.patientAge}` : "",
    ].filter(Boolean);

    if (intakeParts.length > 0) {
      noteParts.push(`Patient intake - ${intakeParts.join(" · ")}`);
    }
  }

  return noteParts.join("\n\n") || null;
}

export async function createManualAppointmentForStaff(input: {
  bookedBy: string;
  draft: ManualAppointmentDraft;
}) {
  const { bookedBy, draft } = input;
  const durationMin = Number.parseInt(draft.durationMin, 10);

  if (
    !draft.serviceId ||
    !draft.dentistId ||
    !draft.appointmentDate ||
    !draft.appointmentTime
  ) {
    return {
      error:
        "Complete service, dentist, date, and time before creating the appointment.",
    };
  }

  if (!Number.isFinite(durationMin) || durationMin <= 0) {
    return {
      error: "Duration must be a positive number.",
    };
  }

  if (!allowedStatuses.includes(draft.appointmentStatus as AppointmentStatus)) {
    return {
      error: "Choose a valid appointment status.",
    };
  }

  const startAt = getDateTimeValue(
    draft.appointmentDate,
    draft.appointmentTime,
  );
  if (Number.isNaN(startAt.getTime())) {
    return {
      error: "Choose a valid appointment date and time.",
    };
  }

  const [services, dentists, activeAppointments] = await Promise.all([
    getServicesForStaff(),
    getDentistsForStaff(),
    getActiveAppointmentSlotsForStaff(),
  ]);

  const service = services.find((entry) => entry.id === draft.serviceId);
  if (!service) {
    return {
      error: "Choose a valid service.",
    };
  }

  const dentist = dentists.find((entry) => entry.id === draft.dentistId);
  if (!dentist) {
    return {
      error: "Choose a valid dentist.",
    };
  }

  const isAvailable = canDentistTakeSlot(
    {
      id: dentist.id,
      name: `${dentist.firstName} ${dentist.lastName}`.trim() || dentist.email,
      email: dentist.email,
      schedules: dentist.schedules,
    },
    activeAppointments,
    draft.appointmentDate,
    draft.appointmentTime,
    durationMin,
  );

  if (!isAvailable) {
    const weekday = weekdayMap[startAt.getDay()];
    const startMinutes = toMinutes(draft.appointmentTime);
    const endMinutes = startMinutes + durationMin;
    const coveredBySchedule = dentist.schedules.some((entry) => {
      if (!entry.isAvailable || entry.day !== weekday) {
        return false;
      }

      const scheduleStart = toMinutes(entry.startTime);
      const scheduleEnd = toMinutes(entry.endTime);
      return startMinutes >= scheduleStart && endMinutes <= scheduleEnd;
    });

    return {
      error: coveredBySchedule
        ? "Selected dentist already has an appointment during this time."
        : "Selected dentist is not available at this date/time.",
    };
  }

  let patientId: string | null = null;
  let patientName = draft.patientName;
  let patientEmail = draft.patientEmail.trim().toLowerCase();

  if (draft.selectedPatient) {
    const selectedPatient = await getPatientDetailForStaff(
      draft.selectedPatient,
    );

    if (!selectedPatient) {
      return {
        error: "Selected patient could not be found.",
      };
    }

    patientId = selectedPatient.patientProfileId;
    patientName = selectedPatient.name;
    patientEmail = selectedPatient.email.trim().toLowerCase();
  }

  if (!patientName || !patientEmail) {
    return {
      error:
        "Select an existing patient or enter guest patient name and email.",
    };
  }

  const endAt = new Date(startAt.getTime() + durationMin * 60_000);
  const supabase = createAdminClient();

  const { error } = await supabase.from("appointments").insert({
    booked_by: bookedBy,
    dentist_id: dentist.id,
    duration_min: durationMin,
    end_at: endAt.toISOString(),
    notes: buildManualAppointmentNotes(draft),
    patient_email: patientEmail,
    patient_id: patientId,
    patient_name: patientName,
    service_id: service.id,
    source: "staff_manual",
    start_at: startAt.toISOString(),
    status: draft.appointmentStatus as AppointmentStatus,
    confirmed_at:
      draft.appointmentStatus === "confirmed" ? new Date().toISOString() : null,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
