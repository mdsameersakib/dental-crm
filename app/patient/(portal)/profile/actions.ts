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
  const dateOfBirth = String(formData.get("date_of_birth") ?? "").trim();
  const gender = String(formData.get("gender") ?? "").trim();
  const bloodType = String(formData.get("blood_type") ?? "").trim();
  const allergiesText = String(formData.get("allergies") ?? "").trim();
  const currentMedicationsText = String(
    formData.get("current_medications") ?? "",
  ).trim();
  const emergencyContactName = String(
    formData.get("emergency_contact_name") ?? "",
  ).trim();
  const emergencyContactPhone = String(
    formData.get("emergency_contact_phone") ?? "",
  ).trim();

  if (!firstName || !lastName) {
    redirectProfileStatus("error", "First and last name are required.");
  }

  const result = await savePatientProfileDetails(
    profile.id,
    profile.patientProfileId,
    {
      firstName,
      lastName,
      phone,
      address,
      dateOfBirth,
      gender,
      bloodType,
      allergiesText,
      currentMedicationsText,
      emergencyContactName,
      emergencyContactPhone,
    },
  );

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
