import { createBookingRequest } from "@/features/bookings/mutations";
import { getPublishedDentists } from "@/features/public-content/dentist-queries";
import { getPublishedServices } from "@/features/public-content/service-queries";
import { createWaitlistEntry } from "@/features/waitlist/admin";

export async function getPatientFollowUpOptions() {
  const [services, dentists] = await Promise.all([
    getPublishedServices(),
    getPublishedDentists(),
  ]);

  return {
    services,
    dentists,
  };
}

type PatientFollowUpValidationResult =
  | {
      success: true;
      data: {
        phone: string;
        serviceId: string;
        preferredDentistId: string | null;
        preferredDate: string;
        preferredTime: string;
        notes: string | null;
        joinWaitlist: boolean;
      };
    }
  | {
      success: false;
      error: string;
    };

function getTrimmedField(formData: FormData, field: string) {
  return String(formData.get(field) ?? "").trim();
}

function buildWaitlistNotes(input: {
  notes: string | null;
  phone: string;
  preferredTime: string;
}) {
  const parts = [
    input.notes?.trim() || "",
    `Phone: ${input.phone}`,
    `Preferred time: ${input.preferredTime}`,
  ].filter(Boolean);

  return parts.join("\n");
}

export function validatePatientFollowUpRequest(
  formData: FormData,
): PatientFollowUpValidationResult {
  const phone = getTrimmedField(formData, "phone");
  const serviceId = getTrimmedField(formData, "service_id");
  const preferredDentistId = getTrimmedField(formData, "preferred_dentist_id");
  const preferredDate = getTrimmedField(formData, "preferred_date");
  const preferredTime = getTrimmedField(formData, "preferred_time");
  const notes = getTrimmedField(formData, "notes");
  const joinWaitlist =
    String(formData.get("join_waitlist") ?? "").trim() === "yes";

  if (!phone || !serviceId || !preferredDate || !preferredTime) {
    return {
      success: false,
      error:
        "Complete the required follow-up request fields before submitting.",
    };
  }

  return {
    success: true,
    data: {
      phone,
      serviceId,
      preferredDentistId: preferredDentistId || null,
      preferredDate,
      preferredTime,
      notes: notes || null,
      joinWaitlist,
    },
  };
}

export async function createPatientFollowUpRequest(input: {
  patientName: string;
  email: string;
  phone: string;
  serviceId: string;
  preferredDentistId: string | null;
  preferredDate: string;
  preferredTime: string;
  notes: string | null;
  joinWaitlist: boolean;
  patientProfileId?: string;
}) {
  if (input.joinWaitlist && input.patientProfileId) {
    return createWaitlistEntry({
      patientId: input.patientProfileId,
      dentistId: input.preferredDentistId,
      serviceId: input.serviceId,
      preferredFrom: input.preferredDate,
      preferredTo: input.preferredDate,
      notes: buildWaitlistNotes({
        notes: input.notes,
        phone: input.phone,
        preferredTime: input.preferredTime,
      }),
    });
  }

  return createBookingRequest({
    patientName: input.patientName,
    email: input.email,
    phone: input.phone,
    serviceId: input.serviceId,
    preferredDentistId: input.preferredDentistId,
    preferredDate: input.preferredDate,
    preferredTime: input.preferredTime,
    notes: input.notes,
  });
}
