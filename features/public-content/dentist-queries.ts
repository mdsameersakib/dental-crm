import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

import {
  type DentistProfileWithName,
  formatMoney,
  mapDentistAvailability,
  mapPublicDentists,
} from "./mappers";
import type { PublicDentistDetail } from "./types";

type DentistScheduleRow =
  Database["public"]["Tables"]["dentist_schedules"]["Row"];

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

export async function getPublishedDentists(limit?: number) {
  const dentists = await readPublishedDentists(limit);
  return mapPublicDentists(dentists);
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
