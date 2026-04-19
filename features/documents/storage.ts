import { randomUUID } from "node:crypto";

import type { createAdminClient } from "@/lib/supabase/admin";

export const PATIENT_DOCUMENT_BUCKET = "patient-documents";

export function getDocumentFileExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) {
    return fromName;
  }

  const fromType = file.type.split("/")[1]?.toLowerCase();
  if (fromType && /^[a-z0-9.+-]+$/.test(fromType)) {
    return fromType.replace("jpeg", "jpg");
  }

  return "bin";
}

export async function ensurePatientDocumentBucket(
  supabase: ReturnType<typeof createAdminClient>,
) {
  const { error } = await supabase.storage.getBucket(PATIENT_DOCUMENT_BUCKET);
  if (!error) {
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(
    PATIENT_DOCUMENT_BUCKET,
    {
      public: false,
      fileSizeLimit: 10 * 1024 * 1024,
      allowedMimeTypes: [
        "image/png",
        "image/jpeg",
        "image/webp",
        "application/pdf",
      ],
    },
  );

  if (createError && !createError.message.toLowerCase().includes("already")) {
    throw createError;
  }
}

export async function uploadPatientDocument(
  supabase: ReturnType<typeof createAdminClient>,
  input: {
    patientId: string;
    treatmentId: string | null;
    file: File;
  },
) {
  await ensurePatientDocumentBucket(supabase);

  const fileExtension = getDocumentFileExtension(input.file);
  const treatmentSegment = input.treatmentId ?? "general";
  const storagePath = `patients/${input.patientId}/treatments/${treatmentSegment}/${Date.now()}-${randomUUID()}.${fileExtension}`;
  const bytes = Buffer.from(await input.file.arrayBuffer());

  const { error } = await supabase.storage
    .from(PATIENT_DOCUMENT_BUCKET)
    .upload(storagePath, bytes, {
      contentType: input.file.type || undefined,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  return {
    bucketName: PATIENT_DOCUMENT_BUCKET,
    storagePath,
  };
}

export async function removePatientDocumentFile(
  supabase: ReturnType<typeof createAdminClient>,
  storagePath: string,
) {
  await supabase.storage.from(PATIENT_DOCUMENT_BUCKET).remove([storagePath]);
}
