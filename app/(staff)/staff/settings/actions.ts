"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { requireAdminProfile, requireStaffProfile } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

import {
  saveClinicBookingDefaults,
  saveStaffProfileDetails,
  setStaffActiveStatus,
} from "@/features/settings/admin";

const allowedStaffRoles: Array<Database["public"]["Enums"]["app_role"]> = [
  "admin",
  "receptionist",
  "dentist",
];

function redirectWithStatus(message: string, type: "error" | "success"): never {
  const params = new URLSearchParams({
    [type]: message,
  });

  redirect(`/staff/settings?${params.toString()}`);
}

export async function saveMyProfile(formData: FormData) {
  const profile = await requireStaffProfile();

  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!firstName || !lastName) {
    redirectWithStatus("First and last name are required.", "error");
  }

  const result = await saveStaffProfileDetails(profile.id, {
    firstName,
    lastName,
    phone,
  });

  if (result.error) {
    redirectWithStatus(result.error.message, "error");
  }

  revalidatePath("/", "layout");
  redirectWithStatus("Profile details updated.", "success");
}

export async function changeMyPassword(formData: FormData) {
  await requireStaffProfile();

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  if (!password || password.length < 8) {
    redirectWithStatus("Password must be at least 8 characters long.", "error");
  }

  if (password !== confirmPassword) {
    redirectWithStatus("Passwords do not match.", "error");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    redirectWithStatus(error.message, "error");
  }

  redirectWithStatus("Password changed successfully.", "success");
}

export async function saveBookingDefaults(formData: FormData) {
  const profile = await requireStaffProfile();
  const settingId = String(formData.get("id") ?? "").trim();
  const durationMinRaw = String(formData.get("duration_min") ?? "").trim();
  const timezone = String(formData.get("timezone") ?? "").trim();

  const durationMin = Number.parseInt(durationMinRaw, 10);
  if (!Number.isFinite(durationMin) || durationMin <= 0) {
    redirectWithStatus("Default duration must be a positive number.", "error");
  }

  if (!timezone) {
    redirectWithStatus("Timezone is required.", "error");
  }

  const result = await saveClinicBookingDefaults(profile.id, {
    id: settingId || null,
    durationMin,
    timezone,
  });

  if (result.error) {
    redirectWithStatus(result.error.message, "error");
  }

  revalidatePath("/staff/settings");
  redirectWithStatus("Booking defaults saved.", "success");
}

export async function updateStaffAccountStatus(formData: FormData) {
  const admin = await requireAdminProfile();
  const targetId = String(formData.get("profile_id") ?? "").trim();
  const nextIsActive = String(formData.get("next_is_active") ?? "").trim();

  if (!targetId) {
    redirectWithStatus("Staff profile is required.", "error");
  }

  if (targetId === admin.id && nextIsActive === "false") {
    redirectWithStatus("You cannot deactivate your own account.", "error");
  }

  const result = await setStaffActiveStatus(targetId, nextIsActive === "true");
  if (result.error) {
    redirectWithStatus(result.error.message, "error");
  }

  revalidatePath("/staff/settings");
  redirectWithStatus("Staff account status updated.", "success");
}

async function buildBaseUrlFromHeaders() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  if (!host) {
    return null;
  }
  const protocol = headerStore.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host}`;
}

export async function inviteStaffAccount(formData: FormData) {
  await requireAdminProfile();

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const role = String(formData.get("role") ?? "").trim();
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();

  if (!email || !role) {
    redirectWithStatus("Email and role are required.", "error");
  }

  if (
    !allowedStaffRoles.includes(role as Database["public"]["Enums"]["app_role"])
  ) {
    redirectWithStatus("Choose a valid staff role.", "error");
  }

  const supabase = createAdminClient();
  const { data: existingProfile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("email", email)
    .maybeSingle();

  if (profileError) {
    redirectWithStatus(profileError.message, "error");
  }

  if (existingProfile) {
    redirectWithStatus(
      "An account with this email already exists. Use active/inactive controls below instead.",
      "error",
    );
  }

  const baseUrl = await buildBaseUrlFromHeaders();
  const redirectTo = `${baseUrl ?? "http://localhost:3000"}/auth/complete?next=/auth/staff-onboarding`;

  const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo,
    data: {
      role,
      first_name: firstName,
      last_name: lastName,
    },
  });

  if (error) {
    redirectWithStatus(error.message, "error");
  }

  revalidatePath("/staff/settings");
  redirectWithStatus("Staff invite sent successfully.", "success");
}

export async function sendStaffPasswordResetEmail(formData: FormData) {
  await requireAdminProfile();

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    redirectWithStatus("Staff email is required.", "error");
  }

  const supabase = await createClient();
  const baseUrl = await buildBaseUrlFromHeaders();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl ?? "http://localhost:3000"}/auth/reset-password`,
  });

  if (error) {
    redirectWithStatus(error.message, "error");
  }

  redirectWithStatus("Password reset email sent.", "success");
}
