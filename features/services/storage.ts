import { randomUUID } from "node:crypto";

import type { createAdminClient } from "@/lib/supabase/admin";

export const SERVICE_IMAGE_BUCKET = "service-images";

function extractBucketPathFromPublicUrl(url: string, bucket: string) {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  const pathWithQuery = url.slice(index + marker.length);
  const [path] = pathWithQuery.split("?");

  return decodeURIComponent(path);
}

export function getStorageFileExtension(file: File) {
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

export async function ensureServiceImageBucket(
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

export async function removeServiceImage(
  supabase: ReturnType<typeof createAdminClient>,
  imageUrl: string | null,
) {
  if (!imageUrl) {
    return;
  }

  const bucketPath = extractBucketPathFromPublicUrl(
    imageUrl,
    SERVICE_IMAGE_BUCKET,
  );

  if (!bucketPath) {
    return;
  }

  await supabase.storage.from(SERVICE_IMAGE_BUCKET).remove([bucketPath]);
}

export async function uploadServiceImage(
  supabase: ReturnType<typeof createAdminClient>,
  input: {
    slug: string;
    file: File;
    publicBaseUrl: string;
  },
) {
  await ensureServiceImageBucket(supabase);

  const fileExtension = getStorageFileExtension(input.file);
  const storagePath = `services/${input.slug}/${Date.now()}-${randomUUID()}.${fileExtension}`;
  const bytes = Buffer.from(await input.file.arrayBuffer());

  const { error } = await supabase.storage
    .from(SERVICE_IMAGE_BUCKET)
    .upload(storagePath, bytes, {
      contentType: input.file.type || undefined,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return `${input.publicBaseUrl}/storage/v1/object/public/${SERVICE_IMAGE_BUCKET}/${storagePath}`;
}
