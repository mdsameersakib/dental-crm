"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const staffRoles = new Set(["admin", "receptionist", "dentist"]);

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

  const safeUserId = userId!;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", safeUserId)
    .maybeSingle();

  if (!profile || !staffRoles.has(profile.role)) {
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
