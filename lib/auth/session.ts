import { redirect } from "next/navigation";

import { ensurePatientAccountForProfile } from "@/features/patient-portal/account";
import {
  isAdminRole,
  isLandingManagerRole,
  isPatientRole,
  isStaffRole,
} from "@/features/staff/roles";
import { createClient } from "@/lib/supabase/server";

export type CurrentProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  address: string | null;
  role: "patient" | "dentist" | "receptionist" | "admin";
  isActive: boolean;
  staffOnboardingCompletedAt: string | null;
  needsStaffOnboarding: boolean;
};

export type CurrentPatientPortalProfile = CurrentProfile & {
  patientProfileId: string;
};

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
  } satisfies CurrentProfile;
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

  if (!isLandingManagerRole(profile.role)) {
    redirect("/staff/dashboard?error=landing_access_denied");
  }

  return profile;
}

export async function requireAdminProfile() {
  const profile = await requireStaffProfile();

  if (!isAdminRole(profile.role)) {
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

function buildPatientLoginHref(
  messageType: "error" | "success",
  message: string,
  next = "/patient/dashboard",
) {
  const params = new URLSearchParams({
    [messageType]: message,
    next,
  });

  return `/patient/login?${params.toString()}`;
}

export async function requirePatientProfile(
  next = "/patient/dashboard",
): Promise<CurrentPatientPortalProfile> {
  const supabase = await createClient();
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect(
      buildPatientLoginHref("error", "Please sign in to continue.", next),
    );
  }

  if (isStaffRole(profile.role)) {
    redirect("/staff/settings");
  }

  if (!isPatientRole(profile.role)) {
    await supabase.auth.signOut();
    redirect(
      buildPatientLoginHref(
        "error",
        "This login is limited to patient accounts.",
        next,
      ),
    );
  }

  if (!profile.isActive) {
    await supabase.auth.signOut();
    redirect(
      buildPatientLoginHref(
        "error",
        "Your patient account has been deactivated.",
        next,
      ),
    );
  }

  const patientProfile = await ensurePatientAccountForProfile({
    profileId: profile.id,
    email: profile.email,
  });

  return {
    ...profile,
    patientProfileId: patientProfile.id,
  };
}
