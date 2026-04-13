"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { saveLandingSettings, parseWhyChooseUsInput } from "@/features/public-content/admin";
import { requireStaffProfile } from "@/lib/auth/session";

function redirectWithStatus(message: string, type: "error" | "success"): never {
  const params = new URLSearchParams({
    [type]: message,
  });

  redirect(`/staff/landing-content?${params.toString()}`);
}

export async function saveLandingContent(formData: FormData) {
  await requireStaffProfile();

  const heroTitle = String(formData.get("hero_title") ?? "").trim();
  if (!heroTitle) {
    redirectWithStatus("Hero title is required.", "error");
  }

  const result = await saveLandingSettings({
    id: String(formData.get("id") ?? "").trim() || null,
    heroTitle,
    heroSubtitle: String(formData.get("hero_subtitle") ?? "").trim(),
    primaryCtaLabel: String(formData.get("primary_cta_label") ?? "").trim(),
    primaryCtaHref: String(formData.get("primary_cta_href") ?? "").trim(),
    secondaryCtaLabel: String(formData.get("secondary_cta_label") ?? "").trim(),
    secondaryCtaHref: String(formData.get("secondary_cta_href") ?? "").trim(),
    contactPhone: String(formData.get("contact_phone") ?? "").trim(),
    contactEmail: String(formData.get("contact_email") ?? "").trim(),
    clinicAddress: String(formData.get("clinic_address") ?? "").trim(),
    whyChooseUs: parseWhyChooseUsInput(
      String(formData.get("why_choose_us") ?? "").trim(),
    ),
  });

  if (result.error) {
    redirectWithStatus(result.error.message, "error");
  }

  revalidatePath("/", "layout");
  redirectWithStatus("Landing content updated.", "success");
}
