"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createBookingRequest } from "@/features/bookings/mutations";
import { validateBookingRequest } from "@/features/bookings/validation";

function redirectWithError(message: string): never {
  const params = new URLSearchParams({
    error: message,
  });

  redirect(`/book?${params.toString()}`);
}

export async function submitBookingRequest(formData: FormData) {
  const validation = validateBookingRequest(formData);

  if (!validation.success) {
    redirectWithError(validation.error);
  }

  const { error } = await createBookingRequest(validation.data);

  if (error) {
    redirectWithError("We could not submit your request. Please try again.");
  }

  revalidatePath("/book");
  redirect("/book?submitted=1");
}
