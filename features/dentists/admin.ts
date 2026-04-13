import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

type DentistRow = Database["public"]["Tables"]["dentist_profiles"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export const dentistScheduleDays = [
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
  { value: "sat", label: "Saturday" },
  { value: "sun", label: "Sunday" },
] as const;

export type DentistScheduleDay = (typeof dentistScheduleDays)[number]["value"];

export type StaffDentistProfile = Pick<
  DentistRow,
  | "id"
  | "profile_id"
  | "license_number"
  | "specializations"
  | "education"
  | "years_of_experience"
  | "bio"
  | "short_bio"
  | "profile_photo_path"
  | "consultation_fee"
  | "is_accepting_patients"
  | "slug"
  | "is_published"
  | "is_featured"
  | "display_order"
> & {
  email: string;
  firstName: string;
  lastName: string;
  schedules: Array<{
    day: DentistScheduleDay;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>;
};

export type AvailableDentistStaff = Pick<ProfileRow, "id" | "email" | "first_name" | "last_name">;

export async function getDentistsForStaff() {
  const supabase = createAdminClient();
  const [{ data: profiles }, { data: schedules }] = await Promise.all([
    supabase
      .from("dentist_profiles")
      .select(
        "id, profile_id, license_number, specializations, education, years_of_experience, bio, short_bio, profile_photo_path, consultation_fee, is_accepting_patients, slug, is_published, is_featured, display_order, profiles!dentist_profiles_profile_id_fkey(email, first_name, last_name)",
      )
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("dentist_schedules")
      .select("dentist_id, day_of_week, start_time, end_time, is_available")
      .order("day_of_week", { ascending: true }),
  ]);

  const schedulesByDentist = new Map<string, StaffDentistProfile["schedules"]>();
  for (const row of schedules ?? []) {
    const current = schedulesByDentist.get(row.dentist_id) ?? [];
    current.push({
      day: row.day_of_week,
      startTime: row.start_time,
      endTime: row.end_time,
      isAvailable: row.is_available,
    });
    schedulesByDentist.set(row.dentist_id, current);
  }

  return (profiles ?? []).map((entry) => {
    const profile = Array.isArray(entry.profiles) ? entry.profiles[0] : entry.profiles;
    return {
      id: entry.id,
      profile_id: entry.profile_id,
      license_number: entry.license_number,
      specializations: entry.specializations,
      education: entry.education,
      years_of_experience: entry.years_of_experience,
      bio: entry.bio,
      short_bio: entry.short_bio,
      profile_photo_path: entry.profile_photo_path,
      consultation_fee: entry.consultation_fee,
      is_accepting_patients: entry.is_accepting_patients,
      slug: entry.slug,
      is_published: entry.is_published,
      is_featured: entry.is_featured,
      display_order: entry.display_order,
      email: profile?.email ?? "",
      firstName: profile?.first_name ?? "",
      lastName: profile?.last_name ?? "",
      schedules: schedulesByDentist.get(entry.id) ?? [],
    } satisfies StaffDentistProfile;
  });
}

export async function getAvailableDentistStaff() {
  const supabase = createAdminClient();
  const [{ data: profiles }, { data: dentistProfiles }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, first_name, last_name")
      .eq("role", "dentist")
      .eq("is_active", true)
      .order("first_name", { ascending: true }),
    supabase.from("dentist_profiles").select("profile_id"),
  ]);

  const usedProfileIds = new Set((dentistProfiles ?? []).map((entry) => entry.profile_id));

  return (profiles ?? []).filter((profile) => !usedProfileIds.has(profile.id)) as AvailableDentistStaff[];
}
