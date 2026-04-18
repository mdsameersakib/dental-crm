import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

type PatientProfileRow =
  Database["public"]["Tables"]["patient_profiles"]["Row"];

async function linkGuestAppointmentsByEmail(
  patientProfileId: string,
  email: string,
) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return;
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("appointments")
    .select("id, patient_email")
    .is("patient_id", null);

  const appointmentIds = (data ?? [])
    .filter(
      (entry) => entry.patient_email?.trim().toLowerCase() === normalizedEmail,
    )
    .map((entry) => entry.id);

  if (appointmentIds.length === 0) {
    return;
  }

  await supabase
    .from("appointments")
    .update({
      patient_id: patientProfileId,
    })
    .in("id", appointmentIds);
}

export async function ensurePatientAccountForProfile(input: {
  profileId: string;
  email: string;
}) {
  const supabase = createAdminClient();
  const { data: existing, error: existingError } = await supabase
    .from("patient_profiles")
    .select("id, profile_id")
    .eq("profile_id", input.profileId)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing) {
    await linkGuestAppointmentsByEmail(existing.id, input.email);
    return existing as Pick<PatientProfileRow, "id" | "profile_id">;
  }

  const { data, error } = await supabase
    .from("patient_profiles")
    .insert({
      profile_id: input.profileId,
    })
    .select("id, profile_id")
    .single();

  if (error) {
    throw error;
  }

  await linkGuestAppointmentsByEmail(data.id, input.email);
  return data as Pick<PatientProfileRow, "id" | "profile_id">;
}
