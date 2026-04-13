"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function redirectWithError(message: string) {
  const params = new URLSearchParams({
    error: message,
  });

  redirect(`/book?${params.toString()}`);
}

export async function submitBookingRequest(formData: FormData) {
  const patientName = String(formData.get("patient_name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const serviceId = String(formData.get("service_id") ?? "").trim();
  const preferredDentistId = String(
    formData.get("preferred_dentist_id") ?? "",
  ).trim();
  const preferredDate = String(formData.get("preferred_date") ?? "").trim();
  const preferredTime = String(formData.get("preferred_time") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (
    !patientName ||
    !email ||
    !phone ||
    !serviceId ||
    !preferredDate ||
    !preferredTime
  ) {
    redirectWithError(
      "Complete the required booking fields before submitting.",
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("booking_requests").insert({
    patient_name: patientName,
    email,
    phone,
    service_id: serviceId,
    preferred_dentist_id: preferredDentistId || null,
    preferred_date: preferredDate,
    preferred_time: preferredTime,
    notes: notes || null,
  });

  if (error) {
    redirectWithError("We could not submit your request. Please try again.");
  }

  revalidatePath("/book");
  redirect("/book?submitted=1");
}
