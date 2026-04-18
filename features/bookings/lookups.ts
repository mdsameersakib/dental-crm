import { createAdminClient } from "@/lib/supabase/admin";

function buildName(firstName: string | null, lastName: string | null) {
  return `${firstName ?? ""} ${lastName ?? ""}`.trim();
}

export async function getServiceNameMap(serviceIds: string[]) {
  if (serviceIds.length === 0) {
    return new Map<string, string>();
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("services")
    .select("id, name")
    .in("id", serviceIds);

  return new Map((data ?? []).map((service) => [service.id, service.name]));
}

export async function getDentistNameMap(dentistIds: string[]) {
  if (dentistIds.length === 0) {
    return new Map<string, string>();
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("dentist_profiles")
    .select(
      "id, profiles!dentist_profiles_profile_id_fkey(first_name, last_name)",
    )
    .in("id", dentistIds);

  return new Map(
    (data ?? []).map((dentist) => {
      const profile = Array.isArray(dentist.profiles)
        ? dentist.profiles[0]
        : dentist.profiles;
      const name = buildName(
        profile?.first_name ?? null,
        profile?.last_name ?? null,
      );
      return [dentist.id, name || "Unnamed dentist"];
    }),
  );
}

export async function getPatientInfoMap(patientIds: string[]) {
  if (patientIds.length === 0) {
    return new Map<string, { name: string; email: string }>();
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("patient_profiles")
    .select(
      "id, profiles!patient_profiles_profile_id_fkey(first_name, last_name, email)",
    )
    .in("id", patientIds);

  return new Map(
    (data ?? []).map((patient) => {
      const profile = Array.isArray(patient.profiles)
        ? patient.profiles[0]
        : patient.profiles;
      const name = buildName(
        profile?.first_name ?? null,
        profile?.last_name ?? null,
      );

      return [
        patient.id,
        {
          name: name || "Unnamed patient",
          email: profile?.email ?? "",
        },
      ];
    }),
  );
}
