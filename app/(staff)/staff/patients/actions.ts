"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  savePatientAccountStateForStaff,
  savePatientContactProfileForStaff,
  savePatientMedicalProfileForStaff,
} from "@/features/patients/admin";
import { requireStaffProfile } from "@/lib/auth/session";

function buildPatientsRedirect(input: {
  type: "error" | "success";
  message: string;
  patient?: string;
  query?: string;
}) {
  const params = new URLSearchParams({
    [input.type]: input.message,
  });

  if (input.query) {
    params.set("q", input.query);
  }

  if (input.patient) {
    params.set("patient", input.patient);
  }

  redirect(`/staff/patients?${params.toString()}`);
}

export async function updatePatientMedicalProfile(formData: FormData) {
  await requireStaffProfile();

  const patientProfileId = String(
    formData.get("patient_profile_id") ?? "",
  ).trim();
  const patientRegistryKey = String(formData.get("patient") ?? "").trim();
  const query = String(formData.get("q") ?? "").trim();
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

  if (!patientProfileId || !patientRegistryKey) {
    buildPatientsRedirect({
      type: "error",
      message: "Unable to update this patient medical profile.",
      query,
    });
  }

  const result = await savePatientMedicalProfileForStaff({
    patientProfileId,
    dateOfBirth,
    gender,
    bloodType,
    allergiesText,
    currentMedicationsText,
    emergencyContactName,
    emergencyContactPhone,
  });

  if (result.error) {
    buildPatientsRedirect({
      type: "error",
      message: "Unable to save medical profile details right now.",
      patient: patientRegistryKey,
      query,
    });
  }

  revalidatePath("/staff/patients");
  buildPatientsRedirect({
    type: "success",
    message: "Medical profile updated.",
    patient: patientRegistryKey,
    query,
  });
}

export async function updatePatientContactProfile(formData: FormData) {
  await requireStaffProfile();

  const profileId = String(formData.get("profile_id") ?? "").trim();
  const patientProfileId = String(
    formData.get("patient_profile_id") ?? "",
  ).trim();
  const patientRegistryKey = String(formData.get("patient") ?? "").trim();
  const query = String(formData.get("q") ?? "").trim();
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!profileId || !patientRegistryKey) {
    buildPatientsRedirect({
      type: "error",
      message: "Unable to update this patient contact profile.",
      query,
    });
  }

  if (!firstName || !lastName || !email) {
    buildPatientsRedirect({
      type: "error",
      message: "First name, last name, and email are required.",
      patient: patientRegistryKey,
      query,
    });
  }

  const result = await savePatientContactProfileForStaff({
    profileId,
    patientProfileId: patientProfileId || null,
    firstName,
    lastName,
    email,
    phone,
    address,
  });

  if (result.error) {
    buildPatientsRedirect({
      type: "error",
      message: "Unable to save contact details right now.",
      patient: patientRegistryKey,
      query,
    });
  }

  revalidatePath("/staff/patients");
  buildPatientsRedirect({
    type: "success",
    message: "Contact details updated.",
    patient: patientRegistryKey,
    query,
  });
}

export async function updatePatientArchiveState(formData: FormData) {
  await requireStaffProfile();

  const profileId = String(formData.get("profile_id") ?? "").trim();
  const patientRegistryKey = String(formData.get("patient") ?? "").trim();
  const query = String(formData.get("q") ?? "").trim();
  const nextState = String(formData.get("next_state") ?? "").trim();

  if (!profileId || !patientRegistryKey) {
    buildPatientsRedirect({
      type: "error",
      message: "Unable to update this patient account state.",
      query,
    });
  }

  const nextIsActive = nextState === "restore";
  const result = await savePatientAccountStateForStaff({
    profileId,
    nextIsActive,
  });

  if (result.error) {
    buildPatientsRedirect({
      type: "error",
      message: "Unable to update patient access right now.",
      patient: patientRegistryKey,
      query,
    });
  }

  revalidatePath("/staff/patients");
  buildPatientsRedirect({
    type: "success",
    message: nextIsActive
      ? "Patient account restored."
      : "Patient account archived.",
    patient: patientRegistryKey,
    query,
  });
}
