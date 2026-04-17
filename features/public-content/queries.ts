import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

import {
  DEFAULT_CLINIC_ADDRESS,
  DEFAULT_CONTACT_EMAIL,
  DEFAULT_CONTACT_PHONE,
} from "./constants";
import {
  type DentistProfileWithName,
  formatMoney,
  mapDentistAvailability,
  mapPublicDentists,
  mapPublicServices,
} from "./mappers";
import type {
  PublicDentist,
  PublicDentistDetail,
  PublicService,
  StaffLandingSettings,
} from "./types";

type LandingSettingsRow =
  Database["public"]["Tables"]["landing_settings"]["Row"];
type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
type DentistScheduleRow =
  Database["public"]["Tables"]["dentist_schedules"]["Row"];

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

async function readPublishedServices(limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from("services")
    .select(
      "id, slug, name, short_description, full_description, icon_name, image_path, base_price, duration_min",
    )
    .eq("is_active", true)
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("display_order", { ascending: true });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data } = await query;

  return (data ?? []) as Pick<
    ServiceRow,
    | "id"
    | "slug"
    | "name"
    | "short_description"
    | "full_description"
    | "icon_name"
    | "image_path"
    | "base_price"
    | "duration_min"
  >[];
}

async function readPublishedDentists(limit?: number) {
  const admin = createAdminClient();
  let query = admin
    .from("dentist_profiles")
    .select(
      "id, slug, short_bio, bio, specializations, education, profile_photo_path, profiles!dentist_profiles_profile_id_fkey(first_name,last_name)",
    )
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("display_order", { ascending: true });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data } = await query;

  return (data?.map((entry) => {
    const profile = Array.isArray(entry.profiles)
      ? entry.profiles[0]
      : entry.profiles;
    const firstName = profile?.first_name?.trim() ?? "";
    const lastName = profile?.last_name?.trim() ?? "";

    return {
      id: entry.id,
      slug: entry.slug,
      short_bio: entry.short_bio,
      bio: entry.bio,
      specializations: entry.specializations,
      education: entry.education,
      profile_photo_path: entry.profile_photo_path,
      profile_name: `${firstName} ${lastName}`.trim() || "Dental Specialist",
    };
  }) ?? []) as DentistProfileWithName[];
}

export async function getLandingPageData() {
  const [settings, services, dentists] = await Promise.all([
    readLandingSettings(),
    readPublishedServices(6),
    readPublishedDentists(6),
  ]);

  return {
    landing: {
      id: settings?.id ?? null,
      contactPhone: settings?.contact_phone?.trim() || DEFAULT_CONTACT_PHONE,
      contactEmail: settings?.contact_email?.trim() || DEFAULT_CONTACT_EMAIL,
      clinicAddress: settings?.clinic_address?.trim() || DEFAULT_CLINIC_ADDRESS,
    },
    services: mapPublicServices(services),
    dentists: mapPublicDentists(dentists),
  };
}

export async function getPublicDirectoryData() {
  const [services, dentists] = await Promise.all([
    readPublishedServices(),
    readPublishedDentists(),
  ]);

  return {
    services: mapPublicServices(services),
    dentists: mapPublicDentists(dentists),
  };
}

export async function getBookingPageData() {
  const [{ services, dentists }, landing] = await Promise.all([
    getPublicDirectoryData(),
    readLandingSettings(),
  ]);

  return {
    services,
    dentists,
    contactPhone: landing?.contact_phone?.trim() || DEFAULT_CONTACT_PHONE,
    contactEmail: landing?.contact_email?.trim() || DEFAULT_CONTACT_EMAIL,
  };
}

export async function getPublicDentistDetail(
  dentistId: string,
): Promise<PublicDentistDetail | null> {
  const admin = createAdminClient();
  const { data: dentist } = await admin
    .from("dentist_profiles")
    .select(
      "id, slug, short_bio, bio, specializations, education, profile_photo_path, years_of_experience, consultation_fee, is_accepting_patients, profiles!dentist_profiles_profile_id_fkey(first_name,last_name)",
    )
    .or(`slug.eq.${dentistId},id.eq.${dentistId}`)
    .eq("is_published", true)
    .maybeSingle();

  if (!dentist) {
    return null;
  }

  const profile = Array.isArray(dentist.profiles)
    ? dentist.profiles[0]
    : dentist.profiles;
  const firstName = profile?.first_name ?? "";
  const lastName = profile?.last_name ?? "";

  const { data: schedules } = await admin
    .from("dentist_schedules")
    .select("day_of_week, start_time, end_time, is_available")
    .eq("dentist_id", dentist.id)
    .order("day_of_week", { ascending: true });

  const educationItems =
    Array.isArray(dentist.education) && dentist.education.length > 0
      ? dentist.education.filter(
          (entry): entry is string => typeof entry === "string",
        )
      : ["Advanced Clinical Training"];

  return {
    id: dentist.id,
    slug: dentist.slug ?? dentist.id,
    name: `${firstName} ${lastName}`.trim() || "Dental Specialist",
    specialty: dentist.specializations[0] ?? "Dental Specialist",
    education: educationItems[0] ?? "Advanced Clinical Training",
    shortBio:
      dentist.short_bio ??
      dentist.bio ??
      "Experienced clinician focused on patient comfort and modern dentistry.",
    imageUrl:
      dentist.profile_photo_path ||
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
    bio:
      dentist.bio ??
      dentist.short_bio ??
      "Experienced clinician focused on patient comfort and modern dentistry.",
    yearsOfExperience:
      dentist.years_of_experience === null
        ? "By consultation"
        : `${dentist.years_of_experience} years`,
    consultationFee: formatMoney(dentist.consultation_fee),
    isAcceptingPatients: dentist.is_accepting_patients,
    educationItems,
    specialties:
      dentist.specializations.length > 0
        ? dentist.specializations
        : ["Comprehensive Dental Care"],
    availability: mapDentistAvailability(
      (schedules ?? []) as Pick<
        DentistScheduleRow,
        "day_of_week" | "start_time" | "end_time" | "is_available"
      >[],
    ),
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

export type { PublicDentist, PublicDentistDetail, PublicService };
