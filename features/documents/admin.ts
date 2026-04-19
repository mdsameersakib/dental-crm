import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

import { removePatientDocumentFile, uploadPatientDocument } from "./storage";
import type { PatientPortalDocument, StaffTreatmentDocument } from "./types";

type PatientDocumentRow =
  Database["public"]["Tables"]["patient_documents"]["Row"];

async function buildSignedUrl(input: {
  bucketName: string;
  storagePath: string;
}) {
  const supabase = createAdminClient();
  const { data } = await supabase.storage
    .from(input.bucketName)
    .createSignedUrl(input.storagePath, 60 * 10);

  return typeof data?.signedUrl === "string" ? data.signedUrl : null;
}

export async function getTreatmentDocumentsForStaff(treatmentId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("patient_documents")
    .select("*")
    .eq("treatment_id", treatmentId)
    .order("uploaded_at", { ascending: false });

  const rows = (data ?? []) as PatientDocumentRow[];
  const urlEntries = await Promise.all(
    rows.map(async (row) => {
      const signedUrl = await buildSignedUrl({
        bucketName: row.bucket_name,
        storagePath: row.storage_path,
      });

      return [row.id, signedUrl] as const;
    }),
  );
  const urlMap = new Map(urlEntries);

  return rows.map(
    (row) =>
      ({
        id: row.id,
        treatmentId: row.treatment_id,
        patientId: row.patient_id,
        documentType: row.document_type,
        fileName: row.file_name,
        fileSizeBytes: row.file_size_bytes,
        mimeType: row.mime_type,
        notes: row.notes,
        uploadedAt: row.uploaded_at,
        isVisibleToPatient: row.is_visible_to_patient,
        downloadUrl: urlMap.get(row.id) ?? null,
      }) satisfies StaffTreatmentDocument,
  );
}

export async function getPatientVisibleDocuments(patientProfileId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("patient_documents")
    .select("*")
    .eq("patient_id", patientProfileId)
    .eq("is_visible_to_patient", true)
    .order("uploaded_at", { ascending: false })
    .limit(6);

  const rows = (data ?? []) as PatientDocumentRow[];
  const urlEntries = await Promise.all(
    rows.map(async (row) => {
      const signedUrl = await buildSignedUrl({
        bucketName: row.bucket_name,
        storagePath: row.storage_path,
      });

      return [row.id, signedUrl] as const;
    }),
  );
  const urlMap = new Map(urlEntries);

  return rows.map(
    (row) =>
      ({
        id: row.id,
        treatmentId: row.treatment_id,
        fileName: row.file_name,
        documentType: row.document_type,
        notes: row.notes,
        uploadedAt: row.uploaded_at,
        downloadUrl: urlMap.get(row.id) ?? null,
      }) satisfies PatientPortalDocument,
  );
}

export async function addTreatmentDocumentForStaff(input: {
  treatmentId: string;
  patientId: string;
  appointmentId: string | null;
  uploadedBy: string;
  file: File;
  documentType: Database["public"]["Enums"]["document_type"];
  notes: string | null;
  isVisibleToPatient: boolean;
}) {
  const supabase = createAdminClient();
  const upload = await uploadPatientDocument(supabase, {
    patientId: input.patientId,
    treatmentId: input.treatmentId,
    file: input.file,
  });

  const { error } = await supabase.from("patient_documents").insert({
    appointment_id: input.appointmentId,
    bucket_name: upload.bucketName,
    document_type: input.documentType,
    file_name: input.file.name,
    file_size_bytes: input.file.size,
    is_visible_to_patient: input.isVisibleToPatient,
    mime_type: input.file.type || null,
    notes: input.notes,
    patient_id: input.patientId,
    storage_path: upload.storagePath,
    treatment_id: input.treatmentId,
    uploaded_by: input.uploadedBy,
  });

  if (error) {
    await removePatientDocumentFile(supabase, upload.storagePath);
    return { error };
  }

  return { error: null };
}

export async function deleteTreatmentDocumentForStaff(documentId: string) {
  const supabase = createAdminClient();
  const { data, error: readError } = await supabase
    .from("patient_documents")
    .select("id, bucket_name, storage_path")
    .eq("id", documentId)
    .maybeSingle();

  if (readError || !data) {
    return { error: readError ?? new Error("Document not found.") };
  }

  await removePatientDocumentFile(supabase, data.storage_path);

  const { error } = await supabase
    .from("patient_documents")
    .delete()
    .eq("id", documentId);

  return { error };
}
