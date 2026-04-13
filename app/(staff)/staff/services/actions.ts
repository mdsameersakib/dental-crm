"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireStaffProfile } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateServiceForm } from "@/features/services/validation";

function redirectWithStatus(message: string, type: "error" | "success"): never {
  const params = new URLSearchParams({
    [type]: message,
  });

  redirect(`/staff/services?${params.toString()}`);
}

export async function saveService(formData: FormData) {
  await requireStaffProfile();
  const validation = validateServiceForm(formData);

  if (!validation.success) {
    redirectWithStatus(validation.error, "error");
  }

  const supabase = createAdminClient();
  const payload = {
    slug: validation.data.slug,
    name: validation.data.name,
    short_description: validation.data.shortDescription,
    full_description: validation.data.fullDescription,
    icon_name: validation.data.iconName,
    image_path: validation.data.imagePath,
    base_price: validation.data.basePrice,
    duration_min: validation.data.durationMin,
    display_order: validation.data.displayOrder,
    is_active: validation.data.isActive,
    is_published: validation.data.isPublished,
    is_featured: validation.data.isFeatured,
  };

  const result = validation.data.id
    ? await supabase
        .from("services")
        .update(payload)
        .eq("id", validation.data.id)
    : await supabase.from("services").insert(payload);

  if (result.error) {
    redirectWithStatus(result.error.message, "error");
  }

  revalidatePath("/", "layout");
  redirectWithStatus("Service details saved.", "success");
}

export async function deleteService(formData: FormData) {
  await requireStaffProfile();
  const serviceId = String(formData.get("id") ?? "").trim();

  if (!serviceId) {
    redirectWithStatus("Service id is required for deletion.", "error");
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("services").delete().eq("id", serviceId);

  if (error) {
    redirectWithStatus(error.message, "error");
  }

  revalidatePath("/", "layout");
  redirectWithStatus("Service deleted.", "success");
}
