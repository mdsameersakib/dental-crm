"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isStaffRole } from "@/features/staff/roles";
import { createClient } from "@/lib/supabase/server";
import { buildBaseUrlFromHeaders } from "@/lib/supabase/url";

function redirectWithError(message: string, next = "/staff/settings"): never {
  const params = new URLSearchParams({
    error: message,
    next,
  });

  redirect(`/auth/login?${params.toString()}`);
}

export async function signInStaff(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextValue = String(formData.get("next") ?? "/staff/settings");
  const next =
    nextValue.startsWith("/staff") || nextValue === "/staff"
      ? nextValue
      : "/staff/settings";

  if (!email || !password) {
    redirectWithError("Email and password are required.", next);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirectWithError("Invalid email or password.", next);
  }

  const userId = data.user?.id;

  if (!userId) {
    redirectWithError("Invalid email or password.", next);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", userId)
    .maybeSingle();

  if (!profile || !isStaffRole(profile.role)) {
    await supabase.auth.signOut();
    redirectWithError("This login is limited to staff accounts.", next);
  }

  if (!profile.is_active) {
    await supabase.auth.signOut();
    redirectWithError("Your staff account has been deactivated.", next);
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signOutStaff() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/auth/login?signed_out=1");
}

function redirectForgotWithStatus(
  message: string,
  type: "error" | "success",
): never {
  const params = new URLSearchParams({
    [type]: message,
  });

  redirect(`/auth/forgot-password?${params.toString()}`);
}

export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirectForgotWithStatus("Email is required.", "error");
  }

  const supabase = await createClient();
  const baseUrl = await buildBaseUrlFromHeaders();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl ?? "http://localhost:3000"}/auth/callback?next=/auth/reset-password`,
  });

  if (error) {
    redirectForgotWithStatus(
      "Unable to send a reset email right now. Please try again.",
      "error",
    );
  }

  redirectForgotWithStatus(
    "If this email is registered, a password reset link has been sent.",
    "success",
  );
}
