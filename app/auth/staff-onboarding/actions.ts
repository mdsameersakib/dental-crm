"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireStaffProfileForOnboarding } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

function redirectWithError(message: string) {
  const params = new URLSearchParams({
    error: message,
  });

  redirect(`/auth/staff-onboarding?${params.toString()}`);
}

export async function completeStaffOnboarding(formData: FormData) {
  const profile = await requireStaffProfileForOnboarding();

  if (!profile.needsStaffOnboarding) {
    redirect("/staff/settings");
  }

  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!firstName || !lastName || !phone || !address) {
    redirectWithError("Complete all onboarding fields before continuing.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
      phone,
      address,
      staff_onboarding_completed_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (error) {
    redirectWithError(error.message);
  }

  revalidatePath("/", "layout");
  redirect("/staff/settings");
}
