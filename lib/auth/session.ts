import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type ProfileRole = "patient" | "dentist" | "receptionist" | "admin";

const staffRoles: ProfileRole[] = ["dentist", "receptionist", "admin"];
const landingManagerRoles: ProfileRole[] = ["receptionist", "admin"];

function isStaffRole(role: ProfileRole) {
  return staffRoles.includes(role);
}

export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, email, first_name, last_name, phone, address, role, is_active, staff_onboarding_completed_at",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    phone: profile.phone,
    address: profile.address,
    role: profile.role,
    isActive: profile.is_active,
    staffOnboardingCompletedAt: profile.staff_onboarding_completed_at,
    needsStaffOnboarding:
      isStaffRole(profile.role) &&
      profile.is_active &&
      profile.staff_onboarding_completed_at === null,
  };
}

export async function requireStaffProfile() {
  const supabase = await createClient();
  const profile = await getCurrentProfile();

  if (!profile || !isStaffRole(profile.role)) {
    redirect("/auth/login?next=/staff/settings");
  }

  if (!profile.isActive) {
    await supabase.auth.signOut();
    redirect("/auth/login?error=Your+staff+account+has+been+deactivated.");
  }

  if (profile.needsStaffOnboarding) {
    redirect("/auth/staff-onboarding");
  }

  return profile;
}

export async function requireLandingManagerProfile() {
  const profile = await requireStaffProfile();

  if (!landingManagerRoles.includes(profile.role)) {
    redirect("/staff/dashboard?error=landing_access_denied");
  }

  return profile;
}

export async function requireAdminProfile() {
  const profile = await requireStaffProfile();

  if (profile.role !== "admin") {
    redirect("/staff/dashboard?error=admin_access_denied");
  }

  return profile;
}

export async function requireStaffProfileForOnboarding() {
  const supabase = await createClient();
  const profile = await getCurrentProfile();

  if (!profile || !isStaffRole(profile.role)) {
    redirect("/auth/login?next=/auth/staff-onboarding");
  }

  if (!profile.isActive) {
    await supabase.auth.signOut();
    redirect("/auth/login?error=Your+staff+account+has+been+deactivated.");
  }

  return profile;
}
