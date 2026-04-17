import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

const staffRoles: Array<Database["public"]["Enums"]["app_role"]> = [
  "admin",
  "receptionist",
  "dentist",
];

export type StaffMember = Pick<
  ProfileRow,
  "id" | "first_name" | "last_name" | "email" | "phone" | "role" | "is_active"
>;

export type StaffSettingsProfile = Pick<
  ProfileRow,
  "id" | "first_name" | "last_name" | "email" | "phone"
>;

export type ClinicSettings = {
  id: string | null;
  booking_default_duration_min: number;
  booking_timezone: string;
};

export async function getClinicSettingsForStaff() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("clinic_settings")
    .select("id, booking_default_duration_min, booking_timezone")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (data) {
    return data as ClinicSettings;
  }

  return {
    id: null,
    booking_default_duration_min: 30,
    booking_timezone: "Asia/Dhaka",
  };
}

export async function getStaffMemberList() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email, phone, role, is_active")
    .in("role", staffRoles)
    .order("role", { ascending: true })
    .order("first_name", { ascending: true });

  return (data ?? []) as StaffMember[];
}

export async function saveStaffProfileDetails(
  profileId: string,
  input: {
    firstName: string;
    lastName: string;
    phone: string;
  },
) {
  const supabase = createAdminClient();
  return supabase
    .from("profiles")
    .update({
      first_name: input.firstName,
      last_name: input.lastName,
      phone: input.phone || null,
    })
    .eq("id", profileId);
}

export async function saveClinicBookingDefaults(
  actorId: string,
  input: {
    id?: string | null;
    durationMin: number;
    timezone: string;
  },
) {
  const supabase = createAdminClient();
  const payload = {
    booking_default_duration_min: input.durationMin,
    booking_timezone: input.timezone,
    updated_by: actorId,
  };

  if (input.id) {
    return supabase.from("clinic_settings").update(payload).eq("id", input.id);
  }

  return supabase.from("clinic_settings").insert(payload);
}

export async function setStaffActiveStatus(
  profileId: string,
  isActive: boolean,
) {
  const supabase = createAdminClient();
  return supabase
    .from("profiles")
    .update({
      is_active: isActive,
    })
    .eq("id", profileId)
    .in("role", staffRoles);
}
