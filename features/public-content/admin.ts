import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/auth/session";

export type StaffLandingSettings = {
  id: string | null;
  heroTitle: string;
  heroSubtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  contactPhone: string;
  contactEmail: string;
  clinicAddress: string;
  whyChooseUs: Array<{
    title: string;
    description: string;
  }>;
};

export function parseWhyChooseUsInput(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...descriptionParts] = line.split("|");
      return {
        title: title?.trim() ?? "",
        description: descriptionParts.join("|").trim(),
      };
    })
    .filter((item) => item.title && item.description);
}

export function formatWhyChooseUsInput(
  items: StaffLandingSettings["whyChooseUs"],
) {
  return items.map((item) => `${item.title} | ${item.description}`).join("\n");
}

export async function saveLandingSettings(input: StaffLandingSettings) {
  const supabase = createAdminClient();
  const profile = await getCurrentProfile();

  const payload = {
    hero_title: input.heroTitle,
    hero_subtitle: input.heroSubtitle || null,
    primary_cta_label: input.primaryCtaLabel || null,
    primary_cta_href: input.primaryCtaHref || null,
    secondary_cta_label: input.secondaryCtaLabel || null,
    secondary_cta_href: input.secondaryCtaHref || null,
    contact_phone: input.contactPhone || null,
    contact_email: input.contactEmail || null,
    clinic_address: input.clinicAddress || null,
    why_choose_us: input.whyChooseUs,
    updated_by: profile?.id ?? null,
  };

  if (input.id) {
    return supabase.from("landing_settings").update(payload).eq("id", input.id);
  }

  return supabase.from("landing_settings").insert(payload);
}
