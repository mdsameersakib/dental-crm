import { createBookingRequest } from "@/features/bookings/mutations";
import { getPublishedDentists } from "@/features/public-content/dentist-queries";
import { getPublishedServices } from "@/features/public-content/service-queries";

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
      };
    }
  | {
      success: false;
      error: string;
    };

function getTrimmedField(formData: FormData, field: string) {
  return String(formData.get(field) ?? "").trim();
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
}) {
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
