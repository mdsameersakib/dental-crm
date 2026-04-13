import { createClient } from "@/lib/supabase/server";

import type { BookingRequestInput } from "./validation";

export async function createBookingRequest(input: BookingRequestInput) {
  const supabase = await createClient();

  return supabase.from("booking_requests").insert({
    patient_name: input.patientName,
    email: input.email,
    phone: input.phone,
    service_id: input.serviceId,
    preferred_dentist_id: input.preferredDentistId,
    preferred_date: input.preferredDate,
    preferred_time: input.preferredTime,
    notes: input.notes,
  });
}
