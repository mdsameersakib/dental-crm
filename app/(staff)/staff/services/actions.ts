"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validateServiceForm } from "@/features/services/validation";
import { requireStaffProfile } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSupabaseEnv } from "@/lib/supabase/env";

const SERVICE_IMAGE_BUCKET = "service-images";

function extractBucketPathFromPublicUrl(url: string) {
  const marker = `/storage/v1/object/public/${SERVICE_IMAGE_BUCKET}/`;
  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  const pathWithQuery = url.slice(index + marker.length);
  const [path] = pathWithQuery.split("?");

  return decodeURIComponent(path);
}

function fileExtensionFrom(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();

  if (fromName && /^[a-z0-9]+$/.test(fromName)) {
    return fromName;
  }

  const fromType = file.type.split("/")[1]?.toLowerCase();
  if (fromType && /^[a-z0-9.+-]+$/.test(fromType)) {
    return fromType.replace("jpeg", "jpg");
  }

  return "jpg";
}

async function ensureServiceImageBucket(
  supabase: ReturnType<typeof createAdminClient>,
) {
  const { error } = await supabase.storage.getBucket(SERVICE_IMAGE_BUCKET);
  if (!error) {
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(
    SERVICE_IMAGE_BUCKET,
    {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: ["image/png", "image/jpeg", "image/webp"],
    },
  );

  if (createError && !createError.message.toLowerCase().includes("already")) {
    throw createError;
  }
}

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
  const removeServiceImage = formData.get("remove_service_image") === "on";
  const existingServiceImagePath = validation.data.id
    ? (
        await supabase
          .from("services")
          .select("image_path")
          .eq("id", validation.data.id)
          .maybeSingle()
      ).data?.image_path ?? null
    : null;

  let serviceImagePath = existingServiceImagePath;

  if (removeServiceImage && existingServiceImagePath) {
    const existingBucketPath = extractBucketPathFromPublicUrl(existingServiceImagePath);
    if (existingBucketPath) {
      await supabase.storage
        .from(SERVICE_IMAGE_BUCKET)
        .remove([existingBucketPath]);
    }
    serviceImagePath = null;
  }

  if (profileImageFile instanceof File && profileImageFile.size > 0) {
    try {
      await ensureServiceImageBucket(supabase);
    } catch (bucketError) {
      const message =
        bucketError instanceof Error
          ? bucketError.message
          : "Unable to prepare service image storage bucket.";
      redirectWithStatus(message, "error");
    }

    const fileExtension = fileExtensionFrom(profileImageFile);
    const storagePath = `services/${validation.data.slug}/${Date.now()}-${randomUUID()}.${fileExtension}`;
    const bytes = Buffer.from(await profileImageFile.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from(SERVICE_IMAGE_BUCKET)
      .upload(storagePath, bytes, {
        contentType: profileImageFile.type || undefined,
        upsert: false,
      });

    if (uploadError) {
      redirectWithStatus(uploadError.message, "error");
    }

    if (existingServiceImagePath) {
      const existingBucketPath = extractBucketPathFromPublicUrl(existingServiceImagePath);
      if (existingBucketPath) {
        await supabase.storage
          .from(SERVICE_IMAGE_BUCKET)
          .remove([existingBucketPath]);
      }
    }

    serviceImagePath = `${env.url}/storage/v1/object/public/${SERVICE_IMAGE_BUCKET}/${storagePath}`;
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
    const bucketPath = extractBucketPathFromPublicUrl(serviceImagePath);
    if (bucketPath) {
      await supabase.storage.from(SERVICE_IMAGE_BUCKET).remove([bucketPath]);
    }
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
