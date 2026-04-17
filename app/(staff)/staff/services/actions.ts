"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  removeServiceImage,
  uploadServiceImage,
} from "@/features/services/storage";
import { validateServiceForm } from "@/features/services/validation";
import { requireStaffProfile } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSupabaseEnv } from "@/lib/supabase/env";

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
  const env = getSupabaseEnv();
  const profileImageFile = formData.get("service_image");
  const shouldRemoveServiceImage =
    formData.get("remove_service_image") === "on";
  const existingServiceImagePath = validation.data.id
    ? ((
        await supabase
          .from("services")
          .select("image_path")
          .eq("id", validation.data.id)
          .maybeSingle()
      ).data?.image_path ?? null)
    : null;

  let serviceImagePath = existingServiceImagePath;

  if (shouldRemoveServiceImage && existingServiceImagePath) {
    await removeServiceImage(supabase, existingServiceImagePath);
    serviceImagePath = null;
  }

  if (profileImageFile instanceof File && profileImageFile.size > 0) {
    try {
      serviceImagePath = await uploadServiceImage(supabase, {
        slug: validation.data.slug,
        file: profileImageFile,
        publicBaseUrl: env.url,
      });
    } catch (bucketError) {
      const message =
        bucketError instanceof Error
          ? bucketError.message
          : "Unable to prepare service image storage bucket.";
      redirectWithStatus(message, "error");
    }

    if (existingServiceImagePath) {
      await removeServiceImage(supabase, existingServiceImagePath);
    }
  }

  const payload = {
    slug: validation.data.slug,
    name: validation.data.name,
    short_description: validation.data.shortDescription,
    full_description: validation.data.fullDescription,
    icon_name: validation.data.iconName,
    image_path: serviceImagePath,
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
  const { data: service } = await supabase
    .from("services")
    .select("image_path")
    .eq("id", serviceId)
    .maybeSingle();

  const serviceImagePath = service?.image_path;
  if (serviceImagePath) {
    await removeServiceImage(supabase, serviceImagePath);
  }

  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", serviceId);

  if (error) {
    redirectWithStatus(error.message, "error");
  }

  revalidatePath("/", "layout");
  redirectWithStatus("Service deleted.", "success");
}
