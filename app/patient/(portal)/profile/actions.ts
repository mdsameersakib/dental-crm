"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { savePatientProfileDetails } from "@/features/patient-portal/profile";
import { requirePatientProfile } from "@/lib/auth/session";

function redirectProfileStatus(
  type: "error" | "success",
  message: string,
): never {
  const params = new URLSearchParams({
    [type]: message,
  });

  redirect(`/patient/profile?${params.toString()}`);
}

export async function savePatientProfile(formData: FormData) {
  const profile = await requirePatientProfile("/patient/profile");
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!firstName || !lastName) {
    redirectProfileStatus("error", "First and last name are required.");
  }

  const result = await savePatientProfileDetails(profile.id, {
    firstName,
    lastName,
    phone,
    address,
  });

  if (result.error) {
    redirectProfileStatus(
      "error",
      "Unable to save your profile details right now.",
    );
  }

  revalidatePath("/patient/profile");
  revalidatePath("/patient/dashboard");
  redirectProfileStatus("success", "Profile details updated.");
}
