import { createClient } from "@/lib/supabase/server";

import type { PatientPortalProfileFormData } from "./types";

export async function getPatientProfileFormData(profileId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("first_name, last_name, email, phone, address")
    .eq("id", profileId)
    .maybeSingle();

  return {
    firstName: data?.first_name ?? "",
    lastName: data?.last_name ?? "",
    email: data?.email ?? "",
    phone: data?.phone ?? "",
    address: data?.address ?? "",
  } satisfies PatientPortalProfileFormData;
}

export async function savePatientProfileDetails(
  profileId: string,
  input: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
  },
) {
  const supabase = await createClient();
  return supabase
    .from("profiles")
    .update({
      first_name: input.firstName,
      last_name: input.lastName,
      phone: input.phone || null,
      address: input.address || null,
    })
    .eq("id", profileId);
}
