import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

import {
  DEFAULT_CLINIC_ADDRESS,
  DEFAULT_CONTACT_EMAIL,
  DEFAULT_CONTACT_PHONE,
} from "./constants";
import type { StaffLandingSettings } from "./types";

type LandingSettingsRow =
  Database["public"]["Tables"]["landing_settings"]["Row"];

async function readLandingSettings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("landing_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data as LandingSettingsRow | null;
}

export async function getLandingContactInfo() {
  const settings = await readLandingSettings();

  return {
    id: settings?.id ?? null,
    contactPhone: settings?.contact_phone?.trim() || DEFAULT_CONTACT_PHONE,
    contactEmail: settings?.contact_email?.trim() || DEFAULT_CONTACT_EMAIL,
    clinicAddress: settings?.clinic_address?.trim() || DEFAULT_CLINIC_ADDRESS,
  };
}

export async function getLandingBookingContactInfo() {
  const settings = await readLandingSettings();

  return {
    contactPhone: settings?.contact_phone?.trim() || DEFAULT_CONTACT_PHONE,
    contactEmail: settings?.contact_email?.trim() || DEFAULT_CONTACT_EMAIL,
  };
}

export async function getLandingSettingsForStaff(): Promise<StaffLandingSettings> {
  const settings = await readLandingSettings();

  return {
    id: settings?.id ?? null,
    contactPhone: settings?.contact_phone ?? "",
    contactEmail: settings?.contact_email ?? "",
    clinicAddress: settings?.clinic_address ?? "",
  };
}
