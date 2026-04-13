export type BookingRequestInput = {
  patientName: string;
  email: string;
  phone: string;
  serviceId: string;
  preferredDentistId: string | null;
  preferredDate: string;
  preferredTime: string;
  notes: string | null;
};

type BookingValidationResult =
  | {
      success: true;
      data: BookingRequestInput;
    }
  | {
      success: false;
      error: string;
    };

function getTrimmedField(formData: FormData, field: string) {
  return String(formData.get(field) ?? "").trim();
}

export function validateBookingRequest(
  formData: FormData,
): BookingValidationResult {
  const patientName = getTrimmedField(formData, "patient_name");
  const email = getTrimmedField(formData, "email").toLowerCase();
  const phone = getTrimmedField(formData, "phone");
  const serviceId = getTrimmedField(formData, "service_id");
  const preferredDentistId = getTrimmedField(formData, "preferred_dentist_id");
  const preferredDate = getTrimmedField(formData, "preferred_date");
  const preferredTime = getTrimmedField(formData, "preferred_time");
  const notes = getTrimmedField(formData, "notes");

  if (
    !patientName ||
    !email ||
    !phone ||
    !serviceId ||
    !preferredDate ||
    !preferredTime
  ) {
    return {
      success: false,
      error: "Complete the required booking fields before submitting.",
    };
  }

  return {
    success: true,
    data: {
      patientName,
      email,
      phone,
      serviceId,
      preferredDentistId: preferredDentistId || null,
      preferredDate,
      preferredTime,
      notes: notes || null,
    },
  };
}
