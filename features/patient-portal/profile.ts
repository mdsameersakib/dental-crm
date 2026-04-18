import { createClient } from "@/lib/supabase/server";

import type { PatientPortalProfileFormData } from "./types";

function joinLines(values: string[] | null) {
  return (values ?? []).join("\n");
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export async function getPatientProfileFormData(
  profileId: string,
  patientProfileId: string,
) {
  const supabase = await createClient();
  const [{ data: profile }, { data: patientProfile }] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name, last_name, email, phone, address")
      .eq("id", profileId)
      .maybeSingle(),
    supabase
      .from("patient_profiles")
      .select(
        "date_of_birth, gender, blood_type, allergies, current_medications, emergency_contact_name, emergency_contact_phone",
      )
      .eq("id", patientProfileId)
      .maybeSingle(),
  ]);

  return {
    firstName: profile?.first_name ?? "",
    lastName: profile?.last_name ?? "",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
    address: profile?.address ?? "",
    dateOfBirth: patientProfile?.date_of_birth ?? "",
    gender: patientProfile?.gender ?? "",
    bloodType: patientProfile?.blood_type ?? "",
    allergiesText: joinLines(patientProfile?.allergies ?? null),
    currentMedicationsText: joinLines(
      patientProfile?.current_medications ?? null,
    ),
    emergencyContactName: patientProfile?.emergency_contact_name ?? "",
    emergencyContactPhone: patientProfile?.emergency_contact_phone ?? "",
  } satisfies PatientPortalProfileFormData;
}

export async function savePatientProfileDetails(
  profileId: string,
  patientProfileId: string,
  input: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    gender: string;
    bloodType: string;
    allergiesText: string;
    currentMedicationsText: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
  },
) {
  const supabase = await createClient();
  const profileResult = await supabase
    .from("profiles")
    .update({
      first_name: input.firstName,
      last_name: input.lastName,
      phone: input.phone || null,
      address: input.address || null,
    })
    .eq("id", profileId);

  if (profileResult.error) {
    return profileResult;
  }

  return supabase
    .from("patient_profiles")
    .update({
      date_of_birth: input.dateOfBirth || null,
      gender: input.gender || null,
      blood_type: input.bloodType || null,
      allergies: splitLines(input.allergiesText),
      current_medications: splitLines(input.currentMedicationsText),
      emergency_contact_name: input.emergencyContactName || null,
      emergency_contact_phone: input.emergencyContactPhone || null,
    })
    .eq("id", patientProfileId);
}
