import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/auth/session";

export type StaffLandingSettings = {
  id: string | null;
  contactPhone: string;
  contactEmail: string;
  clinicAddress: string;
};

export async function saveLandingSettings(input: StaffLandingSettings) {
  const supabase = createAdminClient();
  const profile = await getCurrentProfile();

  const payload = {
    contact_phone: input.contactPhone || null,
    contact_email: input.contactEmail || null,
    clinic_address: input.clinicAddress || null,
    updated_by: profile?.id ?? null,
  };

  if (input.id) {
    return supabase.from("landing_settings").update(payload).eq("id", input.id);
  }

  return supabase.from("landing_settings").insert(payload);
}
