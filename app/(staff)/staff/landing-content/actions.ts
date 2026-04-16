"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { saveLandingSettings } from "@/features/public-content/admin";
import { requireStaffProfile } from "@/lib/auth/session";

function redirectWithStatus(message: string, type: "error" | "success"): never {
  const params = new URLSearchParams({
    [type]: message,
  });

  redirect(`/staff/landing-content?${params.toString()}`);
}

export async function saveLandingContent(formData: FormData) {
  await requireStaffProfile();

  const result = await saveLandingSettings({
    id: String(formData.get("id") ?? "").trim() || null,
    contactPhone: String(formData.get("contact_phone") ?? "").trim(),
    contactEmail: String(formData.get("contact_email") ?? "").trim(),
    clinicAddress: String(formData.get("clinic_address") ?? "").trim(),
  });

  if (result.error) {
    redirectWithStatus(result.error.message, "error");
  }

  revalidatePath("/", "layout");
  redirectWithStatus("Landing content updated.", "success");
}
