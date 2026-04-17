import { randomUUID } from "node:crypto";

import type { createAdminClient } from "@/lib/supabase/admin";

export const DENTIST_IMAGE_BUCKET = "doctor-images";

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

export async function removeDentistImage(
  supabase: ReturnType<typeof createAdminClient>,
  imageUrl: string | null,
) {
  if (!imageUrl) {
    return;
  }

  const bucketPath = extractBucketPathFromPublicUrl(
    imageUrl,
    DENTIST_IMAGE_BUCKET,
  );

  if (!bucketPath) {
    return;
  }

  await supabase.storage.from(DENTIST_IMAGE_BUCKET).remove([bucketPath]);
}

export async function uploadDentistImage(
  supabase: ReturnType<typeof createAdminClient>,
  input: {
    profileId: string;
    file: File;
    publicBaseUrl: string;
  },
) {
  const fileExtension = getStorageFileExtension(input.file);
  const folder = input.profileId || "unassigned";
  const storagePath = `dentists/${folder}/${Date.now()}-${randomUUID()}.${fileExtension}`;
  const bytes = Buffer.from(await input.file.arrayBuffer());

  const { error } = await supabase.storage
    .from(DENTIST_IMAGE_BUCKET)
    .upload(storagePath, bytes, {
      contentType: input.file.type || undefined,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return `${input.publicBaseUrl}/storage/v1/object/public/${DENTIST_IMAGE_BUCKET}/${storagePath}`;
}
